import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Target, Trophy, Zap, MapPin, Camera, Globe, Briefcase, 
  GraduationCap, Edit3, Save, X, CheckCircle2, Award, 
  Star, Share2, ChevronRight, Download, Image as ImageIcon,
  FileText, ShieldCheck, Mail, Phone, Link as LinkIcon, 
  Linkedin, Twitter, Plus, Trash2, Languages, Heart, MousePointer2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
    const { error } = await supabase.from("profiles").update(formData).eq("id", profile.id);
    if (!error) {
      setProfile(formData);
      setIsEditing(false);
      toast.success("Europass verileriniz senkronize edildi.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black tracking-tighter italic">UNICORN LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* HEADER & NAV GİBİ ÜST KISIMLAR ÖNCEKİ KODDAKİ GİBİ KALACAK */}
      <div className="h-48 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C62828]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-8 relative z-10">
          <div className="flex justify-between items-end w-full">
            <div className="flex gap-6 items-end">
                <div className="w-32 h-32 rounded-[2rem] border-4 border-white shadow-2xl bg-slate-100 overflow-hidden">
                  <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name}`} className="w-full h-full object-cover" />
                </div>
                <div className="mb-2">
                    <h1 className="text-4xl font-black text-white italic tracking-tighter">{profile?.full_name}</h1>
                    <p className="text-[#C62828] font-bold uppercase text-[10px] tracking-[0.3em]">{profile?.title || "International Professional"}</p>
                </div>
            </div>
            <div className="flex gap-4">
               <Button onClick={() => setIsEditing(!isEditing)} className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-white text-black hover:bg-slate-100"}>
                 {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                 {isEditing ? "SİSTEMİ GÜNCELLE" : "EUROPASS DÜZENLE"}
               </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <Tabs defaultValue="europass" className="space-y-12">
          <TabsList className="bg-white border p-1 rounded-2xl w-fit shadow-sm">
            <TabsTrigger value="europass" className="rounded-xl px-10 font-black text-xs">EUROPASS CV ENGINE</TabsTrigger>
            <TabsTrigger value="portfolio" className="rounded-xl px-10 font-black text-xs">PORTFOLIO</TabsTrigger>
          </TabsList>

          {/* 🇪🇺 EUROPASS CV ENGINE CONTENT */}
          <TabsContent value="europass" className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            
            <div className="grid grid-cols-12 gap-8">
              
              {/* SOL KOLON: KİŞİSEL VERİ VE DİLLER */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-[#C62828]" /> Dil Yetkinlikleri
                  </h3>
                  <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2"><span className="text-sm font-bold italic">Türkçe</span> <Badge variant="secondary">Ana Dil</Badge></div>
                        <Progress value={100} className="h-1 bg-slate-100 [&>div]:bg-slate-900" />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2"><span className="text-sm font-bold italic">İngilizce</span> <Badge variant="outline" className="text-[#C62828]">C1 - Professional</Badge></div>
                        <Progress value={85} className="h-1 bg-slate-100 [&>div]:bg-[#C62828]" />
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 bg-[#C62828] rounded-bl-[2rem] font-black text-[10px] tracking-widest">EU</div>
                   <h3 className="text-xs font-black uppercase tracking-widest mb-6">Dijital Beceriler</h3>
                   <div className="flex flex-wrap gap-2">
                      {["Project Management", "FinTech", "SaaS Strategy", "Agile", "UI/UX Design"].map(skill => (
                        <span key={skill} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold border border-white/10 hover:border-[#C62828] transition-colors">{skill}</span>
                      ))}
                   </div>
                </Card>
              </div>

              {/* SAĞ KOLON: DENEYİM VE EĞİTİM (TAM FORM) */}
              <div className="col-span-12 lg:col-span-8 space-y-8">
                
                {/* İŞ DENEYİMİ BÖLÜMÜ */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-xl font-black italic flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-[#C62828]" /> İş Deneyimi
                    </h2>
                    {isEditing && <Button size="sm" variant="outline" className="rounded-xl border-dashed"><Plus className="w-4 h-4 mr-2" /> Deneyim Ekle</Button>}
                  </div>

                  {/* ÖRNEK DENEYİM KARTI (FORM HALİ) */}
                  <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-xl transition-all duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Pozisyon / Ünvan</label>
                        <Input disabled={!isEditing} defaultValue="Senior Executive Coach" className="border-slate-100 rounded-xl font-bold bg-slate-50 focus:bg-white transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">İşveren / Şirket</label>
                        <Input disabled={!isEditing} defaultValue="KariyeerUP Global" className="border-slate-100 rounded-xl font-bold bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Şehir / Ülke</label>
                        <Input disabled={!isEditing} defaultValue="Londra, Birleşik Krallık" className="border-slate-100 rounded-xl font-bold bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Tarih Aralığı</label>
                        <Input disabled={!isEditing} defaultValue="Ocak 2021 - Günümüz" className="border-slate-100 rounded-xl font-bold bg-slate-50" />
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Ana Sorumluluklar ve Başarılar</label>
                        <Textarea disabled={!isEditing} defaultValue="Üst düzey yöneticilere liderlik gelişimi ve stratejik yönetim konularında koçluk desteği sağlamak. Global ağın genişletilmesi ve dijital dönüşüm süreçlerinin yönetimi." className="border-slate-100 rounded-xl min-h-[100px] font-medium leading-relaxed bg-slate-50" />
                      </div>
                    </div>
                  </Card>
                </section>

                {/* EĞİTİM VE ÖĞRETİM BÖLÜMÜ */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-xl font-black italic flex items-center gap-3">
                      <GraduationCap className="w-6 h-6 text-[#C62828]" /> Eğitim ve Öğretim
                    </h2>
                    {isEditing && <Button size="sm" variant="outline" className="rounded-xl border-dashed"><Plus className="w-4 h-4 mr-2" /> Eğitim Ekle</Button>}
                  </div>

                  <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Eğitim Seviyesi / Alanı</label>
                        <Input disabled={!isEditing} defaultValue="Yüksek Lisans - İşletme Yönetimi (MBA)" className="border-slate-100 rounded-xl font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Kurum / Üniversite</label>
                        <Input disabled={!isEditing} defaultValue="Stanford University" className="border-slate-100 rounded-xl font-bold" />
                      </div>
                    </div>
                  </Card>
                </section>

                {/* SERTİFİKALAR (DİNAMİK GALERİ) */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-xl font-black italic flex items-center gap-3">
                      <Award className="w-6 h-6 text-[#C62828]" /> Sertifikalar & Onaylar
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[1, 2].map(i => (
                      <div key={i} className="group relative aspect-[4/3] bg-white rounded-[2rem] border shadow-sm overflow-hidden flex flex-col items-center justify-center p-6 text-center hover:border-[#C62828] transition-all">
                        <Trophy className="w-10 h-10 text-yellow-500 mb-4" />
                        <h4 className="text-[10px] font-black uppercase leading-tight">Advanced Global Leadership Certification</h4>
                        <p className="text-[8px] font-bold text-slate-400 mt-2">ID: 48593-EU</p>
                        {isEditing && <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-red-400"><Trash2 className="w-4 h-4" /></Button>}
                      </div>
                    ))}
                    <div className="aspect-[4/3] border-4 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all group">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="text-slate-400 group-hover:text-[#C62828]" />
                      </div>
                      <span className="text-[9px] font-black uppercase text-slate-400 mt-4 tracking-widest">Belge Ekle</span>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </TabsContent>

          {/* PORTFOLIO CONTENT (DİNAMİK MASONRY) */}
          <TabsContent value="portfolio" className="h-96 flex flex-col items-center justify-center border-4 border-dashed rounded-[3rem] bg-white">
             <MousePointer2 className="w-12 h-12 text-slate-200 mb-4 animate-bounce" />
             <p className="text-xl font-black italic text-slate-400 uppercase tracking-tighter">Proje Galerisi Yakında...</p>
          </TabsContent>
        </Tabs>
      </main>

      {/* 🔮 EUROPASS SMART CV DOWNLOAD BAR */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] no-print">
        <div className="bg-slate-950/95 backdrop-blur-2xl px-10 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-8 border border-white/10 ring-4 ring-[#C62828]/10">
           <div className="flex flex-col">
             <span className="text-white font-black italic text-sm tracking-tight">Europass Engine v2.0</span>
             <span className="text-[#C62828] text-[8px] font-black uppercase tracking-[0.4em]">Ready for EU Standards</span>
           </div>
           <div className="w-px h-8 bg-white/10" />
           <Button onClick={() => window.print()} className="bg-[#C62828] hover:bg-[#a31f1f] text-white rounded-2xl font-black px-10 h-12 shadow-xl shadow-red-900/20 active:scale-95 transition-all">
              OFFICIAL EUROPASS CV (.PDF)
           </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
