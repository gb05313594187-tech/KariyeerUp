# 🚀 Vercel Deployment Rehberi - Kariyeer.com

Bu rehber, projenizi Vercel'e deploy etmek ve **www.kariyeer.com** alan adını bağlamak için adım adım talimatlar içerir.

## 📋 Ön Hazırlık (Tamamlandı ✅)

Proje Vercel deployment için hazırlandı:
- ✅ `vercel.json` - Vercel konfigürasyonu
- ✅ `.vercelignore` - Deploy edilmeyecek dosyalar
- ✅ Supabase environment variables otomatik eklenmiş
- ✅ SPA routing yapılandırması hazır

---

## 🎯 Adım 1: Projeyi Export Edin

1. MGX platformunda **sağ üst köşedeki Share butonuna** tıklayın
2. **Export** butonuna tıklayın
3. ZIP dosyası bilgisayarınıza inecek
4. ZIP dosyasını bir klasöre çıkarın

---

## 🌐 Adım 2: Vercel Hesabı Oluşturun

1. [vercel.com](https://vercel.com) adresine gidin
2. **Sign Up** butonuna tıklayın
3. **Continue with GitHub** seçeneğini seçin (önerilen)
4. GitHub hesabınızla giriş yapın

---

## 📤 Adım 3: Projeyi Vercel'e Yükleyin

### Yöntem A: Drag & Drop (En Kolay)

1. Vercel Dashboard'da **Add New...** → **Project** seçin
2. **Browse** veya **Upload** butonuna tıklayın
3. Çıkardığınız proje klasörünü seçin veya sürükleyip bırakın
4. Vercel otomatik olarak projeyi tanıyacak

### Yöntem B: Vercel CLI (Terminal)

```bash
# Vercel CLI'yi yükleyin (bir kez)
npm i -g vercel

# Proje klasörüne gidin
cd /path/to/extracted/project

# Deploy edin
vercel --prod
```

---

## ⚙️ Adım 4: Deployment Ayarları

Vercel otomatik olarak şu ayarları algılayacak:
- **Framework Preset:** Vite
- **Build Command:** `pnpm run build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

**Önemli:** Hiçbir ayarı değiştirmeyin, **Deploy** butonuna tıklayın!

---

## 🌍 Adım 5: Alan Adı Ekleyin (www.kariyeer.com)

### Vercel Dashboard'da:

1. Deploy tamamlandıktan sonra → **Settings** → **Domains**
2. Domain input alanına `www.kariyeer.com` yazın
3. **Add** butonuna tıklayın
4. Vercel size DNS kayıtlarını gösterecek:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

---

## 🔧 Adım 6: GoDaddy DNS Ayarları

1. [godaddy.com](https://godaddy.com) → **My Products** → **DNS**
2. **Manage DNS** butonuna tıklayın
3. **Add** butonuna tıklayın (yeni kayıt ekle)
4. Şu bilgileri girin:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600 seconds (10 dakika)
```

5. **Save** butonuna tıklayın

---

## ⏱️ Adım 7: DNS Propagation (Bekleme)

- DNS değişikliklerinin yayılması **10-30 dakika** sürebilir
- Vercel otomatik olarak SSL sertifikası oluşturacak
- Vercel Dashboard'da domain durumunu kontrol edebilirsiniz

**Durum Kontrol:**
```bash
# Terminal'de kontrol edin
nslookup www.kariyeer.com
```

---

## ✅ Adım 8: Test Edin

1. Tarayıcınızda `https://www.kariyeer.com` adresine gidin
2. Şunları kontrol edin:
   - ✅ Site yükleniyor mu?
   - ✅ HTTPS (yeşil kilit) aktif mi?
   - ✅ Giriş/Kayıt çalışıyor mu?
   - ✅ Ödeme sistemi çalışıyor mu?

---

## 🔒 Güvenlik Notları

- ✅ Supabase API anahtarları `vercel.json` içinde tanımlı
- ✅ Environment variables otomatik yükleniyor
- ✅ SSL sertifikası Vercel tarafından otomatik yönetiliyor
- ✅ HTTPS zorunlu (HTTP otomatik yönlendiriliyor)

---

## 🆘 Sorun Giderme

### Problem: "Domain not verified"
**Çözüm:** GoDaddy DNS ayarlarını kontrol edin, 30 dakika bekleyin

### Problem: "Build failed"
**Çözüm:** Vercel Dashboard → Deployments → Build Logs'u kontrol edin

### Problem: "404 on refresh"
**Çözüm:** `vercel.json` dosyasında SPA routing zaten yapılandırıldı

### Problem: "Supabase connection error"
**Çözüm:** Vercel Dashboard → Settings → Environment Variables'ı kontrol edin

---

## 📞 Destek

Herhangi bir sorunla karşılaşırsanız:
1. Vercel Dashboard → Support
2. [Vercel Community](https://github.com/vercel/vercel/discussions)
3. MGX platformunda @Alex'e mesaj atın

---

## 🎉 Tebrikler!

Projeniz artık **www.kariyeer.com** adresinde yayında! 🚀

**Sonraki Adımlar:**
- 📊 Vercel Analytics'i aktif edin (ücretsiz)
- 🔔 Deployment bildirimleri ayarlayın
- 🌍 CDN performansını izleyin
- 📈 SEO optimizasyonu yapın

---

**Deploy Tarihi:** 2025-11-28  
**Platform:** Vercel  
**Framework:** React + Vite + Shadcn-UI  
**Backend:** Supabase  
**Domain:** www.kariyeer.com