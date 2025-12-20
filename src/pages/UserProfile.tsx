// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  BadgeCheck,
  ShieldCheck,
  Calendar,
  ArrowRight,
  LogIn,
  Pencil,
  Save,
  X,
} from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const [editOpen, setEditOpen] = useState(false);

  // Edit form state (profiles tablosu ile 1:1)
  const [form, setForm] = useState({
    full_name: "",
    title: "",
    sector: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        const user = data?.user || null;
        if (!mounted) return;

        setMe(user);

        if (!user) {
          setProfile(null);
          return;
        }

        // Profile çek (satır yoksa null döner)
        const { data: pData, error: pErr } = await supabase
          .from("profiles")
          .select("id, full_name, title, sector, city, phone, created_at, updated_at")
          .eq("id", user.id)
          .maybeSingle();

        if (pErr) {
          console.error("profiles select error:", pErr);
          setProfile(null);
          // formu en azından user metadata ile doldur
          setForm({
            full_name: user?.user_metadata?.full_name || "",
            title: "",
            sector: "",
            city: "",
            phone: "",
          });
          return;
        }

        const p = pData || null;
        setProfile(p);

        setForm({
          full_name: p?.full_name || user?.user_metadata?.full_name || "",
          title: p?.title || "",
          sector: p?.sector || "",
          city: p?.city || "",
          phone: p?.phone || "",
        });
      } catch (e) {
        console.error("UserProfile load error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const displayName =
    profile?.full_name ||
    me?.user_metadata?.full_name ||
    me?.email?.split("@")?.[0] ||
    "Kullanıcı";

  const completion = useMemo(() => {
    if (!me) return 0;
    const checks = [
      !!(profile?.full_name || me?.user_metadata?.full_name),
      !!profile?.phone,
      !!profile?.city,
      !!profile?.title,
      !!profile?.sector,
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [me, profile]);

  const lastSignIn = useMemo(() => {
    const raw = me?.last_sign_in_at;
    if (!raw) return "-";
    try {
      const d = new Date(raw);
      return d.toLocaleString();
    } catch {
      return raw;
    }
  }, [me]);

  const openEdit = () => {
    if (!me) return;
    // ✅ artık edit sayfasına gidiyoruz
    navigate("/user/profile/edit");
  };

  const closeEdit = () => {
    // kaydetmeden kapatılırsa mevcut profile’a geri döndür
    setForm({
      full_name: profile?.full_name || me?.user_metadata?.full_name || "",
      title: profile?.title || "",
      sector: profile?.sector || "",
      city: profile?.city || "",
      phone: profile?.phone || "",
    });
    setEditOpen(false);
  };

  const saveProfile = async () => {
    if (!me?.id) {
      toast.error("Lütfen giriş yapın.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: me.id, // ✅ kritik: auth.uid() = id
        full_name: (form.full_name || "").trim(),
        title: (form.title || "").trim(),
        sector: (form.sector || "").trim(),
        city: (form.city || "").trim(),
        phone: (form.phone || "").trim(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(payload, {
        onConflict: "id",
      });

      if (error) {
        console.error("profiles upsert error:", error);
        toast.error("Kaydedilemedi. RLS veya tablo kolonlarını kontrol et.");
        return;
      }

      toast.success("Profil güncellendi.");

      // tekrar çek (garanti)
      const { data: pData, error: pErr } = await supabase
        .from("profiles")
        .select("id, full_name, title, sector, city, phone, created_at, updated_at")
        .eq("id", me.id)
        .maybeSingle();

      if (!pErr) setProfile(pData || payload);

      setEditOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Beklenmeyen bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-700">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="border-b border-orange-100 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-xs text-white/90">User Profile</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-white">
            {me ? displayName : "Profil"}
          </h1>
          <p className="mt-2 text-sm text-white/90 max-w-2xl">
            Profil bilgilerin, koç eşleşmelerini ve seans deneyimini doğrudan etkiler.
            Ne kadar net olursan, sonuç o kadar hızlı gelir.
          </p>

          {/* Completion */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center justify-between text-xs text-white/90">
              <span>Profil tamamlanma</span>
              <span className="font-semibold">%{me ? completion : 0}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/25 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${me ? completion : 0}%` }} />
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-6 flex gap-2 flex-wrap">
            <Button
              className="rounded-xl bg-white text-slate-900 hover:bg-white/90"
              onClick={() => navigate("/user/dashboard")}
            >
              Dashboard <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              className="rounded-xl border-white/70 text-white hover:bg-white/10"
              onClick={() => navigate("/coaches")}
            >
              Koçları İncele
            </Button>

            {me ? (
              <Button
                variant="outline"
                className="rounded-xl border-white/70 text-white hover:bg-white/10"
                onClick={() => navigate("/user/profile/edit")} // ✅ İSTEDİĞİN EKLENDİ
              >
                <Pencil className="h-4 w-4 mr-2" />
                Profili Düzenle
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Not logged in */}
        {!me ? (
          <Card className="border-slate-200">
            <CardContent className="p-8">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <LogIn className="h-5 w-5 text-slate-900" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Profilini görmek için giriş yap
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Giriş yapınca hesap bilgilerin ve profil alanların burada görünecek.
                  </p>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Link to="/login">
                      <Button className="rounded-xl">Giriş Yap</Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="outline" className="rounded-xl">
                        Kayıt Ol
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Account */}
              <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-600" /> Hesap Bilgileri
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-sm text-slate-700">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <div className="mt-1 font-semibold text-slate-900">
                        {me?.email || "-"}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <BadgeCheck className="h-4 w-4" />
                        User ID
                      </div>
                      <div className="mt-1 font-mono text-xs text-slate-900 break-all">
                        {me?.id || "-"}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <ShieldCheck className="h-4 w-4" />
                        Son giriş
                      </div>
                      <div className="mt-1 font-semibold text-slate-900">
                        {lastSignIn}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Phone className="h-4 w-4" />
                        Telefon
                      </div>
                      <div className="mt-1 font-semibold text-slate-900">
                        {profile?.phone || "-"}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Telefon / şehir / sektör gibi alanlar profilden gelir.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2 flex-wrap">
                    <Button className="rounded-xl" onClick={() => navigate("/user/settings")}>
                      Ayarlar
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => navigate("/how-it-works")}
                    >
                      Nasıl çalışır?
                    </Button>

                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => navigate("/user/profile/edit")} // ✅ İSTEDİĞİN EKLENDİ
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Profili Düzenle
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Profile snapshot */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-orange-600" /> Profil Özeti
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-700 space-y-3">
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Unvan</p>
                      <p className="font-semibold text-slate-900">
                        {profile?.title || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Sektör</p>
                      <p className="font-semibold text-slate-900">
                        {profile?.sector || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Şehir</p>
                      <p className="font-semibold text-slate-900">
                        {profile?.city || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-500">Önerilen</p>
                    <p className="mt-1 text-sm text-slate-700">
                      Profilin %{completion}.{" "}
                      {completion < 70
                        ? "Biraz daha tamamla, eşleşme kalitesi yükselsin."
                        : "Gayet iyi. Seans planlamaya hazırsın."}
                    </p>

                    <div className="mt-4 flex gap-2 flex-wrap">
                      <Button className="rounded-xl w-full" onClick={() => navigate("/coaches")}>
                        Koçları İncele <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl w-full"
                        onClick={() => navigate("/book-session")}
                      >
                        Seanslar
                      </Button>
                    </div>

                    <div className="mt-3">
                      <Button
                        variant="outline"
                        className="rounded-xl w-full"
                        onClick={() => navigate("/user/profile/edit")} // ✅ ekstra CTA
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Profili Düzenle
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom strip */}
            <div className="mt-6">
              <Card className="border-slate-200 bg-slate-50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-slate-900" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Hızlı akış</p>
                        <p className="mt-1 text-sm text-slate-600">
                          Hedefini netleştir → koçları filtrele → ilk seansı planla → aksiyon planı oluştur.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        className="rounded-xl"
                        onClick={() => navigate("/coach-selection-process")}
                      >
                        Koç seçimi rehberi
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => navigate("/user/dashboard")}
                      >
                        Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* EDIT MODAL (artık kullanılmıyor ama dosyada kalsın istersen) */}
            {editOpen ? (
              <div className="fixed inset-0 z-50">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={saving ? undefined : closeEdit}
                />
                <div className="absolute inset-x-0 top-10 sm:top-16 mx-auto w-[92%] max-w-2xl">
                  <Card className="border-slate-200 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-white">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Pencil className="h-4 w-4 text-orange-600" />
                            Profili Düzenle
                          </CardTitle>
                          <p className="mt-1 text-xs text-slate-500">
                            Bu bilgiler eşleşme kalitesini ve seans deneyimini etkiler.
                          </p>
                        </div>
                        <button
                          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                          onClick={saving ? undefined : closeEdit}
                          aria-label="Kapat"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </CardHeader>

                    <CardContent className="bg-white p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="text-xs text-slate-600">Ad Soyad</label>
                          <input
                            value={form.full_name}
                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            placeholder="Örn: Salih Gökalp Büyükçelebi"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="text-xs text-slate-600">Unvan</label>
                          <input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Örn: Product Manager"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="text-xs text-slate-600">Sektör</label>
                          <input
                            value={form.sector}
                            onChange={(e) => setForm({ ...form, sector: e.target.value })}
                            placeholder="Örn: Yazılım, Fintech..."
                            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="text-xs text-slate-600">Şehir</label>
                          <input
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            placeholder="Örn: İstanbul"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="text-xs text-slate-600">Telefon</label>
                          <input
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="Örn: +90 5xx xxx xx xx"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row gap-2">
                        <Button
                          className="rounded-xl bg-orange-600 hover:bg-orange-500"
                          onClick={saveProfile}
                          disabled={saving}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? "Kaydediliyor..." : "Kaydet"}
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={closeEdit}
                          disabled={saving}
                        >
                          Vazgeç
                        </Button>
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        *Kaydet dediğinde veriler <span className="font-medium">profiles</span> tablosuna yazılır.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
