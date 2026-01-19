// src/pages/MentorCircle.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

export default function MentorCircle() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("mentor_circle_feed_premium")
      .select("*")
      .limit(20);

    if (error) {
      console.error("Feed error:", error);
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="p-6">Yükleniyor…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4">
      {posts.length === 0 && (
        <div className="text-center text-gray-500">
          Henüz paylaşım yok
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
