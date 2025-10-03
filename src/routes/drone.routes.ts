import { Router } from "express";
import { DroneController } from "../controllers";
import { DroneRepository, MedicationRepository } from "../repositories";
import { MedicationService, DroneService } from "../services";

const router = Router();

// Initialize dependencies
const droneRepository = new DroneRepository();
const medicationRepository = new MedicationRepository();
const medicationService = new MedicationService(medicationRepository);
const droneService = new DroneService(droneRepository, medicationService);
const droneController = new DroneController(droneService);

/**
 * @swagger
 * /drones:
 *   post:
 *     summary: Register a new drone
 *     tags: [Drones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serialNumber
 *               - model
 *               - weightLimit
 *               - batteryCapacity
 *               - state
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 maxLength: 100
 *                 example: "DRONE-001"
 *               model:
 *                 type: string
 *                 enum: [Lightweight, Middleweight, Cruiserweight, Heavyweight]
 *                 example: "Lightweight"
 *               weightLimit:
 *                 type: number
 *                 maximum: 500
 *                 example: 300
 *               batteryCapacity:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 100
 *               state:
 *                 type: string
 *                 enum: [IDLE, LOADING, LOADED, DELIVERING, DELIVERED, RETURNING]
 *                 example: "IDLE"
 *     responses:
 *       201:
 *         description: Drone registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Drone'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post("/", (req, res) => droneController.registerDrone(req, res));

/**
 * @swagger
 * /drones:
 *   get:
 *     summary: Get all drones
 *     tags: [Drones]
 *     responses:
 *       200:
 *         description: List of all drones
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Drone'
 */
router.get("/", (req, res) => droneController.getAllDrones(req, res));

/**
 * @swagger
 * /drones/available:
 *   get:
 *     summary: Get available drones for loading
 *     tags: [Drones]
 *     description: Returns drones that are in IDLE state with battery level above 25%
 *     responses:
 *       200:
 *         description: List of available drones
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Drone'
 */
router.get("/available", (req, res) =>
  droneController.getAvailableDrones(req, res)
);

/**
 * @swagger
 * /drones/{droneId}:
 *   get:
 *     summary: Get drone by ID
 *     tags: [Drones]
 *     parameters:
 *       - $ref: '#/components/parameters/DroneId'
 *     responses:
 *       200:
 *         description: Drone details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Drone'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:droneId", (req, res) => droneController.getDroneById(req, res));

/**
 * @swagger
 * /drones/{droneId}/load:
 *   post:
 *     summary: Load medication onto a drone
 *     tags: [Drones]
 *     parameters:
 *       - $ref: '#/components/parameters/DroneId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Medication'
 *     responses:
 *       200:
 *         description: Medication loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         drone:
 *                           $ref: '#/components/schemas/Drone'
 *                         medication:
 *                           $ref: '#/components/schemas/Medication'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/ValidationError'
 *                 - $ref: '#/components/responses/LowBatteryError'
 *                 - $ref: '#/components/responses/OverweightError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post("/:droneId/load", (req, res) =>
  droneController.loadMedication(req, res)
);

/**
 * @swagger
 * /drones/{droneId}/medications:
 *   get:
 *     summary: Get loaded medications for a drone
 *     tags: [Drones]
 *     parameters:
 *       - $ref: '#/components/parameters/DroneId'
 *     responses:
 *       200:
 *         description: List of medications loaded on the drone
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Medication'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:droneId/medications", (req, res) =>
  droneController.getLoadedMedications(req, res)
);

/**
 * @swagger
 * /drones/{droneId}/battery:
 *   get:
 *     summary: Check drone battery level
 *     tags: [Drones]
 *     parameters:
 *       - $ref: '#/components/parameters/DroneId'
 *     responses:
 *       200:
 *         description: Battery level information
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BatteryInfo'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:droneId/battery", (req, res) =>
  droneController.getBatteryLevel(req, res)
);

/**
 * @swagger
 * /drones/{droneId}/state:
 *   patch:
 *     summary: Update drone state
 *     tags: [Drones]
 *     parameters:
 *       - $ref: '#/components/parameters/DroneId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - state
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [IDLE, LOADING, LOADED, DELIVERING, DELIVERED, RETURNING]
 *                 example: "DELIVERING"
 *     responses:
 *       200:
 *         description: Drone state updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Drone'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch("/:droneId/state", (req, res) =>
  droneController.updateDroneState(req, res)
);

export default router;
