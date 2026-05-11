import { parseCV } from "../services/parserService.js";
import { ResumeModel } from "../models/Resume.js";
import { logger } from "../config/logger.js";

export const uploadAndParseCV = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No file uploaded");
      error.statusCode = 400;
      throw error;
    }

    logger.info(`Parsing uploaded CV: ${req.file.filename}`);

    const parsed = await parseCV(req.file.path, req.file.mimetype);

    res.status(200).json({
      message: "CV parsed successfully",
      data: parsed,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAndCreateResume = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No file uploaded");
      error.statusCode = 400;
      throw error;
    }

    const { title } = req.body;

    if (!title) {
      const error = new Error("Title is required");
      error.statusCode = 400;
      throw error;
    }

    logger.info(`Parsing and creating resume from: ${req.file.filename}`);

    const parsed = await parseCV(req.file.path, req.file.mimetype);

    const resume = await ResumeModel.create({
      userId: req.user.id,
      title,
      cvBase: parsed,
    });

    logger.info(`Resume created from upload: ${resume.id}`);

    res.status(201).json({
      message: "Resume created from CV upload successfully",
      resume,
    });
  } catch (error) {
    next(error);
  }
};
