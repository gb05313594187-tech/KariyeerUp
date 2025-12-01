export interface CirclePost {
  id: string;
  author: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    badge?: string;
  };
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  type: 'discussion' | 'webinar' | 'article';
  hashtags?: string[];
}

export interface FeaturedCoach {
  id: string;
  name: string;
  title: string;
  avatar: string;
  specialty: string;
  bio: string;
}

export const getCirclePosts = (): CirclePost[] => {
  return [
    {
      id: '1',
      author: {
        id: '1',
        name: 'Ayşe Demir',
        title: 'ICF PCC Sertifikalı Kariyer Koçu',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        badge: 'Ayın Koçu',
      },
      title: 'Kariyer Geçişinde En Sık Yapılan 5 Hata',
      content:
        'Kariyer değişimi düşünenler için kritik ipuçları: 1) Hazırlıksız başlamak 2) Network kurmayı ertelemek 3) Transferable skills\'i göz ardı etmek 4) Finansal planlamayı atlamak 5) Sabırsız olmak. Her birini detaylı anlatalım...',
      date: '2 saat önce',
      likes: 24,
      comments: 8,
      type: 'article',
      hashtags: ['kariyergeçişi', 'kariyerkoçluğu', 'kariyerplanlama'],
    },
    {
      id: '2',
      author: {
        id: '2',
        name: 'Mehmet Kaya',
        title: 'Executive Coach & Startup Mentor',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      },
      title: 'Startup Dünyasında Liderlik: Deneyimlerim',
      content:
        '10 yıllık startup yolculuğumda öğrendiğim en önemli şey: Liderlik, unvan değil davranıştır. Ekibinize güvenmek, hata yapma özgürlüğü tanımak ve sürekli öğrenmeye açık olmak...',
      date: '5 saat önce',
      likes: 18,
      comments: 12,
      type: 'discussion',
      hashtags: ['liderlik', 'startup', 'yöneticikoçluğu'],
    },
    {
      id: '3',
      author: {
        id: '3',
        name: 'Zeynep Arslan',
        title: 'Öğrenci Koçluğu Uzmanı',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      },
      title: 'Üniversite Öğrencileri İçin Mülakat Hazırlık Webinarı',
      content:
        '🎯 25 Ocak Perşembe, 19:00\'da canlı yayında! Mülakatlarda başarılı olmanın sırları, davranışsal sorulara hazırlık, CV ve LinkedIn optimizasyonu. Katılım ücretsiz!',
      date: '1 gün önce',
      likes: 31,
      comments: 15,
      type: 'webinar',
      hashtags: ['mülakathazirligi', 'öğrencikoçluğu', 'kariyerbaşlangıcı'],
    },
    {
      id: '4',
      author: {
        id: '4',
        name: 'Can Özkan',
        title: 'Tech Career Coach',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      },
      title: 'Yazılım Mühendisliğinde Kariyer Yolu Haritası',
      content:
        'Junior\'dan Senior\'a giden yolda teknik becerilerin yanı sıra soft skills de çok önemli. İletişim, problem çözme, takım çalışması... Detaylı kariyer haritası için blog yazımı okuyabilirsiniz.',
      date: '2 gün önce',
      likes: 27,
      comments: 9,
      type: 'article',
      hashtags: ['teknolojikariyeri', 'yazılım', 'kariyerplanlama'],
    },
  ];
};

export const getCoachOfTheWeek = () => {
  return {
    id: '2',
    name: 'Mehmet Kaya',
    title: 'Executive Coach & Startup Mentor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    bio: 'Bu hafta 15 webinar ve 50+ danışanla etkileşim kurdu. Startup ekosisteminde liderlik konusunda öncü.',
  };
};

export const getCoachOfTheMonth = () => {
  return {
    id: '1',
    name: 'Ayşe Demir',
    title: 'ICF PCC Sertifikalı Kariyer Koçu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    certification: 'ICF PCC',
    bio: 'Bu ay 500+ kişiye ulaşan içerikler üretti ve 8 başarılı webinar düzenledi.',
    stats: {
      posts: 12,
      likes: 340,
      engagement: '92%',
    },
  };
};

export const getFeaturedCoaches = (): FeaturedCoach[] => {
  return [
    {
      id: '1',
      name: 'Ayşe Demir',
      title: 'ICF PCC Sertifikalı Kariyer Koçu',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      specialty: 'Kariyer Geçişi',
      bio: '15 yıllık İK deneyimi ve 500+ başarılı kariyer geçişi koçluğu.',
    },
    {
      id: '2',
      name: 'Mehmet Kaya',
      title: 'Executive Coach & Startup Mentor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      specialty: 'Liderlik',
      bio: '3 başarılı startup kurucusu, 200+ girişimci mentorluğu.',
    },
    {
      id: '3',
      name: 'Zeynep Arslan',
      title: 'Öğrenci Koçluğu Uzmanı',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      specialty: 'Öğrenci Koçluğu',
      bio: 'Üniversite öğrencilerine kariyer başlangıcında rehberlik.',
    },
  ];
};
