import { BatteryAudit } from "../models";
import { BaseRepository } from "./base.repository";

export class BatteryAuditRepository extends BaseRepository<BatteryAudit> {
  constructor() {
    super("battery_audit");
  }

  async create(auditData: Partial<BatteryAudit>): Promise<BatteryAudit> {
    const id = this.generateId();
    const now = new Date().toISOString();

    const audit: BatteryAudit = {
      id,
      droneId: auditData.droneId!,
      batteryLevel: auditData.batteryLevel!,
      checkTime: auditData.checkTime || new Date(now),
    };

    const sql = `
      INSERT INTO battery_audit (id, droneId, batteryLevel, checkTime)
      VALUES (?, ?, ?, ?)
    `;

    await this.runQuery(sql, [
      audit.id,
      audit.droneId,
      audit.batteryLevel,
      audit.checkTime.toISOString(),
    ]);

    return audit;
  }

  async findByDroneId(droneId: string): Promise<BatteryAudit[]> {
    const sql =
      "SELECT * FROM battery_audit WHERE droneId = ? ORDER BY checkTime DESC";
    const rows = await this.allQuery<any>(sql, [droneId]);

    return rows.map((row) => this.mapRowToAudit(row));
  }

  async findRecentAudits(limit: number = 100): Promise<BatteryAudit[]> {
    const sql = "SELECT * FROM battery_audit ORDER BY checkTime DESC LIMIT ?";
    const rows = await this.allQuery<any>(sql, [limit]);

    return rows.map((row) => this.mapRowToAudit(row));
  }

  async cleanupOldAudits(daysToKeep: number = 30): Promise<void> {
    const sql =
      'DELETE FROM battery_audit WHERE checkTime < datetime("now", ?)';
    const interval = `-${daysToKeep} days`;
    await this.runQuery(sql, [interval]);
  }

  private mapRowToAudit(row: any): BatteryAudit {
    return {
      id: row.id,
      droneId: row.droneId,
      batteryLevel: row.batteryLevel,
      checkTime: new Date(row.checkTime),
    };
  }
}
