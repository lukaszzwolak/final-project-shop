import { Router } from "express";
import Product from "../models/Product.js";
const router = Router();

router.get("/", async (_req, res) => {
  res.json(await Product.find().lean());
});

router.post("/", async (req, res) => {
  try {
    const doc = await Product.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
