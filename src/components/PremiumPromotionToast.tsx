import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Trophy, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface PremiumPromotionToastProps {
  coachId: string;
  coachName: string;
  isPremium: boolean;
}

export function PremiumPromotionToast({ coachId, coachName, isPremium }: PremiumPromotionToastProps) {
  const { language } = useLanguage();
  const [hasShown, setHasShown] = useState(false);

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return en;
      case 'fr': return fr;
      default: return tr;
    }
  };

  useEffect(() => {
    // Don't show for premium coaches
    if (isPremium) return;

    // Check if user has dismissed this notification today
    const storageKey = `premium-toast-${coachId}`;
    const lastShown = localStorage.getItem(storageKey);
    const today = new Date().toDateString();

    if (lastShown === today || hasShown) return;

    // Show toast after 2 seconds
    const timer = setTimeout(() => {
      toast.custom(
        (t) => (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg shadow-xl p-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-400 p-2 rounded-full">
                <Sparkles className="h-5 w-5 text-yellow-900" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 mb-1 flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  {getNavText('Profilinizi Öne Çıkarın!', 'Highlight Your Profile!', 'Mettez votre profil en avant!')}
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  {getNavText(
                    'Premium üyelikle profiliniz daha fazla görünür olsun, daha çok danışana ulaşın!',
                    'Get more visibility with Premium membership and reach more clients!',
                    'Obtenez plus de visibilité avec l\'adhésion Premium et atteignez plus de clients!'
                  )}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold"
                    onClick={() => {
                      toast.dismiss(t);
                      window.location.href = '/dashboard';
                    }}
                  >
                    {getNavText('Detayları Gör', 'View Details', 'Voir les détails')}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-600"
                    onClick={() => {
                      localStorage.setItem(storageKey, today);
                      toast.dismiss(t);
                    }}
                  >
                    {getNavText('Bir daha gösterme', 'Don\'t show again', 'Ne plus afficher')}
                  </Button>
                </div>
              </div>
              <button
                onClick={() => toast.dismiss(t)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ),
        {
          duration: 7000,
          position: 'top-right',
        }
      );
      
      setHasShown(true);
      localStorage.setItem(storageKey, today);
    }, 2000);

    return () => clearTimeout(timer);
  }, [coachId, isPremium, hasShown, language]);

  return null;
}