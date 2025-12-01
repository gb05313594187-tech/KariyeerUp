export const mentorCircleData = {
  user: {
    name: "Salih Gökalp",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100",
    title: "Premium Üye"
  },
  trendingTopics: [
    { id: 1, name: "Kariyer Değişikliği", posts: 156 },
    { id: 2, name: "Liderlik", posts: 124 },
    { id: 3, name: "Mülakat Teknikleri", posts: 98 },
    { id: 4, name: "Yurt Dışı İş İmkanları", posts: 85 }
  ],
  posts: [
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
      tags: ["Kariyer", "Tavsiye"]
    },
    {
      id: 2,
      author: {
        name: "Mehmet Demir",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100",
        title: "Yazılım Müdürü",
        isVerified: false
      },
      content: "Remote çalışırken ekip içi iletişimi nasıl güçlü tutuyorsunuz? Kullandığınız araçlar neler?",
      likes: 128,
      comments: 85,
      shares: 5,
      time: "5 saat önce",
      tags: ["Remote", "İletişim"]
    }
  ]
};
