import express from "express";
import { errorHandler } from "./response-handler";

export function handleErrorMiddleWare(
  error: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  console.error("Unhandled error:", error);

  let statusCode = 500;
  let message = "Internal server error";

  if (error instanceof SyntaxError && "body" in error) {
    statusCode = 400;
    message = "Invalid JSON in request body";
  } else if (error.code === "SQLITE_CONSTRAINT") {
    statusCode = 400;
    message = "Database constraint violation";
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.message) {
    message = error.message;
  }

  res.status(statusCode).json(errorHandler(message, statusCode));
}
