// src/pages/Home.tsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image, BarChart2, Calendar, Briefcase, X, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import AIEnhancedPostCard from "@/components/AIEnhancedPostCard";

const TRANSLATIONS = {
  tr: {
    composerPlaceholder: "Bugün kariyerinde ne yaşıyorsun? Fikrini paylaş, ilham ol...",
    verified: "ONAYLI PROFİL",
    shareButton: "PAYLAŞ",
    sending: "Gönderiliyor...",
    public: "🌍 Herkese Açık",
    followers: "👥 Takipçiler",
    private: "🔒 Sadece Ben",
    noPostsYet: "Henüz kimse paylaşım yapmadı",
    beFirst: "İlk paylaşımı sen yap, lider ol!",
    aiFeed: "AI Feed Hazırlanıyor...",
  },
  en: {
    composerPlaceholder: "What's happening in your career today? Share your thoughts...",
    verified: "VERIFIED PROFILE",
    shareButton: "POST",
    sending: "Posting...",
    public: "🌍 Public",
    followers: "👥 Followers",
    private: "🔒 Private",
    noPostsYet: "No posts yet",
    beFirst: "Be the first to post!",
    aiFeed: "AI Feed Loading...",
  },
  ar: {
    composerPlaceholder: "ما الذي يحدث في مسيرتك المهنية اليوم؟ شارك أفكارك...",
    verified: "ملف موثق",
    shareButton: "نشر",
    sending: "جاري النشر...",
    public: "🌍 عام",
    followers: "👥 المتابعون",
    private: "🔒 خاص",
    noPostsYet: "لا توجد منشورات بعد",
    beFirst: "كن أول من ينشر!",
    aiFeed: "جاري تحميل التغذية الذكية...",
  },
  fr: {
    composerPlaceholder: "Que se passe-t-il dans votre carrière aujourd'hui ? Partagez vos pensées...",
    verified: "PROFIL VÉRIFIÉ",
    shareButton: "PUBLIER",
    sending: "Publication en cours...",
    public: "🌍 Public",
    followers: "👥 Abonnés",
    private: "🔒 Privé",
    noPostsYet: "Aucune publication pour le moment",
    beFirst: "Soyez le premier à publier !",
    aiFeed: "Flux IA en cours de chargement...",
  },
};

