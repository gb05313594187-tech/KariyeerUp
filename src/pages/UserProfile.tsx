// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  runStandardMatching,
  runBoostMatching,
  fetchExistingMatches,
  fetchAllJobs,
  isGeminiConfigured,
} from "@/lib/matchingService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  X, Briefcase, GraduationCap, Cpu, Languages, Target,
  Plus, Trash2, Award, Heart, Phone, MapPin, Star, CheckCircle2,
  Camera, ImagePlus, Save, Edit3, AlertTriangle, Wifi, WifiOff,
  Zap, Search, Sparkles, TrendingUp, Building2, Clock, ChevronDown, ChevronUp
} from "lucide-react";

/* =========================================================
   ÇOK DİLLİ METİNLER
   ========================================================= */
const TRANSLATIONS = {
  tr: {
    // Header & Status
    connectionSupabase: "Supabase Bağlantısı Aktif",
    connectionLocal: "Yerel Mod — Veriler localStorage'da Saklanıyor",
    verified: "ONAYLI",
    editProfile: "PROFİLİ DÜZENLE",
    
    // Empty State
    profileEmpty: "Profiliniz Boş",
    profileEmptyDesc: "Profil bilgilerinizi ekleyerek kariyer yolculuğunuza başlayın. İş ilanlarıyla eşleşme yapabilmek için profilinizi doldurun.",
    createProfile: "PROFİLİ OLUŞTUR",
    
    // Sections
    careerVision: "Kariyer Vizyonu",
    workExperience: "İş Deneyimi",
    education: "Eğitim",
    certificates: "Sertifikalar",
    languages: "Diller",
    skills: "Yetenekler",
    interests: "İlgi Alanları",
    
    // Job Matching
    jobMatches: "İş Eşleşmelerim",
    jobMatchesDesc: "Profilini aktif ilanlarla karşılaştır ve uygunluk puanını gör",
    standard: "Standard",
    aiBoost: "AI Boost",
    scanning: "Taranıyor...",
    aiAnalyzing: "AI Analiz Ediliyor...",
    noMatches: "Henüz Eşleşme Yok",
    noMatchesDesc: "\"Standard\" veya \"AI Boost\" butonuna tıklayarak profilinizi aktif ilanlarla eşleştirin.",
    fillProfileFirst: "Önce profilinizi doldurun, ardından ilanlarla eşleşme yapabilirsiniz.",
    highMatch: "Yüksek Uyum",
    mediumMatch: "Orta Uyum",
    lowMatch: "Düşük Uyum",
    strengths: "Güçlü Yönler",
    improvements: "Gelişim Alanları",
    detailedScores: "Detaylı Skor Dağılımı",
    jobDescription: "İlan Açıklaması",
    salary: "Maaş",
    skillScore: "Yetenek",
    locationScore: "Lokasyon",
    experienceScore: "Deneyim",
    languageScore: "Dil",
    standardDesc: "Standard = Kelime bazlı eşleşme",
    boostDesc: "Boost = Gemini AI semantik analiz",
    addGeminiKey: "AI Boost için .env'ye VITE_GEMINI_API_KEY ekleyin",
    
    // Modal
    profileArchitect: "Profil Mimarı",
    profilePhotos: "Profil Görselleri",
    profilePhoto: "Profil Fotoğrafı",
    bannerImage: "Banner Görseli",
    uploading: "Görsel yükleniyor...",
    fullName: "Ad Soyad",
    fullNamePlaceholder: "Adınız ve Soyadınız",
    location: "Lokasyon",
    selectCountry: "Ülke Seçin",
    selectCity: "Şehir Seçin",
    internationalPhone: "Uluslararası Telefon",
    aboutMe: "Hakkımda / Kariyer Vizyonu",
    aboutMePlaceholder: "Kendinizi ve kariyer hedefinizi tanımlayın...",
    add: "EKLE",
    position: "Pozisyon / Ünvan",
    company: "Şirket Adı",
    startYear: "Başlangıç (2020)",
    endYear: "Bitiş (2023)",
    current: "Devam Ediyor",
    ongoing: "Devam",
    delete: "SİL",
    jobDescription2: "Görev tanımı ve başarılarınız...",
    educationInfo: "Eğitim Bilgileri",
    school: "Okul / Üniversite",
    department: "Bölüm / Alan",
    degree: "Derece",
    highSchool: "Lise",
    associate: "Ön Lisans",
    bachelor: "Lisans",
    master: "Yüksek Lisans",
    doctorate: "Doktora",
    languageSkills: "Dil Yetkinliği",
    selectLanguage: "Dil Seçin",
    certificateName: "Sertifika Adı",
    institution: "Kurum",
    year: "Yıl",
    technicalSkills: "Teknik Programlar & Yetenekler",
    skillPlaceholder: "Yetenek yazıp Enter'a basın...",
    interestPlaceholder: "İlgi alanı yazıp Enter'a basın...",
    cancel: "İPTAL",
    saveMemory: "HAFIZAYI MÜHÜRLE",
    saving: "MÜHÜRLENİYOR...",
    
    // Toasts
    syncingMemory: "Hafıza Senkronize Ediliyor...",
    photoSaved: "Profil fotoğrafı mühürlendi!",
    bannerSaved: "Banner mühürlendi!",
    savedLocal: "kaydedildi!",
    localBackup: "Yerel yedek kayıt oluşturuldu.",
    uploadFailed: "Yükleme tamamen başarısız oldu.",
    fileTooLarge: "Dosya 5MB'den küçük olmalı.",
    selectImage: "Lütfen bir resim dosyası seçin.",
    dataSavedSupabase: "Tüm veriler Supabase'e mühürlendi!",
    dataSavedLocal: "Veriler yerel olarak mühürlendi!",
    saveFailed: "Kayıt mühürlenemedi:",
    supabaseRequired: "Eşleştirme için Supabase bağlantısı gerekli.",
    noJobsFound: "Henüz aktif ilan bulunamadı.",
    standardComplete: "ilan ile standart eşleşme tamamlandı!",
    boostComplete: "AI Boost ile ilan analiz edildi!",
    matchError: "Eşleştirme hatası:",
    boostError: "AI Boost hatası:",
    change: "Değiştir",
    changeBanner: "Banner Değiştir",
    present: "Günümüz",
  },
  en: {
    connectionSupabase: "Supabase Connection Active",
    connectionLocal: "Local Mode — Data Stored in localStorage",
    verified: "VERIFIED",
    editProfile: "EDIT PROFILE",
    profileEmpty: "Your Profile is Empty",
    profileEmptyDesc: "Start your career journey by adding your profile information. Fill in your profile to match with job listings.",
    createProfile: "CREATE PROFILE",
    careerVision: "Career Vision",
    workExperience: "Work Experience",
    education: "Education",
    certificates: "Certificates",
    languages: "Languages",
    skills: "Skills",
    interests: "Interests",
    jobMatches: "My Job Matches",
    jobMatchesDesc: "Compare your profile with active listings and see your fit score",
    standard: "Standard",
    aiBoost: "AI Boost",
    scanning: "Scanning...",
    aiAnalyzing: "AI Analyzing...",
    noMatches: "No Matches Yet",
    noMatchesDesc: "Click \"Standard\" or \"AI Boost\" to match your profile with active listings.",
    fillProfileFirst: "First fill in your profile, then you can match with listings.",
    highMatch: "High Match",
    mediumMatch: "Medium Match",
    lowMatch: "Low Match",
    strengths: "Strengths",
    improvements: "Areas for Improvement",
    detailedScores: "Detailed Score Breakdown",
    jobDescription: "Job Description",
    salary: "Salary",
    skillScore: "Skills",
    locationScore: "Location",
    experienceScore: "Experience",
    languageScore: "Language",
    standardDesc: "Standard = Keyword-based matching",
    boostDesc: "Boost = Gemini AI semantic analysis",
    addGeminiKey: "Add VITE_GEMINI_API_KEY to .env for AI Boost",
    profileArchitect: "Profile Architect",
    profilePhotos: "Profile Images",
    profilePhoto: "Profile Photo",
    bannerImage: "Banner Image",
    uploading: "Uploading image...",
    fullName: "Full Name",
    fullNamePlaceholder: "Your Full Name",
    location: "Location",
    selectCountry: "Select Country",
    selectCity: "Select City",
    internationalPhone: "International Phone",
    aboutMe: "About Me / Career Vision",
    aboutMePlaceholder: "Describe yourself and your career goals...",
    add: "ADD",
    position: "Position / Title",
    company: "Company Name",
    startYear: "Start (2020)",
    endYear: "End (2023)",
    current: "Currently Working",
    ongoing: "Ongoing",
    delete: "DELETE",
    jobDescription2: "Job description and achievements...",
    educationInfo: "Education Information",
    school: "School / University",
    department: "Department / Field",
    degree: "Degree",
    highSchool: "High School",
    associate: "Associate",
    bachelor: "Bachelor's",
    master: "Master's",
    doctorate: "Doctorate",
    languageSkills: "Language Skills",
    selectLanguage: "Select Language",
    certificateName: "Certificate Name",
    institution: "Institution",
    year: "Year",
    technicalSkills: "Technical Programs & Skills",
    skillPlaceholder: "Type a skill and press Enter...",
    interestPlaceholder: "Type an interest and press Enter...",
    cancel: "CANCEL",
    saveMemory: "SAVE PROFILE",
    saving: "SAVING...",
    syncingMemory: "Syncing Memory...",
    photoSaved: "Profile photo saved!",
    bannerSaved: "Banner saved!",
    savedLocal: "saved!",
    localBackup: "Local backup created.",
    uploadFailed: "Upload completely failed.",
    fileTooLarge: "File must be smaller than 5MB.",
    selectImage: "Please select an image file.",
    dataSavedSupabase: "All data saved to Supabase!",
    dataSavedLocal: "Data saved locally!",
    saveFailed: "Save failed:",
    supabaseRequired: "Supabase connection required for matching.",
    noJobsFound: "No active listings found.",
    standardComplete: "listings matched with standard!",
    boostComplete: "listings analyzed with AI Boost!",
    matchError: "Matching error:",
    boostError: "AI Boost error:",
    change: "Change",
    changeBanner: "Change Banner",
    present: "Present",
  },
  fr: {
    connectionSupabase: "Connexion Supabase Active",
    connectionLocal: "Mode Local — Données Stockées dans localStorage",
    verified: "VÉRIFIÉ",
    editProfile: "MODIFIER LE PROFIL",
    profileEmpty: "Votre Profil est Vide",
    profileEmptyDesc: "Commencez votre parcours professionnel en ajoutant vos informations de profil. Remplissez votre profil pour correspondre aux offres d'emploi.",
    createProfile: "CRÉER LE PROFIL",
    careerVision: "Vision de Carrière",
    workExperience: "Expérience Professionnelle",
    education: "Formation",
    certificates: "Certificats",
    languages: "Langues",
    skills: "Compétences",
    interests: "Centres d'Intérêt",
    jobMatches: "Mes Correspondances d'Emploi",
    jobMatchesDesc: "Comparez votre profil avec les offres actives et voyez votre score de compatibilité",
    standard: "Standard",
    aiBoost: "AI Boost",
    scanning: "Analyse en cours...",
    aiAnalyzing: "Analyse IA en cours...",
    noMatches: "Aucune Correspondance",
    noMatchesDesc: "Cliquez sur \"Standard\" ou \"AI Boost\" pour faire correspondre votre profil avec les offres actives.",
    fillProfileFirst: "Remplissez d'abord votre profil, puis vous pourrez faire des correspondances avec les offres.",
    highMatch: "Haute Compatibilité",
    mediumMatch: "Compatibilité Moyenne",
    lowMatch: "Faible Compatibilité",
    strengths: "Points Forts",
    improvements: "Axes d'Amélioration",
    detailedScores: "Répartition Détaillée des Scores",
    jobDescription: "Description du Poste",
    salary: "Salaire",
    skillScore: "Compétences",
    locationScore: "Localisation",
    experienceScore: "Expérience",
    languageScore: "Langue",
    standardDesc: "Standard = Correspondance par mots-clés",
    boostDesc: "Boost = Analyse sémantique Gemini AI",
    addGeminiKey: "Ajoutez VITE_GEMINI_API_KEY à .env pour AI Boost",
    profileArchitect: "Architecte de Profil",
    profilePhotos: "Images de Profil",
    profilePhoto: "Photo de Profil",
    bannerImage: "Image de Bannière",
    uploading: "Téléchargement en cours...",
    fullName: "Nom Complet",
    fullNamePlaceholder: "Votre Nom Complet",
    location: "Localisation",
    selectCountry: "Sélectionner un Pays",
    selectCity: "Sélectionner une Ville",
    internationalPhone: "Téléphone International",
    aboutMe: "À Propos / Vision de Carrière",
    aboutMePlaceholder: "Décrivez-vous et vos objectifs de carrière...",
    add: "AJOUTER",
    position: "Poste / Titre",
    company: "Nom de l'Entreprise",
    startYear: "Début (2020)",
    endYear: "Fin (2023)",
    current: "En Poste Actuellement",
    ongoing: "En cours",
    delete: "SUPPRIMER",
    jobDescription2: "Description du poste et réalisations...",
    educationInfo: "Informations sur la Formation",
    school: "École / Université",
    department: "Département / Domaine",
    degree: "Diplôme",
    highSchool: "Lycée",
    associate: "DUT/BTS",
    bachelor: "Licence",
    master: "Master",
    doctorate: "Doctorat",
    languageSkills: "Compétences Linguistiques",
    selectLanguage: "Sélectionner une Langue",
    certificateName: "Nom du Certificat",
    institution: "Institution",
    year: "Année",
    technicalSkills: "Programmes Techniques & Compétences",
    skillPlaceholder: "Tapez une compétence et appuyez sur Entrée...",
    interestPlaceholder: "Tapez un centre d'intérêt et appuyez sur Entrée...",
    cancel: "ANNULER",
    saveMemory: "ENREGISTRER LE PROFIL",
    saving: "ENREGISTREMENT...",
    syncingMemory: "Synchronisation de la Mémoire...",
    photoSaved: "Photo de profil enregistrée!",
    bannerSaved: "Bannière enregistrée!",
    savedLocal: "enregistré!",
    localBackup: "Sauvegarde locale créée.",
    uploadFailed: "Échec complet du téléchargement.",
    fileTooLarge: "Le fichier doit être inférieur à 5 Mo.",
    selectImage: "Veuillez sélectionner un fichier image.",
    dataSavedSupabase: "Toutes les données enregistrées sur Supabase!",
    dataSavedLocal: "Données enregistrées localement!",
    saveFailed: "Échec de l'enregistrement:",
    supabaseRequired: "Connexion Supabase requise pour la correspondance.",
    noJobsFound: "Aucune offre active trouvée.",
    standardComplete: "offres correspondues en standard!",
    boostComplete: "offres analysées avec AI Boost!",
    matchError: "Erreur de correspondance:",
    boostError: "Erreur AI Boost:",
    change: "Modifier",
    changeBanner: "Modifier la Bannière",
    present: "Présent",
  },
  ar: {
    connectionSupabase: "اتصال Supabase نشط",
    connectionLocal: "الوضع المحلي — البيانات محفوظة في التخزين المحلي",
    verified: "موثق",
    editProfile: "تعديل الملف الشخصي",
    profileEmpty: "ملفك الشخصي فارغ",
    profileEmptyDesc: "ابدأ رحلتك المهنية بإضافة معلومات ملفك الشخصي. املأ ملفك الشخصي للتوافق مع إعلانات الوظائف.",
    createProfile: "إنشاء الملف الشخصي",
    careerVision: "الرؤية المهنية",
    workExperience: "الخبرة العملية",
    education: "التعليم",
    certificates: "الشهادات",
    languages: "اللغات",
    skills: "المهارات",
    interests: "الاهتمامات",
    jobMatches: "تطابقات الوظائف",
    jobMatchesDesc: "قارن ملفك الشخصي مع الإعلانات النشطة واعرف درجة توافقك",
    standard: "قياسي",
    aiBoost: "تعزيز الذكاء الاصطناعي",
    scanning: "جاري المسح...",
    aiAnalyzing: "جاري تحليل الذكاء الاصطناعي...",
    noMatches: "لا توجد تطابقات بعد",
    noMatchesDesc: "انقر على \"قياسي\" أو \"تعزيز الذكاء الاصطناعي\" لمطابقة ملفك الشخصي مع الإعلانات النشطة.",
    fillProfileFirst: "أولاً املأ ملفك الشخصي، ثم يمكنك المطابقة مع الإعلانات.",
    highMatch: "توافق عالي",
    mediumMatch: "توافق متوسط",
    lowMatch: "توافق منخفض",
    strengths: "نقاط القوة",
    improvements: "مجالات التحسين",
    detailedScores: "توزيع النقاط التفصيلي",
    jobDescription: "وصف الوظيفة",
    salary: "الراتب",
    skillScore: "المهارات",
    locationScore: "الموقع",
    experienceScore: "الخبرة",
    languageScore: "اللغة",
    standardDesc: "قياسي = مطابقة بالكلمات المفتاحية",
    boostDesc: "تعزيز = تحليل دلالي بالذكاء الاصطناعي",
    addGeminiKey: "أضف VITE_GEMINI_API_KEY إلى .env لتعزيز الذكاء الاصطناعي",
    profileArchitect: "مهندس الملف الشخصي",
    profilePhotos: "صور الملف الشخصي",
    profilePhoto: "صورة الملف الشخصي",
    bannerImage: "صورة الغلاف",
    uploading: "جاري رفع الصورة...",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "اسمك الكامل",
    location: "الموقع",
    selectCountry: "اختر الدولة",
    selectCity: "اختر المدينة",
    internationalPhone: "الهاتف الدولي",
    aboutMe: "نبذة عني / الرؤية المهنية",
    aboutMePlaceholder: "صف نفسك وأهدافك المهنية...",
    add: "إضافة",
    position: "المنصب / اللقب",
    company: "اسم الشركة",
    startYear: "البداية (2020)",
    endYear: "النهاية (2023)",
    current: "أعمل حالياً",
    ongoing: "مستمر",
    delete: "حذف",
    jobDescription2: "وصف الوظيفة والإنجازات...",
    educationInfo: "معلومات التعليم",
    school: "المدرسة / الجامعة",
    department: "القسم / المجال",
    degree: "الدرجة",
    highSchool: "الثانوية",
    associate: "دبلوم",
    bachelor: "بكالوريوس",
    master: "ماجستير",
    doctorate: "دكتوراه",
    languageSkills: "المهارات اللغوية",
    selectLanguage: "اختر اللغة",
    certificateName: "اسم الشهادة",
    institution: "المؤسسة",
    year: "السنة",
    technicalSkills: "البرامج التقنية والمهارات",
    skillPlaceholder: "اكتب مهارة واضغط Enter...",
    interestPlaceholder: "اكتب اهتمام واضغط Enter...",
    cancel: "إلغاء",
    saveMemory: "حفظ الملف الشخصي",
    saving: "جاري الحفظ...",
    syncingMemory: "جاري مزامنة الذاكرة...",
    photoSaved: "تم حفظ صورة الملف الشخصي!",
    bannerSaved: "تم حفظ الغلاف!",
    savedLocal: "تم الحفظ!",
    localBackup: "تم إنشاء نسخة احتياطية محلية.",
    uploadFailed: "فشل الرفع بالكامل.",
    fileTooLarge: "يجب أن يكون الملف أصغر من 5 ميجابايت.",
    selectImage: "يرجى اختيار ملف صورة.",
    dataSavedSupabase: "تم حفظ جميع البيانات في Supabase!",
    dataSavedLocal: "تم حفظ البيانات محلياً!",
    saveFailed: "فشل الحفظ:",
    supabaseRequired: "مطلوب اتصال Supabase للمطابقة.",
    noJobsFound: "لم يتم العثور على إعلانات نشطة.",
    standardComplete: "إعلانات متطابقة بالطريقة القياسية!",
    boostComplete: "إعلانات تم تحليلها بتعزيز الذكاء الاصطناعي!",
    matchError: "خطأ في المطابقة:",
    boostError: "خطأ في تعزيز الذكاء الاصطناعي:",
    change: "تغيير",
    changeBanner: "تغيير الغلاف",
    present: "الحالي",
  },
};

