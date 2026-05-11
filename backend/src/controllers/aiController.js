import { ResumeModel } from "../models/Resume.js";
import {
  generateBulletPoints,
  generateSummary,
  generateMatchScore,
  reorderSkills,
} from "../services/groqService.js";
import { logger } from "../config/logger.js";

export const generateResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { jobDesc } = req.body;

    const resume = await ResumeModel.findById(id);

    if (!resume) {
      const error = new Error("Resume not found");
      error.statusCode = 404;
      throw error;
    }

    if (resume.userId !== req.user.id) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    const cvBase = resume.cvBase;

    logger.info(`Generating resume for: ${id}`);

    const updatedExperience = await Promise.all(
      cvBase.experience?.map(async (exp) => {
        const newBullets = await generateBulletPoints(exp, jobDesc);
        return { ...exp, description: newBullets };
      }) || [],
    );

    const updatedSummary = await generateSummary(cvBase, jobDesc);

    const updatedSkills = await reorderSkills(cvBase.skills || [], jobDesc);

    const generatedCv = {
      ...cvBase,
      summary: updatedSummary,
      experience: updatedExperience,
      skills: updatedSkills,
    };

    const matchResult = await generateMatchScore(generatedCv, jobDesc);

    const updated = await ResumeModel.update(id, {
      jobDesc,
      generatedCv,
      matchScore: matchResult.score,
      status: "GENERATED",
    });

    logger.info(
      `Resume generated successfully: ${id}, score: ${matchResult.score}`,
    );

    res.status(200).json({
      message: "Resume generated successfully",
      resume: updated,
      matchResult,
    });
  } catch (error) {
    next(error);
  }
};

export const regenerateSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { section, index } = req.body;

    const resume = await ResumeModel.findById(id);

    if (!resume) {
      const error = new Error("Resume not found");
      error.statusCode = 404;
      throw error;
    }

    if (resume.userId !== req.user.id) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    const generatedCv = resume.generatedCv || resume.cvBase;
    const jobDesc = resume.jobDesc;

    let updatedCv = { ...generatedCv };

    if (section === "summary") {
      updatedCv.summary = await generateSummary(resume.cvBase, jobDesc);
    }

    if (section === "experience" && index !== undefined) {
      const exp = generatedCv.experience[index];
      const newBullets = await generateBulletPoints(exp, jobDesc);
      updatedCv.experience[index] = { ...exp, description: newBullets };
    }

    if (section === "skills") {
      updatedCv.skills = await reorderSkills(
        resume.cvBase.skills || [],
        jobDesc,
      );
    }

    const updated = await ResumeModel.update(id, { generatedCv: updatedCv });

    logger.info(`Section regenerated: ${section} for resume: ${id}`);

    res.status(200).json({
      message: "Section regenerated successfully",
      resume: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getMatchScore = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resume = await ResumeModel.findById(id);

    if (!resume) {
      const error = new Error("Resume not found");
      error.statusCode = 404;
      throw error;
    }

    if (resume.userId !== req.user.id) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    if (!resume.jobDesc) {
      const error = new Error(
        "Job description not found, please generate resume first",
      );
      error.statusCode = 400;
      throw error;
    }

    const cvData = resume.generatedCv || resume.cvBase;
    const matchResult = await generateMatchScore(cvData, resume.jobDesc);

    await ResumeModel.updateMatchScore(id, matchResult.score);

    res.status(200).json({ matchResult });
  } catch (error) {
    next(error);
  }
};
