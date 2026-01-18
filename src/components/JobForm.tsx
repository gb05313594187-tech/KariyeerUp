// src/components/JobForm.tsx
// @ts-nocheck
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function JobForm() {
  const [position, setPosition] = useState("");

  const submit = async () => {
    const { data } = await supabase.from("posts").insert({ type: "job" }).select().single();
    await supabase.from("jobs").insert({
      post_id: data.id,
      position,
      level: "mid",
      work_type: "remote",
      location_text: "Remote",
    });
  };

  return (
    <div>
      <input placeholder="Pozisyon" onChange={(e) => setPosition(e.target.value)} />
      <button onClick={submit}>İlan Yayınla</button>
    </div>
  );
}
