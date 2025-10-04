import { DroneRepository, BatteryAuditRepository } from "../repositories";

export class BatteryCheckTask {
  private isRunning: boolean = false;

  constructor(
    private droneRepository: DroneRepository,
    private batteryAuditRepository: BatteryAuditRepository,
  ) {}

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log("Battery check task is already running");
      return;
    }

    this.isRunning = true;
    console.log("Starting battery check task...");

    // Run immediately on start
    await this.checkAllDronesBattery();

    // Then run every 5 minutes
    setInterval(
      async () => {
        await this.checkAllDronesBattery();
      },
      5 * 60 * 1000,
    ); // 5 minutes
  }

  async checkAllDronesBattery(): Promise<void> {
    try {
      const drones = await this.droneRepository.findAll();
      console.log(`Checking battery levels for ${drones.length} drones...`);

      for (const drone of drones) {
        await this.batteryAuditRepository.create({
          droneId: drone.id,
          batteryLevel: drone.batteryCapacity,
          checkTime: new Date(),
        });

        // Log low battery warnings
        if (drone.batteryCapacity < 25) {
          console.warn(
            `LOW BATTERY: Drone ${drone.serialNumber} has ${drone.batteryCapacity}% battery`,
          );
        } else {
          console.log(
            `Drone ${drone.serialNumber} battery level: ${drone.batteryCapacity}%`,
          );
        }
      }

      // Cleanup old audit records (keep last 30 days)
      await this.batteryAuditRepository.cleanupOldAudits(30);
    } catch (error) {
      console.error("Error during battery check:", error);
    }
  }

  stop(): void {
    this.isRunning = false;
    console.log("Battery check task stopped");
  }
}

export const batteryCheckTask = new BatteryCheckTask(
  new DroneRepository(),
  new BatteryAuditRepository(),
);
