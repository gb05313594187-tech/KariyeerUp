// @ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle2, ShieldCheck, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function PremiumBoostModal({ postId, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Burada normalde Stripe/iyzico API çağrılır. 
    // Şimdilik Unicorn hızında başarılı simülasyonu yapıyoruz.
    setTimeout(async () => {
      const { error } = await supabase.rpc('boost_post_to_premium', { target_post_id: postId });
      
      if (!error) {
        toast.success("Ödeme Başarılı! İlanın şimdi zirvede 🚀");
        onSuccess();
        onClose();
      } else {
        toast.error("İşlem sırasında bir hata oluştu.");
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-br from-[#E63946] to-[#D62828] p-8 text-white text-center">
          <Rocket size={48} className="mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-black tracking-tighter">PREMIUM BOOST</h2>
          <p className="opacity-80 font-medium">İlanını 100.000+ adaya anında ulaştır.</p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
              <CheckCircle2 className="text-green-500" size={18} /> AI Algoritmasında %500 Öncelik
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
              <CheckCircle2 className="text-green-500" size={18} /> "Sponsorlu" Rozeti ve Özel Tasarım
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
              <CheckCircle2 className="text-green-500" size={18} /> Haftalık Performans Raporu
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-400 uppercase text-xs">Toplam Tutar</span>
              <span className="text-2xl font-black text-gray-900">₺499,00</span>
            </div>
            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white h-14 rounded-2xl font-black text-lg flex gap-2 transition-all active:scale-95"
            >
              {loading ? "İşleniyor..." : <><CreditCard /> Şimdi Öde</>}
            </Button>
          </div>

          <p className="text-[10px] text-center text-gray-400 font-medium">
            <ShieldCheck size={12} className="inline mr-1" /> 256-bit SSL Güvenli Ödeme Altyapısı
          </p>
        </div>
      </div>
    </div>
  );
}
