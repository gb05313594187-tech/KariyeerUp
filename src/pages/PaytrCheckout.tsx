// src/pages/PaytrCheckout.tsx
// @ts-nocheck

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

declare global {
  interface Window {
    iFrameResize?: any;
  }
}

export default function PaytrCheckout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const requestId = params.get("requestId");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ RequestId → backend → PayTR token
  useEffect(() => {
    if (!requestId) return;

    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paytr-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ requestId }),
          }
        );

        const json = await res.json();

        if (!json?.token) throw new Error("Token alınamadı");

        setToken(json.token);
      } catch (e) {
        console.error("PAYTR TOKEN ERROR:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [requestId]);

  // 2️⃣ iframe resizer
  useEffect(() => {
    if (!token) return;

    if (!document.getElementById("paytr-iframe-resizer")) {
      const s = document.createElement("script");
      s.id = "paytr-iframe-resizer";
      s.src = "https://www.paytr.com/js/iframeResizer.min.js";
      s.async = true;
      s.onload = () => {
        if (window.iFrameResize) {
          window.iFrameResize({ checkOrigin: false }, "#paytriframe");
        }
      };
      document.body.appendChild(s);
    } else {
      if (window.iFrameResize) {
        window.iFrameResize({ checkOrigin: false }, "#paytriframe");
      }
    }
  }, [token]);

  // 3️⃣ UI STATES
  if (!requestId) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2>Geçersiz ödeme bağlantısı</h2>
        <button onClick={() => navigate("/")}>Ana sayfaya dön</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ödeme hazırlanıyor…
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2>Ödeme başlatılamadı</h2>
        <button onClick={() => navigate("/")}>Ana sayfaya dön</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-4">
        <h1 className="mb-4 text-lg font-semibold">Güvenli Ödeme</h1>

        <iframe
          id="paytriframe"
          frameBorder={0}
          scrolling="no"
          src={`https://www.paytr.com/odeme/guvenli/${token}`}
          style={{ width: "100%", minHeight: 700 }}
        />
      </div>
    </div>
  );
}
