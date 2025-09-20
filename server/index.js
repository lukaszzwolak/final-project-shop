import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import productsRouter from "./routes/products.js";

const app = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/products", productsRouter);

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const { MONGO_URI, PORT = 8000 } = process.env;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in server/.env");
  process.exit(1);
}

let server;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server = app.listen(PORT, () =>
      console.log(`API http://localhost:${PORT}`)
    );
  })
  .catch((e) => {
    console.error("Mongo error:", e.message);
    process.exit(1);
  });

// Graceful shutdown
async function shutdown(signal) {
  console.log(`\n${signal} received, closing server...`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.connection.close();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
