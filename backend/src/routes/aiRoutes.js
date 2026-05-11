import { Router } from "express";
import {
  generateResume,
  regenerateSection,
  getMatchScore,
} from "../controllers/aiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate, jobDescSchema } from "../utils/validator.js";

const router = Router();

router.use(authMiddleware);

router.post("/:id/generate", validate(jobDescSchema), generateResume);
router.post("/:id/regenerate", regenerateSection);
router.get("/:id/match-score", getMatchScore);

export default router;
