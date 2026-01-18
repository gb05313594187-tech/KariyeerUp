// src/components/EventForm.tsx
// @ts-nocheck
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EventForm() {
  const [title, setTitle] = useState("");

  const submit = async () => {
    const { data } = await supabase.from("posts").insert({ type: "event" }).select().single();
    await supabase.from("events").insert({
      post_id: data.id,
      title,
      starts_at: new Date(),
    });
  };

  return (
    <div>
      <input placeholder="Etkinlik Başlığı" onChange={(e) => setTitle(e.target.value)} />
      <button onClick={submit}>Etkinlik Oluştur</button>
    </div>
  );
}
