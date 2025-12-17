// src/pages/About.tsx
// @ts-nocheck
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900">Hakkımızda</h1>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Kariyeer, bireylerin ve kurumların kariyer gelişimi süreçlerinde
            ihtiyaç duydukları koçluk ve danışmanlık hizmetlerine erişimini
            kolaylaştırmak amacıyla oluşturulmuş bir dijital platformdur.
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Platform; yeni mezunlardan profesyonellere, kariyer değişikliği
            planlayanlardan liderlik becerilerini geliştirmek isteyen bireylere
            kadar geniş bir kullanıcı kitlesini, alanında uzman koçlarla bir
            araya getirmeyi hedefler.
          </p>

          {/* Ne Yapıyoruz */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900">
              Ne Yapıyoruz?
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Kariyeer üzerinden kullanıcılar koç profillerini inceleyebilir,
              ihtiyaçlarına uygun koçlarla seans talebi oluşturabilir ve online
              görüşmeler aracılığıyla kariyer hedeflerine yönelik destek alabilir.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Platform, tarafları bir araya getiren bir aracıdır; koçluk
              hizmetinin içeriği, kapsamı ve yöntemi koç ile kullanıcı arasında
              belirlenir.
            </p>
          </section>

          {/* Koçlar */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Koçlar</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Platformda yer alan koçlar başvuru sürecinden geçer. Profil
              bilgileri, uzmanlık alanları ve deneyimlerine göre listelenir.
              Kariyeer, koç ile kullanıcı arasındaki iletişim ve seans
              süreçlerinin dijital olarak yürütülmesini sağlar.
            </p>
          </section>

          {/* Şirketler */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Şirketler</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Şirketler, çalışanlarının gelişimi için platform üzerinden
              koçluk talepleri oluşturabilir, ihtiyaçlarına uygun koçlarla demo
              veya tanışma görüşmeleri talep edebilir.
            </p>
          </section>

          {/* İletişim & Yasal Not */}
          <section className="mt-10 rounded-xl border bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">İletişim</h2>
            <p className="mt-2 text-gray-700">
              Destek ve bilgilendirme talepleriniz için bizimle iletişime
              geçebilirsiniz:
            </p>
            <p className="mt-1 font-medium text-gray-900">
              support@kariyeer.com
            </p>

            <p className="mt-4 text-xs text-gray-500 leading-relaxed">
              Bu sayfadaki bilgiler bilgilendirme amaçlıdır. Platformda sunulan
              hizmetler ve kullanım koşulları, ilgili sözleşmeler, gizlilik
              politikası ve kullanım koşulları metinlerinde detaylı olarak
              açıklanmıştır.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
