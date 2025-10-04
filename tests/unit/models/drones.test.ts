import { Drone, DroneModel, DroneState } from "../../../src/models";

describe("Drone Model", () => {
  test("should create a drone with valid properties", () => {
    const drone: Drone = {
      id: "test-id",
      serialNumber: "DRONE-001",
      model: DroneModel.LIGHTWEIGHT,
      weightLimit: 300,
      batteryCapacity: 100,
      state: DroneState.IDLE,
      medications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(drone.serialNumber).toBe("DRONE-001");
    expect(drone.model).toBe(DroneModel.LIGHTWEIGHT);
    expect(drone.weightLimit).toBe(300);
    expect(drone.batteryCapacity).toBe(100);
    expect(drone.state).toBe(DroneState.IDLE);
  });

  test("should validate drone model enum", () => {
    const models = Object.values(DroneModel);
    expect(models).toContain("Lightweight");
    expect(models).toContain("Middleweight");
    expect(models).toContain("Cruiserweight");
    expect(models).toContain("Heavyweight");
  });

  test("should validate drone state enum", () => {
    const states = Object.values(DroneState);
    expect(states).toContain("IDLE");
    expect(states).toContain("LOADING");
    expect(states).toContain("LOADED");
    expect(states).toContain("DELIVERING");
    expect(states).toContain("DELIVERED");
    expect(states).toContain("RETURNING");
  });
});
