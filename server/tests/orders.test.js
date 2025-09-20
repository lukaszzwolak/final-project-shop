import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../app.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

let mongod, app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri(), { dbName: "jest" });
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await Product.deleteMany({});
  await Order.deleteMany({});
});

test("POST /api/orders -> 201 and normalizes prices", async () => {
  const p = await Product.create({
    title: "Tee",
    price: 49.99,
    description: "tee",
  });

  const res = await request(app)
    .post("/api/orders")
    .send({
      items: [{ productId: p._id, qty: 2, notes: "red" }],
      customer: { name: "Jan", email: "jan@example.com" },
    });

  expect(res.status).toBe(201);
  expect(res.body.subtotal).toBeCloseTo(99.98, 2);
  expect(res.body.items[0].title).toBe("Tee");
});

test("POST /api/orders -> 400 for missing items/customer", async () => {
  const bad1 = await request(app)
    .post("/api/orders")
    .send({ items: [], customer: { name: "A", email: "a@a" } });
  expect(bad1.status).toBe(400);

  const bad2 = await request(app)
    .post("/api/orders")
    .send({ items: [{ productId: new mongoose.Types.ObjectId(), qty: 1 }] });
  expect(bad2.status).toBe(400);
});
