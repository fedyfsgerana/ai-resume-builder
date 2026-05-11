import { Router } from "express";
import {
  uploadAndParseCV,
  uploadAndCreateResume,
} from "../controllers/uploadController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/parse", upload.single("cv"), uploadAndParseCV);
router.post("/create", upload.single("cv"), uploadAndCreateResume);

export default router;
