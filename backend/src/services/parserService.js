import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { logger } from "../config/logger.js";

const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const extractTextFromDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
};

const parseResumeText = (text) => {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const result = {
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      website: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
  };

  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) result.personalInfo.email = emailMatch[0];

  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  if (phoneMatch) result.personalInfo.phone = phoneMatch[0].trim();

  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) result.personalInfo.linkedin = linkedinMatch[0];

  const websiteMatch = text.match(/https?:\/\/(?!linkedin)[\w.-]+\.\w+/i);
  if (websiteMatch) result.personalInfo.website = websiteMatch[0];

  if (lines.length > 0) {
    const firstLine = lines[0];
    if (!firstLine.includes("@") && !firstLine.match(/^\d/)) {
      result.personalInfo.name = firstLine;
    }
  }

  let currentSection = null;
  let currentExp = null;
  let currentEdu = null;
  let summaryLines = [];
  let skillLines = [];

  const sectionKeywords = {
    summary: ["summary", "profile", "objective", "about"],
    experience: ["experience", "work experience", "employment", "work history"],
    education: ["education", "academic", "qualification"],
    skills: ["skills", "technical skills", "competencies", "technologies"],
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    let detectedSection = null;
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.some((kw) => line.includes(kw))) {
        detectedSection = section;
        break;
      }
    }

    if (detectedSection) {
      if (currentExp) {
        result.experience.push(currentExp);
        currentExp = null;
      }
      if (currentEdu) {
        result.education.push(currentEdu);
        currentEdu = null;
      }
      currentSection = detectedSection;
      continue;
    }

    if (currentSection === "summary") {
      summaryLines.push(lines[i]);
    }

    if (currentSection === "skills") {
      const skillItems = lines[i]
        .split(/[,|•·]/)
        .map((s) => s.trim())
        .filter(Boolean);
      skillLines.push(...skillItems);
    }

    if (currentSection === "experience") {
      const datePattern =
        /(\d{4}|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4})/i;
      if (datePattern.test(lines[i])) {
        if (currentExp) result.experience.push(currentExp);
        currentExp = {
          company: lines[i - 1] || "",
          position: lines[i - 2] || "",
          startDate: "",
          endDate: "",
          isCurrent: lines[i].toLowerCase().includes("present"),
          description: [],
        };
        const dates = lines[i].match(/(\w+\s+\d{4}|\d{4})/g);
        if (dates) {
          currentExp.startDate = dates[0] || "";
          currentExp.endDate = dates[1] || "";
        }
      } else if (
        (currentExp && lines[i].startsWith("-")) ||
        (currentExp && lines[i].startsWith("•"))
      ) {
        currentExp.description.push(lines[i].replace(/^[-•]\s*/, ""));
      }
    }

    if (currentSection === "education") {
      const yearMatch = lines[i].match(/\d{4}/);
      if (yearMatch) {
        if (currentEdu) result.education.push(currentEdu);
        currentEdu = {
          institution: lines[i - 1] || "",
          degree: lines[i - 2] || "",
          field: "",
          startDate: "",
          endDate: yearMatch[0],
          gpa: "",
        };
        const gpaMatch = lines[i].match(/gpa[:\s]+(\d+\.\d+)/i);
        if (gpaMatch) currentEdu.gpa = gpaMatch[1];
      }
    }
  }

  if (currentExp) result.experience.push(currentExp);
  if (currentEdu) result.education.push(currentEdu);

  result.summary = summaryLines.join(" ").trim();
  result.skills = [...new Set(skillLines)].filter((s) => s.length > 1);

  return result;
};

export const parseCV = async (filePath, mimetype) => {
  try {
    let text = "";

    if (mimetype === "application/pdf") {
      text = await extractTextFromPDF(filePath);
    } else {
      text = await extractTextFromDOCX(filePath);
    }

    logger.info(`CV parsed successfully from: ${filePath}`);

    const parsed = parseResumeText(text);

    fs.unlinkSync(filePath);

    return parsed;
  } catch (error) {
    logger.error(`Failed to parse CV: ${error.message}`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
};
