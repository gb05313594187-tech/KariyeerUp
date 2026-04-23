// src/pages/MyInterviews.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar as CalendarIcon, ShieldCheck, Sparkles } from "lucide-react";

export default function MyInterviewsPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Gelişim Seanslarını Çek
    async function loadInterviews() {
      const { data } = await supabase
        .from("interviews")
        .select("*, jobs(position, company_id)")
        .eq("candidate_id", user.id)
        .order("scheduled_at", { ascending: true });
      setInterviews(data || []);
    }

    loadInterviews();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* ÜST YASAL BİLGİLENDİRME */}
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-3">
        <ShieldCheck className="text-orange-600 h-5 w-5 shrink-0" />
        <p className="text-[11px] text-orange-800 font-bold uppercase tracking-tight">
          Bu sayfadaki görüşmeler kariyer mentorluğu ve yetkinlik değerlendirme seanslarıdır. Kariyeer.com bir istihdam bürosu değildir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === ORTA ALAN: SEANS LİSTESİ === */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-black flex items-center gap-2 text-slate-900 uppercase italic tracking-tighter">
            <Sparkles className="text-orange-600" /> Gelişim Seanslarım
          </h2>

          <div className="space-y-4">
            {interviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                <Video className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                <p className="text-slate-500 font-medium">Planlanmış bir gelişim seansınız bulunmuyor.</p>
              </div>
            ) : (
              interviews.map(inv => (
                <Card key={inv.id} className="border-l-4 border-l-orange-500 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-black text-lg text-slate-800">{inv.jobs?.position || "Gelişim Programı"}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Online Mentorluk Görüşmesi</p>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-slate-900">
                          {new Date(inv.scheduled_at).toLocaleDateString("tr-TR")}
                        </div>
                        <div className="text-sm text-orange-600 font-black">
                          {new Date(inv.scheduled_at).toLocaleTimeString("tr-TR", {hour:'2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                    
                    {inv.meeting_link && (
                      <a href={inv.meeting_link} target="_blank" rel="noreferrer">
                        <Button className="w-full bg-slate-900 hover:bg-black text-white gap-2 h-12 rounded-xl font-bold uppercase text-xs tracking-widest transition-all active:scale-[0.98]">
                          <Video size={16} /> Seans Odasına Katıl
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* === SAĞ ALAN: MİNİ TAKVİM WIDGET === */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-white border border-slate-100 rounded-3xl shadow-sm sticky top-20">
            <CardHeader className="pb-2 border-b border-slate-50">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-400">
                <CalendarIcon className="w-4 h-4 text-orange-500" /> Seans Takvimi
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="bg-slate-50 rounded-2xl p-5 text-center text-[11px] text-slate-500 font-medium leading-relaxed">
                Tüm kariyer mentorluğu ve değerlendirme seanslarınız bu alanda kronolojik olarak listelenir.
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
