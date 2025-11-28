# Kariyeer.com - Vercel Deployment

## 🚀 Hızlı Başlangıç

Bu proje Vercel'e deploy edilmeye hazır hale getirilmiştir.

### Deployment Dosyaları

- ✅ `vercel.json` - Vercel konfigürasyonu
- ✅ `.vercelignore` - Deploy edilmeyecek dosyalar  
- ✅ `VERCEL_DEPLOYMENT_GUIDE.md` - Detaylı deployment rehberi

### Önemli Bilgiler

**Supabase Bağlantısı:**
- Project URL: `https://wzadnstzslxvuwmmjmwn.supabase.co`
- Anon Key: Otomatik olarak `vercel.json` içinde tanımlı

**Alan Adı:**
- Hedef: `www.kariyeer.com`
- DNS: CNAME → `cname.vercel-dns.com`

### Deployment Adımları (Özet)

1. **Export:** MGX'ten projeyi ZIP olarak indirin
2. **Upload:** Vercel'e yükleyin
3. **Deploy:** Otomatik build başlayacak (3-5 dakika)
4. **Domain:** `www.kariyeer.com` ekleyin
5. **DNS:** GoDaddy'de CNAME kaydı oluşturun
6. **Test:** 10-30 dakika sonra siteyi test edin

**Detaylı talimatlar için:** `VERCEL_DEPLOYMENT_GUIDE.md` dosyasını okuyun.

---

## 📁 Proje Yapısı

```
shadcn-ui/
├── src/
│   ├── components/     # React bileşenleri
│   ├── contexts/       # Auth & Subscription contexts
│   ├── lib/           # Supabase client & utilities
│   ├── pages/         # Sayfa bileşenleri
│   └── App.tsx        # Ana uygulama
├── public/            # Statik dosyalar
├── supabase/          # Edge functions (ayrı deploy)
├── vercel.json        # Vercel config ✅
├── .vercelignore      # Ignore dosyaları ✅
└── package.json       # Dependencies

```

---

## 🔧 Teknoloji Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Shadcn-UI + Tailwind CSS
- **Backend:** Supabase (Auth, Database, Storage)
- **Payment:** Iyzico (Turkish payment gateway)
- **Deployment:** Vercel
- **Domain:** www.kariyeer.com

---

## 🌐 Environment Variables

Vercel'de otomatik olarak tanımlı:

```env
VITE_SUPABASE_URL=https://wzadnstzslxvuwmmjmwn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📦 Build Komutları

```bash
# Dependencies yükle
pnpm install

# Development server
pnpm run dev

# Production build
pnpm run build

# Build önizleme
pnpm run preview

# Lint kontrolü
pnpm run lint
```

---

## 🔐 Güvenlik

- ✅ Row Level Security (RLS) aktif
- ✅ JWT token authentication
- ✅ HTTPS zorunlu
- ✅ API keys environment variables'da
- ✅ CORS yapılandırması

---

## 📞 Destek

Sorularınız için:
- 📧 Email: support@kariyeer.com
- 💬 MGX Platform: @Alex
- 📚 Docs: VERCEL_DEPLOYMENT_GUIDE.md

---

**Son Güncelleme:** 2025-11-28  
**Versiyon:** 1.0.0  
**Durum:** Production Ready ✅