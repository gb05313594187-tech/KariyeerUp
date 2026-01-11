// src/pages/PaytrCheckout.tsx
// @ts-nocheck

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Edge Function URL
const PAYTR_FUNCTION_URL =
  "https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/paytr-get-token";

export default function PaytrCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const requestId = searchParams.get("requestId");

  const [loading, setLoading] = useState(true);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        if (!requestId) {
          setError("Geçersiz ödeme isteği.");
          setLoading(false);
          return;
        }

        // (Opsiyonel) login kontrolü – ödeme için zorunlu tutmak istiyorsan kalsın
        const { data: sess } = await supabase.auth.getSession();
        if (!sess?.session) {
          toast.error("Ödeme için giriş yapmalısın.");
          navigate(`/login?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`);
          return;
        }

        // PayTR token iste
        const res = await fetch(PAYTR_FUNCTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request_id: requestId,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json?.success || !json?.iframe_url) {
          console.error("PayTR error:", json);
          setError("Ödeme başlatılamadı. Lütfen tekrar deneyin.");
          setLoading(false);
          return;
        }

        if (!mounted) return;
        setIframeUrl(json.iframe_url);
        setLoading(false);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setError("Beklenmeyen bir hata oluştu.");
        setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [requestId, navigate]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-20">
        <Card className="p-6 text-center">
          <div className="text-sm text-gray-600">Ödeme hazırlanıyor…</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-20">
        <Card className="p-6 space-y-4">
          <div className="text-sm text-red-600">{error}</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Geri Dön
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Tekrar Dene
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="p-4 md:p-6 space-y-4">
        <h1 className="text-lg font-semibold">Güvenli Ödeme</h1>

        {iframeUrl && (
          <iframe
            src={iframeUrl}
            title="PayTR Güvenli Ödeme"
            className="w-full h-[650px] border rounded"
            frameBorder={0}
            scrolling="no"
          />
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard’a Dön
        </Button>
      </Card>
    </div>
  );
}
