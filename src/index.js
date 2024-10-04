import { BrowserRouter } from "react-router-dom";

// React 18에서 createRoot 사용
const root = ReactDOM.createRoot(document.getElementById("root"));

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
