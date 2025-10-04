import { Drone, DroneState, DroneModel, Medication } from "../models";
import { DroneRepository } from "../repositories";
import { MedicationService } from "./medication.service";

export class DroneService {
  constructor(
    private droneRepository: DroneRepository,
    private medicationService: MedicationService,
  ) {}

  async registerDrone(droneData: Partial<Drone>): Promise<Drone> {
    this.validateDroneData(droneData);
    return this.droneRepository.create(droneData);
  }

  async getAllDrones(): Promise<Drone[]> {
    return this.droneRepository.findAll();
  }

  async getDroneById(droneId: string): Promise<Drone | null> {
    return this.droneRepository.findById(droneId);
  }

  async loadMedication(
    droneId: string,
    medicationData: Partial<Medication>,
  ): Promise<{ drone: Drone; medication: Medication }> {
    const drone = await this.droneRepository.findById(droneId);

    if (!drone) {
      throw new Error("Drone not found");
    }

    // Check battery level
    if (drone.batteryCapacity < 25) {
      throw new Error("Cannot load drone with battery level below 25%");
    }

    // Validate medication data using MedicationService
    await this.medicationService.validateMedicationData(medicationData);

    // Calculate total weight
    const currentWeight =
      drone.medications?.reduce((sum, med) => sum + med.weight, 0) || 0;
    const newTotalWeight = currentWeight + (medicationData.weight || 0);

    if (newTotalWeight > drone.weightLimit) {
      throw new Error(
        `Cannot load medication. Weight limit exceeded. Current: ${currentWeight}gr, New: ${medicationData.weight}gr, Limit: ${drone.weightLimit}gr`,
      );
    }

    // Create medication using MedicationService
    const medication = await this.medicationService.createMedication({
      ...medicationData,
      droneId: drone.id,
    });

    // Update drone state if needed
    if (drone.state === DroneState.IDLE) {
      await this.droneRepository.update(droneId, { state: DroneState.LOADING });
    }

    // Reload drone with medications
    const updatedDrone =
      await this.droneRepository.findByIdWithMedications(droneId);

    return { drone: updatedDrone!, medication };
  }

  async getLoadedMedications(droneId: string): Promise<Medication[]> {
    const drone = await this.droneRepository.findByIdWithMedications(droneId);
    if (!drone) {
      throw new Error("Drone not found");
    }
    return drone.medications || [];
  }

  async getAvailableDrones(): Promise<Drone[]> {
    return this.droneRepository.findAvailableForLoading();
  }

  async getDroneBatteryLevel(droneId: string): Promise<number | null> {
    const drone = await this.droneRepository.findById(droneId);
    return drone?.batteryCapacity || null;
  }

  async updateDroneState(droneId: string, state: DroneState): Promise<Drone> {
    const drone = await this.droneRepository.findById(droneId);
    if (!drone) {
      throw new Error("Drone not found");
    }

    return this.droneRepository.update(droneId, { state });
  }

  private validateDroneData(droneData: Partial<Drone>): void {
    if (droneData.serialNumber && droneData.serialNumber.length > 100) {
      throw new Error("Serial number must not exceed 100 characters");
    }

    if (droneData.weightLimit && droneData.weightLimit > 500) {
      throw new Error("Weight limit must not exceed 500gr");
    }

    if (
      droneData.batteryCapacity &&
      (droneData.batteryCapacity < 0 || droneData.batteryCapacity > 100)
    ) {
      throw new Error("Battery capacity must be between 0 and 100 percent");
    }
  }
}
