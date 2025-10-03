import { Drone, DroneModel, DroneState, Medication } from "../models";
import { BaseRepository } from "./base.repository";

export class DroneRepository extends BaseRepository<Drone> {
  constructor() {
    super("drones");
  }

  async create(droneData: Partial<Drone>): Promise<Drone> {
    const id = this.generateId();
    const now = new Date().toISOString();

    const drone: Drone = {
      id,
      serialNumber: droneData.serialNumber!,
      model: droneData.model as DroneModel,
      weightLimit: droneData.weightLimit!,
      batteryCapacity: droneData.batteryCapacity || 100,
      state: droneData.state || DroneState.IDLE,
      medications: [],
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    const sql = `
      INSERT INTO drones (id, serialNumber, model, weightLimit, batteryCapacity, state, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.runQuery(sql, [
      drone.id,
      drone.serialNumber,
      drone.model,
      drone.weightLimit,
      drone.batteryCapacity,
      drone.state,
      drone.createdAt.toISOString(),
      drone.updatedAt.toISOString(),
    ]);

    return drone;
  }

  async findById(id: string): Promise<Drone | null> {
    const sql = "SELECT * FROM drones WHERE id = ?";
    const row = await this.getQuery<any>(sql, [id]);

    if (!row) return null;
    return this.mapRowToDrone(row);
  }

  // ADD THIS MISSING METHOD
  async findBySerialNumber(serialNumber: string): Promise<Drone | null> {
    const sql = "SELECT * FROM drones WHERE serialNumber = ?";
    const row = await this.getQuery<any>(sql, [serialNumber]);

    if (!row) return null;
    return this.mapRowToDrone(row);
  }

  async findByIdWithMedications(id: string): Promise<Drone | null> {
    const drone = await this.findById(id);
    if (!drone) return null;

    // Load medications for this drone
    const medicationsSql = "SELECT * FROM medications WHERE droneId = ?";
    const medicationRows = await this.allQuery<any>(medicationsSql, [id]);

    drone.medications = medicationRows.map((row) =>
      this.mapRowToMedication(row)
    );

    return drone;
  }

  async findAll(): Promise<Drone[]> {
    const sql = "SELECT * FROM drones ORDER BY createdAt DESC";
    const rows = await this.allQuery<any>(sql);

    return Promise.all(
      rows.map(async (row) => {
        const drone = this.mapRowToDrone(row);

        // Load medications for each drone
        const medicationsSql = "SELECT * FROM medications WHERE droneId = ?";
        const medicationRows = await this.allQuery<any>(medicationsSql, [
          drone.id,
        ]);
        drone.medications = medicationRows.map((medRow) =>
          this.mapRowToMedication(medRow)
        );

        return drone;
      })
    );
  }

  async findAvailableForLoading(): Promise<Drone[]> {
    const sql = `
      SELECT * FROM drones 
      WHERE state = 'IDLE' AND batteryCapacity >= 25 
      ORDER BY batteryCapacity DESC
    `;

    const rows = await this.allQuery<any>(sql);
    return rows.map((row) => this.mapRowToDrone(row));
  }

  async update(id: string, updateData: Partial<Drone>): Promise<Drone> {
    const currentDrone = await this.findById(id);
    if (!currentDrone) {
      throw new Error("Drone not found");
    }

    const updatedAt = new Date().toISOString();
    const fields = [];
    const values = [];

    if (updateData.serialNumber !== undefined) {
      fields.push("serialNumber = ?");
      values.push(updateData.serialNumber);
    }
    if (updateData.model !== undefined) {
      fields.push("model = ?");
      values.push(updateData.model);
    }
    if (updateData.weightLimit !== undefined) {
      fields.push("weightLimit = ?");
      values.push(updateData.weightLimit);
    }
    if (updateData.batteryCapacity !== undefined) {
      fields.push("batteryCapacity = ?");
      values.push(updateData.batteryCapacity);
    }
    if (updateData.state !== undefined) {
      fields.push("state = ?");
      values.push(updateData.state);
    }

    fields.push("updatedAt = ?");
    values.push(updatedAt);
    values.push(id);

    const sql = `UPDATE drones SET ${fields.join(", ")} WHERE id = ?`;
    await this.runQuery(sql, values);

    const updatedDrone = await this.findByIdWithMedications(id);
    return updatedDrone!;
  }

  async delete(id: string): Promise<void> {
    const sql = "DELETE FROM drones WHERE id = ?";
    await this.runQuery(sql, [id]);
  }

  async deleteAll(): Promise<void> {
    const sql = "DELETE FROM drones";
    await this.runQuery(sql);
  }

  async getTotalLoadedWeight(droneId: string): Promise<number> {
    const sql =
      "SELECT COALESCE(SUM(weight), 0) as totalWeight FROM medications WHERE droneId = ?";
    const result = await this.getQuery<{ totalWeight: number }>(sql, [droneId]);
    return result?.totalWeight || 0;
  }

  private mapRowToDrone(row: any): Drone {
    return {
      id: row.id,
      serialNumber: row.serialNumber,
      model: row.model as DroneModel,
      weightLimit: parseFloat(row.weightLimit),
      batteryCapacity: row.batteryCapacity,
      state: row.state as DroneState,
      medications: [], // Will be populated separately
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  private mapRowToMedication(row: any): Medication {
    return {
      id: row.id,
      name: row.name,
      weight: parseFloat(row.weight),
      code: row.code,
      image: row.image,
      droneId: row.droneId,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }
}