/* =========================================================
   GLOBAL VERİ SETLERİ
   ========================================================= */
const PHONE_CODES = [
  { code: "+90", label: "Turkey (+90)" },
  { code: "+216", label: "Tunisia (+216)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+33", label: "France (+33)" },
  { code: "+49", label: "Germany (+49)" },
];

const LOCATION_DATA = {
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan"],
  "United Kingdom": ["London", "Manchester", "Birmingham"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
  "France": ["Paris", "Lyon", "Marseille"],
  "Germany": ["Berlin", "Munich", "Hamburg"],
};

const LANGUAGE_LIST = [
  "Türkçe", "English", "العربية", "Français"
];

/* =========================================================
   VARSAYILAN FORM
   ========================================================= */
const DEFAULT_FORM = {
  full_name: "",
  country: "Turkey",
  city: "",
  bio: "",
  phone_code: "+90",
  phone: "",
  avatar_url: "",
  cover_url: "",
  work_experience: [],
  education: [],
  skills: [],
  certificates: [],
  languages: [],
  interests: [],
};

const STORAGE_KEY = "kariyerup-profile-data";

/* =========================================================
   YARDIMCI FONKSİYONLAR
   ========================================================= */
function compressImageToBase64(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadFromLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_FORM, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT_FORM };
}

