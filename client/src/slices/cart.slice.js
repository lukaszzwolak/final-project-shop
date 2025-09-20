import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addItem: (s, { payload }) => {
      const { productId, title, price, qty = 1, notes = "" } = payload;
      const found = s.items.find((i) => i.productId === productId);
      if (found) found.qty += qty;
      else s.items.push({ productId, title, price, qty, notes });
    },
    removeItem: (s, { payload: productId }) => {
      s.items = s.items.filter((i) => i.productId !== productId);
    },
    updateQty: (s, { payload }) => {
      const { productId, qty } = payload;
      const it = s.items.find((i) => i.productId === productId);
      if (it) it.qty = Math.max(1, qty | 0);
    },
    updateNotes: (s, { payload }) => {
      const { productId, notes } = payload;
      const it = s.items.find((i) => i.productId === productId);
      if (it) it.notes = notes || "";
    },
    clear: (s) => {
      s.items = [];
    },
  },
});

export const { addItem, removeItem, updateQty, updateNotes, clear } =
  slice.actions;
export default slice.reducer;
