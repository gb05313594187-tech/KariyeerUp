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
  const [errText, setErrText] = useState<string | null>(null);

  // 1) requestId -> edge function -> token
  useEffect(() => {
    if (!requestId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setErrText(null);

        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paytr-get-token`;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            // ✅ function bunu istiyor
            request_id: requestId,
            // ✅ bazı kodlar bunu istiyor olabilir diye ikisini de yolluyoruz
            requestId,
          }),
        });

        const text = await res.text();
        let json: any = null;
        try {
          json = JSON.parse(text);
        } catch {
          // json değilse text olarak kalsın
        }

        if (!res.ok) {
          const msg =
            json?.error ||
            json?.message ||
            text ||
            `HTTP ${res.status}`;
          throw new Error(msg);
        }

        const t = json?.token || json?.data?.token;
        if (!t) throw new Error("token_missing");

        setToken(t);
      } catch (e: any) {
        console.error("PAYTR TOKEN ERROR:", e);
        setErrText(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, [requestId]);

  // 2) iframe resizer
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

  // UI
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
        {errText ? (
          <pre className="text-xs opacity-70 max-w-xl whitespace-pre-wrap text-center">
            {errText}
          </pre>
        ) : null}
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
          style={{ width: "100%", minHeight: 700, border: "none" }}
        />
      </div>
    </div>
  );
}
