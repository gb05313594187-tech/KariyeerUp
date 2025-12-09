// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// LanguageProvider'ı context dosyandan import et
// Dosyan büyük ihtimalle: src/context/LanguageContext.tsx
// o zaman path böyle olmalı:
import { LanguageProvider } from "@/context/LanguageContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
