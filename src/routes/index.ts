import { Router } from "express";
import droneRoutes from "./drone.routes";

const router = Router();

// API routes
router.use("/drones", droneRoutes);

// Health check route (now also available at /api/health)
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

export default router;
