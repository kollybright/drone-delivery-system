import { Drone, DroneState, DroneModel, Medication } from "../models";
import { DroneRepository, MedicationRepository } from "../repositories";

export class DroneService {
  constructor(
    private droneRepository: DroneRepository,
    private medicationRepository: MedicationRepository
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
    medicationData: Partial<Medication>
  ): Promise<{ drone: Drone; medication: Medication }> {
    const drone = await this.droneRepository.findById(droneId);

    if (!drone) {
      throw new Error("Drone not found");
    }

    // Check battery level
    if (drone.batteryCapacity < 25) {
      throw new Error("Cannot load drone with battery level below 25%");
    }

    // Validate medication data
    this.validateMedicationData(medicationData);

    // Calculate total weight
    const currentWeight =
      drone.medications?.reduce((sum, med) => sum + med.weight, 0) || 0;
    const newTotalWeight = currentWeight + (medicationData.weight || 0);

    if (newTotalWeight > drone.weightLimit) {
      throw new Error(
        `Cannot load medication. Weight limit exceeded. Current: ${currentWeight}gr, New: ${medicationData.weight}gr, Limit: ${drone.weightLimit}gr`
      );
    }

    // Create medication
    const medication = await this.medicationRepository.create({
      ...medicationData,
      droneId: drone.id,
    });

    // Update drone state if needed
    if (drone.state === DroneState.IDLE) {
      await this.droneRepository.update(droneId, { state: DroneState.LOADING });
    }

    // Reload drone with medications
    const updatedDrone = await this.droneRepository.findByIdWithMedications(
      droneId
    );

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

  async getDroneBatteryLevel(droneId: string): Promise<number> {
    const drone = await this.droneRepository.findById(droneId);
    if (!drone) {
      throw new Error("Drone not found");
    }
    return drone.batteryCapacity;
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

  private validateMedicationData(medicationData: Partial<Medication>): void {
    if (
      medicationData.name &&
      !this.isValidMedicationName(medicationData.name)
    ) {
      throw new Error(
        "Medication name can only contain letters, numbers, hyphens, and underscores"
      );
    }

    if (
      medicationData.code &&
      !this.isValidMedicationCode(medicationData.code)
    ) {
      throw new Error(
        "Medication code can only contain uppercase letters, underscores, and numbers"
      );
    }

    if (medicationData.weight && medicationData.weight <= 0) {
      throw new Error("Medication weight must be positive");
    }
  }

  private isValidMedicationName(name: string): boolean {
    return /^[a-zA-Z0-9\-_]+$/.test(name);
  }

  private isValidMedicationCode(code: string): boolean {
    return /^[A-Z0-9_]+$/.test(code);
  }
}
