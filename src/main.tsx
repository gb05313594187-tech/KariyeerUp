// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "sonner";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("❌ APP CRASHED:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-3xl w-full border border-red-300 rounded-xl p-4">
            <h1 className="text-xl font-bold text-red-600 mb-3">Uygulama Hatası</h1>
            <pre className="text-xs bg-gray-50 border rounded-lg p-3 overflow-auto">
              {this.state.error?.message || "Bilinmeyen hata"}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // ❌ StrictMode KAPALI (test için)
  <LanguageProvider>
    <AuthProvider>
      <NotificationProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
        <Toaster richColors position="top-right" />
      </NotificationProvider>
    </AuthProvider>
  </LanguageProvider>
);
