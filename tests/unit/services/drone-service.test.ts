import { DroneService, MedicationService } from "../../../src/services/";
import { DroneRepository } from "../../../src/repositories/";
import { DroneModel, DroneState } from "../../../src/models";
import { createTestDrone, createTestMedication } from "../../utils/test-helper";

// Mock repositories
jest.mock("../../../src/repositories/drone.repository");
jest.mock("../../../src/services/medication.service");

describe("DroneService", () => {
  let droneService: DroneService;
  let droneRepository: jest.Mocked<DroneRepository>;
  let medicationService: jest.Mocked<MedicationService>;

  beforeEach(() => {
    droneRepository = new DroneRepository() as jest.Mocked<DroneRepository>;
    medicationService = new MedicationService(
      {} as any,
    ) as jest.Mocked<MedicationService>;
    droneService = new DroneService(droneRepository, medicationService);
  });

  describe("registerDrone", () => {
    test("should register a drone with valid data", async () => {
      const droneData = createTestDrone();
      const expectedDrone = { ...droneData, id: "123", medications: [] };

      droneRepository.create.mockResolvedValue(expectedDrone as any);

      const result = await droneService.registerDrone(droneData);

      expect(result).toEqual(expectedDrone);
      expect(droneRepository.create).toHaveBeenCalledWith(droneData);
    });

    test("should throw error for serial number exceeding 100 characters", async () => {
      const droneData = createTestDrone({
        serialNumber: "A".repeat(101),
      });

      await expect(droneService.registerDrone(droneData)).rejects.toThrow(
        "Serial number must not exceed 100 characters",
      );
    });

    test("should throw error for weight limit exceeding 500gr", async () => {
      const droneData = createTestDrone({ weightLimit: 501 });

      await expect(droneService.registerDrone(droneData)).rejects.toThrow(
        "Weight limit must not exceed 500gr",
      );
    });

    test("should throw error for invalid battery capacity", async () => {
      const droneData = createTestDrone({ batteryCapacity: 150 });

      await expect(droneService.registerDrone(droneData)).rejects.toThrow(
        "Battery capacity must be between 0 and 100 percent",
      );
    });
  });

  describe("loadMedication", () => {
    test("should load medication when valid", async () => {
      const drone = {
        id: "drone-123",
        batteryCapacity: 100,
        state: DroneState.IDLE,
        weightLimit: 300,
        medications: [],
      };
      const medicationData = createTestMedication();
      const medication = { ...medicationData, id: "med-123" };

      droneRepository.findById.mockResolvedValue(drone as any);
      medicationService.validateMedicationData.mockResolvedValue();
      medicationService.createMedication.mockResolvedValue(medication as any);
      droneRepository.update.mockResolvedValue({
        ...drone,
        state: DroneState.LOADING,
      } as any);
      droneRepository.findByIdWithMedications.mockResolvedValue({
        ...drone,
        medications: [medication],
        state: DroneState.LOADING,
      } as any);

      const result = await droneService.loadMedication(
        "drone-123",
        medicationData,
      );

      expect(result.medication).toEqual(medication);
      expect(medicationService.createMedication).toHaveBeenCalledWith({
        ...medicationData,
        droneId: "drone-123",
      });
    });

    test("should throw error when drone not found", async () => {
      droneRepository.findById.mockResolvedValue(null);

      await expect(
        droneService.loadMedication("invalid-id", createTestMedication()),
      ).rejects.toThrow("Drone not found");
    });

    test("should throw error when battery below 25%", async () => {
      const drone = {
        id: "drone-123",
        batteryCapacity: 20,
        state: DroneState.IDLE,
      };
      droneRepository.findById.mockResolvedValue(drone as any);

      await expect(
        droneService.loadMedication("drone-123", createTestMedication()),
      ).rejects.toThrow("Cannot load drone with battery level below 25%");
    });
  });

  describe("getAvailableDrones", () => {
    test("should return available drones", async () => {
      const availableDrones = [
        {
          ...createTestDrone(),
          id: "1",
          state: DroneState.IDLE,
          batteryCapacity: 100,
        },
        {
          ...createTestDrone(),
          id: "2",
          state: DroneState.IDLE,
          batteryCapacity: 50,
        },
      ];

      droneRepository.findAvailableForLoading.mockResolvedValue(
        availableDrones as any,
      );

      const result = await droneService.getAvailableDrones();

      expect(result).toEqual(availableDrones);
      expect(droneRepository.findAvailableForLoading).toHaveBeenCalled();
    });
  });
});
