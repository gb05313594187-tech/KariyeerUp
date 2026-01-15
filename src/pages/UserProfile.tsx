import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Target, Trophy, Zap, MapPin, Camera, Globe, Briefcase, 
  GraduationCap, Edit3, Save, X, CheckCircle2, Award, 
  Star, Share2, ChevronRight, Download, Image as ImageIcon,
  FileText, ShieldCheck, Mail, Phone, Link as LinkIcon, 
  Linkedin, Twitter, Plus, Trash2, MoreHorizontal, Eye,
  BarChart3, Settings, Rocket, ShieldAlert, Cpu
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// --- TİPLEMELER ---
interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState("overview");

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
      console.error("Data Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const promise = supabase.from("profiles").update(formData).eq("id", profile.id);
    toast.promise(promise, {
      loading: 'Unicorn veri motoru güncelleniyor...',
      success: () => {
        setProfile(formData);
        setIsEditing(false);
        return 'Profil evrensel olarak güncellendi.';
      },
      error: 'Senkronizasyon hatası.',
    });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-[#C62828] rounded-full animate-spin" />
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">Initializing Professional Core...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9]/50 pb-20 font-sans antialiased text-slate-900">
      
      {/* 🚀 DİNAMİK EXECUTIVE HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">K</div>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 py-1 px-3 rounded-lg flex gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mt-1" /> Verified Expert
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50">
              <Eye className="w-4 h-4 mr-2" /> Kamu Görünümü
            </Button>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)} variant="ghost" className="rounded-xl font-bold text-slate-400">İPTAL</Button>
                <Button onClick={handleSave} className="bg-slate-900 hover:bg-black text-white rounded-xl px-8 font-bold shadow-xl shadow-slate-200 transition-all active:scale-95">
                  <Save className="w-4 h-4 mr-2" /> DEĞİŞİKLİKLERİ YAYINLA
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-[#C62828] hover:bg-[#a31f1f] text-white rounded-xl px-8 font-bold shadow-xl shadow-red-100 transition-all active:scale-95">
                <Edit3 className="w-4 h-4 mr-2" /> PROFİLİ YÖNET
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 mt-8">
        <div className="grid grid-cols-12 gap-8">
          
          {/* 🧩 SOL PANEL: KİŞİSEL KART (APPLE STYLE) */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-950 relative">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              </div>
              <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-6">
                  <div className="w-32 h-32 rounded-[2rem] border-[6px] border-white shadow-xl overflow-hidden bg-slate-100 group">
                    <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name}`} className="w-full h-full object-cover" />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="text-white w-6 h-6" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    {profile?.full_name} <ShieldCheck className="w-5 h-5 text-blue-500" />
                  </h2>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] italic">
                    {profile?.title || "EXECUTIVE ADVISOR"}
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Profil Doluluğu</span>
                    <span className="text-xs font-black text-[#C62828]">85%</span>
                  </div>
                  <Progress value={85} className="h-1.5 bg-slate-100 [&>div]:bg-[#C62828]" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-4 bg-slate-50 rounded-2xl text-center">
                    <p className="text-xl font-black italic">1.2k</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Görüntülenme</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl text-center">
                    <p className="text-xl font-black italic">48</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Mentörlük</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative">
              <Zap className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#C62828] mb-6 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> AI Kariyer Analizi
              </h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed mb-6">
                Mevcut profilin "Üst Düzey Yönetici" rolleri için %92 uyumluluk gösteriyor.
              </p>
              <Button className="w-full bg-white/10 hover:bg-white/20 border-white/10 rounded-xl font-bold py-6">
                RAPORU GÖRÜNTÜLE
              </Button>
            </Card>
          </aside>

          {/* 🛠 SAĞ PANEL: ANA EDİTÖR & DASHBOARD */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* TABS SİSTEMİ (STRIPE STYLE) */}
            <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-transparent h-auto p-0 gap-8 border-b border-slate-200 w-full justify-start rounded-none">
                <TabsTrigger value="overview" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#C62828] data-[state=active]:text-[#C62828] rounded-none px-0 py-4 font-black text-xs uppercase tracking-widest transition-all">GENEL BAKIŞ</TabsTrigger>
                <TabsTrigger value="experience" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#C62828] data-[state=active]:text-[#C62828] rounded-none px-0 py-4 font-black text-xs uppercase tracking-widest transition-all">DENEYİM & EĞİTİM</TabsTrigger>
                <TabsTrigger value="credentials" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#C62828] data-[state=active]:text-[#C62828] rounded-none px-0 py-4 font-black text-xs uppercase tracking-widest transition-all">SERTİFİKALAR</TabsTrigger>
                <TabsTrigger value="settings" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#C62828] data-[state=active]:text-[#C62828] rounded-none px-0 py-4 font-black text-xs uppercase tracking-widest transition-all">HESAP AYARLARI</TabsTrigger>
              </TabsList>

              {/* OVERVIEW CONTENT */}
              <TabsContent value="overview" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-10 border-none shadow-sm rounded-[2.5rem] bg-white">
                  <div className="flex justify-between items-start mb-8">
                    <h3 className="text-xl font-black italic tracking-tight">Executive Manifesto</h3>
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center"><BarChart3 className="w-4 h-4 text-slate-300" /></div>
                  </div>
                  {isEditing ? (
                    <Textarea 
                      className="text-2xl font-bold italic bg-slate-50 border-none rounded-2xl min-h-[120px] p-6 focus-visible:ring-1 focus-visible:ring-[#C62828]"
                      value={formData.manifesto}
                      onChange={e => setFormData({...formData, manifesto: e.target.value})}
                      placeholder="Vizyonunuzu dünya ile paylaşın..."
                    />
                  ) : (
                    <p className="text-3xl font-black italic text-slate-800 leading-tight tracking-tighter">
                      "{profile?.manifesto || "Geleceği inşa etmek, bugünü doğru yönetmekten geçer."}"
                    </p>
                  )}
                </Card>

                <div className="grid grid-cols-2 gap-8">
                   <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C62828] mb-6">İletişim Hub</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <Input disabled={!isEditing} value={formData.email} className="bg-transparent border-none p-0 h-auto font-bold text-sm" />
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <Input disabled={!isEditing} value={formData.phone} className="bg-transparent border-none p-0 h-auto font-bold text-sm" />
                        </div>
                      </div>
                   </Card>

                   <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C62828] mb-6">Sosyal Otorite</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                          <Linkedin className="w-4 h-4 text-[#0077b5]" />
                          <Input disabled={!isEditing} placeholder="linkedin.com/in/..." className="bg-transparent border-none p-0 h-auto font-bold text-sm" />
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                          <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                          <Input disabled={!isEditing} placeholder="twitter.com/..." className="bg-transparent border-none p-0 h-auto font-bold text-sm" />
                        </div>
                      </div>
                   </Card>
                </div>
              </TabsContent>

              {/* EXPERIENCE CONTENT (ADVANCED LIST) */}
              <TabsContent value="experience" className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-black italic">Profesyonel Geçmiş</h3>
                  <Button variant="outline" className="rounded-xl border-slate-200 font-bold bg-white shadow-sm">
                    <Plus className="w-4 h-4 mr-2" /> YENİ DENEYİM
                  </Button>
                </div>

                {[1, 2].map((i) => (
                  <Card key={i} className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-md transition-all">
                    <div className="flex gap-6">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                        <Briefcase className="w-8 h-8 text-slate-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-black tracking-tight">Global Director of Operations</h4>
                            <p className="text-sm font-bold text-[#C62828]">Tech Unicorn Inc. • 2020 - Halen</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="rounded-lg"><Edit3 className="w-4 h-4" /></Button>
                            <Button size="icon" variant="ghost" className="rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                        <p className="mt-4 text-slate-500 text-sm leading-relaxed font-medium">
                          150+ kişilik ekibin yönetimi ve yıllık 50M$ bütçe operasyonlarının dijital dönüşüm süreçlerini yönettim. 
                          Stratejik planlama ve çevik metodolojiler ile verimlilikte %40 artış sağlandı.
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* CREDENTIALS CONTENT (GALLERY) */}
              <TabsContent value="credentials" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-3 gap-6">
                  <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center group cursor-pointer hover:bg-white hover:border-[#C62828] transition-all">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="text-[#C62828]" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sertifika Yükle</p>
                  </div>
                  {[1, 2].map(i => (
                    <Card key={i} className="aspect-square border-none shadow-sm rounded-[2rem] bg-white p-6 flex flex-col justify-between group overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-6">
                         <Button className="w-full bg-white text-black font-black text-xs rounded-xl">DOSYAYI GÖR</Button>
                      </div>
                      <Trophy className="w-10 h-10 text-yellow-500" />
                      <div>
                        <h5 className="font-black text-sm leading-tight mb-1">Advanced Executive Coaching</h5>
                        <p className="text-[10px] font-bold text-slate-400">Harvard Business School • 2023</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </main>

      {/* 🔮 FLOATING GLOBAL ACTION BAR (UNIVERSE STYLE) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] no-print">
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-[2rem] shadow-2xl flex items-center gap-6">
           <div className="flex -space-x-3">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold italic">GP</div>
             ))}
           </div>
           <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Ağındaki 42 lider seni izliyor</p>
           <div className="w-px h-6 bg-white/10" />
           <Button onClick={() => window.print()} size="sm" className="bg-[#C62828] hover:bg-[#a31f1f] text-white rounded-xl font-black text-[10px] h-10 px-6">
              EXECUTIVE CV İNDİR (.PDF)
           </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
