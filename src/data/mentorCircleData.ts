import { FileText, ImageIcon, Link as LinkIcon, Briefcase } from 'lucide-react';

export interface Post {
  id: string;
  type: 'text' | 'image' | 'link' | 'article' | 'poll';
  author: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    isVerified: boolean;
    isPremium: boolean;
    followers: number;
    connections: number;
    badges: { text: string; color: string }[];
  };
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
  date: string;
  views: number;
  likes: number;
  isLiked: boolean;
  comments: number;
  shares: number;
  tags?: string[];
}

export const mockPosts: Post[] = [
  {
    id: '1',
    type: 'text',
    author: {
      id: 'u1',
      name: 'Dr. Ayşe Yılmaz',
      title: 'Kariyer Koçu & Eğitmen',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
      isVerified: true,
      isPremium: true,
      followers: 15420,
      connections: 500,
      badges: [{ text: 'Top Voice', color: 'bg-blue-600' }]
    },
    content: "Kariyer değişikliği yaparken acele etmeyin. İşte dikkat etmeniz gereken 3 altın kural:\n1. Mevcut yetkinliklerinizi analiz edin\n2. Pazar araştırması yapın\n3. Networking'i asla ihmal etmeyin.",
    date: '2 saat önce',
    views: 12500,
    likes: 845,
    isLiked: true,
    comments: 124,
    shares: 56,
    tags: ['Kariyer', 'Tavsiye', 'Gelişim']
  },
  {
    id: '2',
    type: 'image',
    author: {
      id: 'u2',
      name: 'Mehmet Demir',
      title: 'Senior Yazılım Mühendisi',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
      isVerified: false,
      isPremium: false,
      followers: 850,
      connections: 420,
      badges: []
    },
    title: "Remote Çalışma Ortamım",
    content: "Evden çalışırken verimliliği artırmak için kullandığım setup. Sizinki nasıl?",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=400&fit=crop",
    date: '5 saat önce',
    views: 5400,
    likes: 320,
    isLiked: false,
    comments: 45,
    shares: 12,
    tags: ['RemoteWork', 'Setup']
  }
];
