import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { startAgenda } from "../config/agenda.js";
import job from './lib/cron.js';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend is live"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const bootstrap = async () => {
  try {
    await connectDB();
    await startAgenda();
    job.start();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

bootstrap();