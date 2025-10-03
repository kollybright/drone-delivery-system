import { Router } from "express";
import { DroneController } from "../controllers";
import { DroneRepository, MedicationRepository } from "../repositories";
import { DroneService, MedicationService } from "../services";

const router = Router();

// Initialize dependencies
// Initialize dependencies
const droneRepository = new DroneRepository();
const medicationRepository = new MedicationRepository();
const medicationService = new MedicationService(medicationRepository);
const droneService = new DroneService(droneRepository, medicationService);
const droneController = new DroneController(droneService)

/**
 * @route POST /api/drones
 * @description Register a new drone
 * @access Public
 * @body {string} serialNumber - Drone serial number (max 100 chars)
 * @body {string} model - Drone model (Lightweight, Middleweight, Cruiserweight, Heavyweight)
 * @body {number} weightLimit - Maximum weight capacity (max 500gr)
 * @body {number} batteryCapacity - Battery level (0-100%)
 * @body {string} state - Current state (IDLE, LOADING, LOADED, DELIVERING, DELIVERED, RETURNING)
 */
router.post("/", (req, res) => droneController.registerDrone(req, res));

/**
 * @route GET /api/drones
 * @description Get all drones with their medications
 * @access Public
 */
router.get("/", (req, res) => droneController.getAllDrones(req, res));

/**
 * @route GET /api/drones/available
 * @description Get available drones for loading (IDLE state, battery > 25%)
 * @access Public
 */
router.get("/available", (req, res) =>
  droneController.getAvailableDrones(req, res)
);

/**
 * @route GET /api/drones/:droneId
 * @description Get specific drone details by ID
 * @access Public
 * @param {string} droneId - Drone ID
 */
router.get("/:droneId", (req, res) => droneController.getDroneById(req, res));

/**
 * @route POST /api/drones/:droneId/load
 * @description Load medication items onto a drone
 * @access Public
 * @param {string} droneId - Drone ID
 * @body {string} name - Medication name (letters, numbers, '-', '_')
 * @body {number} weight - Medication weight in grams
 * @body {string} code - Medication code (uppercase letters, numbers, '_')
 * @body {string} image - Medication image URL/path
 */
router.post("/:droneId/load", (req, res) =>
  droneController.loadMedication(req, res)
);

/**
 * @route GET /api/drones/:droneId/medications
 * @description Get all medications loaded on a specific drone
 * @access Public
 * @param {string} droneId - Drone ID
 */
router.get("/:droneId/medications", (req, res) =>
  droneController.getLoadedMedications(req, res)
);

/**
 * @route GET /api/drones/:droneId/battery
 * @description Check battery level of a specific drone
 * @access Public
 * @param {string} droneId - Drone ID
 */
router.get("/:droneId/battery", (req, res) =>
  droneController.getBatteryLevel(req, res)
);

/**
 * @route PATCH /api/drones/:droneId/state
 * @description Update drone state
 * @access Public
 * @param {string} droneId - Drone ID
 * @body {string} state - New state (IDLE, LOADING, LOADED, DELIVERING, DELIVERED, RETURNING)
 */
router.patch("/:droneId/state", (req, res) =>
  droneController.updateDroneState(req, res)
);

export default router;
