// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Clock,
  Users,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle,
  Crown,
  Send,
  UserPlus,
  Eye,
  Repeat2,
  Award,
  X,
  Calendar,
  Briefcase,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockPosts, type Post } from '@/data/mentorCircleData';
import VerificationBadgeModal from '@/components/VerificationBadgeModal';

export default function MentorCircle() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<Post[]>(mockPosts.filter(post => post.type !== 'poll'));
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPostType, setSelectedPostType] = useState<'text' | 'image' | 'link' | 'article'>('text');

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleShare = (postId: string, postTitle?: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(postTitle || 'MentorCircle\'dan bir paylaşım');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
  };

  const handleFollow = (authorId: string) => {
    alert(
      language === 'tr'
        ? 'Takip özelliği yakında aktif olacak!'
        : language === 'en'
        ? 'Follow feature coming soon!'
        : 'Fonction de suivi bientôt disponible!'
    );
  };

  const handleMessage = (authorId: string) => {
    alert(
      language === 'tr'
        ? 'Mesajlaşma özelliği yakında aktif olacak!'
        : language === 'en'
        ? 'Messaging feature coming soon!'
        : 'Fonction de messagerie bientôt disponible!'
    );
  };

  const handleConnect = (authorId: string) => {
    alert(
      language === 'tr'
        ? 'Bağlantı kurma özelliği yakında aktif olacak!'
        : language === 'en'
        ? 'Connect feature coming soon!'
        : 'Fonction de connexion bientôt disponible!'
    );
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    alert(
      language === 'tr'
        ? 'Post oluşturma özelliği yakında aktif olacak!'
        : language === 'en'
        ? 'Post creation feature coming soon!'
        : 'Fonction de création de post bientôt disponible!'
    );
    setShowCreatePost(false);
    setNewPostContent('');
  };

  const postTypeOptions = [
    { type: 'text' as const, icon: FileText, label: language === 'tr' ? 'Metin' : language === 'en' ? 'Text' : 'Texte' },
    { type: 'image' as const, icon: ImageIcon, label: language === 'tr' ? 'Görsel' : language === 'en' ? 'Media' : 'Média' },
    { type: 'link' as const, icon: LinkIcon, label: language === 'tr' ? 'Etkinlik' : language === 'en' ? 'Event' : 'Événement' },
    { type: 'article' as const, icon: Briefcase, label: language === 'tr' ? 'İş İlanı' : language === 'en' ? 'Job' : 'Emploi' },
  ];

  const renderPost = (post: Post) => {
    const isPremium = post.author.isPremium;
    const cardClasses = isPremium 
      ? 'hover:shadow-2xl transition-all duration-300 border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50'
      : 'hover:shadow-lg transition-shadow border border-gray-200';

    return (
      <Card key={post.id} className={cardClasses}>
        <CardContent className="pt-6">
          {/* Author Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className={`w-14 h-14 rounded-full object-cover ${isPremium ? 'ring-2 ring-amber-400' : ''}`}
                />
                {post.author.isVerified && (
                  <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-blue-500 bg-white rounded-full" />
                )}
                {isPremium && (
                  <Crown className="absolute -top-1 -right-1 h-5 w-5 text-amber-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                  {post.author.isVerified && (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{post.author.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {post.author.badges.map((badge, idx) => (
                    <Badge key={idx} className={`${badge.color} text-white text-xs px-2 py-0.5`}>
                      {badge.text}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {post.author.followers.toLocaleString()} {language === 'tr' ? 'takipçi' : language === 'en' ? 'followers' : 'abonnés'} •{' '}
                  {post.author.connections.toLocaleString()} {language === 'tr' ? 'bağlantı' : language === 'en' ? 'connections' : 'connexions'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFollow(post.author.id)}
                className="text-xs"
              >
                <UserPlus className="h-3 w-3 mr-1" />
                {language === 'tr' ? 'Takip Et' : language === 'en' ? 'Follow' : 'Suivre'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMessage(post.author.id)}
                className="text-xs"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Post Type Badge / Date */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500">{post.date}</span>
          </div>

          {/* Post Title */}
          {post.title && (
            <h2 className={`font-bold mb-3 ${isPremium ? 'text-2xl text-gray-900' : 'text-xl text-gray-800'}`}>
              {post.title}
            </h2>
          )}

          {/* Post Content */}
          <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>

          {/* Media */}
          {post.image && (
            <img
              src={post.image}
              alt="Post content"
              className="w-full rounded-lg mb-4 object-cover max-h-96"
            />
          )}

          {/* Link Preview */}
          {post.linkPreview && (
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow mb-4"
            >
              <img
                src={post.linkPreview.image}
                alt={post.linkPreview.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{post.linkPreview.domain}</p>
                <h3 className="font-semibold text-gray-900 mb-1">{post.linkPreview.title}</h3>
                <p className="text-sm text-gray-600">{post.linkPreview.description}</p>
              </div>
            </a>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center gap-6 py-3 border-t border-b border-gray-200 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Repeat2 className="h-4 w-4" />
              <span>{post.shares.toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(post.id)}
              className={`flex-1 ${post.isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'}`}
            >
              <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
              {language === 'tr' ? 'Beğen' : language === 'en' ? 'Like' : "J'aime"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-gray-600 hover:text-blue-500"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {language === 'tr' ? 'Yorum Yap' : language === 'en' ? 'Comment' : 'Commenter'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare(post.id, post.title)}
              className="flex-1 text-gray-600 hover:text-green-500"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {language === 'tr' ? 'Paylaş' : language === 'en' ? 'Share' : 'Partager'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleConnect(post.author.id)}
              className="flex-1 text-gray-600 hover:text-purple-500"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {language === 'tr' ? 'Bağlan' : language === 'en' ? 'Connect' : 'Connecter'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {language === 'tr' ? 'MentorCircle' : language === 'en' ? 'MentorCircle' : 'MentorCircle'}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {language === 'tr'
              ? 'Profesyonel ağınızı büyütün, içerik paylaşın ve etkileşime geçin'
              : language === 'en'
              ? 'Grow your professional network, share content and engage'
              : 'Développez votre réseau professionnel, partagez du contenu et interagissez'}
          </p>
          
          {/* Verification Badge CTA */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-amber-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <Award className="h-8 w-8 text-blue-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900">
                {language === 'tr'
                  ? 'Profilinizi Öne Çıkarın!'
                  : language === 'en'
                  ? 'Highlight Your Profile!'
                  : 'Mettez en valeur votre profil!'}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'tr'
                  ? 'Mavi Tik ₺99/ay • Altın Tik ₺299/ay'
                  : language === 'en'
                  ? 'Blue Badge ₺99/mo • Gold Badge ₺299/mo'
                  : 'Badge Bleu ₺99/mois • Badge Or ₺299/mois'}
              </p>
            </div>
            <Button
              onClick={() => setShowBadgeModal(true)}
              className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white"
            >
              {language === 'tr'
                ? 'Detayları Gör'
                : language === 'en'
                ? 'View Details'
                : 'Voir les détails'}
            </Button>
          </div>
        </div>

        {/* Create Post Card */}
        <Card className="mb-6 border-2 border-gray-200 hover:border-red-300 transition-colors">
          <CardContent className="pt-6">
            <Button
              onClick={() => setShowCreatePost(true)}
              variant="ghost"
              className="w-full justify-start text-gray-500 hover:text-gray-700 h-12 text-left"
            >
              {language === 'tr'
                ? 'Bir gönderi başlat...'
                : language === 'en'
                ? 'Start a post...'
                : 'Commencer une publication...'}
            </Button>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              {postTypeOptions.map((option) => (
                <Button
                  key={option.type}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPostType(option.type);
                    setShowCreatePost(true);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600"
                >
                  <option.icon className="h-5 w-5" />
                  <span className="text-sm">{option.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters & Feed */}
        <div className="mb-6">
          <Tabs defaultValue="popular" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="popular" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {language === 'tr' ? 'Popüler' : language === 'en' ? 'Popular' : 'Populaire'}
              </TabsTrigger>
              <TabsTrigger value="new" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {language === 'tr' ? 'Yeni' : language === 'en' ? 'New' : 'Nouveau'}
              </TabsTrigger>
              <TabsTrigger value="following" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {language === 'tr'
                  ? 'Takip Ettiklerim'
                  : language === 'en'
                  ? 'Following'
                  : 'Abonnements'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="popular" className="space-y-6">
              {posts
                .sort((a, b) => b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares))
                .map(renderPost)}
            </TabsContent>

            <TabsContent value="new" className="space-y-6">
              {posts.map(renderPost)}
            </TabsContent>

            <TabsContent value="following" className="space-y-6">
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {language === 'tr'
                    ? 'Henüz kimseyi takip etmiyorsunuz'
                    : language === 'en'
                    ? "You're not following anyone yet"
                    : 'Vous ne suivez personne pour le moment'}
                </h3>
                <p className="text-gray-500">
                  {language === 'tr'
                    ? 'Koçları takip ederek içeriklerini görmeye başlayın'
                    : language === 'en'
                    ? 'Start following coaches to see their content'
                    : 'Commencez à suivre des coachs pour voir leur contenu'}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Post Modal */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {language === 'tr'
                  ? 'Gönderi Oluştur'
                  : language === 'en'
                  ? 'Create Post'
                  : 'Créer une publication'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreatePost(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder={
                language === 'tr'
                  ? 'Ne hakkında konuşmak istiyorsunuz?'
                  : language === 'en'
                  ? 'What do you want to talk about?'
                  : 'De quoi voulez-vous parler?'
              }
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <div className="flex items-center gap-2 pt-4 border-t">
              {postTypeOptions.map((option) => (
                <Button
                  key={option.type}
                  variant={selectedPostType === option.type ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedPostType(option.type)}
                  className="flex items-center gap-2"
                >
                  <option.icon className="h-4 w-4" />
                  <span className="text-sm">{option.label}</span>
                </Button>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowCreatePost(false)}
              >
                {language === 'tr' ? 'İptal' : language === 'en' ? 'Cancel' : 'Annuler'}
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {language === 'tr' ? 'Paylaş' : language === 'en' ? 'Post' : 'Publier'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Verification Badge Modal */}
      <VerificationBadgeModal 
        isOpen={showBadgeModal} 
        onClose={() => setShowBadgeModal(false)} 
      />
    </div>
  );
}
