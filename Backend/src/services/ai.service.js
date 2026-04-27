const Groq = require("groq-sdk");
const z = require("zod");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const interviewReportSchema = z.object({
  matchScore: z.number(),
  title: z.string(),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    }),
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    }),
  ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert interviewer.
Analyze the candidate and return ONLY valid JSON strictly matching this structure.

================ REQUIRED JSON FORMAT =================

{
  "title": "string",
  "matchScore": number,
  "technicalQuestions": [
    { "question": "string", "intention": "string", "answer": "string" }
  ],
  "behavioralQuestions": [
    { "question": "string", "intention": "string", "answer": "string" }
  ],
  "skillGaps": [
    { "skill": "string", "severity": "low | medium | high" }
  ],
  "preparationPlan": [
    { "day": number, "focus": "string", "tasks": ["string"] }
  ]
}

================ INPUT =================

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

================ RULES =================
- Output ONLY JSON (no text outside JSON)
- Do NOT return arrays of strings — ALWAYS return objects
- Ensure all fields exist and match the schema
- Generate:
  - 5–7 technical questions (with intention + answer)
  - 4–6 behavioral questions (with intention + answer)
  - 4–6 skill gaps with severity
  - 7-day preparation plan (structured properly)
`;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const rawText = response.choices[0].message.content.trim();
  console.log("raw texxt...", rawText);

  const parsed = JSON.parse(rawText);
  console.log("parsed data..", parsed);

  // Normalize tasks: [{ task: "..." }] → ["..."]
  if (parsed.preparationPlan) {
    parsed.preparationPlan = parsed.preparationPlan.map((day) => ({
      ...day,
      tasks: day.tasks.map((t) =>
        typeof t === "object" ? t.task || Object.values(t)[0] : t,
      ),
    }));
  }

  // Normalize matchScore: 0.8 → 80
  if (parsed.matchScore <= 1) {
    parsed.matchScore = Math.round(parsed.matchScore * 100);
  }

  return interviewReportSchema.parse(parsed);

  return interviewReportSchema.parse(parsed);
}

module.exports = generateInterviewReport; // ← this was missing
