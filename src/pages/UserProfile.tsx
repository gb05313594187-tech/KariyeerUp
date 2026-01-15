import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Supabase istemcinizin yolu
import { 
  Target, Trophy, Zap, MapPin, Camera, 
  Globe, Briefcase, GraduationCap, Link as LinkIcon,
  CheckCircle2, Plus, Trash2, Edit3
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error("Profil yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* ÜST HEADER / KAPAK ALANI */}
      <div className="h-64 bg-gradient-to-r from-[#C62828] to-[#911f1f] w-full" />
      
      <div className="max-w-7xl mx-auto px-6 -mt-32">
        <div className="grid grid-cols-12 gap-8">
          
          {/* ORTA PANEL: ANA KİMLİK & FOTOĞRAF */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <Card className="p-8 border-none shadow-2xl bg-white rounded-[2.5rem] relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                {/* Fotoğraf Bölümü */}
                <div className="relative group">
                  <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl transition-transform group-hover:scale-105 duration-500">
                    <img 
                      src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                      className="w-full h-full object-cover"
                      alt="Profile" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Temel Bilgiler & Manifesto */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                      {profile?.full_name || "İsimsiz Kullanıcı"}
                    </h1>
                    <p className="text-[#C62828] font-bold tracking-widest uppercase text-sm mt-1">
                      {profile?.title || "Ünvan Belirtilmemiş"} • {profile?.sector || "Sektör"}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 text-sm">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile?.city || "Şehir"}</span>
                    <span className="flex items-center gap-1"><LinkIcon className="w-4 h-4" /> LinkedIn</span>
                  </div>

                  <p className="text-xl text-slate-600 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-4 py-2">
                    "{profile?.manifesto || "Kariyer yolculuğunuzun özeti olan o güçlü vizyon cümlesini buraya ekleyin."}"
                  </p>
                </div>
              </div>
            </Card>

            {/* ULUSLARARASI CV / HAKKINDA BÖLÜMÜ */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-[#C62828]" />
                  <h2 className="text-lg font-bold">Profesyonel Özet & Deneyim</h2>
                </div>
                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 rounded-full text-xs">
                  PDF Olarak İndir
                </Button>
              </div>
              <div className="p-8 space-y-10">
                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Professional Summary</h3>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {profile?.summary || "Global standartlarda bir yönetici özeti ekleyerek koçların sizi tanımasını sağlayın."}
                  </p>
                </section>

                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Education & Certifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                      <div className="bg-white p-2 rounded-xl shadow-sm"><GraduationCap className="w-5 h-5 text-[#C62828]" /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Eğitim Bilgisi</h4>
                        <p className="text-xs text-slate-500">Henüz eklenmemiş</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </Card>
          </div>

          {/* SAĞ PANEL: HEDEFLER & SÜPER GÜÇLER */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* KARİYER YOLCULUĞU (MILESTONES) */}
            <Card className="p-6 border-none shadow-xl bg-white rounded-[2.5rem]">
              <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-widest">
                <Target className="w-4 h-4 text-[#C62828]" /> Kariyer Yolculuğum
              </h3>
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:to-transparent">
                
                {/* Örnek Geçmiş Başarı */}
                <div className="relative flex items-center group">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 border-4 border-white shadow-sm z-10">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs font-bold text-slate-900">Geçmiş Başarı Ekleyin</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Tamamlandı</p>
                  </div>
                </div>

                {/* Örnek Aktif Hedef */}
                <div className="relative flex items-center group">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 border-4 border-white shadow-sm z-10">
                    <div className="h-2 w-2 rounded-full bg-[#C62828] animate-ping" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs font-bold text-slate-900 italic">Aktif Hedef Belirleyin</h4>
                    <p className="text-[10px] text-[#C62828] font-bold uppercase tracking-tighter">Koçluk Hedefi</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* SUPERPOWERS KARTI */}
            <Card className="p-6 border-none shadow-2xl bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C62828] opacity-10 blur-[50px]" />
              <h3 className="text-xs font-black mb-6 flex items-center gap-2 uppercase tracking-[0.2em] text-slate-400">
                <Zap className="w-4 h-4 text-yellow-400" /> Süper Güçlerim
              </h3>
              <div className="space-y-3">
                {profile?.superpowers?.map((power: string, i: number) => (
                  <div key={i} className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex justify-between items-center">
                    <span className="text-sm font-bold tracking-wide">{power}</span>
                    <Trophy className="w-4 h-4 text-slate-600 group-hover:text-yellow-400 transition-colors" />
                  </div>
                ))}
                <button className="w-full p-3 rounded-2xl border-2 border-dashed border-white/10 text-white/40 text-xs font-bold hover:bg-white/5 transition-all">
                  + Yeni Güç Ekle
                </button>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
