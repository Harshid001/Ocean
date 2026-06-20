import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/ui.css"; // import global CSS for the UI kit

const container = document.getElementById("root");
if (!container) throw new Error("#root element not found");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
