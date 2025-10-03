import { Database } from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/drones.db');

export const db = new Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create drones table
  db.run(`
    CREATE TABLE IF NOT EXISTS drones (
      id TEXT PRIMARY KEY,
      serialNumber TEXT UNIQUE NOT NULL,
      model TEXT NOT NULL CHECK(model IN ('Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight')),
      weightLimit REAL NOT NULL CHECK(weightLimit <= 500),
      batteryCapacity INTEGER NOT NULL CHECK(batteryCapacity >= 0 AND batteryCapacity <= 100),
      state TEXT NOT NULL CHECK(state IN ('IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create medications table
  db.run(`
    CREATE TABLE IF NOT EXISTS medications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL CHECK(name REGEXP '^[a-zA-Z0-9\-_]+$'),
      weight REAL NOT NULL CHECK(weight > 0),
      code TEXT NOT NULL CHECK(code REGEXP '^[A-Z0-9_]+$'),
      image TEXT NOT NULL,
      droneId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (droneId) REFERENCES drones (id) ON DELETE SET NULL
    )
  `);

  // Create battery_audit table for battery level history
  db.run(`
    CREATE TABLE IF NOT EXISTS battery_audit (
      id TEXT PRIMARY KEY,
      droneId TEXT NOT NULL,
      batteryLevel INTEGER NOT NULL CHECK(batteryLevel >= 0 AND batteryLevel <= 100),
      checkTime DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (droneId) REFERENCES drones (id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  db.run('CREATE INDEX IF NOT EXISTS idx_drones_state ON drones(state)');
  db.run('CREATE INDEX IF NOT EXISTS idx_drones_battery ON drones(batteryCapacity)');
  db.run('CREATE INDEX IF NOT EXISTS idx_medications_droneId ON medications(droneId)');
  db.run('CREATE INDEX IF NOT EXISTS idx_battery_audit_droneId ON battery_audit(droneId)');
}