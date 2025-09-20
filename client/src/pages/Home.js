import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../slices/products.slice.js";

const h = React.createElement;

export default function Home() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return h("p", null, "Ładowanie…");
  if (error) return h("p", null, `Błąd: ${error}`);

  return h(
    "section",
    null,
    h("h1", null, "Produkty"),
    h(
      "ul",
      { style: { display: "grid", gap: 12, padding: 0, listStyle: "none" } },
      items.map((p) =>
        h(
          "li",
          {
            key: p._id,
            style: {
              border: "1px solid #eee",
              borderRadius: 8,
              padding: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            },
          },
          h("div", null, h("b", null, p.title), ` — ${p.price} PLN`),
          h(Link, { to: `/product/${p._id}` }, "Szczegóły")
        )
      )
    )
  );
}
