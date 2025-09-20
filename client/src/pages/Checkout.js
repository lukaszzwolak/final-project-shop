import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config.js";
import { clear } from "../slices/cart.slice.js";

const h = React.createElement;

export default function Checkout() {
  const items = useSelector((s) => s.cart.items);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();

  if (!items.length) {
    return h(
      "section",
      null,
      h("h1", null, "Checkout"),
      h("p", null, "Koszyk jest pusty."),
      h(Link, { to: "/" }, "← Wróć do sklepu")
    );
  }

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          notes: i.notes || "",
        })),
        customer: form,
      };
      await axios.post(`${API_URL}/orders`, payload);
      dispatch(clear());
      nav("/?ordered=1");
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return h(
    "section",
    { style: { display: "grid", gap: 16, maxWidth: 900 } },
    h("h1", null, "Podsumowanie zamówienia"),
    h(
      "div",
      { style: { display: "grid", gap: 12 } },
      h(
        "ul",
        { style: { listStyle: "none", padding: 0, display: "grid", gap: 8 } },
        items.map((i) =>
          h(
            "li",
            {
              key: i.productId,
              style: { display: "flex", justifyContent: "space-between" },
            },
            h("span", null, `${i.title} × ${i.qty}`),
            h("b", null, `${(i.price * i.qty).toFixed(2)} PLN`)
          )
        )
      ),
      h(
        "div",
        { style: { textAlign: "right" } },
        h("b", null, `Suma: ${subtotal.toFixed(2)} PLN`)
      )
    ),
    h("h2", null, "Dane kontaktowe"),
    err ? h("p", { style: { color: "crimson" } }, `Błąd: ${err}`) : null,
    h(
      "form",
      { onSubmit, style: { display: "grid", gap: 8, maxWidth: 480 } },
      h("input", {
        placeholder: "Imię i nazwisko",
        value: form.name,
        onChange: set("name"),
        required: true,
      }),
      h("input", {
        placeholder: "Email",
        type: "email",
        value: form.email,
        onChange: set("email"),
        required: true,
      }),
      h("input", {
        placeholder: "Telefon",
        value: form.phone,
        onChange: set("phone"),
      }),
      h("textarea", {
        placeholder: "Adres",
        rows: 3,
        value: form.address,
        onChange: set("address"),
      }),
      h(
        "button",
        { type: "submit", disabled: loading },
        loading ? "Wysyłanie…" : "Order"
      )
    ),
    h(
      "p",
      { style: { fontSize: 12, color: "#555" } },
      "Uwaga: ta strona używa localStorage do zapisu koszyka – jest to niezbędne do działania."
    )
  );
}
