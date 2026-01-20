// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image, BarChart2, Calendar, Briefcase } from "lucide-react";
import { toast } from "sonner";
import AIEnhancedPostCard from "@/components/AIEnhancedPostCard";

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Composer state
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [submitting, setSubmitting] = useState(false);

  /* ---------------------------------------------------
     FETCH FEED (AI VIEW KULLANILIYOR)
  --------------------------------------------------- */
  const fetchFeed = async () => {
    try {
      setLoading(true);
      
      // getSession hatasını bypass etmek için doğrudan tablo sorgusu atıyoruz
      const { data, error } = await supabase
        .from("mentor_circle_feed_ai")
        .select("*")
        .order("ai_score", { ascending: false });

      if (error) {
        // Eğer 403 hatası alıyorsak konsola detay basıyoruz
        console.error("Supabase RLS/Access Error:", error);
        if (error.code === "42501") {
          toast.error("Erişim yetkiniz yok. Lütfen SQL politikalarını kontrol edin.");
        } else {
          toast.error("İçerikler yüklenemedi.");
        }
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error("Beklenmedik hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  /* ---------------------------------------------------
     CREATE POST
  --------------------------------------------------- */
  const createPost = async () => {
    if (!content.trim()) {
      toast.error("Paylaşım boş olamaz");
      return;
    }

    if (!user) {
      toast.error("Paylaşım yapmak için giriş yapmalısınız");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      type: "text",
      content: content.trim(),
      visibility,
    });

    if (error) {
      console.error("Post Creation Error:", error);
      toast.error("Paylaşım başarısız: " + error.message);
    } else {
      toast.success("Paylaşıldı");
      setContent("");
      fetchFeed();
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6 px-4">
      {/* ================= COMPOSER ================= */}
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <img 
              src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'anon'}`} 
              className="w-10 h-10 rounded-full border border-gray-100 object-cover" 
            />
            <Textarea
              placeholder="Fikirlerini dünyayla paylaş..."
              className="border-none focus-visible:ring-0 text-lg resize-none min-h-[80px] bg-transparent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex gap-4 text-gray-400">
              <button className="hover:text-blue-500 transition-colors"><Image size={20} /></button>
              <button className="hover:text-blue-500 transition-colors"><BarChart2 size={20} /></button>
              <button className="hover:text-blue-500 transition-colors"><Calendar size={20} /></button>
              {user?.role === "corporate" && <button className="hover:text-blue-500 transition-colors"><Briefcase size={20} /></button>}
            </div>

            <div className="flex items-center gap-3">
              <select
                className="bg-gray-50 border-none rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-600 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="public">🌍 Herkese Açık</option>
                <option value="followers">👥 Takipçiler</option>
                <option value="private">🔒 Özel</option>
              </select>

              <Button 
                onClick={createPost} 
                disabled={submitting || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 font-bold transition-all shadow-md shadow-blue-200 disabled:opacity-50"
              >
                {submitting ? "..." : "Paylaş"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= FEED (AI ENHANCED) ================= */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-medium animate-pulse text-sm">AI Feed Optimize Ediliyor...</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <AIEnhancedPostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Henüz paylaşım bulunmuyor.</p>
            <p className="text-xs text-gray-300 mt-1">İlk adımı sen atarak topluluğu başlat!</p>
          </div>
        )}
      </div>
    </div>
  );
}
