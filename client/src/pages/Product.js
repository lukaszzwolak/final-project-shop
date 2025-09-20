import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config.js";
import { useDispatch } from "react-redux";
import { addItem } from "../slices/cart.slice.js";

const h = React.createElement;

export default function Product() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    item: null,
    loading: true,
    error: null,
  });
  const [qty, setQty] = useState(1);

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
  if (state.error) return h("p", null, `Błąd: ${state.error}`);

  const p = state.item;

  const onAdd = () => {
    dispatch(
      addItem({
        productId: p._id,
        title: p.title,
        price: p.price,
        qty: Number(qty) || 1,
      })
    );
    alert("Dodano do koszyka");
  };

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
      h("label", { htmlFor: "qty" }, "Ilość: "),
      h("input", {
        id: "qty",
        type: "number",
        min: 1,
        value: qty,
        onChange: (e) => setQty(e.target.value),
        style: { width: 72, marginRight: 8 },
      }),
      h("button", { type: "button", onClick: onAdd }, "Add to cart")
    )
  );
}
