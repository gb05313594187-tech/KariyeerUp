// src/pages/MentorCircle.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

export default function MentorCircle() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // 🔹 İlk yükleme
  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("mentor_circle_feed_ai")
      .select("*")
      .order("ai_score", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Feed load error:", error);
    } else {
      setPosts(data || []);
      if (data && data.length > 0) {
        setCursor(data[data.length - 1].created_at);
        setHasMore(data.length === 20);
      }
    }

    setLoading(false);
  };

  // 🔹 Pagination (Load more)
  const loadMore = async () => {
    if (!hasMore || loading || !cursor) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("mentor_circle_feed_ai")
      .select("*")
      .lt("created_at", cursor)
      .order("ai_score", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Feed pagination error:", error);
    } else {
      if (data && data.length > 0) {
        setPosts((prev) => [...prev, ...data]);
        setCursor(data[data.length - 1].created_at);
        setHasMore(data.length === 20);
      } else {
        setHasMore(false);
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Mentor Circle</h1>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Yükleniyor..." : "Daha fazla yükle"}
          </button>
        </div>
      )}

      {!hasMore && (
        <div className="text-center text-sm text-gray-500 py-6">
          Başka gönderi yok
        </div>
      )}
    </div>
  );
}
