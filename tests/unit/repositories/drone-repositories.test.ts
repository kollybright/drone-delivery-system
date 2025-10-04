import { DroneRepository } from "../../../src/repositories";
import { DroneModel, DroneState } from "../../../src/models";
import { db } from "../../../src/config/database";

// Use in-memory database for tests
const testDbPath = ":memory:";

describe("DroneRepository", () => {
  let droneRepository: DroneRepository;

  beforeAll(() => {
    droneRepository = new DroneRepository();
  });

  // beforeEach(async () => {
  //   // Clean up before each test
  //   await new Promise<void>((resolve) => {
  //     db.serialize(() => {
  //       db.run("DELETE FROM medications", () => {
  //         db.run("DELETE FROM drones", () => {
  //           resolve();
  //         });
  //       });
  //     });
  //   });
  // });

  describe("create", () => {
    test("should create a drone in database", async () => {
      const droneData = {
        serialNumber: "REPO-TEST-001",
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: 300,
        batteryCapacity: 100,
        state: DroneState.IDLE,
      };

      const drone = await droneRepository.create(droneData);

      expect(drone.id).toBeDefined();
      expect(drone.serialNumber).toBe(droneData.serialNumber);
      expect(drone.model).toBe(droneData.model);
      expect(drone.createdAt).toBeInstanceOf(Date);
      expect(drone.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("findBySerialNumber", () => {
    test("should find drone by serial number", async () => {
      const droneData = {
        serialNumber: "FIND-TEST-001",
        model: DroneModel.MIDDLEWEIGHT,
        weightLimit: 400,
        batteryCapacity: 80,
        state: DroneState.LOADING,
      };

      await droneRepository.create(droneData);
      const foundDrone =
        await droneRepository.findBySerialNumber("FIND-TEST-001");

      expect(foundDrone).not.toBeNull();
      expect(foundDrone?.serialNumber).toBe(droneData.serialNumber);
    });

    test("should return null for non-existent serial number", async () => {
      const foundDrone =
        await droneRepository.findBySerialNumber("NON-EXISTENT");

      expect(foundDrone).toBeNull();
    });
  });
});
