import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import productsRouter from "./routes/products.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/products", productsRouter);
app.get("/api/health", (_req, res) => res.json({ ok: true }));

const { MONGO_URI, PORT = 8000 } = process.env;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("Mongo error:", e.message);
    process.exit(1);
  });
