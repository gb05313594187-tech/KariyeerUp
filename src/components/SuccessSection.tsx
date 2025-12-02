import React from 'react';

// --- Yardımcı İkon Bileşeni (Kartın içinde kullanılır) ---
const StarIcon = ({ fill }: { fill: boolean }) => (
  <svg className={`w-4 h-4 ${fill ? 'text-orange-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.817 2.045a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.817-2.045a1 1 0 00-1.175 0l-2.817 2.045c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.09 8.72a1 1 0 01.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
  </svg>
);

// --- Tekil Başarı Hikayesi Kartı Bileşeni ---
interface TestimonialCardProps {
  quote: string;
  name: string;
  newRole: string;
  imageSrc: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, newRole, imageSrc, rating }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 p-6 flex flex-col h-full border border-gray-100">
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} fill={i < rating} />
        ))}
      </div>
      <blockquote className="text-gray-700 italic border-l-4 border-orange-500 pl-4 mb-6 flex-grow">
        "{quote}"
      </blockquote>
      <div className="flex items-center mt-auto pt-4 border-t border-gray-50">
        <img
          src={imageSrc}
          alt={name}
          className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-orange-500/50"
        />
        <div>
          <p className="font-bold text-gray-900">{name}</p>
          <p className="text-sm text-orange-600 font-medium">{newRole}</p>
        </div>
      </div>
    </div>
  );
};


// --- Örnek Başarı Hikayeleri Verisi ---
const testimonialsData = [
  {
    quote: "Koçluk sayesinde kariyer hedefim netleşti ve 6 ay içinde sektör değiştirdim. Kariyerimdeki en doğru adımdı!",
    name: "Ayşe Yılmaz",
    newRole: "Yazılım Geliştirici -> Proje Yöneticisi 🚀",
    imageSrc: "/images/user-ayse.jpg",
    rating: 5,
  },
  {
    quote: "Maaş zammı talebimi nasıl yapacağımı öğrendim. Özgüvenim arttı ve istediğim %30 zammı aldım. Teşekkürler Kariyeer!",
    name: "Murat Demir",
    newRole: "Satış Müdürü (+%30 Maaş Artışı 💰)",
    imageSrc: "/images/user-murat.jpg",
    rating: 5,
  },
  {
    quote: "Stres yönetimi konusunda öğrendiklerim, iş-yaşam dengemi kurmamı sağladı. Artık çok daha mutluyum ve verimliyim.",
    name: "Elif Kaya",
    newRole: "Kurumsal İletişim Uzmanı (Gelişmiş İş-Yaşam Dengesi)",
    imageSrc: "/images/user-elif.jpg",
    rating: 4,
  },
];


// --- ANA EXPORT EDİLECEK BÖLÜM (Sadece bu dışarıya açılır) ---
export const SuccessSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <p className="text-lg font-semibold text-orange-600 uppercase tracking-wider mb-2">
            SOMUT KAZANÇLAR
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Sizin Gibi Başaranlar Konuşuyor 🗣️
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Kariyeer koçluğu alanların kariyerinde oluşan somut artılar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};
