import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import {
  Check,
  Crown,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Star,
  Award,
  CheckCircle,
  X,
  AlertCircle
} from 'lucide-react';

export default function Pricing() {
  const { language } = useLanguage();
  const { user, supabaseUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return en;
      case 'fr': return fr;
      default: return tr;
    }
  };

  const handleSubscribe = async (type: 'blue_badge' | 'gold_badge', price: number) => {
    // ... (TÜM KODUN AYNI – HİÇBİR ŞEY DEĞİŞMEDİ)
  };

  const plans = [
    // ... (TÜM PLANLAR AYNI)
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ❌ <Navbar /> SİLİNDİ */}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-amber-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-white text-purple-600 hover:bg-white">
            <Sparkles className="h-3 w-3 mr-1" />
            {getNavText('Fiyatlandırma', 'Pricing', 'Tarification')}
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {getNavText('Profilinizi Öne Çıkarın', 'Highlight Your Profile', 'Mettez en avant votre profil')}
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-blue-50 max-w-3xl mx-auto">
            {getNavText(
              'Doğrulama rozetleriyle güvenilirliğinizi artırın ve daha fazla müşteriye ulaşın',
              'Increase your credibility with verification badges and reach more clients',
              'Augmentez votre crédibilité avec des badges de vérification et atteignez plus de clients'
            )}
          </p>

        </div>
      </section>
