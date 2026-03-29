require("dotenv").config();
const app = require("./src/app");

const generateInterviewReport = require("./src/services/ai.service");

const {
  resume,
  selfDescription,
  jobDescription,
} = require("./src/services/temp.js");

const connectToDB = require("./src/config/database");

connectToDB();

generateInterviewReport({ resume, selfDescription, jobDescription });

app.listen(3000, () => {
  console.log("Server is running on Port 3000");
});
