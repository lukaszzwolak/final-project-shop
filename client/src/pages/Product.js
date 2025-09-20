import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config.js";

const h = React.createElement;

export default function Product() {
  const { id } = useParams();
  const [state, setState] = useState({
    item: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products/${id}`);
        if (mounted) setState({ item: data, loading: false, error: null });
      } catch (e) {
        if (mounted) setState({ item: null, loading: false, error: e.message });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (state.loading) return h("p", null, "Ładowanie…");
  if (state.error)
    return h(
      "p",
      null,
      `Błąd: ${state.error} (czy endpoint GET /api/products/:id jest już na serwerze?)`
    );

  const p = state.item;

  return h(
    "article",
    null,
    h(Link, { to: "/" }, "← Wróć"),
    h("h1", null, p.title),
    p.imageUrl
      ? h("img", {
          src: p.imageUrl,
          alt: p.title,
          style: { maxWidth: "100%", borderRadius: 8 },
        })
      : null,
    h("p", null, h("b", null, `${p.price} PLN`)),
    h("p", null, p.description || "Brak opisu."),
    h(
      "div",
      { style: { marginTop: 12 } },
      h("label", null, "Ilość: "),
      h("input", {
        type: "number",
        min: 1,
        defaultValue: 1,
        style: { width: 72, marginRight: 8 },
      }),
      h(
        "button",
        { type: "button", disabled: true, title: "Koszyk w dniu 2" },
        "Add to cart"
      )
    )
  );
}
