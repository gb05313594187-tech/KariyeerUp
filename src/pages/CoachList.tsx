// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Star, MapPin, ChevronRight, 
  SlidersHorizontal, CheckCircle2, Clock, DollarSign, Briefcase 
} from 'lucide-react';

export default function CoachList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ZENGİNLEŞTİRİLMİŞ VERİ (Görsel olarak dolu dursun)
  const coaches = [
    {
      id: 1,
      name: "Dr. Ayşe Yılmaz",
      title: "Kariyer & Yönetici Koçu",
      rating: 4.9,
      reviews: 128,
      experience: "15 Yıl",
      price: 1500,
      specialties: ["Liderlik", "Kariyer Geçişi", "Stres Yönetimi"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
      isPremium: true,
      nextAvailable: "Bugün 14:00"
    },
    {
      id: 2,
      name: "Mehmet Demir",
      title: "Startup & Girişimcilik Mentoru",
      rating: 4.8,
      reviews: 85,
      experience: "10 Yıl",
      price: 1200,
      specialties: ["Girişimcilik", "Yatırım", "Takım Kurma"],
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400",
      isPremium: false,
      nextAvailable: "Yarın 10:00"
    },
    {
      id: 3,
      name: "Zeynep Kaya",
      title: "İletişim ve İlişki Uzmanı",
      rating: 5.0,
      reviews: 210,
      experience: "8 Yıl",
      price: 2000,
      specialties: ["İletişim", "İkna", "Sunum Teknikleri"],
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400",
      isPremium: true,
      nextAvailable: "Bugün 16:30"
    },
     {
      id: 4,
      name: "Caner Özkan",
      title: "Finansal Özgürlük Koçu",
      rating: 4.7,
      reviews: 56,
      experience: "12 Yıl",
      price: 1800,
      specialties: ["Finans", "Yatırım", "Bütçe"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400",
      isPremium: false,
      nextAvailable: "Pazartesi 09:00"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- HERO (BAŞLIK) BÖLÜMÜ --- */}
      <div className="bg-white border-b pb-8 pt-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                Kariyer Yolculuğunuzda <span className="text-red-600">En İyi Rehberi</span> Seçin
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
                ICF sertifikalı, deneyimli ve alanında uzman yüzlerce koç arasından size en uygun olanı bulun.
            </p>
            
            {/* ARAMA KUTUSU */}
            <div className="max-w-3xl mx-auto relative shadow-lg rounded-xl overflow-hidden border border-gray-200">
                <div className="flex bg-white">
                    <div className="flex-1 flex items-center px-4">
                        <Search className="text-gray-400 w-5 h-5 mr-3" />
                        <input 
                            type="text" 
                            placeholder="Koç adı, uzmanlık alanı veya anahtar kelime..." 
                            className="w-full h-14 outline-none text-gray-700 text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 transition-colors">
                        Ara
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* --- İÇERİK BÖLÜMÜ --- */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* SOL: FİLTRELEME (SIDEBAR) */}
            <div className="hidden lg:block space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2"><SlidersHorizontal className="w-5 h-5"/> Filtrele</h3>
                        <button className="text-xs text-red-600 font-semibold hover:underline">Temizle</button>
                    </div>

                    {/* KATEGORİLER */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-sm text-gray-900 mb-3">Uzmanlık Alanı</h4>
                        <div className="space-y-2">
                            {['Tümü', 'Liderlik', 'Kariyer', 'Girişimcilik', 'İletişim', 'Finans'].map(cat => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                                    <span className="text-gray-600 group-hover:text-gray-900">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* DENEYİM */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-sm text-gray-900 mb-3">Deneyim</h4>
                        <div className="space-y-2">
                            {['0-5 Yıl', '5-10 Yıl', '10+ Yıl'].map(exp => (
                                <label key={exp} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="radio" name="exp" className="w-4 h-4 border-gray-300 text-red-600 focus:ring-red-500"/>
                                    <span className="text-gray-600 group-hover:text-gray-900">{exp}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* FİYAT ARALIĞI */}
                    <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-3">Seans Ücreti</h4>
                        <input type="range" min="500" max="5000" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"/>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>500 ₺</span>
                            <span>5000 ₺</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SAĞ: KOÇ LİSTESİ */}
            <div className="lg:col-span-3">
                
                {/* SIRALAMA VE ÖZET */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600"><span className="font-bold text-gray-900">4</span> koç listeleniyor</p>
                    <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5 outline-none">
                        <option>Önerilen Sıralama</option>
                        <option>Puana Göre (Yüksek-Düşük)</option>
                        <option>Fiyata Göre (Artan)</option>
                        <option>Fiyata Göre (Azalan)</option>
                    </select>
                </div>

                {/* KARTLAR */}
                <div className="grid md:grid-cols-2 gap-6">
                    {coaches.map((coach) => (
                        <div key={coach.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            
                            {/* Kart Üstü (Görsel ve Badge) */}
                            <div className="relative h-24 bg-gradient-to-r from-gray-900 to-gray-800">
                                {coach.isPremium && (
                                    <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current"/> Premium
                                    </span>
                                )}
                            </div>

                            <div className="px-6 pb-6 relative">
                                {/* Profil Resmi */}
                                <div className="absolute -top-12 left-6">
                                    <img src={coach.image} className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform" />
                                </div>

                                {/* İsim ve Puan */}
                                <div className="mt-14 flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-red-600 transition-colors">{coach.name}</h3>
                                        <p className="text-sm text-gray-500">{coach.title}</p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-green-700 font-bold text-sm">
                                        <Star className="w-4 h-4 fill-current"/> {coach.rating}
                                    </div>
                                </div>

                                {/* Detaylar */}
                                <div className="mt-4 space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-gray-400"/> {coach.experience} Deneyim
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-green-500"/> Müsait: <span className="text-green-600 font-medium">{coach.nextAvailable}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400"/> Online Görüşme
                                    </div>
                                </div>

                                {/* Etiketler */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {coach.specialties.map(tag => (
                                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{tag}</span>
                                    ))}
                                </div>

                                {/* Alt Kısım: Fiyat ve Buton */}
                                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-gray-500 block">Seans Ücreti</span>
                                        <span className="text-xl font-bold text-blue-900">{coach.price} ₺</span>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/coach/${coach.id}`)}
                                        className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
                                    >
                                        İncele <ChevronRight className="w-4 h-4"/>
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Sayfalama */}
                <div className="mt-12 flex justify-center">
                    <button className="px-4 py-2 border rounded-l-lg hover:bg-gray-50">Önceki</button>
                    <button className="px-4 py-2 border-t border-b bg-red-600 text-white">1</button>
                    <button className="px-4 py-2 border-t border-b hover:bg-gray-50">2</button>
                    <button className="px-4 py-2 border-t border-b hover:bg-gray-50">3</button>
                    <button className="px-4 py-2 border rounded-r-lg hover:bg-gray-50">Sonraki</button>
                </div>

            </div>
        </div>
      </div>

    </div>
  );
}
