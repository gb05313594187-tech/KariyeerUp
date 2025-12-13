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

// ✅ EKLENDİ: Sonner Toaster
import { Toaster } from "sonner";

/* =====================================================
   ✅ SADECE EKLENDİ: ErrorBoundary
   (Hiçbir şey çıkarılmadı, optimize edilmedi)
   Amaç: Beyaz ekran yerine gerçek hatayı göstermek
===================================================== */
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
    console.error("❌ COMPONENT STACK:", info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const message =
        this.state.error?.message ||
        (typeof this.state.error === "string"
          ? this.state.error
          : "Unknown error");
      const stack = this.state.error?.stack || "";

      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-3xl w-full border border-red-300 rounded-xl p-4">
            <h1 className="text-xl font-bold text-red-600 mb-3">
              Uygulama Çalışırken Hata Aldı
            </h1>
            <p className="text-sm text-gray-700 mb-2">
              Aşağıdaki hata mesajını bana aynen gönder:
            </p>
            <pre className="text-xs bg-gray-50 border rounded-lg p-3 overflow-auto">
{message}

{stack}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children as any;
  }
}
/* ===================================================== */

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          {/* ✅ SADECE SARILDI */}
          <ErrorBoundary>
            <App />
          </ErrorBoundary>

          {/* ✅ Toast’ların görünmesi için root'a eklendi */}
          <Toaster richColors position="top-right" />
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);
