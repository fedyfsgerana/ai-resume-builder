import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const resumeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  cvBase: z
    .object({
      personalInfo: z
        .object({
          name: z.string().optional().default(""),
          email: z.string().optional().default(""),
          phone: z.string().optional().default(""),
          address: z.string().optional().default(""),
          linkedin: z.string().optional().default(""),
          website: z.string().optional().default(""),
        })
        .optional()
        .default({}),
      summary: z.string().optional().default(""),
      experience: z.array(z.any()).optional().default([]),
      education: z.array(z.any()).optional().default([]),
      skills: z.array(z.string()).optional().default([]),
    })
    .optional()
    .default({}),
});

export const jobDescSchema = z.object({
  jobDesc: z.string().min(10, "Job description must be at least 10 characters"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Kata sandi lama wajib diisi"),
  newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter"),
});

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
