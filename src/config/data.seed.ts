import { DroneModel, DroneState } from "../models";
import { DroneRepository, MedicationRepository } from "../repositories";

const droneRepository = new DroneRepository();
const medicationRepository = new MedicationRepository();

export async function seedDatabase(): Promise<void> {
  console.log("Seeding database with initial data...");

  // Sample drones
  const drones = [
    {
      serialNumber: "DRN001-LIGHT-001",
      model: DroneModel.LIGHTWEIGHT,
      weightLimit: 200,
      batteryCapacity: 100,
      state: DroneState.IDLE,
    },
    {
      serialNumber: "DRN002-LIGHT-002",
      model: DroneModel.LIGHTWEIGHT,
      weightLimit: 200,
      batteryCapacity: 85,
      state: DroneState.IDLE,
    },
    {
      serialNumber: "DRN003-MIDDLE-001",
      model: DroneModel.MIDDLEWEIGHT,
      weightLimit: 300,
      batteryCapacity: 75,
      state: DroneState.LOADING,
    },
    {
      serialNumber: "DRN004-MIDDLE-002",
      model: DroneModel.MIDDLEWEIGHT,
      weightLimit: 300,
      batteryCapacity: 50,
      state: DroneState.IDLE,
    },
    {
      serialNumber: "DRN005-CRUISER-001",
      model: DroneModel.CRUISERWEIGHT,
      weightLimit: 400,
      batteryCapacity: 100,
      state: DroneState.LOADED,
    },
    {
      serialNumber: "DRN006-CRUISER-002",
      model: DroneModel.CRUISERWEIGHT,
      weightLimit: 400,
      batteryCapacity: 20, // Low battery for testing
      state: DroneState.IDLE,
    },
    {
      serialNumber: "DRN007-HEAVY-001",
      model: DroneModel.HEAVYWEIGHT,
      weightLimit: 500,
      batteryCapacity: 90,
      state: DroneState.DELIVERING,
    },
    {
      serialNumber: "DRN008-HEAVY-002",
      model: DroneModel.HEAVYWEIGHT,
      weightLimit: 500,
      batteryCapacity: 60,
      state: DroneState.IDLE,
    },
    {
      serialNumber: "DRN009-HEAVY-003",
      model: DroneModel.HEAVYWEIGHT,
      weightLimit: 500,
      batteryCapacity: 30,
      state: DroneState.RETURNING,
    },
    {
      serialNumber: "DRN010-LIGHT-003",
      model: DroneModel.LIGHTWEIGHT,
      weightLimit: 200,
      batteryCapacity: 15, // Very low battery
      state: DroneState.IDLE,
    },
  ];

  // Sample medications
  const medications = [
    {
      name: "Paracetamol-500mg",
      weight: 50,
      code: "PARA_500",
      image: "paracetamol.jpg",
    },
    {
      name: "Amoxicillin-250mg",
      weight: 75,
      code: "AMOX_250",
      image: "amoxicillin.jpg",
    },
    {
      name: "Ibuprofen-400mg",
      weight: 60,
      code: "IBU_400",
      image: "ibuprofen.jpg",
    },
    {
      name: "Vitamin-C-1000mg",
      weight: 40,
      code: "VITC_1000",
      image: "vitamin_c.jpg",
    },
    {
      name: "Aspirin-100mg",
      weight: 45,
      code: "ASP_100",
      image: "aspirin.jpg",
    },
    {
      name: "Insulin-Pen",
      weight: 80,
      code: "INSULIN_PEN",
      image: "insulin.jpg",
    },
    {
      name: "Antiseptic-Cream",
      weight: 55,
      code: "ANTI_CR",
      image: "antiseptic.jpg",
    },
    {
      name: "Bandage-Sterile",
      weight: 30,
      code: "BAND_ST",
      image: "bandage.jpg",
    },
  ];

  try {
    // Create drones
    const createdDrones = [];
    for (const droneData of drones) {
      const drone = await droneRepository.create(droneData);
      createdDrones.push(drone);
    }

    // Load some medications onto specific drones
    if (createdDrones.length >= 3) {
      // Load medications onto first drone
      await medicationRepository.create({
        ...medications[0],
        droneId: createdDrones[0].id,
      });

      await medicationRepository.create({
        ...medications[1],
        droneId: createdDrones[0].id,
      });

      // Load medications onto third drone
      await medicationRepository.create({
        ...medications[2],
        droneId: createdDrones[2].id,
      });

      await medicationRepository.create({
        ...medications[3],
        droneId: createdDrones[2].id,
      });
    }

    console.log("Database seeded successfully!");
    console.log(`Created ${createdDrones.length} drones`);
    console.log(` Created ${medications.length} medication types`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
