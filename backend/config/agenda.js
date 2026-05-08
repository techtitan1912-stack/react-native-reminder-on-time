// agenda.js
import dns from 'dns';
import Agenda from "agenda";
import { sendFCMNotification } from "../src/services/notificationService.js";

const fallbackDNSServers = ['1.1.1.1', '1.0.0.1', '8.8.8.8'];
dns.setServers(fallbackDNSServers);

const mongoConnectionString = process.env.MONGO_URI;

export const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: "agendaJobs" },
});

// 🔥 Define job
agenda.define("task reminder", async (job) => {
  try {
    const { taskId, title, pushTokensArray, profileImage } = job.attrs.data;

     console.log("⏰ Reminder triggered for task:", taskId);

    await sendFCMNotification(
      pushTokensArray,
      "Task Reminder",
      `Reminder: ${title}`,
      true, // ✅ alarm sound
      profileImage
    );

  } catch (error) {
    console.error("Agenda job error:", error);
  }
});

// 🔥 Start agenda
export const startAgenda = async () => {
  try {
    await agenda.start();
    console.log("✅ Agenda started");
  } catch (error) {
    console.error("Failed to start Agenda:", error);
    throw error;
  }
};