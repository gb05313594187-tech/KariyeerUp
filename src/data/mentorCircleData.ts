// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, MessageCircle, Share2, TrendingUp, Clock, 
  Users, FileText, Image as ImageIcon, Link as LinkIcon, 
  Send, CheckCircle, Crown
} from 'lucide-react';

export default function MentorCircle() {
  const [activeTab, setActiveTab] = useState("feed");

  // --- VERİLERİ BURAYA GÖMDÜK (GARANTİ ÇALIŞSIN DİYE) ---
  const posts = [
    {
      id: 1,
      author: { name: "Dr. Ayşe Yılmaz", title: "Kariyer Koçu", isVerified: true, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" },
      content: "Kariyer değişikliği yaparken en sık karşılaşılan hata: Acele etmek. Planlama yapmadan atılan adımlar genellikle hayal kırıklığı ile sonuçlanır. İşte dikkat etmeniz gereken 3 madde...",
      likes: 245,
      comments: 42,
      time: "2 saat önce",
      tags: ["Kariyer", "Tavsiye"]
    },
    {
      id: 2,
      author: { name: "Mehmet Demir", title: "Yazılım Müdürü", isVerified: false, avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" },
      content: "Remote çalışırken ekip içi iletişimi nasıl güçlü tutuyorsunuz? Kullandığınız araçlar neler?",
      likes: 128,
      comments: 85,
      time: "5 saat önce",
      tags: ["Remote", "İletişim"]
    }
  ];

  const trendingTopics = [
    { id: 1, name: "Yapay Zeka", posts: 450 },
    { id: 2, name: "Liderlik", posts: 320 },
    { id: 3, name: "Mülakat", posts: 210 }
  ];
  // -------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SOL SIDEBAR - PROFİL KARTI */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <Card className="overflow-hidden border-t-4 border-t-purple-600">
              <div className="h-24 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              <CardContent className="pt-0 relative">
                <div className="flex justify-center">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" className="w-20 h-20 rounded-full border-4 border-white -mt-10 shadow-md" />
                </div>
                <div className="text-center mt-3">
                  <h3 className="font-bold text-gray-900">Misafir Kullanıcı</h3>
                  <p className="text-sm text-gray-500">Premium Üye</p>
                </div>
                <div className="mt-6 flex justify-between text-center text-sm border-t pt-4">
                  <div><div className="font-bold">12</div><div className="text-gray-500">Gönderi</div></div>
                  <div><div className="font-bold">340</div><div className="text-gray-500">Takipçi</div></div>
                  <div><div className="font-bold">120</div><div className="text-gray-500">Takip</div></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ORTA ALAN - FEED */}
          <div className="col-span-1 lg:col-span-6 space-y-6">
            
            {/* GÖNDERİ OLUŞTURMA */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Textarea placeholder="Deneyimlerini veya sorularını paylaş..." className="min-h-[100px] border-none resize-none bg-gray-50 focus:bg-white transition-colors" />
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-gray-500"><ImageIcon className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" className="text-gray-500"><LinkIcon className="h-5 w-5" /></Button>
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700 px-6"><Send className="h-4 w-4 mr-2" /> Paylaş</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AKIŞ */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start gap-4 p-4">
                    <img src={post.author.avatar} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{post.author.name}</h4>
                        {post.author.isVerified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                        <span className="text-sm text-gray-500">• {post.time}</span>
                      </div>
                      <p className="text-sm text-gray-500">{post.author.title}</p>
                    </div>
                    <Button variant="ghost" size="icon">...</Button>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
                    <div className="flex gap-2 mt-4">
                      {post.tags.map(tag => <Badge key={tag} variant="secondary" className="bg-purple-50 text-purple-700">#{tag}</Badge>)}
                    </div>
                  </CardContent>
                  <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50/50">
                    <Button variant="ghost" size="sm" className="text-gray-600 gap-2"><Heart className="h-4 w-4" /> {post.likes}</Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 gap-2"><MessageCircle className="h-4 w-4" /> {post.comments}</Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 gap-2"><Share2 className="h-4 w-4" /> Paylaş</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* SAĞ SIDEBAR - GÜNDEM */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-purple-600"/> Gündem</CardTitle></CardHeader>
              <CardContent className="p-0">
                {trendingTopics.map((topic, i) => (
                  <div key={topic.id} className="px-6 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0">
                    <div className="text-sm font-medium text-gray-900">#{topic.name}</div>
                    <div className="text-xs text-gray-500">{topic.posts} gönderi</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
