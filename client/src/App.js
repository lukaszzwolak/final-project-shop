import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./slices/products.slice.js";

export default function App() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return React.createElement("p", null, "Ładowanie…");
  if (error) return React.createElement("p", null, `Błąd: ${error}`);

  return React.createElement(
    "main",
    { style: { padding: 24 } },
    React.createElement("h1", null, "Final Project Shop"),
    React.createElement(
      "ul",
      null,
      items.map((p) =>
        React.createElement(
          "li",
          { key: p._id },
          React.createElement("b", null, p.title),
          ` — ${p.price} PLN`
        )
      )
    )
  );
}
