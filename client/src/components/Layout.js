import React from "react";
import { Link, Outlet } from "react-router-dom";
import CookieBanner from "./CookieBanner.js";

const h = React.createElement;

export default function Layout() {
  return h(
    "div",
    { style: { fontFamily: "system-ui, Arial", lineHeight: 1.5 } },
    h(
      "header",
      {
        style: {
          display: "flex",
          gap: 16,
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10,
        },
      },
      h(Link, { to: "/" }, "Final Project Shop"),
      h(
        "nav",
        { style: { marginLeft: "auto", display: "flex", gap: 12 } },
        h(Link, { to: "/" }, "Home"),
        h(Link, { to: "/cart" }, "Cart"),
        h(Link, { to: "/checkout" }, "Checkout")
      )
    ),
    h(
      "main",
      { style: { padding: 24, maxWidth: 960, margin: "0 auto" } },
      h(Outlet, null)
    ),
    h(CookieBanner, null)
  );
}
