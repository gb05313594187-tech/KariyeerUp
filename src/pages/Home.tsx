// src/pages/Home.tsx — FİNAL + ESKİ YAPININ ÜZERİNE EFSANE GELİŞTİRME
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Image, BarChart2, Calendar, Briefcase, X, Globe, Users, Brain, Video, Bookmark, MapPin, CheckCircle2, Edit3
} from "lucide-react";
import { toast } from "sonner";
import AIEnhancedPostCard from "@/components/AIEnhancedPostCard";

const TRANSLATIONS = {
  tr: { editProfile: "PROFİLİ DÜZENLE", verified: "ONAYLI PROFİL" },
  en: { editProfile: "EDIT PROFILE", verified: "VERIFIED PROFILE" },
  ar: { editProfile: "تعديل الملف", verified: "ملف موثق" },
  fr: { editProfile: "MODIFIER LE PROFIL", verified: "PROFIL VÉRIFIÉ" },
};

export default function Home() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = TRANSLATIONS[language] || TRANSLATIONS.tr;
  const isRTL = language === "ar";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, title, avatar_url, cover_url, country, city, cv_data")
        .eq("id", user.id)
        .single();

      if (data) {
        const cv = data.cv_data || {};
        setProfileData({
          full_name: data.full_name || "Kullanıcı",
          title: data.title || cv.title || "Kariyer Yolcusu",
          avatar_url: data.avatar_url || cv.avatar_url || user.user_metadata?.avatar_url,
          cover_url: data.cover_url || cv.cover_url,
          city: data.city || cv.city || "",
          country: data.country || cv.country || "Türkiye",
        });
      }
    };

    const fetchFeed = async () => {
      const { data } = await supabase
        .from("mentor_circle_feed_ai")
        .select("*")
        .order("ai_score", { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };

    fetchProfile();
    fetchFeed();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const createPost = async () => {
    if (!content.trim() && !selectedImage) return;
    setSubmitting(true);
    await supabase.from("posts").insert({
      author_id: user.id,
      type: selectedImage ? "image" : "text",
      content: content.trim(),
      visibility: "public",
    });
    toast.success("Paylaşıldı! 🔥");
    setContent("");
    setSelectedImage(null);
    setSubmitting(false);
  };

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* YENİ HEADER – BANNER + BÜYÜK PROFİL */}
      <div className="relative bg-white shadow-xl">
        {/* Banner */}
        <div className="h-80 overflow-hidden">
          {profileData.cover_url ? (
            <img src={profileData.cover_url} alt="cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-700" />
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="relative -mt-32 flex flex-col md:flex-row items-end justify-between pb-8">
            {/* Sol - Profil Foto + Bilgiler */}
            <div className="flex items-end gap-8">
              <img
                src={profileData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.full_name)}&size=256`}
                alt="avatar"
                className="w-52 h-52 rounded-3xl border-10 border-white shadow-2xl object-cover"
              />

              <div className={`text-white ${isRTL ? "text-right" : ""}`}>
                <h1 className="text-5xl md:text-6xl font-black uppercase drop-shadow-lg">
                  {profileData.full_name}
                </h1>
                <p className="text-2xl md:text-3xl font-bold mt-2">
                  {profileData.title}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="bg-white/30 backdrop-blur px-6 py-3 rounded-full font-black text-lg flex items-center gap-2">
                    <CheckCircle2 size={22} /> {t.verified}
                  </span>
                  <span className="flex items-center gap-2 text-xl font-bold">
                    <MapPin size={26} /> {profileData.city}, {profileData.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Sağ - Profil Düzenle Butonu */}
            <Button
              onClick={() => navigate("/profile")}
              className="bg-white text-rose-600 hover:bg-rose-50 font-black px-10 h-16 rounded-2xl shadow-2xl text-xl flex items-center gap-4"
            >
              <Edit3 size={28} /> {t.editProfile}
            </Button>
          </div>
        </div>
      </div>

      {/* ESKİ 3 SÜTUN YAPISI – TAM OLARAK KORUNDU */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SOL SÜTUN – ESKİ HALİ */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <img src={profileData.avatar_url} alt="" className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <div className="font-bold">{profileData.full_name}</div>
                  <div className="text-xs text-gray-500">{profileData.title}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-2 space-y-1 text-sm">
                <MenuItem icon={Briefcase} label="Başvurularım" path="/my-applications" nav={navigate} />
                <MenuItem icon={Brain} label="Raporlar" path="/my-reports" nav={navigate} />
                <MenuItem icon={Calendar} label="Takvimim" path="/calendar" nav={navigate} />
                <MenuItem icon={Video} label="Mülakatlarım" path="/my-interviews" nav={navigate} />
                <MenuItem icon={Users} label="Seanslarım" path="/my-sessions-hub" nav={navigate} />
              </CardContent>
            </Card>
          </div>

          {/* ORTA SÜTUN – COMPOSER + FEED */}
          <div className="lg:col-span-6 space-y-6">
            {/* Composer – Eski hali korundu */}
            <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-start gap-3">
                  <img src={profileData.avatar_url} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <Textarea
                      placeholder="Fikirlerini paylaş..."
                      className="border-none focus-visible:ring-0 text-base resize-none min-h-[80px] bg-transparent p-0 placeholder:text-gray-400"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    {selectedImage && (
                      <div className="relative mt-2 group w-fit">
                        <img src={selectedImage} className="h-20 rounded-lg object-cover border" />
                        <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5"><X size={12}/></button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-3 border-t border-gray-50 flex justify-between items-center pt-2">
                <div className="flex gap-3 text-gray-400">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <button onClick={() => fileInputRef.current?.click()} className="hover:text-blue-500 transition"><Image size={18} /></button>
                  <button className="hover:text-blue-500 transition"><BarChart2 size={18} /></button>
                  <button className="hover:text-blue-500 transition"><Calendar size={18} /></button>
                </div>
                <Button size="sm" onClick={createPost} disabled={submitting || !content.trim()} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6">
                  {submitting ? "..." : "Paylaş"}
                </Button>
              </CardContent>
            </Card>

            {/* Feed */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-10 text-gray-400 text-sm">Yükleniyor...</div>
              ) : posts.length > 0 ? (
                posts.map((post) => <AIEnhancedPostCard key={post.id} post={post} />)
              ) : (
                <div className="text-center py-10 text-gray-400 text-sm">Henüz paylaşım yok.</div>
              )}
            </div>
          </div>

          {/* SAĞ SÜTUN – GÜNDEM */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-bold text-gray-900">Gündem</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 text-xs text-gray-500 space-y-2">
                <div className="font-medium text-gray-800">#kariyer</div>
                <div className="font-medium text-gray-800">#teknoloji</div>
                <div className="font-medium text-gray-800">#yapayzeka</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, path, nav }) {
  return (
    <button onClick={() => nav(path)} className="w-full text-left px-2 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2.5 text-gray-600 transition-colors group">
      <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-white">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
}
