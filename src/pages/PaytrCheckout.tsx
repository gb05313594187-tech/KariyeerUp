// ✅ Edge function invoke (auth header otomatik gider)
let data: any = null;
let error: any = null;

try {
  const res = await supabase.functions.invoke("paytr-get-token", {
    body: { request_id: requestId },
  });
  data = res.data;
  error = res.error;
} catch (e: any) {
  // SDK bazen body'yi vermiyor, buraya düşer
  error = e;
}

setDbg({
  requestId,
  data,
  error: error
    ? {
        name: error.name,
        message: error.message,
        status: error.context?.status || error.status || null,
        statusText: error.context?.statusText || null,
        body: error.context?.body || null,
      }
    : null,
});

if (error) {
  console.error("paytr-get-token error:", error);
  toast.error("Ödeme başlatılamadı (token).");
  return;
}

if (!data?.token) {
  console.error("paytr-get-token bad response:", data);
  toast.error("Ödeme token alınamadı.");
  return;
}

setToken(String(data.token));
