# Supabase Kurulum Rehberi - Kariyeer Platform

Bu rehber, Kariyeer platformunu Supabase ile entegre etmek için gerekli adımları içerir.

## 1. Supabase Projesi Oluşturma

1. [Supabase Dashboard](https://app.supabase.com)'a gidin
2. "New Project" butonuna tıklayın
3. Proje adı, veritabanı şifresi ve bölge seçin
4. "Create new project" butonuna tıklayın
5. Proje oluşturulmasını bekleyin (1-2 dakika)

## 2. Veritabanı Kurulumu

1. Supabase Dashboard'da sol menüden **SQL Editor**'ü açın
2. "New query" butonuna tıklayın
3. `supabase-setup.sql` dosyasının içeriğini kopyalayıp yapıştırın
4. "Run" butonuna tıklayarak SQL'i çalıştırın

Bu işlem şunları oluşturacak:
- `profiles` tablosu (kullanıcı profilleri)
- `subscriptions` tablosu (abonelikler)
- `bookings` tablosu (randevular)
- Gerekli indeksler
- Row Level Security (RLS) politikaları
- Otomatik profil oluşturma trigger'ı

## 3. API Anahtarlarını Alma

1. Supabase Dashboard'da sol menüden **Settings** > **API**'ye gidin
2. Aşağıdaki bilgileri kopyalayın:
   - **Project URL** (örn: `https://xxxxx.supabase.co`)
   - **anon public** key (uzun bir string)

## 4. Proje Yapılandırması

1. Proje kök dizininde `.env` dosyası oluşturun:

```bash
cp .env.example .env
```

2. `.env` dosyasını açın ve Supabase bilgilerinizi ekleyin:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Authentication Ayarları

1. Supabase Dashboard'da **Authentication** > **Providers**'a gidin
2. **Email** provider'ın aktif olduğundan emin olun
3. (İsteğe bağlı) **Settings** > **Auth** bölümünden:
   - Email confirmation'ı açabilir/kapatabilirsiniz
   - Password minimum uzunluğunu ayarlayabilirsiniz

## 6. Test Etme

1. Geliştirme sunucusunu başlatın:

```bash
pnpm run dev
```

2. Tarayıcıda `http://localhost:5173` adresine gidin
3. "Kayıt Ol" butonuna tıklayın ve yeni bir hesap oluşturun
4. Giriş yapın ve dashboard'a erişin

## 7. Veritabanı Kontrolü

1. Supabase Dashboard'da **Table Editor**'e gidin
2. `profiles` tablosunda yeni kullanıcının oluşturulduğunu kontrol edin
3. `auth.users` tablosunda authentication kaydını görebilirsiniz

## Önemli Notlar

### Güvenlik
- `.env` dosyasını asla Git'e commit etmeyin
- Production'da environment variables kullanın
- RLS politikalarını her zaman aktif tutun

### LocalStorage Fallback
- Eğer Supabase yapılandırılmamışsa, sistem otomatik olarak localStorage kullanır
- Bu demo/test amaçlıdır, production'da Supabase kullanılmalıdır

### Email Confirmation
- Varsayılan olarak Supabase email confirmation gerektirir
- Test için bunu kapatabilirsiniz: **Authentication** > **Settings** > **Enable email confirmations** (OFF)

## Sorun Giderme

### "Invalid API key" hatası
- `.env` dosyasındaki `VITE_SUPABASE_ANON_KEY`'in doğru olduğundan emin olun
- Geliştirme sunucusunu yeniden başlatın

### "Row Level Security" hatası
- SQL Editor'de `supabase-setup.sql`'i tekrar çalıştırın
- RLS politikalarının doğru oluşturulduğunu kontrol edin

### Kullanıcı oluşturulamıyor
- `handle_new_user()` fonksiyonunun ve trigger'ın çalıştığından emin olun
- Supabase logs'u kontrol edin: **Logs** > **Postgres Logs**

## Ek Özellikler

### Storage (Dosya Yükleme)
Gelecekte dosya yükleme için:
1. **Storage** > **New bucket** oluşturun
2. Bucket policies ayarlayın
3. `supabase.storage.from('bucket-name')` kullanın

### Realtime (Canlı Güncellemeler)
Realtime özellikler için:
1. **Database** > **Replication**'da tabloları aktif edin
2. `supabase.from('table').on('*', callback).subscribe()` kullanın

## Destek

Daha fazla bilgi için:
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)