const { GoogleGenAI } = require("@google/genai");
const z = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 to 100 indicating how well the candidate's profile matches the job description",
    ),
  technicalQuestion: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The techinal question can asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral question that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestion: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The techinal question can asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral question that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the condidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The Severity of this skill gap, i.e. how import is the skill is.",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's along with their severity",
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),

        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g data structures, system design, mock interviews",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the the preparation plan, e.g. read a specific book etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preperation plan for the condidate to follow in order to prepare for the interview effectively",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview report for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}

    
    `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  console.log(response.text);
}

module.exports = generateInterviewReport;
