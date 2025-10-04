import { Medication } from "../../../src/models";

describe("Medication Model", () => {
  test("should create a medication with valid properties", () => {
    const medication: Medication = {
      id: "test-id",
      name: "Paracetamol-500mg",
      weight: 50,
      code: "PARA_500",
      image: "paracetamol.jpg",
      droneId: "drone-123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(medication.name).toBe("Paracetamol-500mg");
    expect(medication.weight).toBe(50);
    expect(medication.code).toBe("PARA_500");
    expect(medication.image).toBe("paracetamol.jpg");
  });
});
