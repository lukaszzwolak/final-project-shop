import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("Missing MONGO_URI in server/.env");
    process.exit(1);
  }
  await mongoose.connect(uri);

  await Product.deleteMany({});
  await Product.insertMany([
    {
      title: "Sample Tee",
      price: 49.99,
      description: "Basic cotton tee",
      imageUrl: "https://picsum.photos/seed/tee/600/400",
    },
    {
      title: "Mug",
      price: 29.99,
      description: "Ceramic mug 300ml",
      imageUrl: "https://picsum.photos/seed/mug/600/400",
    },
    {
      title: "Sticker Pack",
      price: 9.99,
      description: "5 vinyl stickers",
      imageUrl: "https://picsum.photos/seed/stickers/600/400",
    },
  ]);

  console.log("Seeded products ✔");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
