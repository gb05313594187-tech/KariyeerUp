// src/components/PollModal.tsx
// @ts-nocheck
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PollModal() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const createPoll = async () => {
    const { data } = await supabase.from("posts").insert({ type: "poll" }).select().single();
    await supabase.from("polls").insert({ post_id: data.id, question });
    for (const o of options) {
      await supabase.from("poll_options").insert({ post_id: data.id, option_text: o });
    }
  };

  return (
    <div className="border p-3">
      <input placeholder="Soru" onChange={(e) => setQuestion(e.target.value)} />
      {options.map((o, i) => (
        <input key={i} placeholder={`Seçenek ${i + 1}`} />
      ))}
      <button onClick={createPoll}>Anket Oluştur</button>
    </div>
  );
}
