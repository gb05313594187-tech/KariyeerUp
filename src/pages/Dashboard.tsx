import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Subscription, supportTicketService } from '@/lib/supabase';
import { 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  CreditCard, 
  FileText, 
  ArrowLeft,
  Download,
  Shield,
  Clock,
  TrendingUp,
  Settings,
  User,
  Sparkles,
  RefreshCw,
  Brain,
  BarChart3,
  Users,
  TestTube,
  AlertCircle,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, setDemoAdmin } = useAuth();
  const { activeSubscriptions, payments, invoices, cancelSubscription, renewSubscription, refreshData, loading } = useSubscription();
  const { language } = useLanguage();
  const [demoMode, setDemoMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [supportDescription, setSupportDescription] = useState('');
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return en;
      case 'fr': return fr;
      default: return tr;
    }
  };

  // Manual refresh function
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast.success(
        getNavText(
          '✅ Veriler güncellendi!',
          '✅ Data refreshed!',
          '✅ Données actualisées!'
        ),
        { duration: 3000 }
      );
    } catch (error) {
      toast.error(
        getNavText(
          '❌ Yenileme başarısız oldu',
          '❌ Refresh failed',
          '❌ Échec de l\'actualisation'
        )
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle support ticket submission
  const handleSupportTicket = async () => {
    if (!supportDescription.trim()) {
      toast.error(
        getNavText(
          'Lütfen sorununuzu açıklayın',
          'Please describe your issue',
          'Veuillez décrire votre problème'
        )
      );
      return;
    }

    setIsSubmittingSupport(true);
    try {
      const result = await supportTicketService.create(
        getNavText(
          'Badge Görünmüyor - Destek Talebi',
          'Badge Not Showing - Support Request',
          'Badge non affiché - Demande d\'assistance'
        ),
        supportDescription,
        'badge_issue'
      );

      if (result.success) {
        toast.success(
          getNavText(
            `🎫 Destek talebiniz oluşturuldu! Ticket: ${result.ticket?.ticket_number}`,
            `🎫 Support ticket created! Ticket: ${result.ticket?.ticket_number}`,
            `🎫 Ticket d'assistance créé! Ticket: ${result.ticket?.ticket_number}`
          ),
          { duration: 6000 }
        );
        setShowSupportDialog(false);
        setSupportDescription('');
      } else {
        toast.error(
          getNavText(
            '❌ Destek talebi oluşturulamadı',
            '❌ Failed to create support ticket',
            '❌ Échec de la création du ticket'
          )
        );
      }
    } catch (error) {
      toast.error(
        getNavText(
          '❌ Bir hata oluştu',
          '❌ An error occurred',
          '❌ Une erreur s\'est produite'
        )
      );
    } finally {
      setIsSubmittingSupport(false);
    }
  };

  // Listen for payment messages from callback window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Dashboard received message:', event.data);
      
      if (event.data.type === 'PAYMENT_SUCCESS') {
        const badgeType = event.data.badgeType;
        const badgeName = badgeType === 'blue' ? '🔵 Mavi Rozet' : '🟡 Altın Rozet';
        
        toast.success(
          `🎉 Ödeme başarılı! ${badgeName} hesabınıza tanımlandı!`,
          { duration: 6000 }
        );
        
        // Refresh subscription data
        setTimeout(() => {
          refreshData();
        }, 2000);
      } else if (event.data.type === 'PAYMENT_ERROR') {
        toast.error('❌ Ödeme işlemi başarısız oldu', { duration: 6000 });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [refreshData]);

  // Handle payment success/error notifications from URL params (fallback)
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency');
    const message = searchParams.get('message');

    if (paymentStatus === 'success') {
      toast.success(
        getNavText(
          `🎉 Ödeme başarılı! ${amount} ${currency} tutarında ödemeniz alındı. Rozetiniz aktif edildi!`,
          `🎉 Payment successful! Your payment of ${amount} ${currency} has been received. Your badge is now active!`,
          `🎉 Paiement réussi! Votre paiement de ${amount} ${currency} a été reçu. Votre badge est maintenant actif!`
        ),
        { duration: 6000 }
      );
      
      // Refresh subscription data
      refreshData();
      
      // Clear URL parameters
      setSearchParams({});
    } else if (paymentStatus === 'error') {
      const errorMessage = message || getNavText('Ödeme işlemi başarısız oldu', 'Payment failed', 'Le paiement a échoué');
      toast.error(`❌ ${decodeURIComponent(errorMessage)}`, { duration: 6000 });
      
      // Clear URL parameters
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, getNavText, refreshData]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const handleRenewBadge = async (subscriptionId: string) => {
    const success = await renewSubscription(subscriptionId);
    if (success) {
      toast.success(getNavText('Rozet başarıyla yenilendi!', 'Badge renewed successfully!', 'Badge renouvelé avec succès!'));
    } else {
      toast.error(getNavText('Yenileme başarısız oldu', 'Renewal failed', 'Le renouvellement a échoué'));
    }
  };

  const handleCancelSubscription = async (subscriptionId: string, badgeType: string) => {
    const badgeName = badgeType === 'gold' ? 'Altın Rozet' : 'Mavi Rozet';
    
    if (window.confirm(getNavText(
      `${badgeName} aboneliğinizi iptal etmek istediğinizden emin misiniz?`,
      `Are you sure you want to cancel your ${badgeType} badge subscription?`,
      `Êtes-vous sûr de vouloir annuler votre abonnement ${badgeType}?`
    ))) {
      const success = await cancelSubscription(subscriptionId);
      if (success) {
        toast.success(getNavText('Abonelik iptal edildi', 'Subscription cancelled', 'Abonnement annulé'));
      }
    }
  };

  const downloadInvoice = (invoiceId: string) => {
    // In a real app, this would download a PDF
    toast.success(getNavText('Fatura indiriliyor...', 'Downloading invoice...', 'Téléchargement de la facture...'));
  };

  const getBadgeGradient = (type: string) => {
    return type === 'gold' 
      ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600'
      : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
  };

  const getBadgeName = (type: string) => {
    return type === 'gold' 
      ? getNavText('Altın Tik', 'Gold Badge', 'Badge d\'or')
      : getNavText('Mavi Tik', 'Blue Badge', 'Badge bleu');
  };

  const getProgressPercentage = (subscription: Subscription) => {
    const start = new Date(subscription.start_date).getTime();
    const end = new Date(subscription.end_date).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getTimeLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const difference = end.getTime() - now.getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0 };
  };

  const toggleDemoMode = () => {
    const newMode = !demoMode;
    setDemoMode(newMode);
    setDemoAdmin(newMode);
    toast.success(newMode ? '🎭 Demo Admin Modu Aktif!' : '👤 Normal Mod Aktif');
  };

  // Check if user is admin or coach
  const isAdmin = user.userType === 'admin' || user.userType === 'super_admin';
  const isCoach = user.userType === 'coach';

  // Check if user has gold badge
  const hasGoldBadge = activeSubscriptions.some(sub => sub.badge_type === 'gold');

  return (
    <div className={`min-h-screen py-8 ${hasGoldBadge ? 'bg-gradient-to-br from-yellow-50 via-white to-yellow-50' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {getNavText('Ana Sayfaya Dön', 'Back to Home', 'Retour à l\'accueil')}
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {getNavText('Kontrol Paneli', 'Dashboard', 'Tableau de bord')}
            </h1>
            <p className="text-gray-600 mt-1">
              {getNavText('Hoş geldiniz', 'Welcome', 'Bienvenue')}, {user.fullName}
            </p>
            <Badge variant="outline" className="mt-2">
              {user.userType === 'super_admin' && '👑 Süper Admin'}
              {user.userType === 'admin' && '🛡️ Admin'}
              {user.userType === 'coach' && '👨‍🏫 Koç'}
              {user.userType === 'client' && '👤 Müşteri'}
              {user.userType === 'company' && '🏢 Şirket'}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button onClick={toggleDemoMode} variant="outline" className="border-purple-600 text-purple-600">
              <TestTube className="h-4 w-4 mr-2" />
              {demoMode ? 'Demo Modu Kapat' : 'Demo Admin Modu'}
            </Button>
            <Button onClick={() => navigate('/profile')} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              {getNavText('Profil Ayarları', 'Profile Settings', 'Paramètres du profil')}
            </Button>
          </div>
        </div>

        {/* Refresh Badge Status Button */}
        <div className="mb-6">
          <Button 
            onClick={handleManualRefresh} 
            disabled={isRefreshing || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 text-lg shadow-lg"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing 
              ? getNavText('Yenileniyor...', 'Refreshing...', 'Actualisation...')
              : getNavText('🔄 Rozet Durumunu Yenile', '🔄 Refresh Badge Status', '🔄 Actualiser le statut du badge')
            }
          </Button>
          <p className="text-center text-sm text-gray-600 mt-2">
            {getNavText(
              'Ödeme yaptıysanız ve rozet görünmüyorsa bu butona tıklayın',
              'Click this button if you made a payment and the badge is not showing',
              'Cliquez sur ce bouton si vous avez effectué un paiement et que le badge n\'apparaît pas'
            )}
          </p>
          
          {/* Support Button - Only show if no badges */}
          {activeSubscriptions.length === 0 && (
            <Button 
              onClick={() => setShowSupportDialog(true)}
              variant="outline"
              className="w-full mt-3 border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              {getNavText(
                '🆘 Hala Görünmüyor mu? Destek Talebi Oluştur',
                '🆘 Still Not Showing? Create Support Ticket',
                '🆘 Toujours pas visible? Créer un ticket d\'assistance'
              )}
            </Button>
          )}
        </div>

        {/* Support Dialog */}
        <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                {getNavText('Destek Talebi Oluştur', 'Create Support Ticket', 'Créer un ticket d\'assistance')}
              </DialogTitle>
              <DialogDescription>
                {getNavText(
                  'Sorununuzu detaylı bir şekilde açıklayın. Destek ekibimiz en kısa sürede size dönüş yapacaktır.',
                  'Describe your issue in detail. Our support team will get back to you as soon as possible.',
                  'Décrivez votre problème en détail. Notre équipe d\'assistance vous répondra dans les plus brefs délais.'
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="description">
                  {getNavText('Sorun Açıklaması', 'Issue Description', 'Description du problème')}
                </Label>
                <Textarea
                  id="description"
                  placeholder={getNavText(
                    'Örnek: Ödeme yaptım ancak rozetim görünmüyor. İşlem numarası: XXX...',
                    'Example: I made a payment but my badge is not showing. Transaction ID: XXX...',
                    'Exemple: J\'ai effectué un paiement mais mon badge n\'apparaît pas. ID de transaction: XXX...'
                  )}
                  value={supportDescription}
                  onChange={(e) => setSupportDescription(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>💡 {getNavText('İpucu:', 'Tip:', 'Conseil:')}</strong>{' '}
                  {getNavText(
                    'Ödeme bilgilerinizi (işlem numarası, tarih, tutar) eklemeyi unutmayın.',
                    'Don\'t forget to include your payment details (transaction ID, date, amount).',
                    'N\'oubliez pas d\'inclure vos détails de paiement (ID de transaction, date, montant).'
                  )}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSupportDialog(false)}
                disabled={isSubmittingSupport}
              >
                {getNavText('İptal', 'Cancel', 'Annuler')}
              </Button>
              <Button
                type="button"
                onClick={handleSupportTicket}
                disabled={isSubmittingSupport || !supportDescription.trim()}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSubmittingSupport ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {getNavText('Gönderiliyor...', 'Sending...', 'Envoi...')}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {getNavText('Destek Talebi Gönder', 'Send Support Ticket', 'Envoyer le ticket')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Demo Mode Alert */}
        {demoMode && (
          <div className="mb-6 bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TestTube className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="font-bold text-purple-900">🎭 Demo Admin Modu Aktif</h3>
                <p className="text-sm text-purple-700">
                  Şu anda admin özelliklerini test ediyorsunuz. Gerçek admin yetkilerine sahip değilsiniz.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Admin/Coach Quick Access Cards */}
        {(isAdmin || isCoach) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {isAdmin && (
              <>
                <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin')}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Shield className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-purple-900">Admin Panel</h3>
                        <p className="text-sm text-purple-700">Gelir raporları, kullanıcı yönetimi</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/advanced-analytics')}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Brain className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-blue-900">AI Analitik</h3>
                        <p className="text-sm text-blue-700">KPI skorları, riskli koçlar</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {isCoach && (
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/coach-dashboard')}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <BarChart3 className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-green-900">Koç Dashboard</h3>
                      <p className="text-sm text-green-700">Performans, başarılar, gelir</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1️⃣ Abonelik ve Rozet Yönetimi Paneli */}
            <Card className={hasGoldBadge ? 'border-2 border-yellow-400 shadow-lg' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {getNavText('Rozet Durumu', 'Badge Status', 'Statut du badge')}
                  </CardTitle>
                  {activeSubscriptions.length > 0 && (
                    <Badge className="bg-green-500">
                      {activeSubscriptions.length} {getNavText('Aktif Rozet', 'Active Badge(s)', 'Badge(s) actif(s)')}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {activeSubscriptions.length > 0 ? (
                  <div className="space-y-6">
                    {activeSubscriptions.map((subscription) => {
                      const timeLeft = getTimeLeft(subscription.end_date);
                      return (
                        <div key={subscription.id} className="border-2 border-gray-200 rounded-lg p-6 space-y-4">
                          {/* Badge Display */}
                          <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                            <div className={`w-20 h-20 ${getBadgeGradient(subscription.badge_type)} rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg transform hover:scale-110 transition-transform`}>
                              {subscription.badge_type === 'gold' ? '★' : '✓'}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold">
                                {getBadgeName(subscription.badge_type)}
                              </h3>
                              <p className="text-gray-600 text-lg">
                                {subscription.price} {subscription.currency}/{getNavText('yıl', 'year', 'année')}
                              </p>
                              <Badge className={subscription.badge_type === 'gold' ? 'bg-yellow-500 mt-2' : 'bg-blue-500 mt-2'}>
                                {subscription.status === 'active' 
                                  ? getNavText('Aktif', 'Active', 'Actif')
                                  : getNavText('Pasif', 'Inactive', 'Inactif')}
                              </Badge>
                            </div>
                          </div>

                          {/* Countdown Timer */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Clock className="h-5 w-5 text-blue-600" />
                              <h4 className="font-semibold text-gray-900">
                                {getNavText('Kalan Süre', 'Time Remaining', 'Temps restant')}
                              </h4>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">{timeLeft.days}</div>
                                <div className="text-sm text-gray-600">{getNavText('Gün', 'Days', 'Jours')}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">{timeLeft.hours}</div>
                                <div className="text-sm text-gray-600">{getNavText('Saat', 'Hours', 'Heures')}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">{timeLeft.minutes}</div>
                                <div className="text-sm text-gray-600">{getNavText('Dakika', 'Minutes', 'Minutes')}</div>
                              </div>
                            </div>
                            <Progress value={100 - getProgressPercentage(subscription)} className="h-2" />
                            <p className="text-xs text-gray-600 mt-2">
                              {getNavText('Bitiş tarihi', 'Expires on', 'Expire le')}: {new Date(subscription.end_date).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3">
                            <Button onClick={() => handleRenewBadge(subscription.id)} className="bg-green-600 hover:bg-green-700">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              {getNavText('Rozeti Yenile', 'Renew Badge', 'Renouveler le badge')}
                            </Button>
                            {subscription.badge_type === 'blue' && (
                              <Button onClick={() => navigate('/pricing')} className="bg-yellow-600 hover:bg-yellow-700">
                                <Sparkles className="h-4 w-4 mr-2" />
                                {getNavText('Altın Tik\'e Yükselt', 'Upgrade to Gold', 'Passer à l\'or')}
                              </Button>
                            )}
                            <Button onClick={() => handleCancelSubscription(subscription.id, subscription.badge_type)} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                              <XCircle className="h-4 w-4 mr-2" />
                              {getNavText('Aboneliği İptal Et', 'Cancel Subscription', 'Annuler l\'abonnement')}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {getNavText('Henüz Rozet Yok', 'No Badge Yet', 'Pas encore de badge')}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {getNavText(
                        'Profilinizi öne çıkarmak için bir rozet satın alın',
                        'Purchase a badge to highlight your profile',
                        'Achetez un badge pour mettre en valeur votre profil'
                      )}
                    </p>
                    <Button onClick={() => navigate('/pricing')} size="lg">
                      {getNavText('Rozet Satın Al', 'Purchase Badge', 'Acheter un badge')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2️⃣ Ödeme ve Fatura Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {getNavText('Ödeme Geçmişi', 'Payment History', 'Historique des paiements')}
                </CardTitle>
                <CardDescription>
                  {getNavText('Tüm ödemeleriniz ve faturalarınız', 'All your payments and invoices', 'Tous vos paiements et factures')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-3">
                    {payments.slice(0, 5).map((payment) => {
                      const invoice = invoices.find(inv => inv.payment_id === payment.id);
                      return (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              payment.payment_status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              <CreditCard className={`h-6 w-6 ${
                                payment.payment_status === 'completed' ? 'text-green-600' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <p className="font-semibold text-lg">
                                {payment.amount.toFixed(2)} {payment.currency}
                              </p>
                              <p className="text-sm text-gray-600">
                                {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'} • {payment.transaction_id || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={payment.payment_status === 'completed' ? 'default' : 'secondary'}>
                              {payment.payment_status === 'completed' 
                                ? getNavText('Tamamlandı', 'Completed', 'Terminé')
                                : getNavText('Beklemede', 'Pending', 'En attente')}
                            </Badge>
                            {invoice && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => downloadInvoice(invoice.id)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                {getNavText('Fatura', 'Invoice', 'Facture')}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {payments.length > 5 && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/subscription-history')}
                      >
                        {getNavText('Tümünü Görüntüle', 'View All', 'Voir tout')} ({payments.length})
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      {getNavText('Henüz ödeme kaydı yok', 'No payment records yet', 'Aucun enregistrement de paiement pour le moment')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {getNavText('İstatistikler', 'Statistics', 'Statistiques')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">
                      {getNavText('Toplam Ödeme', 'Total Payments', 'Paiements totaux')}
                    </span>
                  </div>
                  <span className="text-lg font-bold">{payments.length}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">
                      {getNavText('Toplam Harcama', 'Total Spent', 'Total dépensé')}
                    </span>
                  </div>
                  <span className="text-lg font-bold">
                    {payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)} TRY
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">
                      {getNavText('Faturalar', 'Invoices', 'Factures')}
                    </span>
                  </div>
                  <span className="text-lg font-bold">{invoices.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {getNavText('Hızlı İşlemler', 'Quick Actions', 'Actions rapides')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4 mr-2" />
                  {getNavText('Profilimi Düzenle', 'Edit Profile', 'Modifier le profil')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/pricing')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {getNavText('Rozet Satın Al', 'Purchase Badge', 'Acheter un badge')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/subscription-history')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {getNavText('Tüm Faturalar', 'All Invoices', 'Toutes les factures')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/coaches')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {getNavText('Koç Bul', 'Find Coach', 'Trouver un coach')}
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {getNavText('Hesap Bilgileri', 'Account Information', 'Informations du compte')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">{getNavText('Ad Soyad', 'Full Name', 'Nom complet')}</p>
                  <p className="font-medium">{user.fullName}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">{getNavText('E-posta', 'Email', 'E-mail')}</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">{getNavText('Hesap Türü', 'Account Type', 'Type de compte')}</p>
                  <Badge variant="outline">
                    {user.userType === 'client' && getNavText('Müşteri', 'Client', 'Client')}
                    {user.userType === 'coach' && getNavText('Koç', 'Coach', 'Coach')}
                    {user.userType === 'company' && getNavText('Şirket', 'Company', 'Entreprise')}
                    {user.userType === 'admin' && getNavText('Admin', 'Admin', 'Admin')}
                    {user.userType === 'super_admin' && getNavText('Süper Admin', 'Super Admin', 'Super Admin')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}