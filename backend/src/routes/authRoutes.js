import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  updatePassword,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
} from "../utils/validator.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);
router.put(
  "/profile",
  authMiddleware,
  validate(updateProfileSchema),
  updateProfile,
);
router.put(
  "/password",
  authMiddleware,
  validate(updatePasswordSchema),
  updatePassword,
);

export default router;
