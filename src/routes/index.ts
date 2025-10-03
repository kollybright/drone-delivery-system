import { Router } from "express";
import documentationRoutes from "./documentation.routes";
import droneRoutes from "./drone.routes";

const router = Router();

// API routes
router.use("/drones", droneRoutes);
router.use("/docs", documentationRoutes);

// Health check with enhanced information
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Drone Delivery API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    documentation: {
      hub: "/api/docs",
      swagger: "/api/docs/swagger",
      rapidoc: "/api/docs/rapidoc",
      openapi: "/api/docs/swagger.json",
    },
    endpoints: {
      drones: "/api/drones",
      availableDrones: "/api/drones/available",
      documentation: "/api/docs",
    },
    features: [
      "Drone registration and management",
      "Medication loading with validation",
      "Battery level monitoring",
      "Periodic battery checks",
      "Interactive API documentation",
    ],
  });
});

// Root endpoint redirects to documentation hub
router.get("/", (req, res) => {
  res.redirect("/api/docs");
});

export default router;
