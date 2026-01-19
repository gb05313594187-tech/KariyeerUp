// src/pages/MentorCircleFeed.tsx
// @ts-nocheck

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

export default function MentorCircleFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 🔹 İLK YÜKLEME
  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("mentor_circle_feed_premium")
      .select("*")
      .order("premium_score", { ascending: false })
      .range(0, 19); // ✅ İLK 20 POST

    if (error) {
      console.error(error);
    } else {
      setPosts(data || []);
      if (!data || data.length < 20) {
        setHasMore(false);
      }
    }

    setLoading(false);
  };

  // 🔹 DEVAMINI YÜKLE (PAGINATION)
  const loadMore = async () => {
    if (loadingMore || !hasMore || posts.length === 0) return;

    setLoadingMore(true);

    const cursor = posts[posts.length - 1].created_at;

    const { data, error } = await supabase
      .from("mentor_circle_feed_premium")
      .select("*")
      .order("premium_score", { ascending: false })
      .lt("created_at", cursor) // ✅ CURSOR
      .limit(20);

    if (error) {
      console.error(error);
    } else {
      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
    }

    setLoadingMore(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      {loading && <div className="text-center">Yükleniyor…</div>}

      {!loading &&
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

      {!loading && hasMore && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="w-full py-3 border rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          {loadingMore ? "Yükleniyor…" : "Daha fazla yükle"}
        </button>
      )}

      {!hasMore && (
        <div className="text-center text-sm text-gray-400">
          Başka içerik yok
        </div>
      )}
    </div>
  );
}
