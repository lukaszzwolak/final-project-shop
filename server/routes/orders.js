import { Router } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { items, customer } = req.body || {};
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: "Items are required" });
    }
    if (!customer || !customer.name || !customer.email) {
      return res
        .status(400)
        .json({ error: "Customer name and email are required" });
    }

    const ids = items.map((i) => i.productId).filter(Boolean);
    if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: "Invalid product id in items" });
    }

    const products = await Product.find({ _id: { $in: ids } }).lean();
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const normalized = items.map((i) => {
      const p = byId.get(String(i.productId));
      if (!p) throw new Error("Product not found: " + i.productId);
      const qty = Math.max(1, Number(i.qty) || 1);
      return {
        productId: p._id,
        title: p.title,
        price: p.price,
        qty,
        notes: i.notes || "",
      };
    });

    const subtotal = normalized.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = await Order.create({
      items: normalized,
      subtotal,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        address: customer.address || "",
      },
      status: "NEW",
    });

    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

export default router;
