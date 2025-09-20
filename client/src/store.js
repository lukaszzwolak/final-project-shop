import { configureStore } from "@reduxjs/toolkit";
import products from "./slices/products.slice.js";
import cart from "./slices/cart.slice.js";
import { loadCart, saveCart } from "./persist.js";

const preloadedState = loadCart();

export const store = configureStore({
  reducer: { products, cart },
  preloadedState,
});

store.subscribe(() => {
  saveCart(store.getState());
});
