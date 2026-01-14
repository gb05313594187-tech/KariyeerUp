// src/pages/SessionJoin.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function SessionJoin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate(`/login?redirect=/session/${id}/join`);
      return;
    }

    loadSession();
  }, [loading, user]);

  async function loadSession() {
    const { data, error } = await supabase
      .from("app_2dff6511da_session_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      navigate("/");
      return;
    }

    // sadece ilgili user veya coach girebilsin
    if (data.user_id !== user.id && data.coach_id !== user.id) {
      navigate("/");
      return;
    }

    if (data.status !== "confirmed" || data.payment_status !== "paid") {
      navigate("/");
      return;
    }

    setSession(data);
  }

  if (!session) return null;

  return (
    <div className="w-full h-[calc(100vh-64px)]">
      <iframe
        src={session.meeting_url}
        allow="camera; microphone; fullscreen; display-capture"
        className="w-full h-full border-0"
        title="Seans Görüşmesi"
      />
    </div>
  );
}
