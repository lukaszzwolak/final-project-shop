import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: { type: [itemSchema], required: true },
    subtotal: { type: Number, required: true },
    customer: { type: customerSchema, required: true },
    status: {
      type: String,
      default: "NEW",
      enum: ["NEW", "PAID", "SHIPPED", "CANCELLED"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
