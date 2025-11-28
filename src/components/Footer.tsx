import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();

  const footerSections = [
    {
      title: language === 'tr' ? 'Platform' : 'Platform',
      links: [
        { name: language === 'tr' ? 'Ana Sayfa' : 'Home', path: '/' },
        { name: language === 'tr' ? 'Koçlar' : 'Coaches', path: '/coaches' },
        { name: language === 'tr' ? 'Koç Seçim Süreci' : 'Coach Selection', path: '/coach-selection' },
        { name: language === 'tr' ? 'Gelir Modeli' : 'Revenue Model', path: '/revenue-model' },
      ],
    },
    {
      title: language === 'tr' ? 'Başvurular' : 'Applications',
      links: [
        { name: language === 'tr' ? 'Koç Başvurusu' : 'Coach Application', path: '/coach-application' },
        { name: language === 'tr' ? 'Kurumsal İş Birliği' : 'Corporate Partnership', path: '/partnership' },
      ],
    },
    {
      title: language === 'tr' ? 'Yasal' : 'Legal',
      links: [
        { name: language === 'tr' ? 'KVKK Aydınlatma Metni' : 'KVKK Information', path: '/kvkk-aydinlatma' },
        { name: language === 'tr' ? 'Çerez Politikası' : 'Cookie Policy', path: '/cerez-politikasi' },
        { name: language === 'tr' ? 'Kullanım Sözleşmesi' : 'Terms of Use', path: '/kullanim-sozlesmesi' },
        { name: language === 'tr' ? 'Koç Sözleşmesi' : 'Coach Agreement', path: '/koc-sozlesmesi' },
        { name: language === 'tr' ? 'Danışan Sözleşmesi' : 'Client Agreement', path: '/danisan-sozlesmesi' },
      ],
    },
    {
      title: language === 'tr' ? 'İletişim' : 'Contact',
      links: [
        { name: 'info@kariyeer.com', path: 'mailto:info@kariyeer.com', external: true },
        { name: 'kvkk@kariyeer.com', path: 'mailto:kvkk@kariyeer.com', external: true },
        { name: '+90 (212) 123 45 67', path: 'tel:+902121234567', external: true },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.path}
                        className="text-sm hover:text-red-400 transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-sm hover:text-red-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-white">Kariyeer</span>
            </div>

            <div className="text-sm text-center md:text-left">
              <p className="mb-2">
                {language === 'tr'
                  ? 'Platformda yalnızca ICF veya MYK tarafından sertifikalandırılmış koçlara yer verilir.'
                  : 'Only coaches certified by ICF or MYK are included on the platform.'}
              </p>
              <p className="text-gray-500">
                © 2024 Kariyeer. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
              </p>
            </div>

            <div className="flex space-x-4">
              <a href="#" className="hover:text-red-400 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-red-400 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-red-400 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}