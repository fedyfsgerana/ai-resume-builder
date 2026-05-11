import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),

  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  GROQ_API_KEY: z.string().min(10),
  GROQ_MODEL: z.string().default("llama3-8b-8192"),

  REDIS_URL: z.string().default("redis://localhost:6379"),
  REDIS_TTL: z.string().default("3600"),

  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  APP_NAME: z.string().default("AI Resume Builder"),
  APP_URL: z.string().default("http://localhost:5000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
