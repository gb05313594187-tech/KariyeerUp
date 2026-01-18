// src/components/PollView.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PollView({ postId }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    supabase.from("poll_options").select("*").eq("post_id", postId).then(({ data }) => {
      setOptions(data || []);
    });
  }, []);

  const vote = async (option_id) => {
    await supabase.from("poll_votes").insert({ post_id: postId, option_id });
  };

  return (
    <div>
      {options.map((o) => (
        <button key={o.id} onClick={() => vote(o.id)}>
          {o.option_text}
        </button>
      ))}
    </div>
  );
}
