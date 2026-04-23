// src/pages/About.tsx
// @ts-nocheck

export default function About() {
  return (
    <main className="flex-1 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Hakkımızda</h1>

        <p className="mt-4 text-gray-600 leading-relaxed">
          Kariyeer, bireylerin ve kurumların kişisel ve profesyonel gelişim süreçlerinde
          ihtiyaç duydukları <strong>mentorluk, eğitim ve koçluk danışmanlığı</strong> hizmetlerine erişimini
          kolaylaştırmak amacıyla oluşturulmuş bir teknoloji platformudur.
        </p>

        <p className="mt-4 text-gray-600 leading-relaxed">
          Platformumuz; yetkinliklerini artırmak, liderlik becerilerini geliştirmek veya 
          kariyer yolculuklarında profesyonel bir rehberlik almak isteyen bireyleri, 
          bağımsız danışman ve mentorlarla dijital bir ortamda buluşturur.
        </p>

        {/* Vizyonumuz */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">Vizyonumuz</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Temel amacımız, iş gücü piyasasındaki bireylerin eğitim ve gelişim yoluyla 
            kendi potansiyellerini keşfetmelerine yardımcı olmaktır. Kariyeer, bir 
            <strong> iş bulma veya işe yerleştirme kurumu değildir</strong>; bireylerin bu süreçlere 
            hazırlanmasını sağlayan bir "gelişim durağı"dır.
          </p>
        </section>

        {/* Ne Yapıyoruz */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">Neler Sunuyoruz?</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Kullanıcılar platform üzerinden uzman danışmanların profillerini inceleyebilir, 
            kişisel gelişim odaklı seans talepleri oluşturabilir ve online mentorluk alabilirler. 
            Verilen hizmetler; mülakat teknikleri eğitimi, özgeçmiş hazırlama danışmanlığı ve 
            stratejik yetkinlik geliştirme üzerine odaklıdır.
          </p>
        </section>

        {/* Kurumsal Çözümler */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">Kurumsal Gelişim Danışmanlığı</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Şirketler, ekiplerinin performansını artırmak ve çalışan bağlılığını güçlendirmek adına 
            danışmanlarımızdan kurumsal eğitim ve mentorluk programları talep edebilirler.
          </p>
        </section>

        {/* ÖNEMLİ YASAL BEYAN - İŞKUR KORUMASI */}
        <section className="mt-12 rounded-xl border-2 border-orange-100 bg-orange-50/30 p-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Yasal Bilgilendirme</h2>
          <p className="mt-3 text-sm text-gray-700 leading-relaxed">
            Kariyeer.com, 4904 sayılı Türkiye İş Kurumu Kanunu kapsamında faaliyet gösteren bir 
            <strong> Özel İstihdam Bürosu değildir</strong>. Platformumuz üzerinden doğrudan veya dolaylı 
            olarak işe yerleştirme, iş bulma veya personel tedariki faaliyetleri yürütülmemektedir. 
          </p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Kariyeer; yalnızca danışmanlık, eğitim ve mentorluk hizmeti sunan profesyoneller ile bu 
            hizmetlerden yararlanmak isteyen kullanıcıları bir araya getiren bir <strong>SaaS (Yazılım Hizmeti) 
            platformudur.</strong> Tüm ödemeler "Eğitim ve Danışmanlık Hizmet Bedeli" kapsamında değerlendirilir.
          </p>
        </section>

        {/* İletişim */}
        <section className="mt-10 p-6">
          <h2 className="text-lg font-semibold text-gray-900">İletişim</h2>
          <p className="mt-1 font-medium text-gray-900">support@kariyeer.com</p>
        </section>
      </div>
    </main>
  );
}
