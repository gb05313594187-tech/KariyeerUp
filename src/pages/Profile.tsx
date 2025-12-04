// @ts-nocheck
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Lock, ArrowLeft, Phone, Globe, Type as TypeIcon } from 'lucide-react';

// Supabase client (projende zaten var)
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const { supabaseUser, logout } = useAuth(); // AuthContext’ten gelen gerçek Supabase user
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form stateleri
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [timezone, setTimezone] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const t = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'en': return en;
      case 'fr': return fr;
      default: return tr;
    }
  };

  // İlk harfler
  const getInitials = () => {
    if (fullName) {
      const parts = fullName.split(' ');
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return fullName.substring(0, 2).toUpperCase();
    }
    if (supabaseUser?.email) return supabaseUser.email[0].toUpperCase();
    return 'U';
  };

  // PROFİLİ SUPABASE'TEN ÇEK
  useEffect(() => {
    if (!supabaseUser) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)  // Çoğu şablonda profiles.id = auth.users.id
        .maybeSingle();

      if (error) {
        console.error('Profil okuma hatası:', error);
      }

      if (data) {
        setFullName(data.full_name || '');
        setDisplayName(data.display_name || '');
        setEmail(data.email || supabaseUser.email || '');
        setPhone(data.phone || '');
        setCountry(data.country || '');
        setCity(data.city || '');
        setTimezone(data.timezone || '');
        setHeadline(data.headline || '');
        setBio(data.bio || '');
      } else {
        // İlk giriş yapan user için default dolduralım
        setEmail(supabaseUser.email || '');
      }

      setLoading(false);
    };

    fetchProfile();
  }, [supabaseUser, navigate]);

  const handleSave = async () => {
    if (!supabaseUser) return;
    setSaving(true);

    const payload = {
      id: supabaseUser.id,        // onConflict için
      email,
      full_name: fullName,
      display_name: displayName,
      phone,
      country,
      city,
      timezone,
      headline,
      bio,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    setSaving(false);

    if (error) {
      console.error('Profil kaydetme hatası:', error);
      toast.error(t('Profil kaydedilemedi', 'Failed to save profile', 'Échec de l’enregistrement du profil'));
      return;
    }

    toast.success(t('Profil güncellendi', 'Profile updated', 'Profil mis à jour'));
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Sayfayı yenileyerek Supabase’ten tekrar çekmek en garantisi
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Geri Dön */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('Ana Sayfaya Dön', 'Back to Home', 'Retour à l’accueil')}
        </Button>

        {/* Profil Başlığı */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-red-600 text-white text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {fullName || displayName || supabaseUser?.email}
                </CardTitle>
                <CardDescription className="text-base">
                  {headline || t('Kariyerinizi birlikte şekillendirelim.', 'Let’s shape your career together.', 'Construisons votre carrière ensemble.')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profil Formu */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {t('Profil Bilgileri', 'Profile Information', 'Informations du profil')}
                </CardTitle>
                <CardDescription>
                  {t(
                    'Hesap bilgilerinizi görüntüleyin ve düzenleyin',
                    'View and edit your account information',
                    'Afficher et modifier les informations de votre compte'
                  )}
                </CardDescription>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  {t('Düzenle', 'Edit', 'Modifier')}
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Ad Soyad */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('Ad Soyad', 'Full Name', 'Nom complet')}
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            {/* Görünecek İsim */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="flex items-center gap-2">
                <TypeIcon className="h-4 w-4" />
                {t('Görünen İsim', 'Display Name', 'Nom affiché')}
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <Separator />

            {/* E-posta (readonly) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t('E-posta', 'Email', 'E-mail')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Telefon */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t('Telefon', 'Phone', 'Téléphone')}
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <Separator />

            {/* Ülke / Şehir / Saat Dilimi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">
                  {t('Ülke', 'Country', 'Pays')}
                </Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">
                  {t('Şehir', 'City', 'Ville')}
                </Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t('Saat Dilimi', 'Time Zone', 'Fuseau horaire')}
                </Label>
                <Input
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                  placeholder="Europe/Istanbul"
                />
              </div>
            </div>

            <Separator />

            {/* Headline */}
            <div className="space-y-2">
              <Label htmlFor="headline">
                {t('Unvan / Başlık', 'Headline', 'Titre / Headline')}
              </Label>
              <Input
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
                placeholder={t(
                  'Kariyer Koçu | Tech Hiring Specialist | ICF ACC',
                  'Career Coach | Tech Hiring Specialist | ICF ACC',
                  'Coach de carrière | Spécialiste du recrutement Tech | ICF ACC'
                )}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">
                {t('Hakkımda', 'About Me', 'À propos de moi')}
              </Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditing}
                className={`w-full rounded-md border px-3 py-2 text-sm ${
                  !isEditing ? 'bg-gray-50' : ''
                }`}
                rows={4}
                maxLength={1000}
                placeholder={t(
                  'Kısaca kendinizden, deneyimlerinizden ve koçluk yaklaşımınızdan bahsedin...',
                  'Briefly describe yourself, your experience and your coaching approach...',
                  'Décrivez brièvement qui vous êtes, votre expérience et votre approche du coaching...'
                )}
              />
              <div className="text-xs text-gray-400 text-right">
                {bio.length}/1000
              </div>
            </div>

            {/* Kaydet / İptal */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={saving}
                >
                  {saving
                    ? t('Kaydediliyor...', 'Saving...', 'Enregistrement...')
                    : t('Kaydet', 'Save', 'Enregistrer')}
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  {t('İptal', 'Cancel', 'Annuler')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Güvenlik Kartı */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {t('Güvenlik', 'Security', 'Sécurité')}
            </CardTitle>
            <CardDescription>
              {t(
                'Hesap güvenliği ayarları',
                'Account security settings',
                'Paramètres de sécurité du compte'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">
                  {t('Şifre', 'Password', 'Mot de passe')}
                </p>
                <p className="text-sm text-gray-500">
                  {t(
                    'Şifrenizi Supabase Auth üzerinden yönetebilirsiniz.',
                    'You can manage your password via Supabase Auth.',
                    'Vous pouvez gérer votre mot de passe via Supabase Auth.'
                  )}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/forgot-password')}
              >
                {t('Şifreyi Değiştir', 'Change Password', 'Changer le mot de passe')}
              </Button>
            </div>

            <Separator />

            <div className="pt-4">
              <Button
                variant="destructive"
                onClick={async () => {
                  await logout();
                  await supabase.auth.signOut();
                  navigate('/');
                  toast.success(t('Çıkış yapıldı', 'Logged out', 'Déconnecté'));
                }}
              >
                {t('Çıkış Yap', 'Logout', 'Se déconnecter')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
