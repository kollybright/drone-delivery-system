import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { errorHandler, handleErrorMiddleWare } from "./utils";

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "cdn.jsdelivr.net",
          "unpkg.com",
          "blob:",
          "'unsafe-inline'",
        ],
        "worker-src": ["'self'", "blob:"],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "unpkg.com",
        ],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "img-src": ["'self'", "data:"],
      },
    },
    frameguard: { action: "deny" }, // Anti-clickjacking
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, //  HSTS
    noSniff: true, //  X-Content-Type-Options
    hidePoweredBy: true, //  remove X-Powered-By
    xssFilter: true, // legacy XSS filter (optional, safe)
  }),
);

// CORS configuration
app.use(
  cors({
    origin: process.env["CORS_ORIGIN"] || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", routes);

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json(errorHandler(`Route ${req.originalUrl} not found`, 404));
});

// Global error handling middleware
app.use(handleErrorMiddleWare);

export default app;
