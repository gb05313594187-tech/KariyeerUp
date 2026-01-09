// src/pages/PaytrCheckout.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getPaytrTokenViaFetch } from "@/lib/paytr";

export default function PaytrCheckout() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const requestId = sp.get("requestId") || "";

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [debug, setDebug] = useState<any>(null);

  const load = async () => {
    try {
      setLoading(true);
      setToken("");
      setErrorMsg("");
      setDebug(null);

      if (!requestId) {
        setErrorMsg("RequestId yok.");
        return;
      }

      const t = await getPaytrTokenViaFetch(requestId);
      setToken(t);

      // burada iframe create ediyorsun (sende nasıl ise)
      // örnek:
      // document.getElementById("paytr-iframe").innerHTML =
      //   `<iframe src="https://www.paytr.com/odeme/guvenli/${t}" ...></iframe>`;
    } catch (e: any) {
      console.error("paytr-get-token error(fetch):", e);
      setErrorMsg("Ödeme başlatılamadı (token).");

      // ✅ en kritik: gerçek body burada
      setDebug({
        requestId,
        status: e?.status || null,
        body: e?.body || null,
        message: String(e?.message || e),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  return (
    <div className="min-h-[70vh] w-full">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-3">
          <div className="text-lg font-semibold">Ödeme</div>
          <div className="text-sm text-muted-foreground">
            Ödeme güvenli şekilde PayTR altyapısında tamamlanır. Kart bilgileri platformda saklanmaz.
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          {loading ? (
            <div className="text-sm">Yükleniyor...</div>
          ) : errorMsg ? (
            <div className="space-y-3">
              <div className="text-sm text-red-600">{errorMsg}</div>

              <div className="rounded-md bg-slate-50 p-3 text-xs overflow-auto">
                <div className="font-semibold mb-1">Debug</div>
                <pre className="whitespace-pre-wrap break-words">
{JSON.stringify(
  { requestId, token: token || "(yok)", debug },
  null,
  2
)}
                </pre>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                  Dashboard’a dön
                </Button>
                <Button onClick={load}>Yeniden dene</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-green-700">
                Token alındı. Iframe yükleniyor…
              </div>

              <div className="rounded-md border p-3">
                <div id="paytr-iframe" />
              </div>

              <div className="rounded-md bg-slate-50 p-3 text-xs overflow-auto">
                <div className="font-semibold mb-1">Debug</div>
                <pre className="whitespace-pre-wrap break-words">
{JSON.stringify({ requestId, token }, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
