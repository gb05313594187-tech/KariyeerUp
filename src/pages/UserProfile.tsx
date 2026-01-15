import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Target, Trophy, Zap, MapPin, Camera, Globe, Briefcase, 
  GraduationCap, Edit3, Save, X, CheckCircle2, Award, 
  Star, Share2, ChevronRight, Download, Image as ImageIcon,
  FileText, ShieldCheck, Mail, Phone, Link as LinkIcon, Github, Linkedin, Twitter
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").update(formData).eq("id", profile.id);
      if (error) throw error;
      setProfile(formData);
      setIsEditing(false);
      toast.success("Profil başarıyla güncellendi.");
    } catch (error) {
      toast.error("Hata oluştu.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0F172A] text-white">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ÜST BANNER & AVATAR */}
      <div className="h-64 bg-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C62828] to-slate-900 opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative h-full">
           <div className="absolute -bottom-16 left-6 flex items-end gap-6">
              <div className="relative group">
                <div className="w-40 h-40 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-white">
                  <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name}`} className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg hover:bg-slate-50 transition-colors">
                  <Camera className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
                  {profile?.full_name} <CheckCircle2 className="w-6 h-6 text-blue-500" />
                </h1>
                <p className="text-slate-500 font-medium">{profile?.title || "Kariyer Uzmanı"}</p>
              </div>
           </div>
           <div className="absolute bottom-4 right-6 flex gap-3">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white/20">
                <Share2 className="w-4 h-4 mr-2" /> Paylaş
              </Button>
              <Button onClick={() => setIsEditing(!isEditing)} className={isEditing ? "bg-green-600" : "bg-slate-900"}>
                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {isEditing ? "Kaydet" : "Profili Düzenle"}
              </Button>
           </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-24 pb-20">
        <Tabs defaultValue="genel" className="space-y-8">
          <TabsList className="bg-white border p-1 rounded-2xl w-fit">
            <TabsTrigger value="genel" className="rounded-xl px-8">Genel Bilgiler</TabsTrigger>
            <TabsTrigger value="kariyer" className="rounded-xl px-8">Kariyer & Deneyim</TabsTrigger>
            <TabsTrigger value="belgeler" className="rounded-xl px-8">Belgeler & Galeri</TabsTrigger>
            <TabsTrigger value="sosyal" className="rounded-xl px-8">Bağlantılar</TabsTrigger>
          </TabsList>

          <TabsContent value="genel">
            <div className="grid grid-cols-12 gap-8">
              {/* FORM ALANI */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <Card className="p-8 border-none shadow-sm rounded-3xl">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#C62828]" /> Kişisel Bilgiler ve Manifesto
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">Tam Adınız</label>
                      <Input disabled={!isEditing} value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="rounded-xl border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">Profesyonel Ünvan</label>
                      <Input disabled={!isEditing} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="rounded-xl border-slate-200" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-slate-600">Manifesto (Vizyon Cümleniz)</label>
                      <Textarea disabled={!isEditing} value={formData.manifesto} onChange={e => setFormData({...formData, manifesto: e.target.value})} className="rounded-xl border-slate-200 min-h-[100px]" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-slate-600">Hakkımda / Profesyonel Özet</label>
                      <Textarea disabled={!isEditing} value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="rounded-xl border-slate-200 min-h-[150px]" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* YAN PANEL BİLGİLERİ */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <Card className="p-8 border-none shadow-sm rounded-3xl">
                  <h3 className="text-lg font-bold mb-6">Lokasyon & Sektör</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <div className="flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Şehir</p>
                        <Input disabled={!isEditing} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-7 border-none bg-transparent p-0 focus-visible:ring-0 font-bold" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <Briefcase className="w-5 h-5 text-slate-400" />
                      <div className="flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Sektör</p>
                        <Input disabled={!isEditing} value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} className="h-7 border-none bg-transparent p-0 focus-visible:ring-0 font-bold" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-none shadow-sm rounded-3xl bg-slate-900 text-white">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#C62828]" /> CV Aksiyonları
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">Verilerinizle otomatik oluşturulmuş profesyonel CV dosyanızı indirin.</p>
                  <Button onClick={() => window.print()} className="w-full bg-[#C62828] hover:bg-[#a31f1f] rounded-xl py-6 font-bold">
                    PDF OLARAK İNDİR
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kariyer" className="h-40 flex items-center justify-center border-2 border-dashed rounded-3xl text-slate-400 italic">
            Deneyim ve Eğitim bilgilerini düzenleme alanı buraya gelecek...
          </TabsContent>

          <TabsContent value="belgeler">
            <Card className="p-8 border-none shadow-sm rounded-3xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold">Sertifikalar & Belgeler</h3>
                <Button variant="outline" className="rounded-xl"><ImageIcon className="w-4 h-4 mr-2" /> Yeni Ekle</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center group cursor-pointer hover:border-[#C62828] transition-colors">
                    <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-[#C62828]" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sosyal">
             <Card className="p-8 border-none shadow-sm rounded-3xl">
               <h3 className="text-lg font-bold mb-8">Dijital Varlıklar</h3>
               <div className="grid grid-cols-2 gap-8">
                 <div className="flex items-center gap-4 p-4 border rounded-2xl">
                    <Linkedin className="w-6 h-6 text-[#0077b5]" />
                    <Input placeholder="Linkedin Profil Linki" className="border-none focus-visible:ring-0 font-medium" />
                 </div>
                 <div className="flex items-center gap-4 p-4 border rounded-2xl">
                    <Globe className="w-6 h-6 text-slate-600" />
                    <Input placeholder="Kişisel Web Sitesi" className="border-none focus-visible:ring-0 font-medium" />
                 </div>
               </div>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserProfile;
