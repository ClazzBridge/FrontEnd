import React from "react";
import ReactDOM from "react-dom/client"; // React 18의 새로운 API
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// React 18에서 createRoot 사용
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
