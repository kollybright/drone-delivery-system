import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env["CORS_ORIGIN"] || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Drone Delivery API",
    version: "1.0.0",
    description: "A REST API for managing drone medication deliveries",
    endpoints: {
      documentation: "/api/health",
      drones: "/api/drones",
      medications: "/api/drones/:id/medications",
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Drone Delivery API is healthy ",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

// Global error handling middleware
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", error);

    // Default error
    let statusCode = 500;
    let message = "Internal server error";

    // Handle specific error types
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

    res.status(statusCode).json({
      success: false,
      error: message,
      ...(process.env["NODE_ENV"] === "development" && { stack: error.stack }),
    });
  }
);

export default app;
