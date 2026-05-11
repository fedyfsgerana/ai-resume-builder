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
  cvBase: z.object({
    personalInfo: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email format"),
      phone: z.string().optional(),
      address: z.string().optional(),
      linkedin: z.string().optional(),
      website: z.string().optional(),
    }),
    summary: z.string().optional(),
    experience: z
      .array(
        z.object({
          company: z.string().min(1, "Company is required"),
          position: z.string().min(1, "Position is required"),
          startDate: z.string().min(1, "Start date is required"),
          endDate: z.string().optional(),
          isCurrent: z.boolean().default(false),
          description: z.array(z.string()).optional(),
        }),
      )
      .optional(),
    education: z
      .array(
        z.object({
          institution: z.string().min(1, "Institution is required"),
          degree: z.string().min(1, "Degree is required"),
          field: z.string().optional(),
          startDate: z.string().min(1, "Start date is required"),
          endDate: z.string().optional(),
          gpa: z.string().optional(),
        }),
      )
      .optional(),
    skills: z.array(z.string()).optional(),
  }),
});

export const jobDescSchema = z.object({
  jobDesc: z.string().min(10, "Job description must be at least 10 characters"),
});

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
