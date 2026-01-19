// src/pages/MentorCircle.tsx
// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import { Crown, Lock, Users, Heart, Info } from "lucide-react";

export default function MentorCircle() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const viewedRef = useRef<Set<string>>(new Set());

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    loadInitial();
    const channel = subscribeRealtimeReactions();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadInitial = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("mentor_circle_feed_ai")
      .select("*")
      .order("ai_score", { ascending: false })
      .limit(20);

    if (data) {
      setPosts(data);
      setCursor(data.at(-1)?.created_at ?? null);
      setHasMore(data.length === 20);
    }

    setLoading(false);
  };

  /* ---------------- PAGINATION ---------------- */
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !cursor) return;

    setLoading(true);

    const { data } = await supabase
      .from("mentor_circle_feed_ai")
      .select("*")
      .lt("created_at", cursor)
      .order("ai_score", { ascending: false })
      .limit(20);

    if (data?.length) {
      setPosts((prev) => [...prev, ...data]);
      setCursor(data.at(-1)?.created_at ?? null);
      setHasMore(data.length === 20);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }, [cursor, hasMore, loading]);

  /* ---------------- OBSERVER ---------------- */
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && loadMore(),
      { rootMargin: "200px" }
    );

    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  /* ---------------- EVENTS ---------------- */
  const trackEvent = async (type: string, postId: string) => {
    if (type === "view") {
      if (viewedRef.current.has(postId)) return;
      viewedRef.current.add(postId);
    }

    await supabase.from("mentor_circle_events").insert({
      post_id: postId,
      event_type: type,
    });
  };

  /* ---------------- REALTIME REACTIONS ---------------- */
  const subscribeRealtimeReactions = () => {
    return supabase
      .channel("mentor-circle-reactions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_reactions",
        },
        (payload) => {
          const postId = payload.new?.post_id;
          if (!postId) return;

          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? { ...p, reaction_count: (p.reaction_count || 0) + 1 }
                : p
            )
          );
        }
      )
      .subscribe();
  };

  /* ---------------- UI HELPERS ---------------- */
  const renderVisibilityBadge = (post: any) => {
    if (post.visibility === "private")
      return (
        <span className="flex items-center gap-1 text-xs text-red-600">
          <Lock size={14} /> Private
        </span>
      );

    if (post.visibility === "followers")
      return (
        <span className="flex items-center gap-1 text-xs text-indigo-600">
          <Users size={14} /> Followers
        </span>
      );

    return null;
  };

  const premiumWrapper = (post: any, children: any) => {
    if (!post.is_premium) return children;

    if (!post.has_access) {
      return (
        <div className="relative rounded-xl overflow-hidden border border-yellow-400/40">
          <div className="blur-sm pointer-events-none">{children}</div>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70">
            <Crown className="text-yellow-500 mb-2" />
            <button
              onClick={() => trackEvent("premium_cta_click", post.id)}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold"
            >
              Premium’a Geç
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="relative rounded-xl border border-yellow-400/40 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold text-yellow-700">
          <Crown size={14} /> PREMIUM
        </div>
        {children}
      </div>
    );
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Mentor Circle</h1>

      {posts.map((post) =>
        premiumWrapper(
          post,
          <div
            key={post.id}
            className="space-y-2"
            onMouseEnter={() => trackEvent("view", post.id)}
          >
            <div className="flex items-center justify-between px-1">
              <div className="text-sm font-medium">{post.author_name}</div>
              {renderVisibilityBadge(post)}
            </div>

            <PostCard post={post} />

            <div className="flex items-center justify-between text-sm text-gray-500 px-1">
              <div className="flex items-center gap-2">
                <Heart size={14} />
                {post.reaction_count || 0}
              </div>

              {post.ai_labels && (
                <div className="flex items-center gap-1 text-xs text-indigo-600">
                  <Info size={12} />
                  Neden üstte?
                </div>
              )}
            </div>
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
    </div>
  );
}
