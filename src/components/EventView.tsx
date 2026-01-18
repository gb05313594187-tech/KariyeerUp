// src/components/EventView.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EventView({ postId }) {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    supabase.from("events").select("*").eq("post_id", postId).single().then(({ data }) => {
      setEvent(data);
    });
  }, []);

  if (!event) return null;
  return <div>📅 {event.title}</div>;
}
