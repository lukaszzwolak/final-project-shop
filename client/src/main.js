import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store.js";
import App from "./App.js";

const root = createRoot(document.getElementById("root"));
root.render(
  React.createElement(Provider, { store }, React.createElement(App, null))
);
