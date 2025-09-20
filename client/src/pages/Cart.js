import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  removeItem,
  updateQty,
  updateNotes,
  clear,
} from "../slices/cart.slice.js";

const h = React.createElement;

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (!items.length) {
    return h(
      "section",
      null,
      h("h1", null, "Koszyk"),
      h("p", null, "Koszyk jest pusty."),
      h(Link, { to: "/" }, "← Wróć do sklepu")
    );
  }

  return h(
    "section",
    null,
    h("h1", null, "Koszyk"),
    h(
      "ul",
      { style: { listStyle: "none", padding: 0, display: "grid", gap: 12 } },
      items.map((i) =>
        h(
          "li",
          {
            key: i.productId,
            style: { border: "1px solid #eee", borderRadius: 8, padding: 12 },
          },
          h(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              },
            },
            h("div", null, h("b", null, i.title), ` — ${i.price} PLN`),
            h(
              "div",
              null,
              h("label", { htmlFor: `qty-${i.productId}` }, "Ilość: "),
              h("input", {
                id: `qty-${i.productId}`,
                type: "number",
                min: 1,
                value: i.qty,
                onChange: (e) =>
                  dispatch(
                    updateQty({
                      productId: i.productId,
                      qty: Number(e.target.value),
                    })
                  ),
                style: { width: 72, marginRight: 8 },
              }),
              h(
                "button",
                { onClick: () => dispatch(removeItem(i.productId)) },
                "Usuń"
              )
            )
          ),
          h(
            "div",
            { style: { marginTop: 8 } },
            h("label", { htmlFor: `notes-${i.productId}` }, "Notatki:"),
            h("textarea", {
              id: `notes-${i.productId}`,
              value: i.notes || "",
              onChange: (e) =>
                dispatch(
                  updateNotes({ productId: i.productId, notes: e.target.value })
                ),
              rows: 2,
              style: { width: "100%", marginTop: 4 },
            })
          )
        )
      )
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          marginTop: 12,
        },
      },
      h("button", { onClick: () => dispatch(clear()) }, "Wyczyść koszyk"),
      h("div", null, h("b", null, `Suma: ${subtotal.toFixed(2)} PLN`))
    ),
    h(
      "div",
      { style: { marginTop: 12, textAlign: "right" } },
      h(Link, { to: "/checkout" }, "Przejdź do zamówienia →")
    )
  );
}
