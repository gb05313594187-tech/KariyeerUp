// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Star, MapPin, ChevronRight, 
  SlidersHorizontal, CheckCircle2, Clock, DollarSign, Briefcase, LayoutGrid, List 
} from 'lucide-react';

export default function CoachList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' veya 'list'

  // ZENGİNLEŞTİRİLMİŞ VERİ
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
      
      {/* --- HERO (BAŞLIK) BÖLÜMÜ - TURUNCU TEMA --- */}
      {/* Arka plan gradyanı markanın turuncu/kırmızı tonlarında */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 pb-16 pt-20 px-4 relative overflow-hidden">
        {/* Arka plan deseni */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                Potansiyelinizi Keşfedecek <br/> <span className="text-yellow-300">Uzman Koçu</span> Bulun
            </h1>
            <p className="text-lg text-red-50 max-w-2xl mx-auto mb-10">
                ICF sertifikalı, deneyimli ve alanında uzman yüzlerce profesyonel arasından hedeflerinize en uygun yol arkadaşını seçin.
            </p>
            
            {/* ARAMA KUTUSU */}
            <div className="max-w-3xl mx-auto relative shadow-2xl rounded-2xl overflow-hidden border-4 border-white/20">
                <div className="flex bg-white h-16">
                    <div className="flex-1 flex items-center px-6">
                        <Search className="text-gray-400 w-6 h-6 mr-4" />
                        <input 
                            type="text" 
                            placeholder="İsim, uzmanlık alanı veya anahtar kelime ile ara..." 
                            className="w-full h-full outline-none text-gray-700 text-lg font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-gray-900 hover:bg-black text-white font-bold px-10 transition-colors text-lg">
                        Ara
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* --- İÇERİK BÖLÜMÜ --- */}
      <div className="max-w-7xl mx-auto px-4 py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* SOL: FİLTRELEME (SIDEBAR) */}
            <div className="hidden lg:block space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900"><SlidersHorizontal className="w-5 h-5"/> Filtrele</h3>
                        <button className="text-xs text-red-600 font-semibold hover:underline">Temizle</button>
                    </div>

                    {/* KATEGORİLER */}
                    <div className="mb-8 pb-6 border-b border-gray-100">
                        <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">Uzmanlık Alanı</h4>
                        <div className="space-y-3">
                            {['Tümü', 'Liderlik', 'Kariyer', 'Girişimcilik', 'İletişim', 'Finans'].map(cat => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center group-hover:border-red-500 transition-colors">
                                        {/* Checkbox ikonu simülasyonu */}
                                        {cat === 'Tümü' && <div className="w-3 h-3 bg-red-500 rounded-sm"></div>}
                                    </div>
                                    <span className="text-gray-700 font-medium group-hover:text-red-600 transition-colors">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* DENEYİM */}
                    <div className="mb-8 pb-6 border-b border-gray-100">
                        <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">Deneyim</h4>
                        <div className="space-y-3">
                            {['0-5 Yıl', '5-10 Yıl', '10+ Yıl'].map(exp => (
                                <label key={exp} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center group-hover:border-red-500 transition-colors">
                                        {/* Radio ikonu simülasyonu */}
                                        {exp === '5-10 Yıl' && <div className="w-3 h-3 bg-red-500 rounded-full"></div>}
                                    </div>
                                    <span className="text-gray-700 font-medium group-hover:text-red-600 transition-colors">{exp}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* FİYAT ARALIĞI */}
                    <div>
                        <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">Seans Ücreti</h4>
                        <div className="px-2">
                            <input type="range" min="500" max="5000" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"/>
                            <div className="flex justify-between text-sm font-bold text-gray-700 mt-3">
                                <span>500 ₺</span>
                                <span>5000 ₺</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SAĞ: KOÇ LİSTESİ */}
            <div className="lg:col-span-3">
                
                {/* SIRALAMA VE GÖRÜNÜM */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-gray-600 font-medium mb-4 sm:mb-0"><span className="font-bold text-gray-900 text-lg">4</span> koç listeleniyor</p>
                    <div className="flex items-center gap-4">
                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5 outline-none font-medium">
                            <option>Önerilen Sıralama</option>
                            <option>Puana Göre (Yüksek-Düşük)</option>
                            <option>Fiyata Göre (Artan)</option>
                            <option>Fiyata Göre (Azalan)</option>
                        </select>
                        <div className="flex border rounded-lg overflow-hidden">
                            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-red-50 text-red-600' : 'bg-white text-gray-500'} hover:bg-red-50 transition-colors`}><LayoutGrid className="w-5 h-5"/></button>
                            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-red-50 text-red-600' : 'bg-white text-gray-500'} hover:bg-red-50 transition-colors`}><List className="w-5 h-5"/></button>
                        </div>
                    </div>
                </div>

                {/* KARTLAR (GRID GÖRÜNÜMÜ) */}
                <div className="grid md:grid-cols-2 gap-8">
                    {coaches.map((coach) => (
                        <div key={coach.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
                            
                            {/* KART ÜSTÜ (RENK DEĞİŞTİ) */}
                            <div className="relative h-28 bg-gradient-to-r from-red-600 to-orange-500">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                {coach.isPremium && (
                                    <span className="absolute top-4 right-4 bg-white/90 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-sm">
                                        <Star className="w-3 h-3 fill-current"/> Premium Koç
                                    </span>
                                )}
                            </div>

                            <div className="px-6 pb-6 relative flex-1 flex flex-col">
                                {/* Profil Resmi (Daha büyük ve belirgin) */}
                                <div className="absolute -top-14 left-6 p-1 bg-white rounded-2xl shadow-md">
                                    <img src={coach.image} className="w-28 h-28 rounded-xl object-cover" alt={coach.name} />
                                </div>

                                {/* İsim ve Puan */}
                                <div className="mt-16 flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-2xl text-gray-900 group-hover:text-red-600 transition-colors leading-tight">{coach.name}</h3>
                                        <p className="text-gray-500 font-medium">{coach.title}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-yellow-700 font-bold text-lg">
                                            <Star className="w-5 h-5 fill-current text-yellow-500"/> {coach.rating}
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1">({coach.reviews} yorum)</span>
                                    </div>
                                </div>

                                {/* Detaylar (İkonlu) */}
                                <div className="mt-6 space-y-3 text-sm text-gray-700 font-medium bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Briefcase className="w-5 h-5 text-blue-500"/> 
                                        <span>{coach.experience} Profesyonel Deneyim</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-green-500"/> 
                                        <span>En Erken Müsaitlik: <span className="text-green-600 font-bold">{coach.nextAvailable}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-purple-500"/> 
                                        <span>Online Görüntülü Görüşme</span>
                                    </div>
                                </div>

                                {/* Etiketler */}
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {coach.specialties.map(tag => (
                                        <span key={tag} className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors">{tag}</span>
                                    ))}
                                </div>

                                {/* Alt Kısım: Fiyat ve Buton */}
                                <div className="mt-8 pt-6 border-t flex items-center justify-between mt-auto">
                                    <div>
                                        <span className="text-xs text-gray-500 block font-medium mb-1">45 Dk. Seans Ücreti</span>
                                        <span className="text-2xl font-black text-gray-900">{coach.price} ₺</span>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/coach/${coach.id}`)}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                                    >
                                        Profili İncele <ChevronRight className="w-5 h-5"/>
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Sayfalama */}
                <div className="mt-16 flex justify-center">
                    <nav className="inline-flex rounded-xl shadow-sm bg-white border border-gray-200 p-1">
                        <button className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Önceki</button>
                        <button className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-sm">1</button>
                        <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors">2</button>
                        <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors">3</button>
                        <button className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Sonraki</button>
                    </nav>
                </div>

            </div>
        </div>
      </div>

    </div>
  );
}
