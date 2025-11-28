# Badge Görünürlük Sorunu - Debug Analizi

## Mevcut Durum

### 1. Veri Akışı
```
SupabaseManager.execute_sql (ödeme sonrası)
    ↓
app_2dff6511da_subscriptions tablosu (badge yazılıyor)
    ↓
SubscriptionContext.refreshData() (veri çekiliyor)
    ↓
subscriptionService.getAllActiveByUserId() (aktif badge'ler)
    ↓
Dashboard.tsx (görüntüleme)
```

### 2. Tespit Edilen Sorunlar

#### A. RLS Policy Sorunu
- `app_2dff6511da_subscriptions` tablosunda RLS policy var
- Kullanıcı kendi badge'lerini okuyamıyor olabilir
- Edge function `app_2dff6511da_get_my_subscriptions` var ama kullanılmıyor

#### B. Veri Senkronizasyon Sorunu
- Ödeme tamamlandıktan sonra badge yazılıyor
- Ancak Dashboard'da görünmüyor
- Manuel refresh butonu var ama çalışmıyor olabilir

#### C. Polling Mekanizması
- VerificationBadgeModal.tsx'te polling var (3 saniye aralıklarla)
- Ancak sadece transaction tablosunu kontrol ediyor
- Subscription tablosunu kontrol etmiyor

### 3. Çözüm Önerileri

#### Öncelik 1: RLS Policy Kontrolü
```sql
-- Mevcut policy'leri kontrol et
SELECT * FROM pg_policies 
WHERE tablename = 'app_2dff6511da_subscriptions';

-- Kullanıcı kendi subscription'larını okuyabilmeli
CREATE POLICY "Users can read own subscriptions"
ON app_2dff6511da_subscriptions
FOR SELECT
USING (auth.uid() = user_id);
```

#### Öncelik 2: Edge Function Kullanımı
- `subscriptionService.getAllActiveByUserId()` fonksiyonunu güncelle
- RLS bypass için edge function kullan
- `app_2dff6511da_get_my_subscriptions` edge function'ını çağır

#### Öncelik 3: Debug Logs Ekle
- SubscriptionContext.tsx'e console.log ekle
- Dashboard.tsx'e console.log ekle
- Hangi aşamada veri kayboluyor tespit et

### 4. Test Senaryosu
1. Ödeme yap
2. Console'da logları kontrol et
3. Manuel refresh butonuna bas
4. Network tab'ında subscription query'sini kontrol et
5. Response'da badge var mı kontrol et
