import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  userType: 'client' | 'coach' | 'company';
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return en;
      case 'fr': return fr;
      default: return tr;
    }
  };

  const handleSave = () => {
    // Update user info in localStorage
    if (user) {
      const updatedUser = {
        ...user,
        fullName,
        email,
      };
      
      // Update current user
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in users array
      const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: StoredUser) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      toast.success(getNavText('Profil güncellendi', 'Profile updated', 'Profil mis à jour'));
      setIsEditing(false);
      
      // Reload page to update context
      window.location.reload();
    }
  };

  const handleCancel = () => {
    setFullName(user?.fullName || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  const getInitials = () => {
    if (!user?.fullName) return 'U';
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.fullName.substring(0, 2).toUpperCase();
  };

  const getUserTypeLabel = () => {
    switch (user?.userType) {
      case 'client':
        return getNavText('Müşteri', 'Client', 'Client');
      case 'coach':
        return getNavText('Koç', 'Coach', 'Coach');
      case 'company':
        return getNavText('Şirket', 'Company', 'Entreprise');
      default:
        return getNavText('Kullanıcı', 'User', 'Utilisateur');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {getNavText('Ana Sayfaya Dön', 'Back to Home', 'Retour à l\'accueil')}
        </Button>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-red-600 text-white text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.fullName}</CardTitle>
                <CardDescription className="text-base">
                  {getUserTypeLabel()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{getNavText('Profil Bilgileri', 'Profile Information', 'Informations du profil')}</CardTitle>
                <CardDescription>
                  {getNavText(
                    'Hesap bilgilerinizi görüntüleyin ve düzenleyin',
                    'View and edit your account information',
                    'Afficher et modifier les informations de votre compte'
                  )}
                </CardDescription>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  {getNavText('Düzenle', 'Edit', 'Modifier')}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {getNavText('Ad Soyad', 'Full Name', 'Nom complet')}
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <Separator />

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {getNavText('E-posta', 'Email', 'E-mail')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <Separator />

            {/* User Type */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {getNavText('Hesap Türü', 'Account Type', 'Type de compte')}
              </Label>
              <Input
                value={getUserTypeLabel()}
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                  {getNavText('Kaydet', 'Save', 'Enregistrer')}
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  {getNavText('İptal', 'Cancel', 'Annuler')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {getNavText('Güvenlik', 'Security', 'Sécurité')}
            </CardTitle>
            <CardDescription>
              {getNavText(
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
                  {getNavText('Şifre', 'Password', 'Mot de passe')}
                </p>
                <p className="text-sm text-gray-500">
                  {getNavText(
                    'Son değiştirilme: Bilinmiyor',
                    'Last changed: Unknown',
                    'Dernière modification: Inconnu'
                  )}
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/forgot-password')}>
                {getNavText('Şifreyi Değiştir', 'Change Password', 'Changer le mot de passe')}
              </Button>
            </div>

            <Separator />

            <div className="pt-4">
              <Button
                variant="destructive"
                onClick={async () => {
                  await logout();
                  navigate('/');
                  toast.success(getNavText('Çıkış yapıldı', 'Logged out', 'Déconnecté'));
                }}
              >
                {getNavText('Çıkış Yap', 'Logout', 'Se déconnecter')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}