import { Drone, DroneModel, DroneState, Medication } from "../../src/models";

export const createTestDrone = (
  overrides: Partial<Drone> = {},
): Partial<Drone> => ({
  serialNumber: "TEST-DRONE-001",
  model: DroneModel.LIGHTWEIGHT,
  weightLimit: 300,
  batteryCapacity: 100,
  state: DroneState.IDLE,
  ...overrides,
});

export const createTestMedication = (
  overrides: Partial<Medication> = {},
): Partial<Medication> => ({
  name: "Test-Medication-001",
  weight: 50,
  code: "TEST_001",
  image: "test.jpg",
  ...overrides,
});

export const sampleDrones = [
  createTestDrone({ serialNumber: "DRONE-001", batteryCapacity: 100 }),
  createTestDrone({ serialNumber: "DRONE-002", batteryCapacity: 50 }),
  createTestDrone({
    serialNumber: "DRONE-003",
    batteryCapacity: 20,
    state: DroneState.LOADING,
  }),
];

export const sampleMedications = [
  createTestMedication({ name: "Med-1", weight: 50, code: "MED_001" }),
  createTestMedication({ name: "Med-2", weight: 75, code: "MED_002" }),
  createTestMedication({ name: "Med-3", weight: 100, code: "MED_003" }),
];
