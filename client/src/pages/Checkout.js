import React from "react";
const h = React.createElement;

export default function Checkout() {
  return h(
    "section",
    null,
    h("h1", null, "Checkout"),
    h(
      "p",
      null,
      "Podsumowanie + formularz zamówienia pojawi się po dodaniu koszyka (Dzień 3)."
    )
  );
}
