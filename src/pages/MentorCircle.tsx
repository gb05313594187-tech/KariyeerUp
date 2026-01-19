// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";

export default function MentorCircle() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);

  /* -------------------- FEED LOAD -------------------- */
  useEffect(() => {
    if (loading) return;
    if (!user) return;

    loadFeed();
  }, [loading, user]);

  async function loadFeed() {
    setFeedLoading(true);

    const { data, error } = await supabase
      .from("feed_ranked")
      .select("*")
      .order("score", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Feed error:", error);
    } else {
      setPosts(data || []);
    }

    setFeedLoading(false);
  }

  /* -------------------- REACTION UPSERT -------------------- */
  async function toggleLike(postId: string) {
    if (!user) return;

    const { data: existing } = await supabase
      .from("post_reactions")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      await supabase
        .from("post_reactions")
        .delete()
        .eq("id", existing.id);
    } else {
      await supabase.from("post_reactions").insert({
        post_id: postId,
        user_id: user.id,
        reaction: "like",
      });
    }

    loadFeed();
  }

  /* -------------------- GUARDS -------------------- */
  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Giriş yapmalısın
      </div>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {feedLoading && (
          <div className="text-center text-gray-400">Yükleniyor…</div>
        )}

        {!feedLoading && posts.length === 0 && (
          <div className="text-center text-gray-400">
            Henüz içerik yok
          </div>
        )}

        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="pt-6 space-y-4">
              {/* AUTHOR */}
              <div className="text-sm text-gray-500">
                {post.author_id}
              </div>

              {/* CONTENT */}
              <div className="text-gray-800 whitespace-pre-line">
                {post.content}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Beğen
                </Button>

                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Yorum
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