function saveToLocal(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("localStorage kayıt hatası:", e);
  }
}

function getScoreColor(score, t) {
  if (score >= 80) return { bg: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50", border: "border-emerald-200", label: t.highMatch };
  if (score >= 50) return { bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50", border: "border-amber-200", label: t.mediumMatch };
  return { bg: "bg-red-500", text: "text-red-600", light: "bg-red-50", border: "border-red-200", label: t.lowMatch };
}

/* =========================================================
   TOAST SİSTEMİ
   ========================================================= */
let toastIdCounter = 0;

function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "success") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 animate-[slideIn_0.3s_ease-out] ${
            t.type === "success"
              ? "bg-emerald-600 text-white"
              : t.type === "warning"
              ? "bg-amber-500 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {t.type === "success" ? <CheckCircle2 size={16} /> : t.type === "warning" ? <AlertTriangle size={16} /> : <X size={16} />}
          {t.message}
        </div>
      ))}
    </div>
  );

  return { show, ToastContainer };
}

/* =========================================================
   BÖLÜM BAŞLIĞI
   ========================================================= */
function SectionTitle({ icon: Icon, color, title, onAdd, addLabel = "EKLE" }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
      <h3 className="font-black uppercase text-[11px] text-slate-500 tracking-widest flex items-center gap-2">
        <Icon size={16} className={color} /> {title}
      </h3>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="bg-slate-800 hover:bg-rose-600 text-white rounded-xl font-black h-9 px-5 text-[9px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
        >
          <Plus size={12} /> {addLabel}
        </button>
      )}
    </div>
  );
}

