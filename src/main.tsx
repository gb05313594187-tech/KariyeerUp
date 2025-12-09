// src/main.tsx
// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Context Providers
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);
