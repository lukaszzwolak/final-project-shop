import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config.js";
import { Link, useNavigate } from "react-router-dom";

const h = React.createElement;

export default function AdminNew() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [err, setErr] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const payload = { ...form, price: Number(form.price) };
      await axios.post(`${API_URL}/products`, payload);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  };

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  return h(
    "section",
    null,
    h(Link, { to: "/" }, "← Wróć"),
    h("h1", null, "Nowy produkt"),
    err ? h("p", { style: { color: "crimson" } }, `Błąd: ${err}`) : null,
    h(
      "form",
      { onSubmit, style: { display: "grid", gap: 8, maxWidth: 480 } },
      h("input", {
        placeholder: "Tytuł",
        value: form.title,
        onChange: set("title"),
        required: true,
      }),
      h("input", {
        placeholder: "Cena (liczba)",
        type: "number",
        step: "0.01",
        value: form.price,
        onChange: set("price"),
        required: true,
      }),
      h("input", {
        placeholder: "URL obrazka",
        value: form.imageUrl,
        onChange: set("imageUrl"),
      }),
      h("textarea", {
        placeholder: "Opis",
        rows: 4,
        value: form.description,
        onChange: set("description"),
      }),
      h("button", { type: "submit" }, "Zapisz")
    )
  );
}
