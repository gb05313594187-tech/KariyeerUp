// src/pages/PaytrCheckout.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PAYTR_TOKEN_FN =
  "https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/paytr-token";

export default function PaytrCheckout() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const requestId = sp.get("requestId") || "";
  const [loading, setLoading] = useState(true);
  const [iframeUrl, setIframeUrl] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        if (!requestId) {
          toast.error("requestId yok");
          setLoading(false);
          return;
        }

        const { data: { session }, error: sErr } = await supabase.auth.getSession();
        if (sErr) throw sErr;
        if (!session?.access_token) {
          toast.error("Giriş yapman gerekiyor");
          navigate("/login");
          return;
        }

        setLoading(true);

        const r = await fetch(PAYTR_TOKEN_FN, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            requestId,
            user_name: "Kariyeer Kullanıcısı",
            user_address: "N/A",
            user_phone: "0000000000",
            // amount: 10000, // kuruş (opsiyonel)
          }),
        });

        const j = await r.json();

        if (!r.ok || j?.error) {
          console.error("paytr-token error:", j);
          toast.error(j?.error || "PayTR token alınamadı");
          setLoading(false);
          return;
        }

        const url = j?.iframe_url;
        if (!url) {
          toast.error("iframe_url gelmedi");
          setLoading(false);
          return;
        }

        if (mounted) {
          setIframeUrl(url);
          setLoading(false);
        }
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || "Hata");
        setLoading(false);
      }
    }

    run();
    return () => { mounted = false; };
  }, [requestId, navigate]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Ödeme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!requestId && (
            <div className="text-sm text-red-600">
              URL’de requestId yok. Örn: /paytr/checkout?requestId=...
            </div>
          )}

          {loading && (
            <div className="text-sm">Token alınıyor, ödeme ekranı hazırlanıyor…</div>
          )}

          {!loading && iframeUrl && (
            <iframe
              title="PayTR"
              src={iframeUrl}
              style={{ width: "100%", height: 720, border: 0 }}
              allow="payment *"
            />
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Dashboard’a dön
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Yenile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
