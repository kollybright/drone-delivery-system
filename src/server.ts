import app from "./app";
import { db, seedDatabase } from "./config";
import { batteryCheckTask } from "./tasks";

const PORT = process.env["PORT"] || 3000;

// Initialize database and start server
db.on("open", async () => {
  console.log("Database connection established");

  // Seed database with initial data
  await seedDatabase();

  // Start battery monitoring task
  await batteryCheckTask.start();

  // Start the server
  app.listen(PORT, () => {
    console.log(`Drone Delivery API server running on port ${PORT}`);
    console.log(
      `API Documentation available at http://localhost:${PORT}/api/health`
    );
    console.log(`Battery monitoring task started (checks every 5 minutes)`);
  });
});

db.on("error", (err: any) => {
  console.error("Database error:", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  batteryCheckTask.stop();
  db.close((err: any) => {
    if (err) {
      console.error("Error closing database:", err);
      process.exit(1);
    }
    console.log("Database connection closed");
    process.exit(0);
  });
});
