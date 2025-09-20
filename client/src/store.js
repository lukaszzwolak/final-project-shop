import { configureStore } from "@reduxjs/toolkit";
import products from "./slices/products.slice.js";

export const store = configureStore({
  reducer: { products },
});
