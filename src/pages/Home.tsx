// src/pages/Home.tsx
// @ts-nocheck

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Send,
  Image,
  BarChart2,
  Calendar,
  Briefcase,
  Globe,
  Users,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

/* ---------------------------------------------------
 TYPES
--------------------------------------------------- */
type Post = {
  id: string;
  author_id: string;
  type: string;
  content: string | null;
  visibility: "public" | "followers" | "private";
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
    role: string;
  };
};

/* ---------------------------------------------------
 HOME PAGE
--------------------------------------------------- */
export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Composer state
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"public" | "followers" | "private">("public");
  const [submitting, setSubmitting] = useState(false);

  /* ---------------------------------------------------
   FETCH FEED
  --------------------------------------------------- */
  const fetchFeed = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        author_id,
        type,
        content,
        visibility,
        created_at,
        profiles:author_id (
          full_name,
          avatar_url,
          role
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      toast.error("Feed yüklenemedi");
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  /* ---------------------------------------------------
   CREATE POST (TEXT MVP)
  --------------------------------------------------- */
  const createPost = async () => {
    if (!content.trim()) {
      toast.error("Paylaşım boş olamaz");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      type: "text",
      content,
      visibility,
    });

    if (error) {
      toast.error("Paylaşım başarısız");
    } else {
      toast.success("Paylaşıldı");
      setContent("");
      fetchFeed();
    }

    setSubmitting(false);
  };

  /* ---------------------------------------------------
   RENDER
  --------------------------------------------------- */
  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">

      {/* ================= COMPOSER ================= */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <Textarea
              placeholder="Ne paylaşmak istiyorsun?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3 text-gray-500">
              <Image size={18} />
              <BarChart2 size={18} />
              <Calendar size={18} />
              {user?.role === "corporate" && <Briefcase size={18} />}
            </div>

            <div className="flex items-center gap-2">
              {/* Visibility */}
              <select
                className="border rounded px-2 py-1 text-sm"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
              >
                <option value="public">🌍 Herkese Açık</option>
                <option value="followers">👥 Takipçiler</option>
                <option value="private">🔒 Özel</option>
              </select>

              <Button onClick={createPost} disabled={submitting}>
                Paylaş
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= FEED ================= */}
      {loading ? (
        <p className="text-center text-gray-400">Yükleniyor...</p>
      ) : (
        posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <p className="font-semibold">{post.profiles.full_name}</p>
                  <p className="text-xs text-gray-500">
                    {post.profiles.role.toUpperCase()} ·{" "}
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="whitespace-pre-wrap">{post.content}</p>

              {/* Actions */}
              <div className="flex justify-between text-gray-500 pt-2">
                <button className="flex items-center gap-1">
                  <ThumbsUp size={16} /> Beğen
                </button>
                <button className="flex items-center gap-1">
                  <MessageCircle size={16} /> Yorum
                </button>
                <button className="flex items-center gap-1">
                  <Repeat2 size={16} /> Paylaş
                </button>
                <button className="flex items-center gap-1">
                  <Send size={16} /> Gönder
                </button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
