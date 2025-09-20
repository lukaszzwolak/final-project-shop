import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store.js";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.js";
import Home from "./pages/Home.js";
import Product from "./pages/Product.js";
import Cart from "./pages/Cart.js";
import Checkout from "./pages/Checkout.js";
import AdminNew from "./pages/AdminNew.js";

const h = React.createElement;

const router = createBrowserRouter([
  {
    path: "/",
    element: h(Layout, null),
    children: [
      { index: true, element: h(Home, null) },
      { path: "product/:id", element: h(Product, null) },
      { path: "cart", element: h(Cart, null) },
      { path: "checkout", element: h(Checkout, null) },
      { path: "admin/new", element: h(AdminNew, null) },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(h(Provider, { store }, h(RouterProvider, { router })));
