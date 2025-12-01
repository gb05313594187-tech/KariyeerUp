// Sayfanın beklediği TIP tanımı
export interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    title: string;
    isVerified: boolean;
  };
  content: string;
  likes: number;
  comments: number;
  shares: number;
  time: string;
  tags: string[];
  image?: string;
}

// Sayfanın beklediği KULLANICI verisi
export const currentUser = {
  name: "Salih Gökalp",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100",
  title: "Premium Üye",
  stats: {
    posts: 12,
    followers: 340,
    following: 120
  }
};

// Sayfanın beklediği GÜNDEM verisi
export const trendingTopics = [
  { id: 1, name: "Kariyer Değişikliği", posts: 156 },
  { id: 2, name: "Liderlik", posts: 124 },
  { id: 3, name: "Mülakat Teknikleri", posts: 98 },
  { id: 4, name: "Yurt Dışı İş İmkanları", posts: 85 },
  { id: 5, name: "Yapay Zeka", posts: 450 }
];

// Sayfanın beklediği GÖNDERİ Listesi (mockPosts)
export const mockPosts: Post[] = [
  {
    id: 1,
    author: {
      name: "Dr. Ayşe Yılmaz",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100",
      title: "Kariyer Koçu",
      isVerified: true
    },
    content: "Kariyer değişikliği yaparken en sık karşılaşılan hata: Acele etmek. Planlama yapmadan atılan adımlar genellikle hayal kırıklığı ile sonuçlanır. İşte dikkat etmeniz gereken 3 madde...",
    likes: 245,
    comments: 42,
    shares: 12,
    time: "2 saat önce",
    tags: ["Kariyer", "Tavsiye"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600&h=300"
  },
  {
    id: 2,
    author: {
      name: "Mehmet Demir",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100",
      title: "Yazılım Müdürü",
      isVerified: false
    },
    content: "Remote çalışırken ekip içi iletişimi nasıl güçlü tutuyorsunuz? Kullandığınız araçlar neler? Biz Slack ve Notion kombinasyonunu çok seviyoruz.",
    likes: 128,
    comments: 85,
    shares: 5,
    time: "5 saat önce",
    tags: ["Remote", "İletişim"]
  },
  {
    id: 3,
    author: {
      name: "Zeynep Kaya",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100",
      title: "İK Uzmanı",
      isVerified: true
    },
    content: "Mülakatlarda 'Zayıf yönleriniz nelerdir?' sorusuna verilebilecek en iyi cevaplar. Dürüst olun ama stratejik davranın.",
    likes: 543,
    comments: 120,
    shares: 45,
    time: "1 gün önce",
    tags: ["Mülakat", "İK"]
  }
];
