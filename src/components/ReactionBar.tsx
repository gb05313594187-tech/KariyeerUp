// src/components/ReactionBar.tsx
// @ts-nocheck
import { supabase } from "@/lib/supabase";

const reactions = ["like", "celebrate", "support", "love", "insightful", "funny"];

export default function ReactionBar({ postId }) {
  const react = async (type) => {
    await supabase.from("post_reactions").upsert({
      post_id: postId,
      type,
    });
  };

  return (
    <div className="flex gap-2">
      {reactions.map((r) => (
        <button key={r} onClick={() => react(r)}>
          {r}
        </button>
      ))}
    </div>
  );
}
