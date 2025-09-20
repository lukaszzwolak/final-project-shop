import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../app.js";
import Product from "../models/Product.js";

let mongod, app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { dbName: "jest" });
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

beforeEach(async () => {
  await Product.deleteMany({});
  await Product.insertMany([
    { title: "Tee", price: 49.99, description: "tee" },
    { title: "Mug", price: 29.99, description: "mug" },
  ]);
});

test("GET /api/health -> {ok:true}", async () => {
  const res = await request(app).get("/api/health");
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ok: true });
});

test("GET /api/products -> returns list", async () => {
  const res = await request(app).get("/api/products");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBe(2);
});

test("GET /api/products/:id -> returns one", async () => {
  const one = await Product.findOne().lean();
  const res = await request(app).get(`/api/products/${one._id}`);
  expect(res.status).toBe(200);
  expect(res.body.title).toBe(one.title);
});

test("POST /api/products -> creates with title & price", async () => {
  const res = await request(app)
    .post("/api/products")
    .send({ title: "Sticker", price: 9.99, description: "pack" });
  expect(res.status).toBe(201);
  expect(res.body._id).toBeDefined();

  const count = await Product.countDocuments();
  expect(count).toBe(3);
});

test("POST /api/products -> 400 when missing title/price", async () => {
  const res = await request(app).post("/api/products").send({ title: "Bad" });
  expect(res.status).toBe(400);
});

test("PUT /api/products/:id -> updates price", async () => {
  const one = await Product.findOne().lean();
  const res = await request(app)
    .put(`/api/products/${one._id}`)
    .send({ price: 99.99 });
  expect(res.status).toBe(200);
  expect(res.body.price).toBe(99.99);
});

test("DELETE /api/products/:id -> deletes", async () => {
  const one = await Product.findOne().lean();
  const res = await request(app).delete(`/api/products/${one._id}`);
  expect(res.status).toBe(200);
  expect(res.body.ok).toBe(true);
  const left = await Product.countDocuments();
  expect(left).toBe(1);
});
