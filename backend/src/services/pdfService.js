import { generatePDF } from "../utils/generatePDF.js";
import { ResumeModel } from "../models/Resume.js";
import { logger } from "../config/logger.js";

export const exportResumeToPDF = async (resumeId) => {
  const resume = await ResumeModel.findById(resumeId);

  if (!resume) {
    const error = new Error("Resume not found");
    error.statusCode = 404;
    throw error;
  }

  const cvData = resume.generatedCv || resume.cvBase;

  logger.info(`Generating PDF for resume: ${resumeId}`);

  const pdfBuffer = await generatePDF(cvData);

  await ResumeModel.update(resumeId, {
    exportedAt: new Date(),
    status: "EXPORTED",
  });

  logger.info(`PDF generated successfully for resume: ${resumeId}`);

  return {
    buffer: pdfBuffer,
    filename: `${resume.title.replace(/\s+/g, "_")}_${Date.now()}.pdf`,
  };
};
