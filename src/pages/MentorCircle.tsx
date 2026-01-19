// src/pages/MentorCircle.tsx
// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import { Crown, Lock, Users } from "lucide-react";

export default function MentorCircle() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  /* -------------------------------
     INITIAL LOAD
  -------------------------------- */
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

    if (!error && data) {
      setPosts(data);
      setCursor(data.at(-1)?.created_at ?? null);
      setHasMore(data.length === 20);
    }

    setLoading(false);
  };

  /* -------------------------------
     PAGINATION
  -------------------------------- */
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !cursor) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("mentor_circle_feed_ai")
      .select("*")
      .lt("created_at", cursor)
      .order("ai_score", { ascending: false })
      .limit(20);

    if (!error && data?.length) {
      setPosts((prev) => [...prev, ...data]);
      setCursor(data.at(-1)?.created_at ?? null);
      setHasMore(data.length === 20);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }, [cursor, hasMore, loading]);

  /* -------------------------------
     INTERSECTION OBSERVER
  -------------------------------- */
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );

    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  /* -------------------------------
     UI HELPERS
  -------------------------------- */
  const renderVisibilityBadge = (post: any) => {
    if (post.visibility === "private") {
      return (
        <span className="flex items-center gap-1 text-xs text-red-600">
          <Lock size={14} /> Private
        </span>
      );
    }
    if (post.visibility === "followers") {
      return (
        <span className="flex items-center gap-1 text-xs text-indigo-600">
          <Users size={14} /> Followers
        </span>
      );
    }
    return null;
  };

  const premiumWrapper = (post: any, children: any) => {
    if (!post.is_premium) return children;

    return (
      <div className="relative rounded-xl border border-yellow-400/40 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold text-yellow-700">
          <Crown size={14} /> PREMIUM
        </div>
        {children}
      </div>
    );
  };

  /* -------------------------------
     RENDER
  -------------------------------- */
  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Mentor Circle</h1>

      {posts.map((post) =>
        premiumWrapper(
          post,
          <div key={post.id} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="text-sm font-medium">{post.author_name}</div>
              {renderVisibilityBadge(post)}
            </div>

            <PostCard post={post} />
          </div>
        )
      )}

      {hasMore && (
        <div
          ref={sentinelRef}
          className="h-12 flex items-center justify-center text-sm text-gray-400"
        >
          {loading ? "Yükleniyor…" : ""}
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
