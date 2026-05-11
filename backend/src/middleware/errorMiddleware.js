import { logger } from "../config/logger.js";

export const errorMiddleware = (err, req, res, next) => {
  logger.error(`${err.message}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Data already exists" });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Data not found" });
    }
  }

  res.status(statusCode).json({ message });
};
