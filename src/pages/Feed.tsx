// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const user = supabase.auth.getUser();

  // İlk yükleme
  useEffect(() => {
    loadPosts();
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("realtime-post-reactions")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        (payload) => {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === payload.new.id
                ? { ...p, reactions_count: payload.new.reactions_count }
                : p
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("id, content, reactions_count, created_at")
      .order("created_at", { ascending: false })
      .range(0, 19);

    if (!error) setPosts(data);
  }

  async function toggleLike(postId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.rpc("toggle_reaction", {
      p_post_id: postId,
      p_user_id: user.id,
      p_type: "like",
    });
  }

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border rounded-xl p-4 space-y-3 bg-white"
        >
          <p>{post.content}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              ❤️ {post.reactions_count}
            </span>

            <Button size="sm" onClick={() => toggleLike(post.id)}>
              Like
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
