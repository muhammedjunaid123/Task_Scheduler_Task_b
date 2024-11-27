import cron from "node-cron";
import { recreate } from "./controllers/task.controller.js";

// Schedule a cron job to run every minute
const job = cron.schedule("* * * * *", () => {
  recreate();
});

console.log("Cron job is running...");

export default job;
