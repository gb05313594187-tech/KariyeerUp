// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Users, Briefcase, CalendarCheck2, TrendingUp, Search,
  PlusCircle, Sparkles, ArrowRight, CheckCircle2, Clock,
  Trophy, Target, Zap, ChevronRight, Video, Mail, HelpCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import JobForm from "@/components/JobForm";

export default function CorporateDashboard() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("find_coach");
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  
  const [coaches, setCoaches] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      const { data: cData } = await supabase.from("profiles").select("*").eq("role", "coach");
      const { data: rData } = await supabase.from("corporate_session_requests").select("*").eq("corporate_user_id", auth.user?.id);
      
      setCoaches(cData?.map((c, i) => ({ ...c, ...mockMeta(i) })) || []);
      setRequests(rData || []);
    } catch (e) {
      toast.error("Veriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ JITSI ODASINA KATILMA FONKSİYONU
  const joinMeeting = (requestId: string) => {
    const roomName = `Kariyer-Session-${requestId}`;
    window.open(`https://meet.jit.si/${roomName}`, '_blank');
  };

  // ✅ RESEND / TALEBİ OLUŞTURMA VE MAİL TETİKLEME
  const handleCreateRequest = async (formData: any) => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from("corporate_session_requests").insert([{
        corporate_user_id: auth.user.id,
        coach_user_id: selectedCoach.id,
        coach_name: selectedCoach.full_name,
        goal: formData.goal,
        notes: formData.notes,
        status: "new"
      }]);

      if (error) throw error;

      // Resend Edge Function Tetikleyici (Dün kurduğumuz yapı)
      await supabase.functions.invoke('resend-email', {
        body: { 
          to: selectedCoach.email, 
          subject: "Yeni Kurumsal Seans Talebi!",
          coachName: selectedCoach.full_name 
        }
      });

      toast.success("Talep oluşturuldu ve koça bildirim gönderildi!");
      setModalOpen(false);
      bootstrap();
    } catch (e) {
      toast.error("İşlem sırasında bir hata oluştu.");
    }
  };

  // ... (Görsel Header Kısmı Parça 1'deki ile aynı kalacak)
{/* TALEPLERİM SEKMESİ - Detaylı ve Aksiyonlu */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <AnimatePresence mode="wait">
          {tab === "find_coach" ? (
             /* ... (Koç Kartları Kodları Buraya Gelecek - Önceki mesajdaki ile aynı) ... */
          ) : (
            <div className="space-y-4">
              {requests.length > 0 ? requests.map((req) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  key={req.id} 
                  className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 p-3 rounded-2xl text-[#E30613]"><Briefcase size={20} /></div>
                    <div>
                      <h4 className="font-bold text-gray-800">{req.coach_name}</h4>
                      <p className="text-xs text-gray-500">{req.goal} • {new Date(req.created_at).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* ✅ MÜLAKAT SORULARI (TOOLTIP GİBİ VEYA MODAL AÇAR) */}
                    <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 rounded-xl">
                      <HelpCircle className="mr-2 h-4 w-4" /> Örnek Sorular
                    </Button>

                    {/* ✅ JITSI BUTONU (Sadece Onaylılarda Aktif Olabilir) */}
                    <Button 
                      onClick={() => joinMeeting(req.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                    >
                      <Video className="mr-2 h-4 w-4" /> Görüşmeye Katıl
                    </Button>

                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                      req.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {req.status}
                    </div>
                  </div>
                </motion.div>
              )) : (
                /* Boş Liste Uyarısı */
                <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                  <p className="text-gray-400">Henüz bir talebiniz bulunmuyor.</p>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      <JobForm 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        selectedCoach={selectedCoach} 
        onSubmit={handleCreateRequest} // Artık handleCreateRequest'i kullanıyor
      />
    </div>
  );
}

// ... (mockMeta fonksiyonu sonuna eklenir)
