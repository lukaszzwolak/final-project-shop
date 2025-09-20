import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = Router();

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// LISTA
router.get("/", async (_req, res, next) => {
  try {
    const list = await Product.find().lean();
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// GET BY ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ error: "Invalid product id" });

    const doc = await Product.findById(id).lean();
    if (!doc) return res.status(404).json({ error: "Product not found" });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

// CREATE
router.post("/", async (req, res, next) => {
  try {
    const { title, price, description, imageUrl } = req.body || {};
    if (!title || typeof price !== "number") {
      return res
        .status(400)
        .json({ error: "`title` and numeric `price` are required" });
    }
    const doc = await Product.create({ title, price, description, imageUrl });
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ error: "Invalid product id" });

    const update = req.body || {};
    const doc = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();
    if (!doc) return res.status(404).json({ error: "Product not found" });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ error: "Invalid product id" });

    const doc = await Product.findByIdAndDelete(id).lean();
    if (!doc) return res.status(404).json({ error: "Product not found" });
    res.json({ ok: true, id });
  } catch (e) {
    next(e);
  }
});

export default router;
