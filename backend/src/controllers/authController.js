import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, tier: user.tier },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      message: "Register successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tier: user.tier,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await UserModel.updateRefreshToken(user.id, refreshToken);

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tier: user.tier,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const error = new Error("Refresh token is required");
      error.statusCode = 400;
      throw error;
    }

    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

    const user = await UserModel.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      const error = new Error("Invalid refresh token");
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await UserModel.updateRefreshToken(req.user.id, null);

    logger.info(`User logged out: ${req.user.email}`);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tier: user.tier,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const existing = await UserModel.findByEmail(email);
    if (existing && existing.id !== req.user.id) {
      const error = new Error("Email sudah digunakan");
      error.statusCode = 409;
      throw error;
    }

    const updated = await UserModel.update(req.user.id, { name, email });

    logger.info(`Profile updated: ${req.user.email}`);

    res.status(200).json({
      message: "Profil berhasil diperbarui",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        tier: updated.tier,
        isVerified: updated.isVerified,
        createdAt: updated.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await UserModel.findById(req.user.id);

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      const error = new Error("Kata sandi lama tidak sesuai");
      error.statusCode = 400;
      throw error;
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await UserModel.update(req.user.id, { password: hashed });

    logger.info(`Password updated: ${req.user.email}`);

    res.status(200).json({ message: "Kata sandi berhasil diperbarui" });
  } catch (error) {
    next(error);
  }
};
