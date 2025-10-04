import { MedicationService } from "../../../src/services";
import { MedicationRepository } from "../../../src/repositories";

jest.mock("../../../src/repositories/medication.repository");

describe("MedicationService", () => {
  let medicationService: MedicationService;
  let medicationRepository: jest.Mocked<MedicationRepository>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    medicationRepository =
      new MedicationRepository() as jest.Mocked<MedicationRepository>;
    medicationService = new MedicationService(medicationRepository);
  });

  describe("validateMedicationData", () => {
    test("should validate correct medication data", async () => {
      const medicationData = {
        name: "Valid-Medication_123",
        weight: 50,
        code: "VALID_123",
      };

      await expect(
        medicationService.validateMedicationData(medicationData),
      ).resolves.toBeUndefined();
    });

    test("should throw error for invalid medication name", async () => {
      const medicationData = {
        name: "Invalid@Medication",
        weight: 50,
        code: "VALID_123",
      };

      await expect(
        medicationService.validateMedicationData(medicationData),
      ).rejects.toThrow(
        "Medication name can only contain letters, numbers, hyphens, and underscores",
      );
    });

    test("should throw error for invalid medication code", async () => {
      const medicationData = {
        name: "Valid-Medication",
        weight: 50,
        code: "invalid-code",
      };

      await expect(
        medicationService.validateMedicationData(medicationData),
      ).rejects.toThrow(
        "Medication code can only contain uppercase letters, underscores, and numbers",
      );
    });

    test("should throw error for invalid weight", async () => {
      const medicationData = {
        name: "Valid-Medication",
        weight: 0,
        code: "VALID_123",
      };

      await expect(
        medicationService.validateMedicationData(medicationData),
      ).rejects.toThrow("Medication weight must be a positive number");
    });

    test("should throw error for negative weight", async () => {
      const medicationData = {
        name: "Valid-Medication",
        weight: -10,
        code: "VALID_123",
      };

      await expect(
        medicationService.validateMedicationData(medicationData),
      ).rejects.toThrow("Medication weight must be a positive number");
    });
  });

  describe("createMedication", () => {
    test("should create medication with valid data", async () => {
      const medicationData = {
        name: "Test-Medication",
        weight: 50,
        code: "TEST_123",
        image: "test.jpg",
        droneId: "drone-123",
      };

      const expectedMedication = {
        ...medicationData,
        id: "med-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      medicationRepository.create.mockResolvedValue(expectedMedication as any);

      const result = await medicationService.createMedication(medicationData);

      expect(result).toEqual(expectedMedication);
      expect(medicationRepository.create).toHaveBeenCalledWith(medicationData);
    });

    test("should throw error when repository fails", async () => {
      const medicationData = {
        name: "Test-Medication",
        weight: 50,
        code: "TEST_123",
        image: "test.jpg",
      };

      medicationRepository.create.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(
        medicationService.createMedication(medicationData),
      ).rejects.toThrow("Database error");
    });
  });
});
