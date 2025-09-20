import "dotenv/config";
import mongoose from "mongoose";
import { createApp } from "./app.js";

const {
  MONGO_URI,
  PORT = 8000,
  CLIENT_URL = "http://localhost:5173",
} = process.env;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in server/.env");
  process.exit(1);
}

const app = createApp({ origin: CLIENT_URL });

let server;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server = app.listen(PORT, () => {
      console.log(`API http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Mongo error:", e.message);
    process.exit(1);
  });

// Graceful shutdown
async function shutdown(signal) {
  console.log(`\n${signal} received, closing server...`);
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.connection.close();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
