// src/pages/PaytrCheckout.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PAYTR_TOKEN_FN =
  "https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/paytr-token";

export default function PaytrCheckout() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const requestId = useMemo(() => sp.get("requestId") || "", [sp]);

  const [loading, setLoading] = useState(true);
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setIframeUrl("");
      setDebug(null);

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

        const payload = {
          requestId,
          user_name: "Kariyeer Kullanıcısı",
          user_address: "N/A",
          user_phone: "0000000000",
          // amount: 10000, // kuruş (opsiyonel)
          // currency: "TL",
          // no_installment: 0,
          // max_installment: 0,
          // debug_on: 1,
          // timeout_limit: 30,
        };

        const r = await fetch(PAYTR_TOKEN_FN, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        });

        const j = await r.json().catch(() => ({}));

        if (!mounted) return;

        setDebug({
          ok: r.ok,
          status: r.status,
          requestId,
          response: j,
        });

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

        setIframeUrl(url);
        setLoading(false);
      } catch (e: any) {
        if (!mounted) return;
        console.error(e);
        toast.error(e?.message || "Hata");
        setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [requestId, navigate]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>PayTR Ödeme</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!requestId ? (
            <div className="text-sm text-red-600">
              URL’de <b>requestId</b> yok. Örn: <code>/paytr/checkout?requestId=...</code>
            </div>
          ) : null}

          {loading ? (
            <div className="text-sm">
              Token alınıyor, ödeme ekranı hazırlanıyor…
            </div>
          ) : null}

          {!loading && iframeUrl ? (
            <div className="w-full">
              <iframe
                title="PayTR"
                src={iframeUrl}
                style={{ width: "100%", height: 720, border: 0 }}
                allow="payment *"
              />
            </div>
          ) : null}

          {!loading && !iframeUrl && requestId ? (
            <div className="text-sm text-red-600">
              Ödeme ekranı oluşturulamadı. Aşağıdaki debug’u kontrol et.
            </div>
          ) : null}

          {debug ? (
            <pre className="text-xs bg-gray-50 border rounded-md p-3 overflow-auto">
{JSON.stringify(debug, null, 2)}
            </pre>
          ) : null}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Dashboard’a dön
            </Button>

            <Button variant="secondary" onClick={() => window.location.reload()}>
              Yenile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
