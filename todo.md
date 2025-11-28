# Ödeme ve Abonelik Sistemi - LocalStorage Tabanlı

## Genel Bakış
LocalStorage kullanarak tam fonksiyonel bir ödeme ve abonelik yönetim sistemi.

## Dosya Yapısı (Maksimum 8 dosya)

### 1. src/lib/storage.ts
- LocalStorage yönetimi
- Kullanıcı, abonelik, ödeme, fatura CRUD işlemleri
- Veri tipleri ve interface'ler

### 2. src/contexts/AuthContext.tsx
- Kullanıcı kimlik doğrulama (basit demo)
- Login/logout işlemleri
- Kullanıcı durumu yönetimi

### 3. src/contexts/SubscriptionContext.tsx
- Abonelik durumu yönetimi
- Rozet satın alma işlemleri
- Abonelik iptal/yenileme

### 4. src/pages/Dashboard.tsx
- Kullanıcı dashboard ana sayfası
- Aktif abonelikler görünümü
- Hızlı aksiyonlar (yenile, iptal, upgrade)

### 5. src/pages/PaymentPage.tsx
- Ödeme formu
- Kart bilgileri girişi (demo)
- Ödeme işlemi simülasyonu

### 6. src/components/InvoiceGenerator.tsx
- Fatura oluşturma ve görüntüleme
- PDF indirme fonksiyonu
- Fatura detayları

### 7. src/pages/SubscriptionHistory.tsx
- Ödeme geçmişi
- Fatura arşivi
- Abonelik değişiklikleri timeline

### 8. src/components/VerificationBadgeModal.tsx (Güncelleme)
- Mevcut modal'ı güncelle
- AuthContext ve SubscriptionContext entegrasyonu
- PaymentPage'e yönlendirme

## Özellikler
✅ Rozet satın alma (Mavi Tik: 99₺/ay, Altın Tik: 299₺/ay)
✅ Kullanıcı dashboard
✅ Ödeme formu (demo mode)
✅ Fatura oluşturma ve indirme
✅ Abonelik yönetimi (iptal, yenileme, upgrade)
✅ Ödeme geçmişi
✅ Çoklu dil desteği (TR, EN, FR)

## Uygulama Adımları
1. ✅ Todo.md oluştur
2. ⏳ storage.ts - Veri yönetimi
3. ⏳ AuthContext.tsx - Kimlik doğrulama
4. ⏳ SubscriptionContext.tsx - Abonelik yönetimi
5. ⏳ Dashboard.tsx - Kullanıcı paneli
6. ⏳ PaymentPage.tsx - Ödeme sayfası
7. ⏳ InvoiceGenerator.tsx - Fatura sistemi
8. ⏳ SubscriptionHistory.tsx - Geçmiş
9. ⏳ VerificationBadgeModal.tsx güncelle
10. ⏳ App.tsx'e route'ları ekle
11. ⏳ i18n.ts'e yeni çevirileri ekle
12. ⏳ Navbar'a Dashboard linki ekle