/* =========================================================
   ANA KOMPONENT
   ========================================================= */
export default function UserProfile() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language] || TRANSLATIONS.tr;
  const isRTL = language === "ar";
  
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [connectionMode, setConnectionMode] = useState("checking");

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });

  // ─── MATCHING STATE ───
  const [matches, setMatches] = useState([]);
  const [matching, setMatching] = useState(false);
  const [matchMode, setMatchMode] = useState(null);
  const [expandedMatch, setExpandedMatch] = useState(null);

  const { show: toast, ToastContainer } = useToast();

  /* ─────────────────────────────────────────────────────────
     PROFİL YÜKLEME
     ───────────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchProfile = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: sessionData, error: sessErr } = await supabase.auth.getSession();

          if (sessErr || !sessionData?.session?.user) {
            setConnectionMode("local");
            setFormData(loadFromLocal());
            setLoading(false);
            return;
          }

          const user = sessionData.session.user;
          setMe(user);
          setConnectionMode("supabase");

          const { data: p, error: profileErr } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (profileErr) {
            console.error("Profil çekme hatası:", profileErr);
          }

          if (p) {
            const cv = p.cv_data || {};
            const loadedData = {
              full_name: p.full_name || "",
              country: p.country || "Turkey",
              city: p.city || "",
              avatar_url: p.avatar_url || "",
              cover_url: cv.cover_url || "",
              bio: p.bio || cv.about || "",
              phone_code: cv.phone_code || "+90",
              phone: p.phone || cv.phone_number || "",
              work_experience: Array.isArray(cv.work_experience) ? cv.work_experience : [],
              education: Array.isArray(cv.education) ? cv.education : [],
              skills: Array.isArray(cv.skills) ? cv.skills : [],
              certificates: Array.isArray(cv.certificates) ? cv.certificates : [],
              languages: Array.isArray(cv.languages) ? cv.languages : [],
              interests: Array.isArray(cv.interests) ? cv.interests : [],
            };
            setFormData(loadedData);
            saveToLocal(loadedData);
          }

          setLoading(false);
          return;
        } catch (err) {
          console.error("Supabase bağlantı hatası:", err);
        }
      }

      setConnectionMode("local");
      setFormData(loadFromLocal());
      setLoading(false);
    };

    fetchProfile();
  }, []);

  /* ─────────────────────────────────────────────────────────
     KAYITLI EŞLEŞMELERİ YÜKLE
     ───────────────────────────────────────────────────────── */
  useEffect(() => {
    if (me && connectionMode === "supabase") {
      loadSavedMatches();
    }
  }, [me, connectionMode]);

  const loadSavedMatches = async () => {
    try {
      const [savedMatches, jobs] = await Promise.all([
        fetchExistingMatches(me.id),
        fetchAllJobs(),
      ]);

      if (savedMatches.length > 0 && jobs.length > 0) {
        const results = savedMatches
          .map((m) => {
            const job = jobs.find((j) => j.post_id === m.job_id);
            if (!job) return null;
            const rawExplanation = (m.explanation || "").replace(/^\[(STANDARD|BOOST)\]\s*/i, "");
            const isBoost = (m.explanation || "").includes("[BOOST]");
            return {
              job,
              score: Number(m.fit_score) || 0,
              explanation: rawExplanation,
              mode: isBoost ? "boost" : "standard",
              strengths: [],
              gaps: [],
              details: { skillScore: 0, locationScore: 0, levelScore: 0, languageScore: 0 },
            };
          })
          .filter(Boolean);
        setMatches(results);
      }
    } catch (err) {
      console.error("Kayıtlı eşleşmeler yüklenemedi:", err);
    }
  };

  /* ─────────────────────────────────────────────────────────
     FOTOĞRAF YÜKLEME
     ───────────────────────────────────────────────────────── */
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast(t.fileTooLarge, "error");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast(t.selectImage, "error");
      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      let finalUrl = "";

      if (connectionMode === "supabase" && me) {
        try {
          const ext = file.name.split(".").pop() || "jpg";
          const fileName = `${me.id}/${type}-${Date.now()}.${ext}`;

          const { error: upErr } = await supabase.storage
            .from("profiles")
            .upload(fileName, file, { upsert: true });

          if (upErr) throw upErr;

          const { data: urlData } = supabase.storage
            .from("profiles")
            .getPublicUrl(fileName);

          if (urlData?.publicUrl) {
            finalUrl = urlData.publicUrl + "?t=" + Date.now();
          } else {
            throw new Error("Public URL alınamadı");
          }
        } catch (storageErr) {
          console.warn("Storage başarısız, base64'e dönülüyor:", storageErr);
          finalUrl = await compressImageToBase64(file, type === "avatar" ? 400 : 1200, 0.75);
        }

        try {
          if (type === "avatar") {
            const { error: dbErr } = await supabase
              .from("profiles")
              .update({ avatar_url: finalUrl, updated_at: new Date().toISOString() })
              .eq("id", me.id);
            if (dbErr) console.error("Avatar DB hatası:", dbErr);
            else toast(t.photoSaved, "success");
          } else {
            const { data: currentProfile } = await supabase
              .from("profiles")
              .select("cv_data")
              .eq("id", me.id)
              .maybeSingle();
            const currentCv = currentProfile?.cv_data || {};
            const { error: dbErr } = await supabase
              .from("profiles")
              .update({
                cv_data: { ...currentCv, cover_url: finalUrl },
                updated_at: new Date().toISOString(),
              })
              .eq("id", me.id);
            if (dbErr) console.error("Cover DB hatası:", dbErr);
            else toast(t.bannerSaved, "success");
          }
        } catch (dbError) {
          console.error("DB kayıt hatası:", dbError);
        }
      } else {
        finalUrl = await compressImageToBase64(file, type === "avatar" ? 400 : 1200, 0.75);
        toast(`${type === "avatar" ? t.profilePhoto : t.bannerImage} ${t.savedLocal}`, "success");
      }

      const uploadKey = type === "avatar" ? "avatar_url" : "cover_url";
      setFormData((prev) => {
        const updated = { ...prev, [uploadKey]: finalUrl };
        saveToLocal(updated);
        return updated;
      });
    } catch (error) {
      console.error("Upload hatası:", error);
      try {
        const uploadKey = type === "avatar" ? "avatar_url" : "cover_url";
        const base64 = await compressImageToBase64(file, type === "avatar" ? 400 : 1200);
        setFormData((prev) => {
          const updated = { ...prev, [uploadKey]: base64 };
          saveToLocal(updated);
          return updated;
        });
        toast(t.localBackup, "warning");
      } catch {
        toast(t.uploadFailed, "error");
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  /* ─────────────────────────────────────────────────────────
     TÜM PROFİLİ KAYDET
     ───────────────────────────────────────────────────────── */
  const handleSave = async () => {
    setSaving(true);

    try {
      saveToLocal(formData);

      if (connectionMode === "supabase" && me) {
        const cvData = {
          cover_url: formData.cover_url,
          phone_code: formData.phone_code,
          phone_number: formData.phone,
          about: formData.bio,
          work_experience: formData.work_experience,
          education: formData.education,
          skills: formData.skills,
          certificates: formData.certificates,
          languages: formData.languages,
          interests: formData.interests,
        };

        const profileFields = {
          full_name: formData.full_name.trim(),
          avatar_url: formData.avatar_url,
          country: formData.country,
          city: formData.city,
          bio: formData.bio,
          phone: (formData.phone_code + " " + formData.phone).trim(),
          cv_data: cvData,
          updated_at: new Date().toISOString(),
        };

        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", me.id)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("profiles")
            .update(profileFields)
            .eq("id", me.id);
          if (error) throw error;
        } else {
          const userEmail =
            me.email || me.user_metadata?.email || me.app_metadata?.email || "";
          const { error } = await supabase
            .from("profiles")
            .insert({ id: me.id, email: userEmail, ...profileFields });
          if (error) throw error;
        }

        toast(t.dataSavedSupabase, "success");
      } else {
        toast(t.dataSavedLocal, "success");
      }

      setEditOpen(false);
    } catch (e) {
      console.error("Kayıt hatası:", e);
      toast(`${t.saveFailed} ${e.message || ""}`, "error");
    } finally {
      setSaving(false);
    }
  };

  /* ─────────────────────────────────────────────────────────
     MATCHING HANDLERS
     ───────────────────────────────────────────────────────── */
  const buildProfileForMatching = () => ({
    full_name: formData.full_name,
    bio: formData.bio,
    city: formData.city,
    country: formData.country,
    cv_data: {
      skills: formData.skills,
      work_experience: formData.work_experience,
      education: formData.education,
      languages: formData.languages,
      certificates: formData.certificates,
      interests: formData.interests,
    },
  });

  const handleStandardMatch = async () => {
    if (!me || connectionMode !== "supabase") {
      toast(t.supabaseRequired, "warning");
      return;
    }
    setMatching(true);
    setMatchMode("standard");
    setExpandedMatch(null);
    try {
      const results = await runStandardMatching(buildProfileForMatching(), me.id);
      setMatches(results);
      if (results.length === 0) {
        toast(t.noJobsFound, "warning");
      } else {
        toast(`${results.length} ${t.standardComplete}`, "success");
      }
    } catch (err) {
      console.error("Standard match error:", err);
      toast(`${t.matchError} ${err.message || ""}`, "error");
    } finally {
      setMatching(false);
      setMatchMode(null);
    }
  };

  const handleBoostMatch = async () => {
    if (!me || connectionMode !== "supabase") {
      toast(t.supabaseRequired, "warning");
      return;
    }
    if (!isGeminiConfigured()) {
      toast(t.addGeminiKey, "error");
      return;
    }
    setMatching(true);
    setMatchMode("boost");
    setExpandedMatch(null);
    try {
      const results = await runBoostMatching(buildProfileForMatching(), me.id);
      setMatches(results);
      if (results.length === 0) {
        toast(t.noJobsFound, "warning");
      } else {
        toast(`${results.length} ${t.boostComplete}`, "success");
      }
    } catch (err) {
      console.error("Boost match error:", err);
      toast(`${t.boostError} ${err.message || ""}`, "error");
    } finally {
      setMatching(false);
      setMatchMode(null);
    }
  };

  /* ----- Form Güncelleme Helpers ----- */
  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const updateArrayItem = (field, index, key, value) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addArrayItem = (field, template) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], template],
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        updateField("skills", [...formData.skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === "Enter" && interestInput.trim()) {
      e.preventDefault();
      if (!formData.interests.includes(interestInput.trim())) {
        updateField("interests", [...formData.interests, interestInput.trim()]);
      }
      setInterestInput("");
    }
  };

  /* ----- Yükleniyor ----- */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-black text-rose-500 text-sm uppercase tracking-widest animate-pulse">
            {t.syncingMemory}
          </p>
        </div>
      </div>
    );
  }

  const cities = LOCATION_DATA[formData.country] || [];

  const hasContent =
    formData.bio ||
    formData.work_experience.length > 0 ||
    formData.education.length > 0 ||
    formData.certificates.length > 0 ||
    formData.languages.length > 0 ||
    formData.skills.length > 0 ||
    formData.interests.length > 0;

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className={`bg-[#F8FAFC] min-h-screen pb-20 font-sans ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <ToastContainer />

      {/* Gizli file input'lar */}
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*"
        onChange={(e) => handleFileUpload(e, "avatar")} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*"
        onChange={(e) => handleFileUpload(e, "cover")} />

      {/* BAĞLANTI DURUMU */}
      <div className={`text-center py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${
        connectionMode === "supabase" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
      }`}>
        {connectionMode === "supabase" ? (
          <><Wifi size={12} /> {t.connectionSupabase}</>
        ) : (
          <><WifiOff size={12} /> {t.connectionLocal}</>
        )}
      </div>

      {/* ==================== HEADER ==================== */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto">
          {/* Banner */}
          <div
            className={`h-48 md:h-64 bg-slate-200 relative group overflow-hidden rounded-b-3xl ${uploading ? "pointer-events-none opacity-70" : "cursor-pointer"}`}
            onClick={() => !uploading && coverInputRef.current?.click()}
          >
            {formData.cover_url ? (
              <img src={formData.cover_url} className="w-full h-full object-cover" alt="banner"
                onError={(e) => { e.target.style.display = "none"; }} />
            ) : null}
            <div className={`absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-500 to-orange-400 ${formData.cover_url ? "opacity-0" : "opacity-90"}`} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300">
              {uploading ? (
                <>
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="font-black uppercase tracking-widest text-sm">{t.uploading}</span>
                </>
              ) : (
                <>
                  <ImagePlus size={32} className="mb-2" />
                  <span className="font-black uppercase tracking-widest text-sm">{t.changeBanner}</span>
                </>
              )}
            </div>
          </div>

          {/* Profil Özet */}
          <div className="px-4 md:px-8 pb-8 flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6 -mt-16 relative z-10">
            <div
              className={`w-32 h-32 md:w-44 md:h-44 rounded-3xl border-[6px] border-white shadow-xl overflow-hidden bg-slate-100 group relative shrink-0 ${uploading ? "pointer-events-none" : "cursor-pointer"}`}
              onClick={() => !uploading && avatarInputRef.current?.click()}
            >
              <img
                src={formData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || "U")}&size=256&background=f43f5e&color=fff&bold=true`}
                className="w-full h-full object-cover"
                alt="avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || "U")}&size=256&background=f43f5e&color=fff&bold=true`;
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300">
                <Camera size={24} className="mb-1" />
                <span className="font-black text-[9px] uppercase tracking-widest">{t.change}</span>
              </div>
            </div>

            <div className="flex-1 pb-2 min-w-0">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-800 leading-none truncate">
                {formData.full_name || t.fullName.toUpperCase()}
              </h1>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase">
                  <CheckCircle2 size={12} /> {t.verified}
                </span>
                {(formData.city || formData.country) && (
                  <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                    <MapPin size={12} /> {[formData.city, formData.country].filter(Boolean).join(", ")}
                  </span>
                )}
                {formData.phone && (
                  <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                    <Phone size={12} /> {formData.phone_code} {formData.phone}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setEditOpen(true)}
              className="mb-2 bg-slate-900 text-white font-black px-6 md:px-8 h-12 rounded-xl shadow-lg hover:bg-rose-600 transition-all uppercase italic text-xs tracking-widest active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Edit3 size={16} /> {t.editProfile}
            </button>
          </div>
        </div>
      </div>

      {/* ==================== ANA İÇERİK ==================== */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
              <Edit3 size={40} className="text-slate-300" />
            </div>
            <h2 className="text-xl font-black uppercase text-slate-400 tracking-wider mb-2">
              {t.profileEmpty}
            </h2>
            <p className="text-slate-400 text-sm mb-8 max-w-md">
              {t.profileEmptyDesc}
            </p>
            <button
              onClick={() => setEditOpen(true)}
              className="bg-rose-600 text-white font-black px-10 h-14 rounded-2xl shadow-xl hover:bg-rose-700 transition-all uppercase italic text-sm tracking-widest active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Plus size={20} /> {t.createProfile}
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* SOL KOLON */}
            <div className="lg:col-span-8 space-y-10">
              {formData.bio && (
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Target size={18} className="text-rose-500" /> {t.careerVision}
                  </h3>
                  <p className="text-slate-700 font-bold italic text-lg leading-relaxed">
                    &ldquo;{formData.bio}&rdquo;
                  </p>
                </section>
              )}

              {formData.work_experience.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Briefcase size={20} className="text-rose-500" /> {t.workExperience}
                  </h3>
                  <div className="space-y-4">
                    {formData.work_experience.map((w, i) => (
                      <div key={i} className="p-6 rounded-3xl shadow-sm bg-white border border-slate-50">
                        <h4 className="text-lg font-black uppercase italic tracking-tight text-slate-800">{w.role || t.position}</h4>
                        <p className="text-rose-600 font-black text-[10px] uppercase mt-1">
                          {w.company || t.company} • {w.start || "?"} - {w.isCurrent ? t.present : w.end || "?"}
                        </p>
                        {w.desc && (
                          <p className="text-slate-500 italic text-sm mt-3 pl-4 border-l-2 border-rose-100">&ldquo;{w.desc}&rdquo;</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {formData.education.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <GraduationCap size={20} className="text-emerald-500" /> {t.education}
                  </h3>
                  <div className="space-y-4">
                    {formData.education.map((ed, i) => (
                      <div key={i} className="p-6 rounded-3xl shadow-sm bg-white border border-slate-50">
                        <h4 className="text-lg font-black uppercase italic tracking-tight text-slate-800">{ed.school || t.school}</h4>
                        <p className="text-emerald-600 font-black text-[10px] uppercase mt-1">{ed.degree} • {ed.field}</p>
                        <p className="text-slate-400 font-bold text-[10px] uppercase mt-1">
                          {ed.start || "?"} - {ed.isCurrent ? t.ongoing : ed.end || "?"}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {formData.certificates.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Award size={20} className="text-amber-500" /> {t.certificates}
                  </h3>
                  <div className="space-y-4">
                    {formData.certificates.map((c, i) => (
                      <div key={i} className="p-6 rounded-3xl shadow-sm bg-white border border-slate-50">
                        <h4 className="text-base font-black uppercase tracking-tight text-slate-800">{c.name || t.certificateName}</h4>
                        <p className="text-amber-600 font-black text-[10px] uppercase mt-1">{c.issuer} • {c.year}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* SAĞ KOLON */}
            <div className="lg:col-span-4 space-y-10">
              {formData.languages.length > 0 && (
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Languages size={16} className="text-indigo-500" /> {t.languages}
                  </h3>
                  <div className="space-y-3">
                    {formData.languages.map((l, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                        <span className="font-black uppercase text-[10px] text-slate-700 tracking-widest">{l.lang || t.selectLanguage}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {formData.skills.length > 0 && (
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Cpu size={16} className="text-cyan-500" /> {t.skills}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((s, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </section>
              )}

              {formData.interests.length > 0 && (
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Heart size={16} className="text-pink-500" /> {t.interests}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((s, i) => (
                      <span key={i} className="bg-pink-50 text-pink-600 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </main>

      {/* =========================================================
          İŞ EŞLEŞMELERİ BÖLÜMÜ
          ========================================================= */}
      {connectionMode === "supabase" && (
        <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 md:px-8 py-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-black uppercase italic tracking-tight text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Zap size={20} className="text-amber-400" />
                    </div>
                    {t.jobMatches}
                  </h2>
                  <p className="text-slate-400 text-xs mt-1 ms-13">
                    {t.jobMatchesDesc}
                  </p>
                </div>
                <div className="flex gap-2 ms-13 sm:ms-0">
                  <button
                    onClick={handleStandardMatch}
                    disabled={matching}
                    className="bg-white/10 hover:bg-white/20 text-white font-black px-5 h-11 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer border border-white/10"
                  >
                    {matching && matchMode === "standard" ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search size={14} />
                    )}
                    {t.standard}
                  </button>
                  <button
                    onClick={handleBoostMatch}
                    disabled={matching}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-5 h-11 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/25"
                  >
                    {matching && matchMode === "boost" ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles size={14} />
                    )}
                    {t.aiBoost}
                  </button>
                </div>
              </div>

              {/* Matching Progress */}
              {matching && (
                <div className="mt-4 ms-13">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full animate-pulse" style={{ width: "60%" }} />
                    </div>
                    <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">
                      {matchMode === "boost" ? t.aiAnalyzing : t.scanning}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Match Results */}
            <div className="p-6 md:p-8">
              {matches.length === 0 && !matching ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp size={28} className="text-slate-300" />
                  </div>
                  <h3 className="font-black text-slate-400 uppercase text-sm tracking-wider mb-2">
                    {t.noMatches}
                  </h3>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto">
                    {hasContent ? t.noMatchesDesc : t.fillProfileFirst}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((m, idx) => {
                    const sc = getScoreColor(m.score, t);
                    const isExpanded = expandedMatch === idx;
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border-2 ${sc.border} ${sc.light} overflow-hidden transition-all duration-300`}
                      >
                        {/* Match Header */}
                        <div
                          className="p-5 cursor-pointer"
                          onClick={() => setExpandedMatch(isExpanded ? null : idx)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-8 h-8 rounded-lg ${sc.bg} bg-opacity-20 flex items-center justify-center`}>
                                  <Building2 size={16} className={sc.text} />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm truncate">
                                    {m.job.position || "Unknown Position"}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                    {m.job.work_type && (
                                      <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">
                                        {m.job.work_type}
                                      </span>
                                    )}
                                    {m.job.level && (
                                      <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">
                                        • {m.job.level}
                                      </span>
                                    )}
                                    {m.job.location_text && (
                                      <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-1">
                                        • <MapPin size={9} /> {m.job.location_text}
                                      </span>
                                    )}
                                    {m.job.experience_range && (
                                      <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-1">
                                        • <Clock size={9} /> {m.job.experience_range}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Score Bar */}
                              <div className="flex items-center gap-3 mt-3">
                                <div className="flex-1 bg-white rounded-full h-2.5 overflow-hidden shadow-inner">
                                  <div
                                    className={`h-full rounded-full ${sc.bg} transition-all duration-700`}
                                    style={{ width: `${m.score}%` }}
                                  />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${sc.light} ${sc.text}`}>
                                  {m.mode === "boost" ? "BOOST" : "STANDARD"}
                                </span>
                              </div>
                            </div>

                            {/* Score Circle */}
                            <div className="flex flex-col items-center shrink-0">
                              <div className={`w-16 h-16 rounded-2xl ${sc.bg} flex items-center justify-center shadow-lg`}>
                                <span className="text-white font-black text-xl">{m.score}</span>
                              </div>
                              <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${sc.text}`}>
                                {sc.label}
                              </span>
                              <button className="mt-1 text-slate-400">
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="px-5 pb-5 space-y-4 border-t border-white/50">
                            {/* Explanation */}
                            <div className="pt-4">
                              <p className="text-slate-600 text-sm italic">
                                &ldquo;{m.explanation}&rdquo;
                              </p>
                            </div>

                            {/* Strengths & Gaps */}
                            {(m.strengths?.length > 0 || m.gaps?.length > 0) && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {m.strengths?.length > 0 && (
                                  <div className="bg-white rounded-xl p-4 space-y-2">
                                    <h5 className="text-[9px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                                      <CheckCircle2 size={12} /> {t.strengths}
                                    </h5>
                                    {m.strengths.map((s, si) => (
                                      <p key={si} className="text-xs text-slate-600 flex items-start gap-2">
                                        <span className="text-emerald-500 mt-0.5">✓</span> {s}
                                      </p>
                                    ))}
                                  </div>
                                )}
                                {m.gaps?.length > 0 && (
                                  <div className="bg-white rounded-xl p-4 space-y-2">
                                    <h5 className="text-[9px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1">
                                      <AlertTriangle size={12} /> {t.improvements}
                                    </h5>
                                    {m.gaps.map((g, gi) => (
                                      <p key={gi} className="text-xs text-slate-600 flex items-start gap-2">
                                        <span className="text-amber-500 mt-0.5">!</span> {g}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Detail Scores (Standard only) */}
                            {m.mode === "standard" && m.details && (m.details.skillScore > 0 || m.details.locationScore > 0) && (
                              <div className="bg-white rounded-xl p-4">
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                  {t.detailedScores}
                                </h5>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                  {[
                                    { label: t.skillScore, score: m.details.skillScore, weight: "40%", color: "bg-cyan-500" },
                                    { label: t.locationScore, score: m.details.locationScore, weight: "20%", color: "bg-blue-500" },
                                    { label: t.experienceScore, score: m.details.levelScore, weight: "25%", color: "bg-purple-500" },
                                    { label: t.languageScore, score: m.details.languageScore, weight: "15%", color: "bg-indigo-500" },
                                  ].map((d, di) => (
                                    <div key={di} className="text-center">
                                      <div className="text-xs font-black text-slate-700">{d.score}</div>
                                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 mb-1">
                                        <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.score}%` }} />
                                      </div>
                                      <div className="text-[8px] font-bold text-slate-400 uppercase">
                                        {d.label} ({d.weight})
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Job Description */}
                            {m.job.description && (
                              <div className="bg-white rounded-xl p-4">
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                  {t.jobDescription}
                                </h5>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  {m.job.description}
                                </p>
                              </div>
                            )}

                            {/* Salary Info */}
                            {(m.job.salary_min || m.job.salary_max) && (
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-black text-[9px] uppercase text-slate-400">{t.salary}:</span>
                                {m.job.salary_min && m.job.salary_max
                                  ? `${m.job.salary_min.toLocaleString()} - ${m.job.salary_max.toLocaleString()} ₺`
                                  : m.job.salary_min
                                  ? `${m.job.salary_min.toLocaleString()} ₺+`
                                  : `${m.job.salary_max?.toLocaleString()} ₺'ye kadar`}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Info Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-4 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Search size={10} /> {t.standardDesc}
                  </span>
                  <span className="flex items-center gap-1">
                    <Sparkles size={10} className="text-amber-500" /> {t.boostDesc}
                  </span>
                </div>
                {!isGeminiConfigured() && (
                  <span className="text-[9px] text-amber-500 font-bold flex items-center gap-1">
                    <AlertTriangle size={10} /> {t.addGeminiKey}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          DÜZENLEME MODALI
          ========================================================= */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl relative flex flex-col ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
            {/* MODAL HEADER */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 md:px-8 py-6 border-b border-slate-100 z-50 flex justify-between items-center rounded-t-[32px]">
              <h2 className="text-lg font-black uppercase italic tracking-tight text-slate-800">
                {t.profileArchitect} <span className="text-rose-500">v33</span>
              </h2>
              <button
                onClick={() => setEditOpen(false)}
                className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL İÇERİK */}
            <div className="p-6 md:p-8 space-y-10">

              {/* FOTOĞRAF YÜKLEMELERİ */}
              <div className="space-y-4">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ms-1">
                  {t.profilePhotos}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`relative h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer group hover:border-rose-300 transition-colors ${uploading ? "pointer-events-none opacity-60" : ""}`}
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} className="w-full h-full object-cover" alt="avatar preview"
                        onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <Camera size={28} className="mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t.profilePhoto}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200">
                      <Camera size={24} />
                    </div>
                  </div>
                  <div
                    className={`relative h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer group hover:border-rose-300 transition-colors ${uploading ? "pointer-events-none opacity-60" : ""}`}
                    onClick={() => coverInputRef.current?.click()}
                  >
                    {formData.cover_url ? (
                      <img src={formData.cover_url} className="w-full h-full object-cover" alt="banner preview"
                        onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ImagePlus size={28} className="mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t.bannerImage}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200">
                      <ImagePlus size={24} />
                    </div>
                  </div>
                </div>
                {uploading && (
                  <div className="flex items-center gap-2 text-rose-500 text-xs font-bold">
                    <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                    {t.uploading}
                  </div>
                )}
              </div>

              {/* AD SOYAD */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ms-1">{t.fullName}</label>
                <input
                  value={formData.full_name}
                  onChange={(e) => updateField("full_name", e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                />
              </div>

              {/* LOKASYON */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ms-1">{t.location}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={formData.country}
                    onChange={(e) => { updateField("country", e.target.value); updateField("city", ""); }}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">{t.selectCountry}</option>
                    {Object.keys(LOCATION_DATA).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">{t.selectCity}</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TELEFON */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ms-1 flex items-center gap-1">
                  <Phone size={12} /> {t.internationalPhone}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={formData.phone_code}
                    onChange={(e) => updateField("phone_code", e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {PHONE_CODES.map((p) => (
                      <option key={p.code} value={p.code}>{p.label}</option>
                    ))}
                  </select>
                  <input
                    placeholder="5XX XXX XX XX"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="sm:col-span-2 w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* HAKKIMDA / BIO */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ms-1 flex items-center gap-1">
                  <Target size={12} /> {t.aboutMe}
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  placeholder={t.aboutMePlaceholder}
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              {/* İŞ DENEYİMİ */}
              <div className="space-y-4">
                <SectionTitle icon={Briefcase} color="text-rose-500" title={t.workExperience} addLabel={t.add}
                  onAdd={() => addArrayItem("work_experience", { role: "", company: "", start: "", end: "", isCurrent: false, desc: "" })} />
                {formData.work_experience.map((w, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl space-y-3 relative border border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input placeholder={t.position} value={w.role}
                        onChange={(e) => updateArrayItem("work_experience", i, "role", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-rose-500" />
                      <input placeholder={t.company} value={w.company}
                        onChange={(e) => updateArrayItem("work_experience", i, "company", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-rose-500" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                      <input placeholder={t.startYear} value={w.start}
                        onChange={(e) => updateArrayItem("work_experience", i, "start", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-rose-500" />
                      <input placeholder={t.endYear} value={w.end} disabled={w.isCurrent}
                        onChange={(e) => updateArrayItem("work_experience", i, "end", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none disabled:opacity-40 focus:ring-2 focus:ring-rose-500" />
                      <label className="flex items-center gap-2 cursor-pointer justify-center">
                        <input type="checkbox" checked={w.isCurrent}
                          onChange={(e) => updateArrayItem("work_experience", i, "isCurrent", e.target.checked)}
                          className="w-4 h-4 accent-rose-500" />
                        <span className="text-[9px] font-black uppercase text-slate-400">{t.current}</span>
                      </label>
                      <button onClick={() => removeArrayItem("work_experience", i)}
                        className="flex items-center justify-center gap-1 bg-white text-red-400 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[9px] font-black uppercase cursor-pointer">
                        <Trash2 size={14} /> {t.delete}
                      </button>
                    </div>
                    <textarea placeholder={t.jobDescription2} value={w.desc}
                      onChange={(e) => updateArrayItem("work_experience", i, "desc", e.target.value)}
                      className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none min-h-[80px] resize-none focus:ring-2 focus:ring-rose-500" />
                  </div>
                ))}
              </div>

              {/* EĞİTİM */}
              <div className="space-y-4">
                <SectionTitle icon={GraduationCap} color="text-emerald-500" title={t.educationInfo} addLabel={t.add}
                  onAdd={() => addArrayItem("education", { school: "", degree: "", field: "", start: "", end: "", isCurrent: false })} />
                {formData.education.map((ed, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input placeholder={t.school} value={ed.school}
                        onChange={(e) => updateArrayItem("education", i, "school", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
                      <input placeholder={t.department} value={ed.field}
                        onChange={(e) => updateArrayItem("education", i, "field", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                      <select value={ed.degree}
                        onChange={(e) => updateArrayItem("education", i, "degree", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="">{t.degree}</option>
                        <option value="Lise">{t.highSchool}</option>
                        <option value="Ön Lisans">{t.associate}</option>
                        <option value="Lisans">{t.bachelor}</option>
                        <option value="Yüksek Lisans">{t.master}</option>
                        <option value="Doktora">{t.doctorate}</option>
                      </select>
                      <input placeholder={t.startYear} value={ed.start}
                        onChange={(e) => updateArrayItem("education", i, "start", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
                      <input placeholder={t.endYear} value={ed.end} disabled={ed.isCurrent}
                        onChange={(e) => updateArrayItem("education", i, "end", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none disabled:opacity-40 focus:ring-2 focus:ring-emerald-500" />
                      <div className="flex items-center justify-between gap-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" checked={ed.isCurrent}
                            onChange={(e) => updateArrayItem("education", i, "isCurrent", e.target.checked)}
                            className="w-4 h-4 accent-emerald-500" />
                          <span className="text-[8px] font-black uppercase text-slate-400">{t.ongoing}</span>
                        </label>
                        <button onClick={() => removeArrayItem("education", i)}
                          className="text-red-400 hover:text-red-600 transition-all cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DİLLER */}
              <div className="space-y-4">
                <SectionTitle icon={Languages} color="text-indigo-500" title={t.languageSkills} addLabel={t.add}
                  onAdd={() => addArrayItem("languages", { lang: "", level: 1 })} />
                {formData.languages.map((l, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <select value={l.lang}
                      onChange={(e) => updateArrayItem("languages", i, "lang", e.target.value)}
                      className="flex-1 p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">{t.selectLanguage}</option>
                      {LANGUAGE_LIST.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} type="button"
                          onClick={() => updateArrayItem("languages", i, "level", s)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer">
                          <Star size={20} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-200"} />
                        </button>
                      ))}
                    </div>
                    <button onClick={() => removeArrayItem("languages", i)} className="text-red-400 hover:text-red-600 p-2 cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* SERTİFİKALAR */}
              <div className="space-y-4">
                <SectionTitle icon={Award} color="text-amber-500" title={t.certificates} addLabel={t.add}
                  onAdd={() => addArrayItem("certificates", { name: "", issuer: "", year: "" })} />
                {formData.certificates.map((c, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                    <input placeholder={t.certificateName} value={c.name}
                      onChange={(e) => updateArrayItem("certificates", i, "name", e.target.value)}
                      className="sm:col-span-2 w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500" />
                    <input placeholder={t.institution} value={c.issuer}
                      onChange={(e) => updateArrayItem("certificates", i, "issuer", e.target.value)}
                      className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500" />
                    <div className="flex gap-2 items-center">
                      <input placeholder={t.year} value={c.year}
                        onChange={(e) => updateArrayItem("certificates", i, "year", e.target.value)}
                        className="flex-1 p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500" />
                      <button onClick={() => removeArrayItem("certificates", i)} className="text-red-400 hover:text-red-600 p-2 cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* YETENEKLER */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ms-1 flex items-center gap-1">
                  <Cpu size={12} className="text-cyan-500" /> {t.technicalSkills}
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((s, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                      {s}
                      <button onClick={() => updateField("skills", formData.skills.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-600 ms-1 cursor-pointer">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <input placeholder={t.skillPlaceholder}
                  value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>

              {/* İLGİ ALANLARI */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ms-1 flex items-center gap-1">
                  <Heart size={12} className="text-pink-500" /> {t.interests}
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.interests.map((s, i) => (
                    <span key={i} className="bg-pink-50 text-pink-600 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                      {s}
                      <button onClick={() => updateField("interests", formData.interests.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-600 ms-1 cursor-pointer">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <input placeholder={t.interestPlaceholder}
                  value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={handleInterestKeyDown}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="sticky bottom-0 p-6 bg-white/95 backdrop-blur-sm border-t border-slate-100 flex gap-3 rounded-b-[32px]">
              <button onClick={() => setEditOpen(false)}
                className="px-8 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                {t.cancel}
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-rose-600 hover:bg-rose-700 h-14 rounded-2xl text-lg font-black uppercase italic text-white shadow-xl active:scale-[0.98] transition-all tracking-widest disabled:opacity-60 flex items-center justify-center gap-3 cursor-pointer">
                <Save size={20} />
                {saving ? t.saving : t.saveMemory}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
