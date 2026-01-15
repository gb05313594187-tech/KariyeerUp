import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Target, Trophy, Zap, MapPin, Camera, 
  Globe, Briefcase, GraduationCap, Edit3, Save, X, CheckCircle2,
  Award, Star, Share2, ChevronRight, Download, Image as ImageIcon,
  FileText, ShieldCheck, Mail, Phone
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
      console.error("Profil yüklenirken hata:", error);
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
      toast.success("Profil ve CV verileriniz başarıyla güncellendi!");
    } catch (error) {
      toast.error("Güncelleme başarısız oldu.");
    }
  };

  const handleDownloadCV = () => {
    // Tarayıcının yazdırma fonksiyonunu kullanarak profesyonel PDF çıktısı alır.
    // @media print CSS kuralları aşağıda tanımlanmıştır.
    window.print();
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#C62828] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white font-black tracking-widest animate-pulse">KARIYEERUP PREPARING...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] print:bg-white">
      {/* 🛠 PDF & PRINT CSS: CV Formatını Uluslararası Standartlara Getirir */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          nav, footer, .no-print, button { display: none !important; }
          .print-only { display: block !important; }
          body { font-size: 11pt; color: black; background: white !important; }
          .card-shadow { box-shadow: none !important; border: 1px solid #eee !important; border-radius: 0 !important; }
          .bg-slate-950 { background: white !important; color: black !important; border-bottom: 3px solid #C62828 !important; height: auto !important; padding: 20px 0 !important; }
          .text-white { color: black !important; }
          .main-grid { display: block !important; }
          .aside-col { width: 100% !important; margin-bottom: 20px; }
          .content-col { width: 100% !important; }
          .manifesto-text { font-size: 18pt !important; line-height: 1.2 !important; }
        }
      `}} />

      {/* HEADER SECTION (Dijital Görünüm) */}
      <header className="relative h-[400px] bg-slate-950 overflow-hidden no-print">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C62828]/40 via-black/90 to-black z-0" />
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-10">
            <div className="relative group">
              <div className="w-48 h-48 rounded-[2.5rem] border-8 border-white/10 shadow-2xl overflow-hidden bg-white">
                <img 
                  src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name}`} 
                  className="w-full h-full object-cover" 
                  alt={profile?.full_name} 
                />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h1 className="text-6xl font-black text-white tracking-tighter italic">
                {isEditing ? (
                  <Input 
                    className="bg-white/10 text-white border-white/20 text-4xl h-16 rounded-2xl" 
                    value={formData.full_name} 
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                  />
                ) : profile?.full_name}
              </h1>
              <div className="flex items-center gap-4 text-[#C62828] font-black tracking-[0.3em] uppercase text-sm">
                <ShieldCheck className="w-5 h-5" />
                {isEditing ? (
                  <Input 
                    className="bg-white/5 text-white border-white/10 h-8" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Ünvan (Örn: Kariyer Koçu)"
                  />
                ) : (profile?.title || "International Career Coach")}
              </div>
            </div>

            <div className="flex gap-4 pb-2">
              <Button 
                onClick={handleDownloadCV}
                className="bg-white text-black hover:bg-slate-100 rounded-2xl px-6 h-14 font-black shadow-xl transition-transform hover:scale-105"
              >
                <Download className="mr-2 w-5 h-5" /> CV İNDİR (PDF)
              </Button>
              <Button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-[#C62828] hover:bg-[#a31f1f]'} text-white rounded-2xl px-8 h-14 font-black shadow-2xl transition-all`}
              >
                {isEditing ? <><Save className="mr-2 w-5 h-5" /> KAYDET</> : <><Edit3 className="mr-2 w-5 h-5" /> DÜZENLE</>}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 📄 PDF-ONLY CV HEADER (Yalnızca çıktı alınırken görünür) */}
      <div className="hidden print-only p-10 border-b-4 border-[#C62828] mb-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold uppercase tracking-tighter">{profile?.full_name}</h1>
            <p className="text-[#C62828] text-xl font-bold mt-2 tracking-widest">{profile?.title || "CAREER COACH"}</p>
          </div>
          <div className="text-right text-sm font-bold text-slate-500">
            <p className="flex items-center justify-end gap-2"><MapPin className="w-4 h-4" /> {profile?.city}</p>
            <p className="flex items-center justify-end gap-2 mt-1"><Briefcase className="w-4 h-4" /> {profile?.sector}</p>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 pb-24 grid grid-cols-12 gap-10 main-grid relative z-20">
        
        {/* LEFT ASIDE */}
        <aside className="col-span-12 lg:col-span-4 space-y-10 aside-col">
          {/* JOURNEY CARD */}
          <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white card-shadow">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
              <Target className="w-5 h-5 text-[#C62828]" /> Kariyer Yolculuğum
            </h2>
            <div className="space-y-10 relative before:absolute before:left-5 before:w-0.5 before:bg-slate-50 before:h-full">
              <div className="relative pl-12">
                <div className="absolute left-0 w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-black text-sm uppercase italic">KariyeerUP Doğrulaması</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Uluslararası Onaylı Profil</p>
              </div>
              <div className="relative pl-12">
                <div className="absolute left-0 w-10 h-10 bg-[#C62828] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-100 animate-pulse">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="font-black text-sm uppercase italic">Aktif Hedefler</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Üst Düzey Yönetici Mentörlüğü</p>
              </div>
            </div>
          </Card>

          {/* 🏆 SERTİFİKA GALERİSİ (SEO Etkileşim Odaklı) */}
          <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-slate-950 text-white card-shadow no-print">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-3">
              <Award className="w-5 h-5 text-yellow-400" /> Sertifika & Başarı Galerisi
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center group cursor-pointer hover:bg-white/10 transition-all">
                  <ImageIcon className="w-8 h-8 text-slate-700 group-hover:text-[#C62828] transition-colors" />
                  <span className="text-[8px] font-black mt-2 text-slate-600 uppercase">Belge Ekle</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 font-bold italic text-center mt-6">
              * Sertifikalarınız uluslararası işe alım algoritmalarına (ATS) uygun olarak indekslenir.
            </p>
          </Card>
        </aside>

        {/* RIGHT CONTENT */}
        <section className="col-span-12 lg:col-span-8 space-y-10 content-col">
          {/* MANIFESTO */}
          <Card className="p-12 border-none shadow-2xl rounded-[3rem] bg-white card-shadow relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-5 no-print"><FileText className="w-64 h-64" /></div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#C62828] mb-8">Professional Manifesto</h2>
            {isEditing ? (
              <Textarea 
                className="text-2xl font-bold italic bg-slate-50 border-none rounded-2xl h-40 p-6"
                value={formData.manifesto}
                onChange={e => setFormData({...formData, manifesto: e.target.value})}
                placeholder="Dünya görüşünüzü ve koçluk felsefenizi buraya yazın..."
              />
            ) : (
              <p className="text-4xl font-black italic text-slate-800 leading-[1.1] tracking-tighter manifesto-text">
                "{profile?.manifesto || "Sınırları zorlayan, vizyoner bir liderlik manifestosu ekleyerek etkileşiminizi 10 katına çıkarın."}"
              </p>
            )}
          </Card>

          {/* SUMMARY / CV BODY */}
          <Card className="border-none shadow-2xl rounded-[3rem] bg-white card-shadow overflow-hidden">
            <div className="bg-slate-50 px-12 py-8 border-b border-slate-100 flex justify-between items-center no-print">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Professional Executive Summary</h2>
              <Globe className="w-5 h-5 text-[#C62828]" />
            </div>
            <div className="p-12">
              {isEditing ? (
                <Textarea 
                  className="text-xl leading-relaxed text-slate-600 bg-slate-50 border-none rounded-[2rem] h-64 p-8"
                  value={formData.summary}
                  onChange={e => setFormData({...formData, summary: e.target.value})}
                  placeholder="Deneyimlerinizi, başarılarınızı ve uzmanlık alanlarınızı detaylandırın..."
                />
              ) : (
                <div className="space-y-8">
                  <p className="text-2xl leading-[1.6] text-slate-600 font-medium italic">
                    {profile?.summary || "Uluslararası geçerliliği olan, sonuç odaklı ve profesyonel bir kariyer özeti buraya gelecek."}
                  </p>
                  
                  <div className="pt-10 border-t border-slate-50 grid grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-[#C62828] tracking-[0.2em]">Primary Industry</h4>
                      <p className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">
                        {isEditing ? (
                          <Input value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} />
                        ) : (profile?.sector || "Global Business")}
                      </p>
                    </div>
                    <div className="space-y-2 text-right">
                      <h4 className="text-[10px] font-black uppercase text-[#C62828] tracking-[0.2em]">Service Location</h4>
                      <p className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">
                         {isEditing ? (
                          <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                        ) : (profile?.city || "Worldwide")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* 📄 PDF-ONLY FOOTER */}
          <div className="hidden print-only mt-20 text-center border-t border-slate-100 pt-10">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.5em]">Verified by KariyeerUP Executive Network</p>
            <div className="flex justify-center gap-10 mt-4 text-[10px] font-bold text-slate-400 uppercase">
              <span>www.kariyeerup.com</span>
              <span>Official Professional Document</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default UserProfile;
