import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";

export function createApp({ origin = "http://localhost:5173" } = {}) {
  const app = express();

  // Middlewares
  app.use(helmet());
  app.use(cors({ origin, credentials: true }));
  app.use(express.json());
  app.use(morgan("dev"));

  // Routes
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/products", productsRouter);
  app.use("/api/orders", ordersRouter);

  // 404 for unknown API routes
  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

  // Global error handler
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
