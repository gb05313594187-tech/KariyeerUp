// src/components/ReactionBar.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const REACTIONS = ["like", "celebrate", "support", "love", "insightful", "funny"];

export default function ReactionBar({ postId }) {
  const [counts, setCounts] = useState({});
  const [myReaction, setMyReaction] = useState(null);

  // 🔹 İlk yükleme
  useEffect(() => {
    loadReactions();

    // 🔴 REALTIME SUBSCRIPTION (TEK CHANNEL)
    const channel = supabase
      .channel(`post-reactions-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_reactions",
          filter: `post_id=eq.${postId}`,
        },
        () => {
          loadReactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const loadReactions = async () => {
    const { data, error } = await supabase
      .from("post_reactions")
      .select("type, user_id")
      .eq("post_id", postId);

    if (error) {
      console.error(error);
      return;
    }

    const map = {};
    let mine = null;
    const me = (await supabase.auth.getUser()).data?.user?.id;

    data.forEach((r) => {
      map[r.type] = (map[r.type] || 0) + 1;
      if (r.user_id === me) mine = r.type;
    });

    setCounts(map);
    setMyReaction(mine);
  };

  // 🔁 TOGGLE REACTION
  const react = async (type) => {
    const user = (await supabase.auth.getUser()).data?.user;
    if (!user) return;

    if (myReaction === type) {
      await supabase
        .from("post_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .eq("type", type);
    } else {
      await supabase.from("post_reactions").delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      await supabase.from("post_reactions").insert({
        post_id: postId,
        user_id: user.id,
        type,
      });
    }
  };

  return (
    <div className="flex gap-2 flex-wrap text-sm">
      {REACTIONS.map((r) => (
        <button
          key={r}
          onClick={() => react(r)}
          className={`px-3 py-1 rounded-full border transition
            ${myReaction === r
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white hover:bg-gray-100"}
          `}
        >
          {r} {counts[r] || 0}
        </button>
      ))}
    </div>
  );
}
