// src/pages/PaytrCheckout.tsx
// @ts-nocheck

import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

declare global {
  interface Window {
    iFrameResize?: any;
  }
}

export default function PaytrCheckout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  useEffect(() => {
    if (!token) return;

    // iframe resizer script tek sefer eklenir
    if (!document.getElementById("paytr-iframe-resizer")) {
      const s = document.createElement("script");
      s.id = "paytr-iframe-resizer";
      s.src = "https://www.paytr.com/js/iframeResizer.min.js";
      s.async = true;
      s.onload = () => {
        if (window.iFrameResize) {
          window.iFrameResize(
            { checkOrigin: false },
            "#paytriframe"
          );
        }
      };
      document.body.appendChild(s);
    } else {
      if (window.iFrameResize) {
        window.iFrameResize(
          { checkOrigin: false },
          "#paytriframe"
        );
      }
    }
  }, [token]);

  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h2>Ödeme başlatılamadı</h2>
        <button onClick={() => navigate("/")}>Ana sayfaya dön</button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f9fafb",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: 12 }}>Güvenli Ödeme</h1>

        <iframe
          id="paytriframe"
          frameBorder={0}
          scrolling="no"
          src={`https://www.paytr.com/odeme/guvenli/${token}`}
          style={{
            width: "100%",
            minHeight: 700,
            border: "none",
          }}
        />
      </div>
    </div>
  );
}
