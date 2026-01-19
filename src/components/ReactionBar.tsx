// src/components/ReactionBar.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const REACTIONS = ["like", "celebrate", "support", "love", "insightful", "funny"];

export default function ReactionBar({ postId }) {
  const [user, setUser] = useState(null);
  const [myReaction, setMyReaction] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔐 auth güvenli şekilde al
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  // 👀 kullanıcının mevcut reaction’ını çek
  useEffect(() => {
    if (!user || !postId) return;

    supabase
      .from("post_reactions")
      .select("type")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setMyReaction(data?.type ?? null);
      });
  }, [user, postId]);

  const toggleReaction = async (type) => {
    if (!user || loading) return;
    setLoading(true);

    // aynı reaction → sil
    if (myReaction === type) {
      await supabase
        .from("post_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      setMyReaction(null);
      setLoading(false);
      return;
    }

    // farklı reaction → upsert
    await supabase.from("post_reactions").upsert({
      post_id: postId,
      user_id: user.id,
      type,
    });

    setMyReaction(type);
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="flex gap-2 flex-wrap pt-2">
      {REACTIONS.map((r) => (
        <button
          key={r}
          onClick={() => toggleReaction(r)}
          className={`px-2 py-1 rounded text-xs border
            ${
              myReaction === r
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
