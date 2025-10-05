import request from "supertest";
import app from "../../src/app";
import { db } from "../../src/config/database";
import { DroneRepository } from "../../src/repositories";
import { MedicationRepository } from "../../src/repositories";
import { DroneModel, DroneState } from "../../src/models";

describe("Drone Routes Integration Tests", () => {
  let droneRepository: DroneRepository;
  let medicationRepository: MedicationRepository;

  beforeAll(() => {
    droneRepository = new DroneRepository();
    medicationRepository = new MedicationRepository();
  });

  //   beforeEach(async () => {
  //     // Clean up before each test
  //     await new Promise<void>((resolve) => {
  //       db.serialize(() => {
  //         db.run("DELETE FROM medications", () => {
  //           db.run("DELETE FROM drones", () => {
  //             resolve();
  //           });
  //         });
  //       });
  //     });
  //   });

  describe("POST /api/drones", () => {
    test("should register a new drone", async () => {
      const droneData = {
        serialNumber: "TEST-REGISTER-001",
        model: "Lightweight",
        weightLimit: 300,
        batteryCapacity: 100,
        state: "IDLE",
      };

      const response = await request(app)
        .post("/api/drones")
        .send(droneData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.serialNumber).toBe(droneData.serialNumber);
      expect(response.body.data.model).toBe(droneData.model);
    });

    test("should return error for invalid drone data", async () => {
      const invalidDroneData = {
        serialNumber: "A".repeat(101), // Too long
        model: "InvalidModel",
        weightLimit: 600, // Exceeds limit
        batteryCapacity: 150, // Exceeds 100%
      };

      const response = await request(app)
        .post("/api/drones")
        .send(invalidDroneData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/drones/available", () => {
    test("should return available drones", async () => {
      // Create available drones
      await droneRepository.create({
        serialNumber: "AVAILABLE-001",
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: 300,
        batteryCapacity: 100,
        state: DroneState.IDLE,
      });

      await droneRepository.create({
        serialNumber: "AVAILABLE-002",
        model: DroneModel.MIDDLEWEIGHT,
        weightLimit: 400,
        batteryCapacity: 50,
        state: DroneState.IDLE,
      });

      // Create unavailable drone (low battery)
      await droneRepository.create({
        serialNumber: "UNAVAILABLE-001",
        model: DroneModel.HEAVYWEIGHT,
        weightLimit: 500,
        batteryCapacity: 20,
        state: DroneState.IDLE,
      });

      const response = await request(app)
        .get("/api/drones/available")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].batteryCapacity).toBeGreaterThanOrEqual(25);
      expect(response.body.data[1].batteryCapacity).toBeGreaterThanOrEqual(25);
    });
  });

  describe("POST /api/drones/:droneId/load", () => {
    test("should load medication onto drone", async () => {
      // Create a drone first
      const drone = await droneRepository.create({
        serialNumber: "LOAD-TEST-001",
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: 300,
        batteryCapacity: 100,
        state: DroneState.IDLE,
      });

      const medicationData = {
        name: "Test-Medication",
        weight: 50,
        code: "TEST_001",
        image: "test.jpg",
      };

      const response = await request(app)
        .post(`/api/drones/${drone.id}/load`)
        .send(medicationData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.medication.name).toBe(medicationData.name);
    });

    test("should prevent loading when battery low", async () => {
      const drone = await droneRepository.create({
        serialNumber: "LOW-BATTERY-001",
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: 300,
        batteryCapacity: 20, // Low battery
        state: DroneState.IDLE,
      });

      const medicationData = {
        name: "Test-Medication",
        weight: 50,
        code: "TEST_001",
        image: "test.jpg",
      };

      const response = await request(app)
        .post(`/api/drones/${drone.id}/load`)
        .send(medicationData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("battery level below 25%");
    });
  });

  describe("GET /api/drones/:droneId/battery", () => {
    test("should return drone battery level", async () => {
      const drone = await droneRepository.create({
        serialNumber: "BATTERY-TEST-001",
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: 300,
        batteryCapacity: 75,
        state: DroneState.IDLE,
      });

      const response = await request(app)
        .get(`/api/drones/${drone.id}/battery`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.batteryLevel).toBe(75);
      expect(response.body.data.droneId).toBe(drone.id);
    });

    test("should return 404 for non-existent drone", async () => {
      const response = await request(app)
        .get("/api/drones/non-existent-id/battery")
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
