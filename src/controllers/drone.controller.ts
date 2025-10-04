import { Request, Response } from "express";
import { DroneService } from "../services";

export class DroneController {
  constructor(private droneService: DroneService) {}

  /**
   * Register a new drone
   */
  async registerDrone(req: Request, res: Response): Promise<void> {
    try {
      const drone = await this.droneService.registerDrone(req.body);
      res.status(201).json({
        success: true,
        message: "Drone registered successfully",
        data: drone,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get all drones
   */
  async getAllDrones(req: Request, res: Response): Promise<void> {
    try {
      const drones = await this.droneService.getAllDrones();
      res.json({
        success: true,
        data: drones,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get drone by ID
   */
  async getDroneById(req: Request, res: Response): Promise<void> {
    try {
      const { droneId } = req.params;
      const drone = await this.droneService.getDroneById(droneId);

      if (!drone) {
        res.status(404).json({
          success: false,
          error: "Drone not found",
        });
        return;
      }

      res.json({
        success: true,
        data: drone,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Load medication onto a drone
   */
  async loadMedication(req: Request, res: Response): Promise<void> {
    try {
      const { droneId } = req.params;
      const result = await this.droneService.loadMedication(droneId, req.body);

      res.json({
        success: true,
        message: "Medication loaded successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get loaded medications for a drone
   */
  async getLoadedMedications(req: Request, res: Response): Promise<void> {
    try {
      const { droneId } = req.params;
      const medications = await this.droneService.getLoadedMedications(droneId);

      res.json({
        success: true,
        data: medications,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get available drones for loading
   */
  async getAvailableDrones(req: Request, res: Response): Promise<void> {
    try {
      const drones = await this.droneService.getAvailableDrones();
      res.json({
        success: true,
        data: drones,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get drone battery level
   */
  async getBatteryLevel(req: Request, res: Response): Promise<void> {
    try {
      const { droneId } = req.params;
      const batteryLevel =
        await this.droneService.getDroneBatteryLevel(droneId);

      if (!batteryLevel) {
        res.status(404).json({
          success: false,
          error: "Battery not found",
        });

        return;
      }

      res.json({
        success: true,
        data: {
          droneId,
          batteryLevel,
          status: batteryLevel < 25 ? "LOW_BATTERY" : "OK",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Update drone state
   */
  async updateDroneState(req: Request, res: Response): Promise<void> {
    try {
      const { droneId } = req.params;
      const { state } = req.body;

      const drone = await this.droneService.updateDroneState(droneId, state);

      res.json({
        success: true,
        message: "Drone state updated successfully",
        data: drone,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
