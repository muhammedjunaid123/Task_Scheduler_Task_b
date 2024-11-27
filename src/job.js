import cron from "node-cron";
import { email_send, recreate } from "./controllers/task.controller.js";

// Schedule a cron job to run every minute
const job = cron.schedule("* * * * *", () => {
  recreate();
  email_send();
  console.log('job call');
  
});

console.log("Cron job is running...");

export default job;
