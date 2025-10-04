import { db } from "../src/config/database";

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env["NODE_ENV"] = "test";
});

afterAll(async () => {
  // Close database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing test database:", err);
    }
  });
});

// Global test teardown
afterEach(async () => {
  // Clean up database after each test
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run("DELETE FROM medications", (err) => {
        if (err) reject(err);
        db.run("DELETE FROM drones", (err) => {
          if (err) reject(err);
          db.run("DELETE FROM battery_audit", (err) => {
            if (err) reject(err);
            resolve();
          });
        });
      });
    });
  });
});
