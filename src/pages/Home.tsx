// src/pages/Home.tsx
// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Image,
  BarChart2,
  Calendar,
  Briefcase,
  X,
  Globe,
  Users,
  Bookmark,
  Brain,
} from "lucide-react";
import { toast } from "sonner";
import AIEnhancedPostCard from "@/components/AIEnhancedPostCard";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kısa profil state (profiles tablosundan)
  const [profile, setProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Composer state
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [submitting, setSubmitting] = useState(false);

  // Resim Yükleme State'leri
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  /* ---------------------------------------------------
     FETCH FEED (AI VIEW KULLANILIYOR)
  --------------------------------------------------- */
  const fetchFeed = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("mentor_circle_feed_ai")
        .select("*")
        .order("ai_score", { ascending: false });

      if (error) {
        console.error("Supabase RLS/Access Error:", error);
        if (error.code === "42501") {
          toast.error(
            "Erişim yetkiniz yok. Lütfen SQL politikalarını kontrol edin."
          );
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
     PROFİLİ PROFILES TABLOSUNDAN ÇEK
  --------------------------------------------------- */
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        setProfileLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, title, avatar_url, country, city")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("profiles fetch error:", error);
        } else {
          setProfile(data || null);
        }
      } catch (e) {
        console.error("profiles fetch exception:", e);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [user?.id]);

  /* ---------------------------------------------------
     RESİM İŞLEMLERİ
  --------------------------------------------------- */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Dosya çok büyük (Maks 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /* ---------------------------------------------------
     CREATE POST
  --------------------------------------------------- */
  const createPost = async () => {
    if (!content.trim() && !selectedImage) {
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
      type: selectedImage ? "image" : "text",
      content: content.trim(),
      visibility,
    });

    if (error) {
      console.error("Post Creation Error:", error);
      toast.error("Paylaşım başarısız: " + error.message);
    } else {
      toast.success("Başarıyla paylaşıldı 🚀");
      setContent("");
      setSelectedImage(null);
      fetchFeed();
    }
    setSubmitting(false);
  };

  // Avatar ve metinler için öncelik: profiles → user_metadata → fallback
  const avatarSrc =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "anon"}`;

  const displayName =
    profile?.full_name || user?.fullName || "Misafir Kullanıcı";

  const displayTitle = profile?.title || "Kariyer Yolculuğu Üyesi";

  const displayLocation =
    profile?.city && profile?.country
      ? `${profile.city}, ${profile.country}`
      : null;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =============== SOL SÜTUN: PROFİL + MENÜ =============== */}
        <div className="lg:col-span-3 space-y-4">
          {/* Profil Kartı */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4 flex items-center gap-3">
              <img
                src={avatarSrc}
                alt={displayName}
                className="w-12 h-12 rounded-xl border border-gray-100 object-cover"
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-gray-500 truncate">
                  {displayTitle}
                </div>
                {displayLocation && (
                  <div className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>{displayLocation}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Kısa Menü */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-3 space-y-1 text-sm">
              <button
                onClick={() => navigate("/saved")}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700"
              >
                <Bookmark className="w-4 h-4 text-red-500" />
                <span>Kaydedilenlerim</span>
              </button>
              <button
                onClick={() => navigate("/user/assessments")}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700"
              >
                <Brain className="w-4 h-4 text-indigo-500" />
                <span>Kişilik Envanteri Raporlarım</span>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* =============== ORTA SÜTUN: COMPOSER + FEED =============== */}
        <div className="lg:col-span-6 space-y-6">
          {/* ================= COMPOSER ================= */}
          <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <img
                  src={avatarSrc}
                  className="w-12 h-12 rounded-2xl border border-gray-100 object-cover shadow-sm"
                />
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Fikirlerini dünyayla paylaş..."
                    className="border-none focus-visible:ring-0 text-lg resize-none min-h-[100px] bg-transparent p-0 placeholder:text-gray-300 font-medium"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />

                  {/* Resim Önizleme Alanı */}
                  {selectedImage && (
                    <div className="relative group rounded-2xl overflow-hidden border border-gray-100 max-h-80">
                      <img src={selectedImage} className="w-full object-cover" />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-3 right-3 bg-black/60 p-1.5 rounded-full text-white hover:bg-red-500 transition-all shadow-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between border-t border-gray-50 pt-4 pb-1">
                {/* İkonlar */}
                <div className="flex gap-4 text-gray-400">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="hover:text-blue-500 transition-colors"
                    title="Fotoğraf Ekle"
                  >
                    <Image size={20} />
                  </button>

                  <button
                    onClick={() => toast.info("Anket yakında!")}
                    className="hover:text-blue-500 transition-colors"
                    title="Anket Yap"
                  >
                    <BarChart2 size={20} />
                  </button>

                  <button
                    onClick={() =>
                      toast.info("Etkinlik planlayıcı yakında burada!")
                    }
                    className="hover:text-blue-500 transition-colors"
                    title="Etkinlik Planla"
                  >
                    <Calendar size={20} />
                  </button>

                  {user?.role === "corporate" && (
                    <button
                      onClick={() =>
                        toast.success("İş ilanı moduna geçiliyor...")
                      }
                      className="hover:text-blue-500 transition-colors"
                      title="İş İlanı Yayınla"
                    >
                      <Briefcase size={20} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      className="appearance-none bg-gray-50 border border-gray-100 rounded-2xl pl-3 pr-8 py-2 text-xs font-bold text-gray-600 outline-none cursor-pointer hover:bg-gray-100 transition-all"
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value)}
                    >
                      <option value="public">🌍 Herkese Açık</option>
                      <option value="followers">👥 Takipçiler</option>
                      <option value="private">🔒 Özel</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>

                  <Button
                    onClick={createPost}
                    disabled={submitting || (!content.trim() && !selectedImage)}
                    className="bg-[#E63946] hover:bg-black text-white rounded-2xl px-8 h-11 font-black transition-all shadow-lg shadow-red-100 disabled:opacity-50 active:scale-95"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Paylaş"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ================= FEED (AI ENHANCED) ================= */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center py-20 gap-3">
                <div className="w-12 h-12 border-4 border-[#E63946] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">
                  AI Feed Optimize Ediliyor...
                </p>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => <AIEnhancedPostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100 shadow-inner">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-gray-200" size={32} />
                </div>
                <p className="text-gray-400 font-black text-lg">
                  Henüz bir paylaşım yok.
                </p>
                <p className="text-sm text-gray-300 font-medium">
                  Topluluğu başlatan ilk kişi sen ol!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =============== SAĞ SÜTUN: GÜNDEM PLACEHOLDER =============== */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                Gündem
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600 space-y-1">
              <p className="text-gray-500">
                #kariyer, #işilanı, #koçluk gibi etiketlerle tartışmaları yakında
                burada göstereceğiz.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
