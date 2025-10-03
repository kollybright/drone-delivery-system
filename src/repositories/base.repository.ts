import { db } from "../config";

export abstract class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected runQuery(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err: any) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  protected getQuery<T>(
    sql: string,
    params: any[] = []
  ): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err: any, row: T) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as T);
        }
      });
    });
  }

  protected allQuery<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err: any, rows: T[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  protected generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
