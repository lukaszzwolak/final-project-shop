import React, { useEffect, useState } from "react";

const h = React.createElement;
const KEY = "fps_cookie_ack_v1";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const ack = localStorage.getItem(KEY);
      if (!ack) setVisible(true);
    } catch {}
  }, []);

  const onAccept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return h(
    "div",
    {
      role: "dialog",
      "aria-live": "polite",
      "aria-label": "Informacja o cookies",
      style: {
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 1000,
        background: "#111",
        color: "#fff",
        borderRadius: 12,
        padding: "12px 16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      },
    },
    h(
      "span",
      { style: { lineHeight: 1.4 } },
      "Używamy localStorage/cookies niezbędnych do działania sklepu. Nie stosujemy śledzących ciasteczek."
    ),
    h(
      "div",
      { style: { marginLeft: "auto", display: "flex", gap: 8 } },
      h(
        "button",
        {
          type: "button",
          onClick: onAccept,
          style: {
            background: "#fff",
            color: "#111",
            border: "none",
            padding: "8px 12px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          },
        },
        "OK, rozumiem"
      )
    )
  );
}
