import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../config.js";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const { data } = await axios.get(`${API_URL}/products`);
  return data;
});

const slice = createSlice({
  name: "products",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchProducts.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload;
    });
    b.addCase(fetchProducts.rejected, (s, a) => {
      s.loading = false;
      s.error = String(a.error.message);
    });
  },
});

export default slice.reducer;