export default function Home() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language] || TRANSLATIONS.tr;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);

  // Composer
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // DİL YÖNLENDİRME (RTL İÇİN)
  const isRTL = language === "ar";

  // PROFİL ÇEKME
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, title, city, country, avatar_url, cover_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setCurrentUserProfile(data);
      } else {
        setCurrentUserProfile({
          full_name: user.user_metadata?.full_name || "Professional",
          title: "",
          city: language === "tr" ? "İstanbul" : language === "ar" ? "دبي" : language === "fr" ? "Paris" : "London",
          country: language === "tr" ? "Türkiye" : language === "ar" ? "الإمارات" : language === "fr" ? "France" : "UK",
          avatar_url: user.user_metadata?.avatar_url || null,
          cover_url: null,
        });
      }
    };

    fetchUserProfile();
  }, [user, language]);

  // FEED
  const fetchFeed = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("mentor_circle_feed_ai")
        .select("*")
        .order("ai_score", { ascending: false });
      setPosts(data || []);
    } catch (err) {
      toast.error("Feed yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    } else if (file) {
      toast.error("Max 5MB");
    }
  };

  const createPost = async () => {
    if (!content.trim() && !selectedImage) return;

    setSubmitting(true);
    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      type: selectedImage ? "image" : "text",
      content: content.trim(),
      visibility,
    });

    if (error) {
      toast.error("Paylaşım başarısız");
    } else {
      toast.success(language === "tr" ? "Paylaşıldı! 🔥" : language === "en" ? "Posted! 🔥" : language === "ar" ? "تم النشر! 🔥" : "Publié ! 🔥");
      setContent("");
      setSelectedImage(null);
      fetchFeed();
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* === PROFİL HEADER (4 DİL) === */}
      {currentUserProfile && (
        <div className="mb-12 -mt-10">
          {/* Banner */}
          <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
            {currentUserProfile.cover_url ? (
              <img src={currentUserProfile.cover_url} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-600 via-purple-600 to-indigo-700" />
            )}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Profil Bilgileri */}
          <div className="relative max-w-4xl mx-auto px-6 -mt-32">
            <div className={`flex flex-col ${isRTL ? "md:flex-row-reverse" : "md:flex-row"} items-end gap-8`}>
              <img
                src={currentUserProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserProfile.full_name)}&background=random&size=256`}
                alt="profile"
                className="w-44 h-44 md:w-56 md:h-56 rounded-3xl border-8 border-white shadow-2xl object-cover z-10"
              />

              <div className={`flex-1 text-white ${isRTL ? "text-right" : "text-left"} pb-6`}>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-2xl">
                  {currentUserProfile.full_name}
                </h1>
                {currentUserProfile.title ? (
                  <p className="text-2xl md:text-4xl font-bold mt-2 opacity-95">
                    {currentUserProfile.title}
                  </p>
                ) : (
                  <p className="text-xl md:text-2xl font-medium italic mt-2 opacity-80">
                    {language === "tr" ? "Kariyerini Yükselten Savaşçı" : language === "en" ? "Career Warrior" : language === "ar" ? "محارب المهنة" : "Guerrier de carrière"}
                  </p>
                )}

                <div className={`flex flex-wrap items-center gap-4 mt-6 ${isRTL ? "justify-end" : "justify-start"}`}>
                  <span className="bg-white/25 backdrop-blur-md px-6 py-3 rounded-full text-sm font-black uppercase flex items-center gap-2 border border-white/40">
                    <CheckCircle2 size={18} /> {t.verified}
                  </span>

                  {(currentUserProfile.city || currentUserProfile.country) && (
                    <span className="flex items-center gap-3 text-lg font-bold bg-white/25 backdrop-blur-md px-6 py-3 rounded-full border border-white/40">
                      <MapPin size={22} />
                      {currentUserProfile.city && `${currentUserProfile.city}, `}
                      {currentUserProfile.country}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === COMPOSER === */}
      <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden mb-10">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-5">
            <img
              src={currentUserProfile?.avatar_url || `https://ui-avatars.com/api/?name=${user?.user_metadata?.full_name || 'U'}`}
              className="w-16 h-16 rounded-3xl border-4 border-white shadow-2xl object-cover flex-shrink-0"
              alt="avatar"
            />
            <div className="flex-1">
              <Textarea
                placeholder={t.composerPlaceholder}
                className="border-none focus-visible:ring-0 text-lg resize-none min-h-[140px] bg-gray-50/70 rounded-2xl p-6 placeholder:text-gray-400 font-medium"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {selectedImage && (
                <div className="relative mt-5 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300">
                  <img src={selectedImage} className="w-full max-h-96 object-cover" alt="preview" />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-black/70 p-2.5 rounded-full text-white hover:bg-red-600 transition-all"
                  >
                    <X size={22} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-5 border-t border-gray-100">
            <div className="flex gap-6 text-gray-500">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <button onClick={() => fileInputRef.current?.click()} className="hover:text-rose-600 transition-all">
                <Image size={26} />
              </button>
              <button onClick={() => toast.info("Yakında!")} className="hover:text-blue-600">
                <BarChart2 size={26} />
              </button>
              <button onClick={() => toast.info("Yakında!")} className="hover:text-green-600">
                <Calendar size={26} />
              </button>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="bg-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold cursor-pointer outline-none"
              >
                <option value="public">{t.public}</option>
                <option value="followers">{t.followers}</option>
                <option value="private">{t.private}</option>
              </select>

              <Button
                onClick={createPost}
                disabled={submitting || (!content.trim() && !selectedImage)}
                className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white font-black px-12 h-14 rounded-2xl shadow-2xl text-lg"
              >
                {submitting ? t.sending : t.shareButton}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* === FEED === */}
      <div className="space-y-6 pb-20">
        {loading ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 border-6 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-gray-500 font-black uppercase tracking-widest text-lg">{t.aiFeed}</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post: any) => <AIEnhancedPostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-32 bg-gradient-to-b from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="text-8xl mb-8">✨</div>
            <p className="text-3xl font-black text-gray-800 mb-3">{t.noPostsYet}</p>
            <p className="text-xl text-gray-600 font-medium">{t.beFirst}</p>
          </div>
        )}
      </div>
    </div>
  );
}
