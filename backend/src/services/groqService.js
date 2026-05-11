import Groq from "groq-sdk";
import { env } from "../config/env.js";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

const chat = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: env.GROQ_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });
  return response.choices[0].message.content;
};

export const generateBulletPoints = async (experience, jobDesc) => {
  const prompt = `
    You are a professional resume writer.

    Rewrite the following work experience bullet points to be more relevant and impactful based on the job description provided.

    Job Description:
    ${jobDesc}

    Work Experience:
    Company: ${experience.company}
    Position: ${experience.position}
    Current bullet points:
    ${experience.description?.join("\n") || ""}

    Rules:
    - Use strong action verbs
    - Include metrics and numbers where possible
    - Match keywords from the job description
    - Return only the bullet points as a JSON array of strings
    - Maximum 5 bullet points

    Return format (JSON only, no explanation): ["bullet point 1", "bullet point 2"]
  `;

  const content = await chat(prompt);
  const clean = content.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

export const generateSummary = async (cvBase, jobDesc) => {
  const prompt = `
    You are a professional resume writer.

    Write a compelling professional summary for a resume based on the candidate's profile and the job description.

    Job Description:
    ${jobDesc}

    Candidate Profile:
    Name: ${cvBase.personalInfo?.name}
    Skills: ${cvBase.skills?.join(", ")}
    Experience: ${cvBase.experience?.map((e) => `${e.position} at ${e.company}`).join(", ")}

    Rules:
    - Maximum 3 sentences
    - Match keywords from the job description
    - Professional and concise tone
    - Return only the summary text, no extra formatting
  `;

  const content = await chat(prompt);
  return content.trim();
};

export const generateMatchScore = async (cvBase, jobDesc) => {
  const prompt = `
    You are an ATS (Applicant Tracking System) expert.

    Analyze the match between the following CV and Job Description.

    Job Description:
    ${jobDesc}

    CV Data:
    Skills: ${cvBase.skills?.join(", ")}
    Experience: ${cvBase.experience?.map((e) => `${e.position} at ${e.company}: ${e.description?.join(", ")}`).join("\n")}
    Education: ${cvBase.education?.map((e) => `${e.degree} from ${e.institution}`).join(", ")}

    Return only a JSON object, no explanation, no markdown:
    {
      "score": 0-100,
      "breakdown": {
        "skills": 0-100,
        "experience": 0-100,
        "education": 0-100
      },
      "missingKeywords": ["keyword1", "keyword2"],
      "suggestions": ["suggestion1", "suggestion2"]
    }
  `;

  const content = await chat(prompt);
  const clean = content.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

export const reorderSkills = async (skills, jobDesc) => {
  const prompt = `
    You are a resume optimization expert.

    Reorder the following skills to prioritize the ones most relevant to the job description.

    Job Description:
    ${jobDesc}

    Skills: ${skills.join(", ")}

    Return only a JSON array of the reordered skills, no explanation, no markdown.
    Format: ["skill1", "skill2"]
  `;

  const content = await chat(prompt);
  const clean = content.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};
