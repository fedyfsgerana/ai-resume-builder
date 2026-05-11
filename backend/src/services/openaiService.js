import OpenAI from "openai";
import { env } from "../config/env.js";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

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
    ${experience.description.join("\n")}
    
    Rules:
    - Use strong action verbs
    - Include metrics and numbers where possible
    - Match keywords from the job description
    - Return only the bullet points as a JSON array of strings
    - Maximum 5 bullet points
    
    Return format: ["bullet point 1", "bullet point 2", ...]
  `;

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
};

export const generateSummary = async (cvBase, jobDesc) => {
  const prompt = `
    You are a professional resume writer.
    
    Write a compelling professional summary for a resume based on the candidate's profile and the job description.
    
    Job Description:
    ${jobDesc}
    
    Candidate Profile:
    Name: ${cvBase.personalInfo.name}
    Skills: ${cvBase.skills?.join(", ")}
    Experience: ${cvBase.experience?.map((e) => `${e.position} at ${e.company}`).join(", ")}
    
    Rules:
    - Maximum 3 sentences
    - Match keywords from the job description
    - Professional and concise tone
    - Return only the summary text, no extra formatting
  `;

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
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
    
    Return only a JSON object with this format:
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

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
};

export const reorderSkills = async (skills, jobDesc) => {
  const prompt = `
    You are a resume optimization expert.
    
    Reorder the following skills to prioritize the ones most relevant to the job description.
    
    Job Description:
    ${jobDesc}
    
    Skills: ${skills.join(", ")}
    
    Return only a JSON array of the reordered skills.
    Format: ["skill1", "skill2", ...]
  `;

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
};
