import React from "react";
const h = React.createElement;

export default function Cart() {
  return h(
    "section",
    null,
    h("h1", null, "Koszyk"),
    h("p", null, "Wersja MVP – logika koszyka dojdzie w Dniu 2.")
  );
}
