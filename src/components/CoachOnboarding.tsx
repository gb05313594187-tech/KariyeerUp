import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Phone, Briefcase, ChevronRight, Check, 
  Linkedin, Award, DollarSign, Clock, BookOpen 
} from "lucide-react";

interface CoachOnboardingProps {
  user: any;
  onComplete: () => void;
}

const CoachOnboarding: React.FC<CoachOnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    phone: "",
    role: "", 
    experience_years: "",
    bio: "",
    linkedin_url: "",
    session_price: "",
    certificates: ""
  });

  const totalSteps = 3;

  const handleUpdate = async () => {
    setLoading(true);
    
    // Veritabanı sütun isimlerinle birebir uyumlu eşleştirme
    const { error } = await supabase
      .from("profiles")
      .update({
        phone: formData.phone,
        role: formData.role, // Uzmanlık alanı
        bio: formData.bio,
        session_price: parseInt(formData.session_price) || 0,
        experience_years: formData.experience_years,
        linkedin_url: formData.linkedin_url,
        // Sertifikaları virgülle ayırıp dizi olarak gönderiyoruz (jsonb desteği için)
        certificates: formData.certificates ? formData.certificates.split(',').map(s => s.trim()) : [],
        is_approved: false, // Yönetici onayı bekliyor
        updated_at: new Date()
      })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      toast.error("Profil güncellenirken bir hata oluştu.");
    } else {
      toast.success("Harika! Profilin oluşturuldu, şimdi onay bekliyor.");
      onComplete();
    }
    setLoading(false);
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[999] p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl my-auto">
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-white/5">
          <div 
            className="h-full bg-rose-600 transition-all duration-700 ease-out" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter italic leading-none">
              Kariyere <span className="text-rose-600">Başla</span>
            </h2>
            <p className="text-zinc-500 text-sm mt-3 font-medium uppercase tracking-widest">
              Adım {step} / {totalSteps} — Profesyonel Bilgiler
            </p>
          </div>

          {/* Adım 1: İletişim ve Uzmanlık */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group space-y-2">
                  <label className="text-[11px] uppercase font-black text-zinc-400 tracking-[0.2em] ml-1">Telefon Numarası</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 size-5 group-focus-within:text-rose-600 transition-colors" />
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl h-16 pl-14 pr-6 text-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all font-medium"
                      placeholder="+90 5XX XXX XX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="group space-y-2">
                  <label className="text-[11px] uppercase font-black text-zinc-400 tracking-[0.2em] ml-1">Uzmanlık Alanı</label>
                  <div className="relative">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 size-5 group-focus-within:text-rose-600 transition-colors" />
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl h-16 pl-14 pr-6 text-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all font-medium"
                      placeholder="Örn: Yönetici Koçu"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <button onClick={nextStep} className="w-full bg-rose-600 h-16 rounded-2xl text-white font-black uppercase italic tracking-widest hover:bg-rose-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-rose-600/20 active:scale-[0.98]">
                İleri Git <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Adım 2: Deneyim ve Bio */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-2 group">
                <label className="text-[11px] uppercase font-black text-zinc-400 tracking-[0.2em] ml-1 text-rose-600">Hakkında & Yaklaşım (AI İçin Önemli)</label>
                <textarea 
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all resize-none font-medium leading-relaxed"
                  placeholder="Danışanlarınıza nasıl yardımcı oluyorsunuz? Metodolojiniz nedir?"
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="relative">
                   <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 size-5" />
                   <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-16 pl-14 pr-6 text-white focus:border-rose-600 outline-none"
                    placeholder="Seans (₺)"
                    type="number"
                    onChange={(e) => setFormData({...formData, session_price: e.target.value})}
                  />
                </div>
                <div className="relative">
                   <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 size-5" />
                   <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-16 pl-14 pr-6 text-white focus:border-rose-600 outline-none"
                    placeholder="Deneyim Yılı"
                    onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                  />
                </div>
              </div>
              <button onClick={nextStep} className="w-full bg-rose-600 h-16 rounded-2xl text-white font-black uppercase italic tracking-widest hover:bg-rose-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                Son Adıma Geç <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Adım 3: Kanıtlar ve Sosyal Medya */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="group space-y-2">
                <label className="text-[11px] uppercase font-black text-zinc-400 tracking-[0.2em] ml-1">LinkedIn Profili</label>
                <div className="relative">
                  <Linkedin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 size-5 group-focus-within:text-rose-600" />
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-16 pl-14 text-white focus:border-rose-600 outline-none transition-all"
                    placeholder="linkedin.com/in/kullaniciadi"
                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  />
                </div>
              </div>
              <div className="group space-y-2">
                <label className="text-[11px] uppercase font-black text-zinc-400 tracking-[0.2em] ml-1">Sertifikalar</label>
                <div className="relative">
                  <Award className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 size-5 group-focus-within:text-rose-600" />
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-16 pl-14 text-white focus:border-rose-600 outline-none transition-all"
                    placeholder="Örn: ICF, EMCC, PCC (Virgülle ayırın)"
                    onChange={(e) => setFormData({...formData, certificates: e.target.value})}
                  />
                </div>
              </div>
              
              <button 
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase italic tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Veriler İşleniyor..." : (
                  <>Kaydı Tamamla <Check size={20} /></>
                )}
              </button>
            </div>
          )}

          <p className="text-center text-[10px] text-zinc-600 uppercase tracking-[0.3em] mt-8 font-bold">
            KariyeerUP • Global Coach Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoachOnboarding;
