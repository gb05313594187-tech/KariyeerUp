// src/pages/PaytrCheckout.tsx
// @ts-nocheck

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function PaytrCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const coachId = searchParams.get("coachId");
  const selectedDate = searchParams.get("date");
  const selectedTime = searchParams.get("time");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeToken, setIframeToken] = useState<string | null>(null);

  useEffect(() => {
    async function initPayment() {
      try {
        // 1️⃣ Kullanıcı bilgisi
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !user.email) {
          throw new Error("Kullanıcı girişi gerekli");
        }

        if (!coachId || !selectedDate || !selectedTime) {
          throw new Error("Eksik parametre");
        }

        // 2️⃣ ÖNCE session_requests INSERT (ALTIN KURAL)
        const { data: requestRow, error: insertError } = await supabase
          .from("session_requests")
          .insert({
            coach_id: coachId,
            user_id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "Kullanıcı",
            selected_date: selectedDate,
            selected_time: selectedTime,
            payment_status: "pending",
          })
          .select()
          .single();

        if (insertError || !requestRow) {
          throw new Error("Seans talebi oluşturulamadı");
        }

        const requestId = requestRow.id; // 🔴 TEK DOĞRU ID

        // 3️⃣ PayTR token al
        const res = await fetch(
          "https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/paytr-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requestId,
              email: user.email,
            }),
          }
        );

        const json = await res.json();

        if (!res.ok || !json.token) {
          throw new Error(json.error || "PayTR token alınamadı");
        }

        setIframeToken(json.token);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    }

    initPayment();
  }, []);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h2 className="text-lg font-semibold">Ödeme hazırlanıyor…</h2>
        <p className="text-sm text-gray-500">Lütfen bekleyin</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center text-red-600">
        <p>{error}</p>
        <button
          className="mt-4 underline"
          onClick={() => navigate("/dashboard")}
        >
          Geri dön
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-xl font-semibold mb-4">Güvenli Ödeme</h1>

      {iframeToken && (
        <iframe
          src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
          frameBorder="0"
          scrolling="no"
          style={{ width: "100%", height: "600px" }}
        />
      )}
    </div>
  );
}
