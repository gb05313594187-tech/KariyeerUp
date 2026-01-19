// src/pages/MentorCircle.tsx
// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

export default function MentorCircle() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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
      console.error("Initial feed error:", error);
    } else {
      setPosts(data || []);
      if (data && data.length > 0) {
        setCursor(data[data.length - 1].created_at);
        setHasMore(data.length === 20);
      }
    }

    setLoading(false);
  };

  // 🔹 Pagination
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("mentor_circle_feed_ai")
      .select("*")
      .lt("created_at", cursor)
      .order("ai_score", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Pagination error:", error);
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
  }, [loading, hasMore, cursor]);

  // 🔹 IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadMore]);

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Mentor Circle</h1>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* 🔹 Scroll Sentinel */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="h-10 flex items-center justify-center text-sm text-gray-400"
        >
          {loading ? "Yükleniyor..." : " "}
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
