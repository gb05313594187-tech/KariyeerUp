export type PostType = 'article' | 'poll' | 'image' | 'link' | 'text';

export interface Badge {
  text: string;
  color: string;
  icon?: string;
}

export interface Author {
  id: string;
  name: string;
  title: string;
  avatar: string;
  isPremium: boolean;
  isVerified: boolean;
  badges: Badge[];
  followers: number;
  connections: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Post {
  id: string;
  type: PostType;
  author: Author;
  content: string;
  title?: string;
  image?: string;
  link?: string;
  linkPreview?: {
    title: string;
    description: string;
    image: string;
    domain: string;
  };
  poll?: {
    question: string;
    options: PollOption[];
    totalVotes: number;
    endsAt: string;
  };
  date: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked: boolean;
  tags?: string[];
}

export const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Ayşe Demir',
    title: 'ICF PCC Sertifikalı Koç',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    isPremium: true,
    isVerified: true,
    badges: [
      { text: 'Premium Koç', color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
      { text: 'Ayın Koçu', color: 'bg-blue-600' }
    ],
    followers: 2450,
    connections: 890
  },
  {
    id: '2',
    name: 'Mehmet Kaya',
    title: 'Executive Coach & HR Partner',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    isPremium: true,
    isVerified: true,
    badges: [
      { text: 'HR Partner', color: 'bg-purple-600' },
      { text: 'Premium Koç', color: 'bg-gradient-to-r from-amber-500 to-orange-500' }
    ],
    followers: 3200,
    connections: 1240
  },
  {
    id: '3',
    name: 'Zeynep Yılmaz',
    title: 'Kariyer Koçu',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    isPremium: false,
    isVerified: true,
    badges: [
      { text: 'Doğrulanmış Koç', color: 'bg-green-600' }
    ],
    followers: 1580,
    connections: 620
  },
  {
    id: '4',
    name: 'Can Özkan',
    title: 'Öğrenci Koçu & Kariyer Danışmanı',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    isPremium: false,
    isVerified: true,
    badges: [
      { text: 'Yeni Yetenek', color: 'bg-teal-600' }
    ],
    followers: 890,
    connections: 340
  },
  {
    id: '5',
    name: 'Elif Arslan',
    title: 'Life Coach & Wellness Expert',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
    isPremium: true,
    isVerified: true,
    badges: [
      { text: 'Premium Koç', color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
      { text: 'Wellness Expert', color: 'bg-pink-600' }
    ],
    followers: 2100,
    connections: 780
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    type: 'article',
    author: mockAuthors[0],
    title: 'Kariyer Geçişinde En Çok Yapılan 5 Hata',
    content: 'Yıllardır koçluk yaparken gözlemlediğim en yaygın hatalar ve bunlardan nasıl kaçınabileceğiniz hakkında deneyimlerimi paylaşmak istiyorum. 1) Hazırlıksız geçiş yapmak 2) Network oluşturmayı ertelemek 3) Finansal planlamayı göz ardı etmek...',
    date: '2 gün önce',
    likes: 234,
    comments: 45,
    shares: 28,
    views: 1250,
    isLiked: false,
    tags: ['kariyer', 'geçiş', 'koçluk']
  },
  {
    id: '2',
    type: 'poll',
    author: mockAuthors[1],
    content: 'Şirketinizde çalışan memnuniyetini artırmak için en etkili yöntem hangisi?',
    poll: {
      question: 'Şirketinizde çalışan memnuniyetini artırmak için en etkili yöntem hangisi?',
      options: [
        { id: '1', text: 'Esnek çalışma saatleri', votes: 145 },
        { id: '2', text: 'Kariyer gelişim programları', votes: 89 },
        { id: '3', text: 'Daha iyi maaş ve yan haklar', votes: 203 },
        { id: '4', text: 'İş-yaşam dengesi destekleri', votes: 112 }
      ],
      totalVotes: 549,
      endsAt: '2 gün sonra'
    },
    date: '3 gün önce',
    likes: 189,
    comments: 32,
    shares: 15,
    views: 980,
    isLiked: true,
    tags: ['anket', 'HR', 'çalışan-memnuniyeti']
  },
  {
    id: '3',
    type: 'image',
    author: mockAuthors[2],
    title: 'Remote Çalışma Döneminde Verimlilik İpuçları',
    content: 'Evden çalışırken verimliliğinizi artırmak için uyguladığım 10 pratik yöntem. Deneyimlerime göre en etkili olanlar infografikte! 📊',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
    date: '5 gün önce',
    likes: 156,
    comments: 28,
    shares: 42,
    views: 750,
    isLiked: false,
    tags: ['remote-work', 'verimlilik', 'ipuçları']
  },
  {
    id: '6',
    type: 'link',
    author: mockAuthors[4],
    content: 'Harvard Business Review\'dan harika bir makale: İş-yaşam dengesi mümkün mü, yoksa sadece bir mit mi? 🤔',
    link: 'https://hbr.org/work-life-balance',
    linkPreview: {
      title: 'Work-Life Balance Is a Myth',
      description: 'Instead of trying to balance work and life, focus on work-life integration and setting boundaries that work for you.',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop',
      domain: 'hbr.org'
    },
    date: '6 saat önce',
    likes: 178,
    comments: 45,
    shares: 67,
    views: 892,
    isLiked: false,
    tags: ['makale', 'iş-yaşam-dengesi', 'HBR']
  },
  {
    id: '7',
    type: 'text',
    author: mockAuthors[3],
    content: 'Üniversite öğrencileri için kariyer planlama serisi başlıyor! 🎓 Her hafta farklı bir konuyu ele alacağız:\n\n1. Hafta: Kendini tanıma ve güçlü yönlerini keşfetme\n2. Hafta: Sektör araştırması ve trend analizi\n3. Hafta: Network oluşturma stratejileri\n4. Hafta: CV ve LinkedIn profili optimizasyonu\n\nİlk oturum 20 Aralık Cuma, 18:00\'de. Katılmak isteyen var mı? 🙋‍♂️',
    date: '2 saat önce',
    likes: 67,
    comments: 18,
    shares: 12,
    views: 234,
    isLiked: true,
    tags: ['öğrenci', 'kariyer-planlama', 'eğitim']
  },
  {
    id: '8',
    type: 'article',
    author: mockAuthors[0],
    title: 'Koçluk Seanslarında En Çok Sorulan 10 Soru',
    content: 'Danışanlarımın en çok merak ettiği konular ve cevapları. Bu yazıda, koçluk seanslarında en sık karşılaştığım soruları ve yaklaşımımı paylaşıyorum. Belki sizin de aklınızdaki soruların cevabını bulursunuz! 💡',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    date: '1 hafta önce',
    likes: 445,
    comments: 89,
    shares: 56,
    views: 2340,
    isLiked: false,
    tags: ['koçluk', 'soru-cevap', 'deneyim']
  }
];