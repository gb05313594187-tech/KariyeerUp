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
  Brain,
  Video,
  Bookmark
} from "lucide-react";
import { toast } from "sonner";
import AIEnhancedPostCard from "@/components/AIEnhancedPostCard";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // PROFİL VERİSİ (DB'den çekilecek)
  const [profileData, setProfileData] = useState<any>(null);

  // Composer state
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [submitting, setSubmitting] = useState(false);

  // Resim Yükleme
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  /* ---------------------------------------------------
     1. FEED YÜKLE
  --------------------------------------------------- */
  const fetchFeed = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("mentor_circle_feed_ai")
        .select("*")
        .order("ai_score", { ascending: false });

      if (error) {
        if (error.code !== "PGRST116") console.error("Feed error:", error);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error("Feed fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------
     2. GÜNCEL PROFİL VERİSİNİ ÇEK (✅ GÜNCELLENDİ)
  --------------------------------------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, display_name, title, avatar_url, cover_url, country, city, cv_data, bio")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        const cv = data.cv_data || {};
        
        // ✅ İsim önceliği: full_name > display_name > cv > auth > fallback
        const finalName = data.full_name || data.display_name || cv.full_name || user?.user_metadata?.full_name || user?.fullName || "Kullanıcı";
        
        // ✅ Ünvan önceliği: title kolonu > cv_data.title > fallback
        const finalTitle = data.title || cv.title || "Kariyer Yolculuğu Üyesi";
        
        // ✅ Avatar önceliği: avatar_url > cv_data.avatar_url > auth > dicebear
        const finalAvatar = data.avatar_url || cv.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`;
        
        // ✅ Lokasyon
        const finalCity = data.city || cv.city || "";
        const finalCountry = data.country || cv.country || "";

        setProfileData({
          full_name: finalName,
          title: finalTitle,
          avatar_url: finalAvatar,
          city: finalCity,
          country: finalCountry,
          bio: data.bio || cv.about || ""
        });
      } else {
        // ✅ Eğer profiles tablosunda kayıt yoksa auth'dan al
        setProfileData({
          full_name: user?.user_metadata?.full_name || user?.fullName || "Kullanıcı",
          title: "Kariyer Yolculuğu Üyesi",
          avatar_url: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`,
          city: "",
          country: "",
          bio: ""
        });
      }
    };

    fetchProfile();
    fetchFeed();
  }, [user?.id]);

  /* ---------------------------------------------------
     3. POST PAYLAŞ
  --------------------------------------------------- */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Dosya çok büyük (Maks 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const createPost = async () => {
    if (!content.trim() && !selectedImage) {
      toast.error("Paylaşım boş olamaz");
      return;
    }
    if (!user) return;

    setSubmitting(true);
    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      type: selectedImage ? "image" : "text",
      content: content.trim(),
      visibility,
    });

    if (error) {
      toast.error("Paylaşım başarısız.");
    } else {
      toast.success("Paylaşıldı!");
      setContent("");
      setSelectedImage(null);
      fetchFeed();
    }
    setSubmitting(false);
  };

  // Görüntülenecek Veriler (Fallback mekanizmalı)
  const displayAvatar = profileData?.avatar_url || user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`;
  const displayName = profileData?.full_name || user?.fullName || "Kullanıcı";
  const displayTitle = profileData?.title || "Kariyer Yolculuğu Üyesi";
  
  const displayLocation = profileData?.city && profileData?.country 
    ? `${profileData.city}, ${profileData.country}` 
    : profileData?.country || null;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === SOL SÜTUN: PROFİL KARTI === */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-12 h-12 rounded-xl border border-gray-100 object-cover bg-gray-50"
              />
              <div className="min-w-0">
                <div className="text-sm font-bold text-gray-900 truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-gray-500 truncate font-medium">
                  {displayTitle}
                </div>
                {displayLocation && (
                  <div className="text-[10px] text-gray-400 truncate flex items-center gap-1 mt-0.5">
                    <Globe className="w-3 h-3" />
                    <span>{displayLocation}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Menü */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-2 space-y-1 text-sm">
              <MenuItem icon={Briefcase} label="Başvurularım" path="/my-applications" color="text-blue-600" nav={navigate} />
              <MenuItem icon={Brain} label="Raporlar" path="/my-reports" color="text-indigo-600" nav={navigate} />
              <MenuItem icon={Calendar} label="Takvimim" path="/calendar" color="text-orange-600" nav={navigate} />
              <MenuItem icon={Video} label="Mülakatlarım" path="/my-interviews" color="text-red-600" nav={navigate} />
              <MenuItem icon={Users} label="Seanslarım" path="/my-sessions-hub" color="text-purple-600" nav={navigate} />
            </CardContent>
          </Card>
        </div>

        {/* === ORTA SÜTUN: COMPOSER + FEED === */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-start gap-3">
                <img src={displayAvatar} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
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

        {/* === SAĞ SÜTUN: GÜNDEM === */}
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
  );
}

function MenuItem({ icon: Icon, label, path, color, nav }) {
  return (
    <button
      onClick={() => nav(path)}
      className="w-full text-left px-2 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2.5 text-gray-600 transition-colors group"
    >
      <div className={`p-1.5 rounded-md ${color.replace('text-', 'bg-').replace('600', '50')} group-hover:bg-white`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
}
