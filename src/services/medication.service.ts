import { Medication } from "../models";
import { MedicationRepository } from "../repositories";

export class MedicationService {
  constructor(private medicationRepository: MedicationRepository) {}

  async createMedication(
    medicationData: Partial<Medication>
  ): Promise<Medication> {
    // Validate medication name
    if (!medicationData?.name) {
      throw new Error("Medication name cannot be empty");
    }
    if (!medicationData?.code) {
      throw new Error("Medication code cannot be empty");
    }

    if (!this.isValidMedicationName(medicationData.name)) {
      throw new Error(
        "Medication name can only contain letters, numbers, hyphens, and underscores"
      );
    }

    // Validate medication code
    if (!this.isValidMedicationCode(medicationData.code)) {
      throw new Error(
        "Medication code can only contain uppercase letters, underscores, and numbers"
      );
    }

    // Validate weight
    if (!medicationData.weight || medicationData.weight <= 0) {
      throw new Error("Medication weight must be a positive number");
    }

    return this.medicationRepository.create(medicationData);
  }

  async validateMedicationData(
    medicationData: Partial<Medication>
  ): Promise<void> {
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
      throw new Error("Medication weight must be a positive number");
    }
  }

  private isValidMedicationName(name: string): boolean {
    return /^[a-zA-Z0-9\-_]+$/.test(name);
  }

  private isValidMedicationCode(code: string): boolean {
    return /^[A-Z0-9_]+$/.test(code);
  }
}
