export interface Coach {
  id: string;
  name: string;
  title: string;
  bio: string;
  bioEn: string;
  specialties: string[];
  specialtiesEn: string[];
  certification: string;
  experience: number;
  rating: number;
  reviews: number;
  price: number;
  avatar: string;
  availability: string[];
  languages: string[];
  // Additional fields for CoachList compatibility
  photo?: string;
  icfLevel?: string;
  hourlyRate45?: number;
  hourlyRate60?: number;
  reviewCount?: number;
  categories?: string[];
  // Enhanced profile fields
  slug?: string;
  videoUrl?: string;
  aboutMe?: string;
  aboutMeEn?: string;
  sectorExperience?: string[];
  education?: string[];
  certificates?: {
    name: string;
    issuer: string;
    year: number;
    imageUrl?: string;
  }[];
  isPremium?: boolean;
  isVerified?: boolean; // ICF Verified badge
  badges?: string[];
  communityScore?: number;
  totalSessions?: number;
  packages?: {
    id: string;
    name: string;
    nameEn: string;
    sessions: number;
    price: number;
    description: string;
    descriptionEn: string;
  }[];
  hasTrialSession?: boolean;
  trialPrice?: number;
}

export interface Review {
  id: string;
  coachId: string;
  clientName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Booking {
  id: string;
  coachId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  duration: number;
  sessionType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  meetingUrl?: string; // Jitsi Meet URL
}

export interface PartnershipRequest {
  id: string;
  type: 'university' | 'company' | 'individual';
  organizationName?: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const coaches: Coach[] = [
  {
    id: '1',
    name: 'Dr. Ayşe Yılmaz',
    slug: 'ayse-yilmaz',
    title: 'Kariyer Geçiş Uzmanı',
    bio: '15 yıllık deneyimiyle kariyer geçişi ve liderlik gelişimi alanında 500+ profesyonele koçluk yapmıştır. ICF PCC sertifikalı.',
    bioEn: 'With 15 years of experience, has coached 500+ professionals in career transition and leadership development. ICF PCC certified.',
    aboutMe: 'Merhaba! Ben Dr. Ayşe Yılmaz. 15 yıldır profesyonellerin kariyer yolculuklarında rehberlik ediyorum. Psikoloji doktorası ve ICF PCC sertifikamla, kariyer geçişi süreçlerinde bireylerin potansiyellerini keşfetmelerine yardımcı oluyorum. Özellikle orta ve üst düzey yöneticilerin kariyer dönüşümlerinde uzmanlaştım. Her bireyin benzersiz olduğuna inanıyor ve koçluk sürecinde kişiye özel yaklaşımlar geliştiriyorum.',
    aboutMeEn: 'Hello! I\'m Dr. Ayşe Yılmaz. I\'ve been guiding professionals in their career journeys for 15 years. With my PhD in Psychology and ICF PCC certification, I help individuals discover their potential during career transitions. I specialize in career transformations of mid and senior-level managers. I believe each individual is unique and develop personalized approaches in the coaching process.',
    specialties: ['Kariyer Geçişi', 'Liderlik Gelişimi', 'Mülakat Hazırlığı'],
    specialtiesEn: ['Career Transition', 'Leadership Development', 'Interview Preparation'],
    certification: 'ICF PCC',
    experience: 15,
    rating: 4.9,
    reviews: 127,
    price: 1500,
    avatar: '/assets/coach-ayse-yilmaz_variant_11.jpg',
    availability: ['Pazartesi', 'Çarşamba', 'Cuma'],
    languages: ['Türkçe', 'İngilizce'],
    photo: '/assets/coach-ayse-yilmaz_variant_12.jpg',
    icfLevel: 'PCC',
    hourlyRate45: 1500,
    hourlyRate60: 2000,
    reviewCount: 127,
    categories: ['career-transition', 'leadership'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    sectorExperience: ['Teknoloji', 'Finans', 'Danışmanlık', 'Sağlık'],
    education: ['Psikoloji Doktorası - Boğaziçi Üniversitesi', 'ICF PCC Sertifikası', 'NLP Practitioner'],
    certificates: [
      {
        name: 'ICF PCC',
        issuer: 'International Coaching Federation',
        year: 2015,
        imageUrl: '/images/ICFPCCCertification.jpg',
      },
      {
        name: 'MYK Seviye 6',
        issuer: 'Mesleki Yeterlilik Kurumu',
        year: 2018,
      },
    ],
    isPremium: true,
    isVerified: true,
    badges: ['Kurucu Koç', 'En Çok Tercih Edilen', 'MentorCircle Aktif'],
    communityScore: 95,
    totalSessions: 500,
    packages: [
      {
        id: 'pkg1',
        name: '3 Seans Paketi',
        nameEn: '3 Session Package',
        sessions: 3,
        price: 4200,
        description: 'Kariyer hedeflerinizi netleştirmek için ideal başlangıç paketi',
        descriptionEn: 'Ideal starter package to clarify your career goals',
      },
      {
        id: 'pkg2',
        name: '6 Seans Paketi',
        nameEn: '6 Session Package',
        sessions: 6,
        price: 7800,
        description: 'Kariyer geçişi için kapsamlı destek paketi',
        descriptionEn: 'Comprehensive support package for career transition',
      },
    ],
    hasTrialSession: true,
    trialPrice: 750,
  },
  {
    id: '2',
    name: 'Mehmet Kaya',
    slug: 'mehmet-kaya',
    title: 'Liderlik ve Ekip Koçu',
    bio: 'Kurumsal şirketlerde 12 yıl yöneticilik deneyimi sonrası koçluğa geçiş yaptı. Özellikle yeni yöneticilerin gelişiminde uzman.',
    bioEn: 'Transitioned to coaching after 12 years of management experience in corporate companies. Specializes in developing new managers.',
    aboutMe: 'Merhaba! Ben Mehmet Kaya. 12 yıl boyunca Fortune 500 şirketlerinde üst düzey yöneticilik yaptıktan sonra, bu deneyimimi yeni nesil liderlere aktarmak için koçluğa geçiş yaptım. Ekip dinamikleri, liderlik becerileri ve organizasyonel gelişim konularında uzmanım. Gerçek iş dünyası deneyimlerimle, teorik bilgiyi pratiğe dönüştürmenize yardımcı oluyorum.',
    aboutMeEn: 'Hello! I\'m Mehmet Kaya. After 12 years of senior management in Fortune 500 companies, I transitioned to coaching to share this experience with the next generation of leaders. I specialize in team dynamics, leadership skills, and organizational development. With my real-world business experience, I help you turn theoretical knowledge into practice.',
    specialties: ['Liderlik Koçluğu', 'Ekip Yönetimi', 'Yönetici Gelişimi'],
    specialtiesEn: ['Leadership Coaching', 'Team Management', 'Manager Development'],
    certification: 'ICF ACC',
    experience: 8,
    rating: 4.8,
    reviews: 94,
    price: 1200,
    avatar: '/assets/coach-mehmet-kaya_variant_11.jpg',
    availability: ['Salı', 'Perşembe', 'Cumartesi'],
    languages: ['Türkçe', 'İngilizce'],
    photo: '/assets/coach-mehmet-kaya_variant_12.jpg',
    icfLevel: 'ACC',
    hourlyRate45: 1200,
    hourlyRate60: 1600,
    reviewCount: 94,
    categories: ['leadership', 'team-management'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    sectorExperience: ['Perakende', 'E-Ticaret', 'Lojistik'],
    education: ['İşletme Yüksek Lisansı - İstanbul Üniversitesi', 'ICF ACC Sertifikası', 'Agile Leadership'],
    certificates: [
      {
        name: 'ICF ACC',
        issuer: 'International Coaching Federation',
        year: 2017,
      },
    ],
    isPremium: false,
    isVerified: true,
    badges: ['MentorCircle Aktif'],
    communityScore: 82,
    totalSessions: 320,
    packages: [
      {
        id: 'pkg3',
        name: '4 Seans Paketi',
        nameEn: '4 Session Package',
        sessions: 4,
        price: 4500,
        description: 'Liderlik becerilerinizi geliştirmek için',
        descriptionEn: 'To develop your leadership skills',
      },
    ],
    hasTrialSession: true,
    trialPrice: 600,
  },
  {
    id: '3',
    name: 'Zeynep Demir',
    slug: 'zeynep-demir',
    title: 'Yönetici Koçu',
    bio: 'C-level yöneticilere özel koçluk hizmeti veriyor. Fortune 500 şirketlerinde 20 yıllık üst düzey yöneticilik tecrübesi.',
    bioEn: 'Provides coaching services specifically for C-level executives. 20 years of senior management experience in Fortune 500 companies.',
    aboutMe: 'Merhaba! Ben Zeynep Demir. 20 yıllık üst düzey yöneticilik deneyimimle, C-level yöneticilere özel koçluk hizmeti veriyorum. Stratejik düşünme, değişim yönetimi ve kurumsal liderlik alanlarında derin uzmanlığım var. ICF MCC sertifikamla, en üst düzey yöneticilerin karmaşık iş zorluklarını aşmalarına ve liderlik kapasitelerini genişletmelerine yardımcı oluyorum.',
    aboutMeEn: 'Hello! I\'m Zeynep Demir. With 20 years of senior management experience, I provide coaching services specifically for C-level executives. I have deep expertise in strategic thinking, change management, and corporate leadership. With my ICF MCC certification, I help top executives overcome complex business challenges and expand their leadership capacity.',
    specialties: ['Yönetici Koçluğu', 'Stratejik Planlama', 'Değişim Yönetimi'],
    specialtiesEn: ['Executive Coaching', 'Strategic Planning', 'Change Management'],
    certification: 'ICF MCC',
    experience: 20,
    rating: 5.0,
    reviews: 156,
    price: 2000,
    avatar: '/assets/coach-zeynep-demir_variant_11.jpg',
    availability: ['Pazartesi', 'Çarşamba', 'Perşembe'],
    languages: ['Türkçe', 'İngilizce', 'Almanca'],
    photo: '/assets/coach-zeynep-demir_variant_12.jpg',
    icfLevel: 'MCC',
    hourlyRate45: 2000,
    hourlyRate60: 2500,
    reviewCount: 156,
    categories: ['executive-coaching', 'leadership'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    sectorExperience: ['Bankacılık', 'Enerji', 'Telekomunikasyon', 'Otomotiv'],
    education: ['MBA - INSEAD', 'ICF MCC Sertifikası', 'Executive Leadership Program - Harvard'],
    certificates: [
      {
        name: 'ICF MCC',
        issuer: 'International Coaching Federation',
        year: 2012,
      },
      {
        name: 'MYK Seviye 6',
        issuer: 'Mesleki Yeterlilik Kurumu',
        year: 2016,
      },
    ],
    isPremium: true,
    isVerified: true,
    badges: ['Kurucu Koç', 'ICF MCC', 'MentorCircle Aktif'],
    communityScore: 98,
    totalSessions: 800,
    packages: [
      {
        id: 'pkg5',
        name: '3 Seans Yönetici Paketi',
        nameEn: '3 Session Executive Package',
        sessions: 3,
        price: 5700,
        description: 'C-level yöneticiler için özel paket',
        descriptionEn: 'Special package for C-level executives',
      },
      {
        id: 'pkg6',
        name: '6 Seans Premium Paket',
        nameEn: '6 Session Premium Package',
        sessions: 6,
        price: 10500,
        description: 'Kapsamlı yönetici gelişim programı',
        descriptionEn: 'Comprehensive executive development program',
      },
    ],
    hasTrialSession: false,
  },
  {
    id: '4',
    name: 'Can Özkan',
    slug: 'can-ozkan',
    title: 'Öğrenci ve Genç Profesyonel Koçu',
    bio: 'Üniversite öğrencileri ve yeni mezunların kariyer yolculuğunda rehberlik ediyor. Özellikle Z kuşağı ile çalışmada uzman.',
    bioEn: 'Guides university students and new graduates in their career journey. Specializes in working with Generation Z.',
    specialties: ['Öğrenci Koçluğu', 'Kariyer Planlama', 'İş Arama Stratejileri'],
    specialtiesEn: ['Student Coaching', 'Career Planning', 'Job Search Strategies'],
    certification: 'ICF PCC',
    experience: 10,
    rating: 4.7,
    reviews: 89,
    price: 900,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=can',
    availability: ['Salı', 'Çarşamba', 'Cuma', 'Cumartesi'],
    languages: ['Türkçe', 'İngilizce'],
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=can',
    icfLevel: 'PCC',
    hourlyRate45: 900,
    hourlyRate60: 1200,
    reviewCount: 89,
    categories: ['student-coaching', 'career-planning'],
    isPremium: false,
    isVerified: true,
    badges: ['MentorCircle Aktif'],
    communityScore: 78,
    totalSessions: 250,
    hasTrialSession: true,
    trialPrice: 450,
  },
  {
    id: '5',
    name: 'Elif Şahin',
    slug: 'elif-sahin',
    title: 'Kadın Liderlik Koçu',
    bio: 'Kadınların kariyer gelişimi ve liderlik yolculuğunda özel destek sağlıyor. Cam tavan sendromu ve iş-yaşam dengesi uzmanı.',
    bioEn: 'Provides special support for women\'s career development and leadership journey. Expert in glass ceiling syndrome and work-life balance.',
    specialties: ['Kadın Liderliği', 'İş-Yaşam Dengesi', 'Kariyer Gelişimi'],
    specialtiesEn: ['Women Leadership', 'Work-Life Balance', 'Career Development'],
    certification: 'ICF ACC',
    experience: 7,
    rating: 4.9,
    reviews: 112,
    price: 1100,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elif',
    availability: ['Pazartesi', 'Salı', 'Perşembe'],
    languages: ['Türkçe', 'İngilizce'],
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elif',
    icfLevel: 'ACC',
    hourlyRate45: 1100,
    hourlyRate60: 1500,
    reviewCount: 112,
    categories: ['women-leadership', 'work-life-balance'],
    isPremium: false,
    isVerified: false,
    badges: ['En Çok Tercih Edilen'],
    communityScore: 88,
    totalSessions: 380,
    hasTrialSession: true,
    trialPrice: 550,
  },
  {
    id: '6',
    name: 'Ahmet Yıldız',
    slug: 'ahmet-yildiz',
    title: 'Teknoloji Sektörü Kariyer Koçu',
    bio: 'Yazılım mühendisliği ve teknoloji sektöründe 15 yıl çalıştıktan sonra koçluğa geçiş yaptı. Tech kariyer geçişlerinde uzman.',
    bioEn: 'Transitioned to coaching after working 15 years in software engineering and technology sector. Expert in tech career transitions.',
    specialties: ['Teknoloji Kariyer', 'Yazılım Mühendisliği', 'Startup Koçluğu'],
    specialtiesEn: ['Technology Career', 'Software Engineering', 'Startup Coaching'],
    certification: 'ICF PCC',
    experience: 6,
    rating: 4.8,
    reviews: 78,
    price: 1300,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmet',
    availability: ['Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    languages: ['Türkçe', 'İngilizce'],
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmet',
    icfLevel: 'PCC',
    hourlyRate45: 1300,
    hourlyRate60: 1700,
    reviewCount: 78,
    categories: ['tech-career', 'startup-coaching'],
    isPremium: false,
    isVerified: true,
    badges: ['MentorCircle Aktif'],
    communityScore: 85,
    totalSessions: 290,
    hasTrialSession: true,
    trialPrice: 650,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    coachId: '1',
    clientName: 'Ahmet Y.',
    rating: 5,
    date: '2024-01-15',
    comment: 'Dr. Ayşe Yılmaz ile çalışmak kariyer hayatımda dönüm noktası oldu. Kendimi daha iyi tanımamı ve hedeflerimi netleştirmemi sağladı.',
    verified: true,
  },
  {
    id: '2',
    coachId: '1',
    clientName: 'Zeynep K.',
    rating: 5,
    date: '2024-01-10',
    comment: 'Mükemmel bir koç! Kariyer geçişim sürecinde bana çok yardımcı oldu. Kesinlikle tavsiye ederim.',
    verified: true,
  },
  {
    id: '3',
    coachId: '2',
    clientName: 'Mehmet A.',
    rating: 5,
    date: '2024-01-20',
    comment: 'Liderlik becerilerimi geliştirmemde çok etkili oldu. Ekip yönetiminde kendime güvenim arttı.',
    verified: true,
  },
  {
    id: '4',
    coachId: '3',
    clientName: 'Ayşe D.',
    rating: 5,
    date: '2024-01-18',
    comment: 'Zeynep Hanım ile çalışmak harika bir deneyimdi. C-level pozisyonuma hazırlanmamda çok yardımcı oldu.',
    verified: true,
  },
  {
    id: '5',
    coachId: '1',
    clientName: 'Can M.',
    rating: 4,
    date: '2024-01-12',
    comment: 'Profesyonel yaklaşımı ve deneyimi sayesinde kariyer hedeflerimi daha net görebildim.',
    verified: true,
  },
];

const bookings: Booking[] = [
  {
    id: '1',
    coachId: '1',
    clientName: 'Ali Demir',
    clientEmail: 'ali@example.com',
    date: '2024-01-25',
    time: '14:00',
    duration: 45,
    sessionType: 'video',
    status: 'confirmed',
    price: 1500,
    meetingUrl: 'https://meet.jit.si/kariyeer-session-1',
  },
  {
    id: '2',
    coachId: '1',
    clientName: 'Selin Yılmaz',
    clientEmail: 'selin@example.com',
    date: '2024-01-26',
    time: '10:00',
    duration: 60,
    sessionType: 'video',
    status: 'pending',
    price: 2000,
  },
];

const partnershipRequests: PartnershipRequest[] = [];

export const categories = [
  { id: 'career-transition', name: 'Kariyer Geçişi', icon: '🔄' },
  { id: 'leadership', name: 'Liderlik', icon: '👔' },
  { id: 'executive-coaching', name: 'Yönetici Koçluğu', icon: '💼' },
  { id: 'student-coaching', name: 'Öğrenci Koçluğu', icon: '🎓' },
  { id: 'women-leadership', name: 'Kadın Liderliği', icon: '👩‍💼' },
  { id: 'tech-career', name: 'Teknoloji Kariyer', icon: '💻' },
  { id: 'team-management', name: 'Ekip Yönetimi', icon: '👥' },
  { id: 'work-life-balance', name: 'İş-Yaşam Dengesi', icon: '⚖️' },
];

export function getCoaches(): Coach[] {
  return coaches;
}

export function getReviews(coachId?: string): Review[] {
  if (coachId) {
    return reviews.filter(review => review.coachId === coachId);
  }
  return reviews;
}

export function getBookings(coachId?: string): Booking[] {
  if (coachId) {
    return bookings.filter(booking => booking.coachId === coachId);
  }
  return bookings;
}

export function saveBooking(booking: Booking): void {
  bookings.push(booking);
}

export function updateCoachAvailability(coachId: string, date: string, time: string): void {
  // In a real app, this would update the database
  console.log(`Updated availability for coach ${coachId} on ${date} at ${time}`);
}

export function savePartnershipRequest(request: PartnershipRequest): void {
  partnershipRequests.push(request);
}

// Generate Jitsi Meet URL for a booking
export function generateMeetingUrl(bookingId: string, coachName: string, clientName: string): string {
  const roomName = `kariyeer-${bookingId}-${Date.now()}`;
  return `https://meet.jit.si/${roomName}`;
}