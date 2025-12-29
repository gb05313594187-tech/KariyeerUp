// src/pages/Index.tsx
// @ts-nocheck
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  PlayCircle,
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  Clock,
  Star,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  // Match filters
  const [goal, setGoal] = useState("interview");
  const [level, setLevel] = useState("mid");
  const [lang, setLang] = useState("tr");

  const i18n: any = {
    tr: {
      trustBadge: "Doğrulanmış Platform · Hedef Bazlı Takip",
      personas: {
        user: {
          label: "Kullanıcı",
          subtitle:
            "Öğrenci, junior, mid veya yönetici olman fark etmez. Doğru koçla hedefini netleştir, gelişimini ölç, hızlan.",
        },
        coach: {
          label: "Koç",
          subtitle:
            "Profilini büyüt, daha fazla danışana ulaş, seanslarını ve gelirini tek panelden yönet.",
        },
        company: {
          label: "Şirket",
          subtitle:
            "Hedef bazlı koçluk programlarıyla ekip gelişimini ölç, raporla ve ölçekle.",
        },
      },
      hero: {
        titleA: "Potansiyelini",
        titleB: "Zirveye Taşı",
        matchCta: "Eşleş",
        howItWorks: "Nasıl Çalışır?",
        stats: {
          onlineCoachesLabel: "Online Koç",
          todayMatchesLabel: "Bugün Eşleşme",
          lastHourLabel: "Son 1 Saatte",
        },
      },
      quickMatch: {
        goal: "Hedef",
        level: "Seviye",
        language: "Dil",
        tip: "İpucu: “Öne Çıkan Koçlar” alanı premium slot olarak satılabilir.",
      },
      goals: {
        interview: "Mülakat",
        career: "Kariyer Planı",
        promotion: "Terfi",
        job_change: "İş Değiştirme",
        salary: "Maaş Pazarlığı",
        cv: "CV / LinkedIn",
        performance: "Performans Gelişimi",
        leadership: "Liderlik",
        confidence: "Özgüven & İletişim",
      },
      levels: {
        student: "Öğrenci / Yeni Mezun",
        junior: "Junior",
        mid: "Mid",
        senior: "Senior",
        manager: "Manager",
      },
      systemValue: {
        badge: "Hedef · Plan · İlerleme Takibi",
        title: "Kariyerini şansa bırakma. Süreci yönet.",
        desc:
          "Kariyeer, tekil seanslardan oluşan bir danışmanlık sitesi değil; kariyer hedefini tanımlayan, doğru uzmanla eşleştiren ve ilerlemeyi ölçen bir sistemdir. İş bulma, terfi veya kariyer değişimi sürecinde ne yapman gerektiğini tahmin etmene gerek kalmaz. Hedefin netleşir, sana uygun koç önerilir ve ilerleme somut çıktılarla takip edilir. Bu yüzden Kariyeer, ihtiyaç anında girilen bir site değil; süreç boyunca kullanılan bir araçtır.",
        cards: [
          {
            title: "🎯 Hedef bazlı eşleşme",
            desc: "Rastgele değil; hedef/rol/level üzerinden",
          },
          {
            title: "✅ Doğrulanmış koçlar",
            desc: "Profil doğrulama + görünür kalite katmanı",
          },
          { title: "📊 Görünür ilerleme", desc: "Seans sonrası çıktı + takip düzeni" },
        ],
        chips: [
          "CV + LinkedIn paketi",
          "Mülakat simülasyonu + geri bildirim",
          "Kariyer planı + 30/60/90 gün hedefleri",
          "Terfi & liderlik gelişim programı",
        ],
        bottom: "Koç aramazsın. Sistem seni doğru sonuca götürür.",
      },
      coachFlow: {
        steps: ["Başvur", "Doğrulama", "Profil yayında", "İlk talep", "İlk seans"],
        cards: [
          "Ödeme güvencesi platform üzerinden sağlanır.",
          "Doğrulama rozetiyle görünürlüğün artar.",
          "Talep, eşleşme ve seans süreci tek panelden yönetilir.",
        ],
      },
      coachGlobal: {
        badge: "Koçlar için Global Sistem",
        title: "Danışan bul, seanslarını yönet, geliri büyüt",
        p1:
          "Kariyeer, koçlar için zamandan bağımsız ve ölçeklenebilir bir gelir modeli sunar. Programlar esnek ilerler; ana işinle paralel yürütülebilir veya tamamen profesyonel bir kanala dönüştürülebilir. Bireysel seanslar düzenli kazanç sağlarken, kurumsal iş birlikleriyle gelir 2–3 katına çıkabilir. Talep, eşleşme ve seans yönetimi tek panelden ilerler. Sen yalnızca uzmanlığına odaklanırsın.",
        p2:
          "Kariyeer; koçların doğru hedefte, doğru danışanla eşleşmesini ve tüm süreci tek yerden yönetmesini sağlar: profil görünürlüğü → talep/eşleşme → seans → takip/rapor → gelir.",
        valueCards: [
          {
            title: "Daha çok görünürlük",
            desc: "Hedef/rol bazlı aramalarda listelenme + doğrulama rozeti",
          },
          {
            title: "Tek panel yönetim",
            desc: "Seanslar, takvim, talepler, gelir ve performans takibi",
          },
          { title: "Global ölçek", desc: "Dil/ülke kırılımı ile uluslararası danışan akışı" },
        ],
        chips: [
          "Komisyon: İlk 50 koç için %10 (ilk 6 ay)",
          "Sonrasında standart komisyon: %20",
          "Öne Çıkan Koçlar: ana sayfa görünürlüğü (ekstra ücretli)",
        ],
        note:
          "Not: “Öne Çıkan Koçlar” alanı sponsorlu vitrindir. İsteyen koçlar ek ücret ile ana sayfada daha görünür olur.",
        apply: "Koç Olarak Başvur",
        view: "Koçları Görüntüle",
      },
      company: {
        badge: "Kurumsal Program Mantığı",
        title: "Koçluk, ekip performansına dönüşsün",
        p1:
          "Kurumsal tarafta amaç “seans satmak” değil; ekip hedeflerini doğru koçlarla eşleştirip, ilerlemeyi görünür hale getirmek. Süreç; ihtiyaç tanımı → koç eşleşmesi → seans akışı → takip/raporlama şeklinde ilerler.",
        cards: [
          { title: "Hedef & kapsam", desc: "Rol/level bazlı program planı" },
          { title: "Doğru koç havuzu", desc: "Uzmanlık + doğrulama katmanı" },
          { title: "Takip & görünürlük", desc: "Raporlanabilir çıktı (mail / PDF)" },
        ],
        chips: ["SLA: 24 saat içinde dönüş", "Pilot: 2 haftada ilk ölçüm raporu"],
        solutions: "Kurumsal Çözümler",
        midText1:
          "Şirketler için koçluk “tekil seans” değil, ölçülebilir bir gelişim sistemidir. Kariyeer; hedef, rol ve seviye bazlı ihtiyaçları netleştirir, doğrulanmış koç havuzundan en uygun eşleşmeyi çıkarır ve süreci raporlanabilir şekilde yönetir.",
        midText2:
          "Sonuç: İnsan & Kültür ekibi için görünür ilerleme, yöneticiler için takip edilebilir gelişim, çalışanlar için net hedef ve düzenli koçluk akışı. Demo talebinden sonra; ihtiyaç haritası → eşleşme → pilot → ilk ölçüm raporu akışıyla ilerler.",
        demo: {
          badge: "Kurumsal Demo Talebi",
          title: "Ekibin için koçluk programını başlatalım",
          desc: "Formu doldur, hedeflerine uygun planı çıkaralım ve ilk raporu paylaşalım.",
          companyName: "Şirket Adı",
          fullName: "Yetkili Ad Soyad",
          email: "E-posta",
          phone: "Telefon",
          teamSize: "Ekip Büyüklüğü",
          need: "Öncelikli İhtiyaç",
          startPlan: "Başlangıç hedefi",
          startHint: "Gönderince 24 saat içinde dönüş yapıp planı netleştiririz.",
          note: "Not (opsiyonel)",
          notePh: "Kısa bilgi: ekip hedefi, rol dağılımı, tarih aralığı...",
          footer:
            "Gönderim sonrası: ihtiyaç haritası → koç eşleşmesi → pilot → mail/PDF raporu (isteğe bağlı sunum).",
          submit: "Demo Talebi Gönder",
          placeholders: {
            company: "Örn: ABC Teknoloji",
            name: "Örn: Ayşe Yılmaz",
            email: "ornek@firma.com",
            phone: "05xx xxx xx xx",
          },
          teamOptions: { a: "1-10", b: "11-50", c: "51-200", d: "200+" },
          needOptions: {
            interview: "Mülakat",
            career: "Kariyer Planı",
            leadership: "Liderlik",
            performance: "Performans",
            cv: "CV / LinkedIn",
          },
          startOptions: { week: "Bu hafta", month: "Bu ay", q1: "Q1" },
        },
      },
      featured: {
        badge: "Sponsorlu Alan / Premium Slot",
        title: "Öne Çıkan Koçlar",
        desc: "En çok tercih edilen uzmanlar. (Bu alana girmek ücretli olabilir.)",
        premium: "Premium’a Geç",
        all: "Tüm Koçlar",
        verified: "Doğrulanmış",
        reviewsSuffix: "yorum",
        coaches: [
          { title: "Kariyer & Liderlik Koçu", tags: ["Liderlik", "Kariyer"] },
          { title: "Teknoloji & Startup Mentoru", tags: ["Teknoloji", "Startup"] },
          { title: "Mülakat & CV Uzmanı", tags: ["Mülakat", "CV"] },
        ],
      },
      y2025: {
        title: "2025’te Ne Problemi Çözüyoruz?",
        desc:
          "Kariyer belirsizliği, mülakat performansı ve “hangi yola gideceğim?” problemi. Kariyeer, hedef bazlı eşleşme ve takip ile bunu ölçülebilir hale getirir.",
        cards: [
          { value: "%37", label: "Daha hızlı terfi etkisi" },
          { value: "%42", label: "Maaş artışı avantajı" },
          { value: "%58", label: "İş değiştirmede başarı" },
        ],
        browse: "Koçları İncele",
        solutions: "Kurumsal Çözümler",
      },
      langs: { tr: "TR", en: "EN", ar: "AR", fr: "FR" },
    },

    en: {
      trustBadge: "Verified Platform · Goal-Based Tracking",
      personas: {
        user: {
          label: "User",
          subtitle:
            "Student, junior, mid, or manager—doesn’t matter. Clarify your goal with the right coach, measure progress, move faster.",
        },
        coach: {
          label: "Coach",
          subtitle:
            "Grow your profile, reach more clients, manage sessions and income from a single dashboard.",
        },
        company: {
          label: "Company",
          subtitle:
            "Measure, report, and scale team development with goal-based coaching programs.",
        },
      },
      hero: {
        titleA: "Take your potential",
        titleB: "to the top",
        matchCta: "Match",
        howItWorks: "How it works",
        stats: {
          onlineCoachesLabel: "Online Coaches",
          todayMatchesLabel: "Matches Today",
          lastHourLabel: "Last 1 Hour",
        },
      },
      quickMatch: {
        goal: "Goal",
        level: "Level",
        language: "Language",
        tip: "Tip: “Featured Coaches” can be sold as a premium slot.",
      },
      goals: {
        interview: "Interview",
        career: "Career Plan",
        promotion: "Promotion",
        job_change: "Job Change",
        salary: "Salary Negotiation",
        cv: "CV / LinkedIn",
        performance: "Performance Growth",
        leadership: "Leadership",
        confidence: "Confidence & Communication",
      },
      levels: {
        student: "Student / New Graduate",
        junior: "Junior",
        mid: "Mid",
        senior: "Senior",
        manager: "Manager",
      },
      systemValue: {
        badge: "Goal · Plan · Progress Tracking",
        title: "Don’t leave your career to chance. Run the process.",
        desc:
          "Kariyeer is not just a one-off consulting site; it’s a system that defines your career goal, matches you with the right expert, and measures progress. You don’t need to guess what to do during job search, promotion, or career change. Your goal becomes clear, you get the right coach recommendation, and progress is tracked with tangible outputs. That’s why Kariyeer isn’t a site you visit only when you need it—it’s a tool you use throughout the journey.",
        cards: [
          { title: "🎯 Goal-based matching", desc: "Not random—based on goal/role/level" },
          { title: "✅ Verified coaches", desc: "Profile verification + visible quality layer" },
          { title: "📊 Visible progress", desc: "Post-session output + follow-up cadence" },
        ],
        chips: [
          "CV + LinkedIn package",
          "Interview simulation + feedback",
          "Career plan + 30/60/90-day goals",
          "Promotion & leadership program",
        ],
        bottom: "You don’t search for a coach. The system gets you to the outcome.",
      },
      coachFlow: {
        steps: ["Apply", "Verification", "Profile live", "First request", "First session"],
        cards: [
          "Payment protection is provided through the platform.",
          "A verification badge boosts your visibility.",
          "Requests, matching, and sessions are managed from one dashboard.",
        ],
      },
      coachGlobal: {
        badge: "Global System for Coaches",
        title: "Find clients, manage sessions, grow revenue",
        p1:
          "Kariyeer offers coaches a time-independent, scalable income model. Programs are flexible; you can run them alongside your main job or turn them into a fully professional channel. While 1:1 sessions create steady income, corporate collaborations can multiply revenue 2–3x. Demand, matching, and session management run in one dashboard. You focus on expertise only.",
        p2:
          "Kariyeer helps coaches match with the right client for the right goal and manage the full flow in one place: profile visibility → request/match → session → follow-up/report → revenue.",
        valueCards: [
          { title: "More visibility", desc: "Listed in goal/role searches + verification badge" },
          { title: "One dashboard", desc: "Sessions, calendar, requests, revenue, performance tracking" },
          { title: "Global scale", desc: "International demand via language/country breakdown" },
        ],
        chips: [
          "Commission: 10% for first 50 coaches (first 6 months)",
          "Then standard commission: 20%",
          "Featured Coaches: homepage visibility (paid add-on)",
        ],
        note:
          "Note: “Featured Coaches” is a sponsored showcase. Coaches can pay extra to be more visible on the homepage.",
        apply: "Apply as Coach",
        view: "View Coaches",
      },
      company: {
        badge: "Corporate Program Logic",
        title: "Turn coaching into team performance",
        p1:
          "On the corporate side, the goal isn’t “selling sessions.” It’s matching team goals with the right coaches and making progress visible. The flow: needs definition → coach matching → session flow → tracking/reporting.",
        cards: [
          { title: "Goal & scope", desc: "Program plan by role/level" },
          { title: "Right coach pool", desc: "Expertise + verification layer" },
          { title: "Tracking & visibility", desc: "Reportable output (email / PDF)" },
        ],
        chips: ["SLA: reply within 24 hours", "Pilot: first measurement report in 2 weeks"],
        solutions: "Corporate Solutions",
        midText1:
          "For companies, coaching isn’t a “one-off session”—it’s a measurable development system. Kariyeer clarifies needs by goal, role, and level, selects the best match from verified coaches, and manages the process in a reportable way.",
        midText2:
          "Result: visible progress for People & Culture teams, trackable development for managers, clear goals and steady coaching cadence for employees. After a demo request: needs map → matching → pilot → first measurement report.",
        demo: {
          badge: "Corporate Demo Request",
          title: "Let’s start a coaching program for your team",
          desc: "Fill the form, we’ll build a plan for your goals and share the first report.",
          companyName: "Company Name",
          fullName: "Contact Person",
          email: "Email",
          phone: "Phone",
          teamSize: "Team Size",
          need: "Primary Need",
          startPlan: "Target start",
          startHint: "After you submit, we’ll get back within 24 hours to finalize the plan.",
          note: "Note (optional)",
          notePh: "Brief info: team goals, role distribution, date range...",
          footer:
            "After submission: needs map → coach matching → pilot → email/PDF report (optional deck).",
          submit: "Send Demo Request",
          placeholders: {
            company: "e.g., ABC Tech",
            name: "e.g., Jane Doe",
            email: "name@company.com",
            phone: "+90 / +216 ...",
          },
          teamOptions: { a: "1-10", b: "11-50", c: "51-200", d: "200+" },
          needOptions: {
            interview: "Interview",
            career: "Career Plan",
            leadership: "Leadership",
            performance: "Performance",
            cv: "CV / LinkedIn",
          },
          startOptions: { week: "This week", month: "This month", q1: "Q1" },
        },
      },
      featured: {
        badge: "Sponsored Area / Premium Slot",
        title: "Featured Coaches",
        desc: "Most preferred experts. (This area can be paid.)",
        premium: "Go Premium",
        all: "All Coaches",
        verified: "Verified",
        reviewsSuffix: "reviews",
        coaches: [
          { title: "Career & Leadership Coach", tags: ["Leadership", "Career"] },
          { title: "Tech & Startup Mentor", tags: ["Technology", "Startup"] },
          { title: "Interview & CV Specialist", tags: ["Interview", "CV"] },
        ],
      },
      y2025: {
        title: "What problem are we solving in 2025?",
        desc:
          "Career uncertainty, interview performance, and the “which path should I take?” problem. Kariyeer makes this measurable with goal-based matching and tracking.",
        cards: [
          { value: "%37", label: "Faster promotion impact" },
          { value: "%42", label: "Salary increase advantage" },
          { value: "%58", label: "Success in job switching" },
        ],
        browse: "Browse Coaches",
        solutions: "Corporate Solutions",
      },
      langs: { tr: "TR", en: "EN", ar: "AR", fr: "FR" },
    },

    ar: {
      trustBadge: "منصّة موثّقة · متابعة بحسب الهدف",
      personas: {
        user: {
          label: "مستخدم",
          subtitle:
            "سواء كنت طالبًا أو مبتدئًا أو متوسطًا أو مديرًا—لا يهم. حدّد هدفك مع المدرب المناسب، قِس تقدّمك، وتقدّم أسرع.",
        },
        coach: {
          label: "مدرّب",
          subtitle:
            "نمِّ ملفك، وصل لعملاء أكثر، وأدِر الجلسات والدخل من لوحة واحدة.",
        },
        company: {
          label: "شركة",
          subtitle:
            "قِس وبلّغ ووسّع تطوير الفريق عبر برامج تدريب مبنية على الأهداف.",
        },
      },
      hero: {
        titleA: "ارفع",
        titleB: "إمكاناتك إلى القمّة",
        matchCta: "مطابقة",
        howItWorks: "كيف يعمل؟",
        stats: {
          onlineCoachesLabel: "مدربون متاحون",
          todayMatchesLabel: "مطابقات اليوم",
          lastHourLabel: "آخر ساعة",
        },
      },
      quickMatch: {
        goal: "الهدف",
        level: "المستوى",
        language: "اللغة",
        tip: "ملاحظة: يمكن بيع قسم “المدربون المميّزون” كمساحة بريميوم.",
      },
      goals: {
        interview: "مقابلة عمل",
        career: "خطة مهنية",
        promotion: "ترقية",
        job_change: "تغيير وظيفة",
        salary: "تفاوض على الراتب",
        cv: "السيرة / لينكدإن",
        performance: "تطوير الأداء",
        leadership: "القيادة",
        confidence: "الثقة والتواصل",
      },
      levels: {
        student: "طالب / حديث تخرّج",
        junior: "مبتدئ",
        mid: "متوسط",
        senior: "خبير",
        manager: "مدير",
      },
      systemValue: {
        badge: "هدف · خطة · تتبّع التقدّم",
        title: "لا تترك مسارك للصدفة. أدر العملية.",
        desc:
          "Kariyeer ليست مجرد موقع جلسات منفصلة؛ بل نظام يعرّف هدفك المهني، يطابقك مع الخبير المناسب، ويقيس التقدّم. لا تحتاج للتخمين أثناء البحث عن عمل أو الترقية أو تغيير المسار. يتضح هدفك، ويُقترح عليك المدرب الأنسب، ويُتابَع التقدّم بنتائج ملموسة. لذلك Kariyeer ليست زيارة وقت الحاجة فقط—بل أداة ترافقك طوال الرحلة.",
        cards: [
          { title: "🎯 مطابقة بحسب الهدف", desc: "ليست عشوائية—بحسب الهدف/الدور/المستوى" },
          { title: "✅ مدربون موثّقون", desc: "توثيق الملف + طبقة جودة واضحة" },
          { title: "📊 تقدّم مرئي", desc: "مخرجات بعد الجلسة + نظام متابعة" },
        ],
        chips: [
          "باقة السيرة + لينكدإن",
          "محاكاة مقابلة + ملاحظات",
          "خطة مهنية + أهداف 30/60/90 يومًا",
          "برنامج الترقية والقيادة",
        ],
        bottom: "لن تبحث عن مدرّب. النظام يقودك للنتيجة.",
      },
      coachFlow: {
        steps: ["قدّم", "توثيق", "الملف منشور", "أول طلب", "أول جلسة"],
        cards: [
          "ضمان الدفع يتم عبر المنصّة.",
          "شارة التوثيق تزيد ظهورك.",
          "الطلبات والمطابقة والجلسات من لوحة واحدة.",
        ],
      },
      coachGlobal: {
        badge: "نظام عالمي للمدربين",
        title: "اعثر على عملاء، أدر جلساتك، ونمِّ دخلك",
        p1:
          "Kariyeer تقدّم للمدربين نموذج دخل قابل للتوسع وغير مرتبط بالوقت. البرامج مرنة؛ يمكنك تشغيلها بجانب عملك أو تحويلها لقناة احترافية كاملة. الجلسات الفردية تؤمن دخلًا ثابتًا، بينما الشراكات المؤسسية قد تضاعف الدخل 2–3 مرات. الطلب والمطابقة وإدارة الجلسات تتم من لوحة واحدة. تركّز أنت على خبرتك فقط.",
        p2:
          "Kariyeer تساعد المدربين على المطابقة مع العميل الصحيح للهدف الصحيح وإدارة كامل التدفق في مكان واحد: ظهور الملف → طلب/مطابقة → جلسة → متابعة/تقرير → دخل.",
        valueCards: [
          { title: "ظهور أكبر", desc: "الظهور في بحث بحسب الهدف/الدور + شارة توثيق" },
          { title: "لوحة واحدة", desc: "الجلسات والتقويم والطلبات والدخل وتتبّع الأداء" },
          { title: "توسّع عالمي", desc: "تدفّق دولي عبر اللغة/الدولة" },
        ],
        chips: [
          "العمولة: 10% لأول 50 مدرب (أول 6 أشهر)",
          "ثم العمولة القياسية: 20%",
          "المدربون المميّزون: ظهور على الصفحة الرئيسية (مدفوع)",
        ],
        note:
          "ملاحظة: “المدربون المميّزون” مساحة عرض مدفوعة. يمكن للمدربين الدفع لزيادة الظهور على الصفحة الرئيسية.",
        apply: "قدّم كمدرّب",
        view: "عرض المدربين",
      },
      company: {
        badge: "منطق البرنامج المؤسسي",
        title: "حوّل التدريب إلى أداء للفريق",
        p1:
          "في جانب الشركات، الهدف ليس “بيع جلسات”. بل مطابقة أهداف الفريق مع المدربين المناسبين وجعل التقدّم مرئيًا. التدفق: تحديد الاحتياج → مطابقة المدرب → سير الجلسات → متابعة/تقارير.",
        cards: [
          { title: "الهدف والنطاق", desc: "خطة بحسب الدور/المستوى" },
          { title: "مخزون مدربين مناسب", desc: "خبرة + طبقة توثيق" },
          { title: "متابعة ووضوح", desc: "مخرجات قابلة للتقرير (بريد / PDF)" },
        ],
        chips: ["SLA: رد خلال 24 ساعة", "Pilot: أول تقرير قياس خلال أسبوعين"],
        solutions: "حلول الشركات",
        midText1:
          "بالنسبة للشركات، التدريب ليس “جلسة واحدة” بل نظام تطوير قابل للقياس. Kariyeer توضح الاحتياجات بحسب الهدف والدور والمستوى، وتستخرج أفضل مطابقة من المدربين الموثّقين، وتدير العملية بشكل قابل للتقرير.",
        midText2:
          "النتيجة: تقدّم واضح لفِرق الأشخاص والثقافة، تطوير قابل للتتبّع للمديرين، وأهداف واضحة وتدفّق تدريب منتظم للموظفين. بعد طلب الديمو: خريطة احتياج → مطابقة → بايلوت → أول تقرير قياس.",
        demo: {
          badge: "طلب ديمو للشركات",
          title: "لنبدأ برنامج تدريب لفريقك",
          desc: "املأ النموذج، سنبني خطة حسب أهدافك ونشارك التقرير الأول.",
          companyName: "اسم الشركة",
          fullName: "اسم المسؤول",
          email: "البريد الإلكتروني",
          phone: "الهاتف",
          teamSize: "حجم الفريق",
          need: "الاحتياج الأساسي",
          startPlan: "موعد البدء المستهدف",
          startHint: "بعد الإرسال سنعود لك خلال 24 ساعة لتثبيت الخطة.",
          note: "ملاحظة (اختياري)",
          notePh: "معلومات مختصرة: هدف الفريق، توزيع الأدوار، المدة الزمنية...",
          footer:
            "بعد الإرسال: خريطة احتياج → مطابقة المدرب → بايلوت → تقرير بريد/PDF (وعرض اختياري).",
          submit: "إرسال طلب الديمو",
          placeholders: {
            company: "مثال: ABC Tech",
            name: "مثال: أحمد علي",
            email: "name@company.com",
            phone: "+216 ...",
          },
          teamOptions: { a: "1-10", b: "11-50", c: "51-200", d: "200+" },
          needOptions: {
            interview: "مقابلة",
            career: "خطة مهنية",
            leadership: "قيادة",
            performance: "أداء",
            cv: "السيرة / لينكدإن",
          },
          startOptions: { week: "هذا الأسبوع", month: "هذا الشهر", q1: "Q1" },
        },
      },
      featured: {
        badge: "مساحة مدفوعة / بريميوم",
        title: "مدربون مميّزون",
        desc: "أكثر الخبراء تفضيلًا. (قد تكون هذه المساحة مدفوعة.)",
        premium: "الترقية إلى بريميوم",
        all: "كل المدربين",
        verified: "موثّق",
        reviewsSuffix: "تقييم",
        coaches: [
          { title: "مدربة مسار مهني وقيادة", tags: ["قيادة", "مسار مهني"] },
          { title: "مرشد تقنية وستارتاب", tags: ["تقنية", "ستارتاب"] },
          { title: "مختصة مقابلات وسيرة", tags: ["مقابلات", "سيرة"] },
        ],
      },
      y2025: {
        title: "ما المشكلة التي نحلّها في 2025؟",
        desc:
          "غموض المسار المهني، أداء المقابلات، وسؤال “أي طريق أختار؟”. Kariyeer تجعل ذلك قابلًا للقياس عبر المطابقة بحسب الهدف والمتابعة.",
        cards: [
          { value: "%37", label: "تأثير أسرع في الترقية" },
          { value: "%42", label: "ميزة زيادة الراتب" },
          { value: "%58", label: "نجاح في تغيير الوظيفة" },
        ],
        browse: "تصفّح المدربين",
        solutions: "حلول الشركات",
      },
      langs: { tr: "TR", en: "EN", ar: "AR", fr: "FR" },
    },

    fr: {
      trustBadge: "Plateforme vérifiée · Suivi par objectif",
      personas: {
        user: {
          label: "Utilisateur",
          subtitle:
            "Étudiant, junior, mid ou manager — peu importe. Clarifie ton objectif avec le bon coach, mesure tes progrès, avance plus vite.",
        },
        coach: {
          label: "Coach",
          subtitle:
            "Développe ton profil, trouve plus de clients, gère tes séances et tes revenus depuis un seul tableau de bord.",
        },
        company: {
          label: "Entreprise",
          subtitle:
            "Mesure, rapporte et scale le développement de l’équipe via des programmes de coaching orientés objectifs.",
        },
      },
      hero: {
        titleA: "Amène ton potentiel",
        titleB: "au sommet",
        matchCta: "Matcher",
        howItWorks: "Comment ça marche ?",
        stats: {
          onlineCoachesLabel: "Coachs en ligne",
          todayMatchesLabel: "Matchs aujourd’hui",
          lastHourLabel: "Dernière heure",
        },
      },
      quickMatch: {
        goal: "Objectif",
        level: "Niveau",
        language: "Langue",
        tip: "Astuce : la zone “Coachs en vedette” peut être vendue en slot premium.",
      },
      goals: {
        interview: "Entretien",
        career: "Plan de carrière",
        promotion: "Promotion",
        job_change: "Changement de job",
        salary: "Négociation salariale",
        cv: "CV / LinkedIn",
        performance: "Amélioration de performance",
        leadership: "Leadership",
        confidence: "Confiance & Communication",
      },
      levels: {
        student: "Étudiant / Jeune diplômé",
        junior: "Junior",
        mid: "Mid",
        senior: "Senior",
        manager: "Manager",
      },
      systemValue: {
        badge: "Objectif · Plan · Suivi de progression",
        title: "Ne laisse pas ta carrière au hasard. Pilote le process.",
        desc:
          "Kariyeer n’est pas seulement un site de séances ponctuelles ; c’est un système qui définit ton objectif, te matche avec le bon expert et mesure tes progrès. Inutile de deviner quoi faire pendant une recherche d’emploi, une promotion ou un changement de carrière. Ton objectif se clarifie, le coach adapté est recommandé et la progression est suivie via des livrables concrets. Kariyeer n’est donc pas un site “à la demande”, mais un outil de parcours.",
        cards: [
          { title: "🎯 Matching par objectif", desc: "Pas au hasard : objectif/rôle/niveau" },
          { title: "✅ Coachs vérifiés", desc: "Vérification du profil + couche qualité visible" },
          { title: "📊 Progrès visibles", desc: "Livrables post-séance + cadence de suivi" },
        ],
        chips: [
          "Pack CV + LinkedIn",
          "Simulation d’entretien + feedback",
          "Plan de carrière + objectifs 30/60/90 jours",
          "Programme promotion & leadership",
        ],
        bottom: "Tu ne cherches pas un coach. Le système t’amène au résultat.",
      },
      coachFlow: {
        steps: ["Postuler", "Vérification", "Profil en ligne", "1ère demande", "1ère séance"],
        cards: [
          "La garantie de paiement est assurée via la plateforme.",
          "Le badge de vérification augmente ta visibilité.",
          "Demandes, matching et séances se gèrent depuis un seul panel.",
        ],
      },
      coachGlobal: {
        badge: "Système global pour coachs",
        title: "Trouve des clients, gère tes séances, augmente tes revenus",
        p1:
          "Kariyeer propose aux coachs un modèle de revenus scalable et indépendant du temps. Les programmes sont flexibles : en parallèle d’un job ou en canal pro à plein temps. Les séances 1:1 apportent un revenu régulier, et le B2B peut multiplier les revenus par 2–3. Demande, matching et gestion des séances : tout depuis un seul panel. Tu te concentres sur ton expertise.",
        p2:
          "Kariyeer permet aux coachs de matcher le bon client au bon objectif et de piloter tout le flux : visibilité → demande/match → séance → suivi/rapport → revenus.",
        valueCards: [
          { title: "Plus de visibilité", desc: "Listé en recherche objectif/rôle + badge vérifié" },
          { title: "Un seul panel", desc: "Séances, agenda, demandes, revenus, suivi performance" },
          { title: "Échelle globale", desc: "Flux international via langues/pays" },
        ],
        chips: [
          "Commission : 10% pour les 50 premiers coachs (6 premiers mois)",
          "Ensuite commission standard : 20%",
          "Coachs en vedette : visibilité homepage (payant)",
        ],
        note:
          "Note : “Coachs en vedette” est une vitrine sponsorisée. Les coachs peuvent payer pour être plus visibles sur la homepage.",
        apply: "Postuler comme coach",
        view: "Voir les coachs",
      },
      company: {
        badge: "Logique du programme entreprise",
        title: "Transforme le coaching en performance d’équipe",
        p1:
          "Côté entreprise, l’objectif n’est pas de “vendre des séances”, mais de matcher les objectifs d’équipe avec les bons coachs et rendre la progression visible. Flux : besoin → matching → séances → suivi/rapport.",
        cards: [
          { title: "Objectif & périmètre", desc: "Plan par rôle/niveau" },
          { title: "Bon pool de coachs", desc: "Expertise + couche de vérification" },
          { title: "Suivi & visibilité", desc: "Livrables reportables (mail / PDF)" },
        ],
        chips: ["SLA : retour sous 24h", "Pilot : 1er rapport de mesure en 2 semaines"],
        solutions: "Solutions entreprises",
        midText1:
          "Pour les entreprises, le coaching n’est pas une “séance ponctuelle” mais un système de développement mesurable. Kariyeer clarifie les besoins par objectif/rôle/niveau, extrait le meilleur matching parmi des coachs vérifiés et gère le process de manière reportable.",
        midText2:
          "Résultat : progrès visibles pour People & Culture, développement traçable pour les managers, objectifs clairs et cadence régulière pour les collaborateurs. Après une demande demo : cartographie des besoins → matching → pilot → premier rapport.",
        demo: {
          badge: "Demande de démo entreprise",
          title: "Lançons un programme de coaching pour ton équipe",
          desc: "Remplis le formulaire, on construit un plan adapté et on partage le premier rapport.",
          companyName: "Nom de l’entreprise",
          fullName: "Contact",
          email: "E-mail",
          phone: "Téléphone",
          teamSize: "Taille d’équipe",
          need: "Besoin prioritaire",
          startPlan: "Démarrage visé",
          startHint: "Après envoi, on revient vers toi sous 24h pour cadrer le plan.",
          note: "Note (optionnel)",
          notePh: "Bref : objectifs équipe, répartition rôles, période...",
          footer:
            "Après envoi : cartographie → matching coach → pilot → rapport mail/PDF (deck optionnel).",
          submit: "Envoyer la demande de démo",
          placeholders: {
            company: "Ex : ABC Tech",
            name: "Ex : Marie Dupont",
            email: "nom@entreprise.com",
            phone: "+33 / +216 ...",
          },
          teamOptions: { a: "1-10", b: "11-50", c: "51-200", d: "200+" },
          needOptions: {
            interview: "Entretien",
            career: "Plan de carrière",
            leadership: "Leadership",
            performance: "Performance",
            cv: "CV / LinkedIn",
          },
          startOptions: { week: "Cette semaine", month: "Ce mois-ci", q1: "T1 (Q1)" },
        },
      },
      featured: {
        badge: "Zone sponsorisée / Slot premium",
        title: "Coachs en vedette",
        desc: "Experts les plus demandés. (Cette zone peut être payante.)",
        premium: "Passer en Premium",
        all: "Tous les coachs",
        verified: "Vérifié",
        reviewsSuffix: "avis",
        coaches: [
          { title: "Coach carrière & leadership", tags: ["Leadership", "Carrière"] },
          { title: "Mentor tech & startup", tags: ["Tech", "Startup"] },
          { title: "Spécialiste entretien & CV", tags: ["Entretien", "CV"] },
        ],
      },
      y2025: {
        title: "Quel problème résolvons-nous en 2025 ?",
        desc:
          "Incertitude de carrière, performance en entretien et le “quel chemin choisir ?”. Kariyeer rend cela mesurable via matching par objectif et suivi.",
        cards: [
          { value: "%37", label: "Impact : promotion plus rapide" },
          { value: "%42", label: "Avantage : hausse salariale" },
          { value: "%58", label: "Succès : changement de job" },
        ],
        browse: "Voir les coachs",
        solutions: "Solutions entreprises",
      },
      langs: { tr: "TR", en: "EN", ar: "AR", fr: "FR" },
    },
  };

  const t = i18n[lang] || i18n.tr;

  // Persona: Kullanıcı / Koç / Şirket
  const personas = [
    {
      key: "user",
      label: t.personas.user.label,
      icon: Users,
      subtitle: t.personas.user.subtitle,
    },
    {
      key: "coach",
      label: t.personas.coach.label,
      icon: Briefcase,
      subtitle: t.personas.coach.subtitle,
    },
    {
      key: "company",
      label: t.personas.company.label,
      icon: Building2,
      subtitle: t.personas.company.subtitle,
    },
  ];

  const [persona, setPersona] = useState("user");
  const personaCopy = personas.find((p) => p.key === persona) ?? personas[0];

  const onMatch = () => {
    const qs = new URLSearchParams({ goal, level, lang });
    navigate(`/coaches?${qs.toString()}`);
  };

  // ✅ DEMO FORM (Şirket seçilince gösterilecek)
  const [demoCompanyName, setDemoCompanyName] = useState("");
  const [demoName, setDemoName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoPhone, setDemoPhone] = useState("");
  const [demoTeamSize, setDemoTeamSize] = useState("1-10");
  const [demoNeed, setDemoNeed] = useState("Mülakat");
  const [demoStartPlan, setDemoStartPlan] = useState("Bu ay"); // ✅ yeni
  const [demoNote, setDemoNote] = useState("");

  const onDemoSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      company_name: demoCompanyName,
      contact_name: demoName,
      email: demoEmail,
      phone: demoPhone,
      team_size: demoTeamSize,
      primary_need: demoNeed,
      start_plan: demoStartPlan,
      note: demoNote,
      lang,
    };

    const { data, error } = await supabase
      .from("corporate_demo_requests")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.error(error);
      alert("Gönderimde hata oldu. Lütfen tekrar deneyin.");
      return;
    }

    navigate(`/demo/thanks?id=${data?.id}`);
  };

  // Featured coaches (statik vitrin)
  const featuredCoaches = [
    {
      name: "Dr. Ayşe Yılmaz",
      title: t.featured.coaches[0].title,
      rating: "4.9",
      reviews: "120+",
      tags: t.featured.coaches[0].tags,
    },
    {
      name: "Mehmet Demir",
      title: t.featured.coaches[1].title,
      rating: "5.0",
      reviews: "85+",
      tags: t.featured.coaches[1].tags,
    },
    {
      name: "Zeynep Kaya",
      title: t.featured.coaches[2].title,
      rating: "4.8",
      reviews: "200+",
      tags: t.featured.coaches[2].tags,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Trust */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-sm font-semibold text-red-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {t.trustBadge}
            </div>
          </div>

          {/* Persona */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-2xl border border-orange-200 bg-white p-1 shadow-sm">
              {personas.map((p) => {
                const Icon = p.icon;
                const active = p.key === persona;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPersona(p.key)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition ${
                      active
                        ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow"
                        : "text-gray-700 hover:bg-orange-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="mt-10 text-center">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight">
              {t.hero.titleA}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                {t.hero.titleB}
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {personaCopy.subtitle}
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={onMatch}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:brightness-110 text-white text-lg h-14 px-8 rounded-xl shadow-lg"
              >
                {t.hero.matchCta} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Link to="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white border-2 border-orange-200 text-gray-700 text-lg h-14 px-8 rounded-xl"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  {t.hero.howItWorks}
                </Button>
              </Link>
            </div>

            {/* Inline stats */}
            <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                {t.hero.stats.onlineCoachesLabel}{" "}
                <span className="font-black">33</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                {t.hero.stats.todayMatchesLabel}{" "}
                <span className="font-black">146</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                {t.hero.stats.lastHourLabel} <span className="font-black">18</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK MATCH */}
      <section className="relative z-10 -mt-10 pb-14">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white border border-orange-200 rounded-2xl shadow-lg p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  {t.quickMatch.goal}
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full h-12 rounded-xl border border-orange-200 px-4"
                >
                  <option value="interview">{t.goals.interview}</option>
                  <option value="career">{t.goals.career}</option>
                  <option value="promotion">{t.goals.promotion}</option>
                  <option value="job_change">{t.goals.job_change}</option>
                  <option value="salary">{t.goals.salary}</option>
                  <option value="cv">{t.goals.cv}</option>
                  <option value="performance">{t.goals.performance}</option>
                  <option value="leadership">{t.goals.leadership}</option>
                  <option value="confidence">{t.goals.confidence}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  {t.quickMatch.level}
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full h-12 rounded-xl border border-orange-200 px-4"
                >
                  <option value="student">{t.levels.student}</option>
                  <option value="junior">{t.levels.junior}</option>
                  <option value="mid">{t.levels.mid}</option>
                  <option value="senior">{t.levels.senior}</option>
                  <option value="manager">{t.levels.manager}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  {t.quickMatch.language}
                </label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full h-12 rounded-xl border border-orange-200 px-4"
                >
                  <option value="tr">{t.langs.tr}</option>
                  <option value="en">{t.langs.en}</option>
                  <option value="ar">{t.langs.ar}</option>
                  <option value="fr">{t.langs.fr}</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={onMatch}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold"
                >
                  {t.hero.matchCta}
                </Button>
              </div>
            </div>
          </div>

          {/* mini note */}
          <div className="mt-4 text-center text-xs text-gray-500">
            {t.quickMatch.tip}
          </div>
        </div>
      </section>

      {/* ✅ ARAMA/EŞLEŞME MOTORU İLE ÖNE ÇIKAN KOÇLAR ARASINA (GLOBAL DEĞER + GÜVENCE) — SADECE USER */}
      {persona === "user" ? (
        <section className="pb-10 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-2xl border border-orange-200 bg-white shadow-lg p-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-sm font-semibold text-red-600 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {t.systemValue.badge}
                </div>

                <h3 className="mt-4 text-2xl md:text-3xl font-black text-gray-900">
                  {t.systemValue.title}
                </h3>

                <p className="mt-3 text-sm md:text-base text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {t.systemValue.desc}
                </p>

                <div className="mt-6 grid md:grid-cols-3 gap-3 text-sm">
                  {t.systemValue.cards.map((c: any) => (
                    <div
                      key={c.title}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="font-semibold text-gray-900">{c.title}</div>
                      <div className="mt-1 text-gray-600">{c.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2 justify-center">
                  {t.systemValue.chips.map((x: string) => (
                    <span
                      key={x}
                      className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700"
                    >
                      {x}
                    </span>
                  ))}
                </div>

                <div className="mt-5 text-sm font-semibold text-gray-700">
                  {t.systemValue.bottom}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ SADECE KOÇTA: EŞLEŞ ile KOÇ BLOĞU ARASINA (SÜREÇ + GÜVENCE) */}
      {persona === "coach" ? (
        <section className="pb-10 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-2xl border border-orange-200 bg-white shadow-lg p-6">
              {/* Steps */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {t.coachFlow.steps.map((s: string, idx: number, arr: any[]) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="px-4 py-2 rounded-full border border-orange-200 bg-orange-50 text-gray-900 text-sm font-bold">
                      {s}
                    </span>
                    {idx !== arr.length - 1 ? (
                      <span className="text-orange-300 font-black">→</span>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* 3 value cards */}
              <div className="mt-5 grid md:grid-cols-3 gap-3">
                {t.coachFlow.cards.map((c: string) => (
                  <div
                    key={c}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center"
                  >
                    <div className="text-sm font-semibold text-gray-800">{c}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ SADECE KOÇTA: GLOBAL DEĞER ÖNERİSİ + KOMİSYON + ÖNE ÇIKMA (EKLENDİ) */}
      {persona === "coach" ? (
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-2xl border border-orange-200 bg-white shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700">
                    <Briefcase className="h-4 w-4" />
                    {t.coachGlobal.badge}
                  </div>

                  <h3 className="mt-3 text-2xl font-black text-gray-900">
                    {t.coachGlobal.title}
                  </h3>

                  <p className="mt-3 text-sm md:text-base text-gray-600 max-w-3xl leading-relaxed">
                    {t.coachGlobal.p1}
                  </p>

                  <p className="mt-3 text-gray-600 max-w-3xl">{t.coachGlobal.p2}</p>

                  <div className="mt-5 grid md:grid-cols-3 gap-3 text-sm">
                    {t.coachGlobal.valueCards.map((c: any) => (
                      <div key={c.title} className="rounded-xl border bg-gray-50 p-4">
                        <div className="font-semibold text-gray-900">{c.title}</div>
                        <div className="mt-1 text-gray-600">{c.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.coachGlobal.chips.map((x: string) => (
                      <span
                        key={x}
                        className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700"
                      >
                        {x}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 text-xs text-gray-500">{t.coachGlobal.note}</div>
                </div>

                <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                  <Button
                    className="h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold px-8 hover:brightness-110"
                    onClick={() => navigate("/coach/application")}
                  >
                    {t.coachGlobal.apply} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-orange-200"
                    onClick={() => navigate("/coaches")}
                  >
                    {t.coachGlobal.view}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ SADECE ŞİRKETTE: DEMO FORM'DAN ÖNCE KURUMSAL AÇIKLAMA BLOĞU (BUTONLAR KALDIRILDI) */}
      {persona === "company" ? (
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-2xl border border-orange-200 bg-white shadow-lg p-6">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700">
                  <Sparkles className="h-4 w-4" />
                  {t.company.badge}
                </div>

                <h3 className="mt-3 text-2xl font-black text-gray-900">
                  {t.company.title}
                </h3>

                <p className="mt-2 text-gray-600 max-w-3xl">{t.company.p1}</p>

                <div className="mt-5 grid md:grid-cols-3 gap-3 text-sm">
                  {t.company.cards.map((c: any) => (
                    <div key={c.title} className="rounded-xl border bg-gray-50 p-4">
                      <div className="font-semibold text-gray-900">{c.title}</div>
                      <div className="mt-1 text-gray-600">{c.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {t.company.chips.map((x: string) => (
                      <span
                        key={x}
                        className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700"
                      >
                        {x}
                      </span>
                    ))}
                  </div>

                  <Link to="/for-companies">
                    <Button variant="outline" className="rounded-xl border-orange-200">
                      {t.company.solutions}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ SADECE ŞİRKETTE: İKİ BLOK ARASINA SADECE METİN (AÇIKLAMA) */}
      {persona === "company" ? (
        <section className="py-6 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-gray-600 leading-relaxed">
              <p className="text-sm md:text-base">{t.company.midText1}</p>
              <p className="mt-3 text-sm md:text-base">{t.company.midText2}</p>
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ ŞİRKET SEÇİLİNCE: DEMO FORM */}
      {persona === "company" ? (
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-2xl border border-orange-200 bg-white shadow-lg p-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700">
                  <Building2 className="h-4 w-4" />
                  {t.company.demo.badge}
                </div>
                <h3 className="mt-3 text-2xl font-black text-gray-900">
                  {t.company.demo.title}
                </h3>
                <p className="mt-2 text-gray-600">{t.company.demo.desc}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {t.company.chips.map((x: string) => (
                    <span
                      key={x}
                      className="text-xs rounded-full border bg-gray-50 px-3 py-1 text-gray-700"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>

              <form onSubmit={onDemoSubmit} className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      {t.company.demo.companyName}
                    </label>
                    <input
                      value={demoCompanyName}
                      onChange={(e) => setDemoCompanyName(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                      placeholder={t.company.demo.placeholders.company}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      {t.company.demo.fullName}
                    </label>
                    <input
                      value={demoName}
                      onChange={(e) => setDemoName(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                      placeholder={t.company.demo.placeholders.name}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      {t.company.demo.email}
                    </label>
                    <input
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                      placeholder={t.company.demo.placeholders.email}
                      type="email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      {t.company.demo.phone}
                    </label>
                    <input
                      value={demoPhone}
                      onChange={(e) => setDemoPhone(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                      placeholder={t.company.demo.placeholders.phone}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      {t.company.demo.teamSize}
                    </label>
                    <select
                      value={demoTeamSize}
                      onChange={(e) => setDemoTeamSize(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                    >
                      <option value="1-10">{t.company.demo.teamOptions.a}</option>
                      <option value="11-50">{t.company.demo.teamOptions.b}</option>
                      <option value="51-200">{t.company.demo.teamOptions.c}</option>
                      <option value="200+">{t.company.demo.teamOptions.d}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      {t.company.demo.need}
                    </label>
                    <select
                      value={demoNeed}
                      onChange={(e) => setDemoNeed(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                    >
                      <option value="Mülakat">{t.company.demo.needOptions.interview}</option>
                      <option value="Kariyer Planı">{t.company.demo.needOptions.career}</option>
                      <option value="Liderlik">{t.company.demo.needOptions.leadership}</option>
                      <option value="Performans">{t.company.demo.needOptions.performance}</option>
                      <option value="CV / LinkedIn">{t.company.demo.needOptions.cv}</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      {t.company.demo.startPlan}
                    </label>
                    <select
                      value={demoStartPlan}
                      onChange={(e) => setDemoStartPlan(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                    >
                      <option value="Bu hafta">{t.company.demo.startOptions.week}</option>
                      <option value="Bu ay">{t.company.demo.startOptions.month}</option>
                      <option value="Q1">{t.company.demo.startOptions.q1}</option>
                    </select>
                    <div className="mt-2 text-xs text-gray-500">
                      {t.company.demo.startHint}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      {t.company.demo.note}
                    </label>
                    <textarea
                      value={demoNote}
                      onChange={(e) => setDemoNote(e.target.value)}
                      className="w-full min-h-[110px] rounded-xl border border-orange-200 px-4 py-3"
                      placeholder={t.company.demo.notePh}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="text-xs text-gray-500">{t.company.demo.footer}</div>

                  <Button
                    type="submit"
                    className="h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold px-8 hover:brightness-110"
                  >
                    {t.company.demo.submit} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ ÖNE ÇIKAN KOÇLAR */}
      <section className="py-18 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700">
                <Sparkles className="h-4 w-4" />
                {t.featured.badge}
              </div>
              <h2 className="mt-3 text-3xl font-black text-gray-900">
                {t.featured.title}
              </h2>
              <p className="mt-2 text-gray-600">{t.featured.desc}</p>
            </div>

            <div className="flex gap-3">
              <Link to="/pricing">
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
                  {t.featured.premium}
                </Button>
              </Link>
              <Link to="/coaches">
                <Button variant="outline" className="rounded-xl">
                  {t.featured.all}
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCoaches.map((coach, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
              >
                <h3 className="text-lg font-bold text-gray-900">{coach.name}</h3>
                <p className="text-sm text-gray-500">{coach.title}</p>

                <div className="flex items-center gap-2 mt-3 text-sm">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{coach.rating}</span>
                  <span className="text-gray-400">
                    ({coach.reviews} {t.featured.reviewsSuffix})
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {coach.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    {t.featured.verified}
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2025 BLOĞU */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            {t.y2025.title}
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">{t.y2025.desc}</p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {t.y2025.cards.map((c: any) => (
              <div key={c.value} className="p-6 rounded-2xl border border-orange-200">
                <div className="text-4xl font-black text-orange-600">{c.value}</div>
                <p className="mt-2 text-gray-600">{c.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            {persona !== "company" ? (
              <>
                <Link to="/coaches">
                  <Button className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white hover:brightness-110">
                    {t.y2025.browse}
                  </Button>
                </Link>
                <Link to="/for-companies">
                  <Button variant="outline" className="rounded-xl">
                    {t.y2025.solutions}
                  </Button>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
