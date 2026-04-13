import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "katex/dist/katex.min.css";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
