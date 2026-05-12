import { Router } from "express";
import {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
  exportResume,
  duplicateResume,
} from "../controllers/resumeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate, resumeSchema } from "../utils/validator.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(resumeSchema), createResume);
router.get("/", getAllResumes);
router.get("/:id", getResumeById);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);
router.get("/:id/export", exportResume);
router.post("/:id/duplicate", duplicateResume);

export default router;
