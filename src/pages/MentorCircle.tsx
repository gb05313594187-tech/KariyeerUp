// src/pages/MentorCircleFeed.tsx
// @ts-nocheck

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

export default function MentorCircleFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);

  /* ============================
     İLK YÜKLEME
     ============================ */
  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("mentor_circle_feed_premium")
      .select("*")
      .order("premium_score", { ascending: false })
      .range(0, 19); // ilk 20

    if (!error) {
      setPosts(data || []);
      if (!data || data.length < 20) setHasMore(false);
    }

    setLoading(false);
  };

  /* ============================
     DAHA FAZLA YÜKLE (CURSOR)
     ============================ */
  const loadMore = async () => {
    if (loadingMore || !hasMore || posts.length === 0) return;

    setLoadingMore(true);

    const cursor = posts[posts.length - 1].created_at;

    const { data, error } = await supabase
      .from("mentor_circle_feed_premium")
      .select("*")
      .order("premium_score", { ascending: false })
      .lt("created_at", cursor)
      .limit(20);

    if (!error) {
      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
    }

    setLoadingMore(false);
  };

  /* ============================
     INTERSECTION OBSERVER
     ============================ */
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [posts, hasMore, loadingMore]);

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      {loading && <div className="text-center">Yükleniyor…</div>}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* 👇 Scroll tetik noktası */}
      {hasMore && (
        <div
          ref={observerRef}
          className="h-10 flex items-center justify-center text-sm text-gray-400"
        >
          {loadingMore ? "Yükleniyor…" : " "}
        </div>
      )}

      {!hasMore && (
        <div className="text-center text-sm text-gray-400">
          Başka içerik yok
        </div>
      )}
    </div>
  );
}
