// src/pages/Home.tsx
// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Image, BarChart2, Calendar, Briefcase, X, Globe, Users, Brain, Video, Bookmark, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import AIEnhancedPostCard from "@/components/AIEnhancedPostCard";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // PROFİL DATASI
  const [profileData, setProfileData] = useState<any>(null);

  // Composer
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // 1. FEED YÜKLE
  const fetchFeed = async () => {
    const { data } = await supabase.from("mentor_circle_feed_ai").select("*").order("ai_score", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  // 2. PROFİL YÜKLEME (AKILLI KONTROL)
  const loadProfile = async () => {
    if (!user?.id) return;
    
    // Veritabanından en taze veriyi çek
    const { data } = await supabase
      .from("profiles")
      .select("full_name, title, avatar_url, country, city, cv_data")
      .eq("id", user.id)
      .maybeSingle();

    if (data) {
      // Veri varsa, UI'ı güncelle
      // NOT: DB'deki title boşsa, "Kariyer Yolculuğu Üyesi" göster
      const finalTitle = data.title && data.title.trim() !== "" ? data.title : "Kariyer Yolculuğu Üyesi";
      const finalAvatar = data.avatar_url || user?.user_metadata?.avatar_url;

      setProfileData({
        full_name: data.full_name,
        title: finalTitle,
        avatar_url: finalAvatar,
        city: data.city,
        country: data.country
      });
    }
  };

  useEffect(() => {
    fetchFeed();
    loadProfile();

    // HER 3 SANİYEDE BİR PROFİLİ KONTROL ET (Otomatik Güncelleme)
    const interval = setInterval(() => {
      loadProfile();
    }, 3000);

    return () => clearInterval(interval);
  }, [user?.id]);


  // ... RESİM YÜKLEME & POST ...
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const createPost = async () => {
    if (!content.trim() && !selectedImage) return toast.error("Boş paylaşım yapılamaz");
    setSubmitting(true);
    await supabase.from("posts").insert({
      author_id: user.id, type: selectedImage ? "image" : "text", content, visibility
    });
    toast.success("Paylaşıldı!");
    setContent("");
    setSelectedImage(null);
    fetchFeed();
    setSubmitting(false);
  };

  // Görüntüleme (Fallback'ler)
  const displayAvatar = profileData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`;
  const displayName = profileData?.full_name || user?.fullName || "Kullanıcı";
  const displayTitle = profileData?.title || "Kariyer Yolculuğu Üyesi";
  const displayLocation = profileData?.city ? `${profileData.city}, ${profileData.country}` : null;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SOL SÜTUN */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <img src={displayAvatar} className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200" />
              <div className="min-w-0">
                <div className="text-sm font-bold text-gray-900 truncate">{displayName}</div>
                <div className="text-[11px] text-gray-500 truncate font-medium">{displayTitle}</div>
                {displayLocation && <div className="text-[10px] text-gray-400 flex items-center gap-1"><Globe className="w-3 h-3"/>{displayLocation}</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-2 space-y-1 text-sm">
              <MenuItem icon={Briefcase} label="Başvurularım" path="/my-applications" color="text-blue-600" nav={navigate} />
              <MenuItem icon={Brain} label="Raporlar" path="/my-reports" color="text-indigo-600" nav={navigate} />
              <MenuItem icon={Calendar} label="Takvimim" path="/calendar" color="text-orange-600" nav={navigate} />
              <MenuItem icon={Video} label="Mülakatlarım" path="/my-interviews" color="text-red-600" nav={navigate} />
              <MenuItem icon={Users} label="Seanslarım" path="/my-sessions-hub" color="text-purple-600" nav={navigate} />
            </CardContent>
          </Card>
        </div>

        {/* ORTA SÜTUN */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-start gap-3">
                <img src={displayAvatar} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                <div className="flex-1">
                  <Textarea 
                    placeholder="Fikirlerini paylaş..." 
                    className="border-none focus-visible:ring-0 text-base resize-none min-h-[80px] bg-transparent p-0"
                    value={content} onChange={(e) => setContent(e.target.value)}
                  />
                  {selectedImage && (
                    <div className="relative mt-2 w-fit">
                      <img src={selectedImage} className="h-20 rounded-lg" />
                      <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5"><X size={12}/></button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3 border-t border-gray-50 flex justify-between items-center pt-2">
              <div className="flex gap-3 text-gray-400">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current?.click()} className="hover:text-blue-500"><Image size={18} /></button>
                <button className="hover:text-blue-500"><BarChart2 size={18} /></button>
                <button className="hover:text-blue-500"><Calendar size={18} /></button>
              </div>
              <Button size="sm" onClick={createPost} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 text-white">Paylaş</Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {posts.map((post) => <AIEnhancedPostCard key={post.id} post={post} />)}
          </div>
        </div>

        {/* SAĞ SÜTUN */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-bold">Gündem</CardTitle>
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
    <button onClick={() => nav(path)} className="w-full text-left px-2 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2.5 text-gray-600 transition-colors group">
      <div className={`p-1.5 rounded-md ${color.replace('text-', 'bg-').replace('600', '50')} group-hover:bg-white`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
}
