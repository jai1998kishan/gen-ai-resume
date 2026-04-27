// const pdfParse = require("pdf-parse");
// const generateInterviewReport = require("../services/ai.service");
// const interviewReportModel = require("../models/interviewReport.model");

// async function generateInterviewReportController(req, res) {
//   const resumeContent = await new pdfParse.PDFParse(
//     Uint8Array.from(req.file.buffer),
//   ).getText();
//   const { selfDescription, jobDescription } = req.body;

//   const interViewReportByAi = await generateInterviewReport({
//     resume: resumeContent.text,
//     selfDescription,
//     jobDescription,
//   });

//   console.log("fwoefrwefwe..", interViewReportByAi);

//   const interviewReport = await interviewReportModel.create({
//     user: req.user.id,
//     resume: resumeContent.text,
//     selfDescription,
//     jobDescription,
//     ...interViewReportByAi,
//   });

//   res.status(201).json({
//     message: "Interview report generated successfuly",
//     interviewReport,
//   });
// }

// module.exports = { generateInterviewReportController };

//===============================================

const { PDFParse } = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // const pdfData = await pdfParse(req.file.buffer);
    const pdfData = new PDFParse(req.file.buffer);

    const resumeContent = pdfData.text;

    const { selfDescription, jobDescription } = req.body;

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    console.log("iiiiiiiiiii..", interViewReportByAi);

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    });

    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

module.exports = { generateInterviewReportController };
