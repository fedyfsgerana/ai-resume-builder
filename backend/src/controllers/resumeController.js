import { ResumeModel } from "../models/Resume.js";
import { exportResumeToPDF } from "../services/pdfService.js";
import { logger } from "../config/logger.js";

export const createResume = async (req, res, next) => {
  try {
    const { title, cvBase } = req.body;
    const resume = await ResumeModel.create({
      userId: req.user.id,
      title,
      cvBase,
    });
    logger.info(`Resume created: ${resume.id} by user: ${req.user.id}`);
    res.status(201).json({ message: "Resume created successfully", resume });
  } catch (error) {
    next(error);
  }
};

export const getAllResumes = async (req, res, next) => {
  try {
    const resumes = await ResumeModel.findAllByUser(req.user.id);
    res.status(200).json({ resumes });
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req, res, next) => {
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

    res.status(200).json({ resume });
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await ResumeModel.findById(id);

    if (!existing) {
      const error = new Error("Resume not found");
      error.statusCode = 404;
      throw error;
    }

    if (existing.userId !== req.user.id) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    const updated = await ResumeModel.update(id, req.body);
    logger.info(`Resume updated: ${id}`);
    res
      .status(200)
      .json({ message: "Resume updated successfully", resume: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await ResumeModel.findById(id);

    if (!existing) {
      const error = new Error("Resume not found");
      error.statusCode = 404;
      throw error;
    }

    if (existing.userId !== req.user.id) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    await ResumeModel.delete(id);
    logger.info(`Resume deleted: ${id}`);
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const exportResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await ResumeModel.findById(id);

    if (!existing) {
      const error = new Error("Resume not found");
      error.statusCode = 404;
      throw error;
    }

    if (existing.userId !== req.user.id) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    const { buffer, filename } = await exportResumeToPDF(id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);

    logger.info(`Resume exported: ${id}`);
  } catch (error) {
    next(error);
  }
};

export const duplicateResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await ResumeModel.findById(id);

    if (!existing) {
      const error = new Error("Resume not found");
      error.statusCode = 404;
      throw error;
    }

    if (existing.userId !== req.user.id) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    const duplicated = await ResumeModel.duplicate(id, req.user.id);
    logger.info(`Resume duplicated: ${id} -> ${duplicated.id}`);

    res.status(201).json({
      message: "CV berhasil diduplikat",
      resume: duplicated,
    });
  } catch (error) {
    next(error);
  }
};
