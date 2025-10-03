import { Medication } from "../models";
import { BaseRepository } from "./base.repository";

export class MedicationRepository extends BaseRepository<Medication> {
  constructor() {
    super("medications");
  }

  async create(medicationData: Partial<Medication>): Promise<Medication> {
    const id = this.generateId();
    const now = new Date().toISOString();

    const medication: Medication = {
      id,
      name: medicationData.name!,
      weight: medicationData.weight!,
      code: medicationData.code!,
      image: medicationData.image!,
      droneId: medicationData.droneId,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    const sql = `
      INSERT INTO medications (id, name, weight, code, image, droneId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.runQuery(sql, [
      medication.id,
      medication.name,
      medication.weight,
      medication.code,
      medication.image,
      medication.droneId,
      medication.createdAt.toISOString(),
      medication.updatedAt.toISOString(),
    ]);

    return medication;
  }

  async findById(id: string): Promise<Medication | null> {
    const sql = "SELECT * FROM medications WHERE id = ?";
    const row = await this.getQuery<any>(sql, [id]);

    if (!row) return null;
    return this.mapRowToMedication(row);
  }

  async findByDroneId(droneId: string): Promise<Medication[]> {
    const sql =
      "SELECT * FROM medications WHERE droneId = ? ORDER BY createdAt DESC";
    const rows = await this.allQuery<any>(sql, [droneId]);

    return rows.map((row) => this.mapRowToMedication(row));
  }

  async findAll(): Promise<Medication[]> {
    const sql = "SELECT * FROM medications ORDER BY createdAt DESC";
    const rows = await this.allQuery<any>(sql);

    return rows.map((row) => this.mapRowToMedication(row));
  }

  async update(
    id: string,
    updateData: Partial<Medication>
  ): Promise<Medication> {
    const currentMedication = await this.findById(id);
    if (!currentMedication) {
      throw new Error("Medication not found");
    }

    const updatedAt = new Date().toISOString();
    const fields = [];
    const values = [];

    if (updateData.name !== undefined) {
      fields.push("name = ?");
      values.push(updateData.name);
    }
    if (updateData.weight !== undefined) {
      fields.push("weight = ?");
      values.push(updateData.weight);
    }
    if (updateData.code !== undefined) {
      fields.push("code = ?");
      values.push(updateData.code);
    }
    if (updateData.image !== undefined) {
      fields.push("image = ?");
      values.push(updateData.image);
    }
    if (updateData.droneId !== undefined) {
      fields.push("droneId = ?");
      values.push(updateData.droneId);
    }

    fields.push("updatedAt = ?");
    values.push(updatedAt);
    values.push(id);

    const sql = `UPDATE medications SET ${fields.join(", ")} WHERE id = ?`;
    await this.runQuery(sql, values);

    const updatedMedication = await this.findById(id);
    return updatedMedication!;
  }

  async delete(id: string): Promise<void> {
    const sql = "DELETE FROM medications WHERE id = ?";
    await this.runQuery(sql, [id]);
  }

  async deleteByDroneId(droneId: string): Promise<void> {
    const sql = "DELETE FROM medications WHERE droneId = ?";
    await this.runQuery(sql, [droneId]);
  }

  async deleteAll(): Promise<void> {
    const sql = "DELETE FROM medications";
    await this.runQuery(sql);
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
