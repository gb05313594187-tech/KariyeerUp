// src/pages/MentorCircle.tsx
// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import { Crown, Lock, Users, Sparkles, TrendingUp, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  tr: {
    title: "Mentor Circle",
    subtitle: "Kariyer yolculuğunu paylaş, uzmanlardan ilham al",
    trending: "Trend",
    latest: "En Yeni",
    premium: "Premium",
    all: "Tümü",
    loading: "Yükleniyor…",
    noMore: "Tüm gönderiler yüklendi",
    noPosts: "Henüz gönderi yok. İlk gönderiyi sen paylaş!",
    premiumUnlock: "Premium'a Geç",
    premiumDesc: "Premium içeriklere erişmek için hesabınızı yükseltin",
    refresh: "Yenile",
    filters: "Filtreler",
    liveIndicator: "Canlı",
    membersOnline: "üye çevrimiçi",
    totalPosts: "gönderi",
  },
  en: {
    title: "Mentor Circle",
    subtitle: "Share your career journey, get inspired by experts",
    trending: "Trending",
    latest: "Latest",
    premium: "Premium",
    all: "All",
    loading: "Loading…",
    noMore: "All posts loaded",
    noPosts: "No posts yet. Be the first to share!",
    premiumUnlock: "Go Premium",
    premiumDesc: "Upgrade your account to access premium content",
    refresh: "Refresh",
    filters: "Filters",
    liveIndicator: "Live",
    membersOnline: "members online",
    totalPosts: "posts",
  },
  ar: {
    title: "دائرة المرشدين",
    subtitle: "شارك رحلتك المهنية، واستلهم من الخبراء",
    trending: "رائج",
    latest: "الأحدث",
    premium: "بريميوم",
    all: "الكل",
    loading: "جاري التحميل…",
    noMore: "تم تحميل جميع المنشورات",
    noPosts: "لا توجد منشورات بعد. كن أول من يشارك!",
    premiumUnlock: "الترقية إلى بريميوم",
    premiumDesc: "قم بترقية حسابك للوصول إلى المحتوى المميز",
    refresh: "تحديث",
    filters: "فلاتر",
    liveIndicator: "مباشر",
    membersOnline: "عضو متصل",
    totalPosts: "منشور",
  },
  fr: {
    title: "Mentor Circle",
    subtitle: "Partagez votre parcours, inspirez-vous des experts",
    trending: "Tendance",
    latest: "Récent",
    premium: "Premium",
    all: "Tous",
    loading: "Chargement…",
    noMore: "Tous les posts chargés",
    noPosts: "Aucun post pour le moment. Soyez le premier à partager !",
    premiumUnlock: "Passer Premium",
    premiumDesc: "Mettez à jour votre compte pour accéder au contenu premium",
    refresh: "Actualiser",
    filters: "Filtres",
    liveIndicator: "En direct",
    membersOnline: "membres en ligne",
    totalPosts: "posts",
  },
};

export default function MentorCircle() {
  const { language } = useLanguage();
  const t = translations[language] || translations.tr;
  const isRTL = language === "ar";

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("trending");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const viewedRef = useRef<Set<string>>(new Set());

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    loadInitial();
    const channel = subscribeRealtimeReactions();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadInitial = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("mentor_circle_feed_ai")
      .select("*")
      .order("ai_score", { ascending: false })
      .limit(20);

    if (data) {
      setPosts(data);
      setCursor(data.at(-1)?.created_at ?? null);
      setHasMore(data.length === 20);
    }
    setLoading(false);
  };

  /* ---------------- PAGINATION ---------------- */
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !cursor) return;
    setLoading(true);

    const { data } = await supabase
      .from("mentor_circle_feed_ai")
      .select("*")
      .lt("created_at", cursor)
      .order("ai_score", { ascending: false })
      .limit(20);

    if (data?.length) {
      setPosts((prev) => [...prev, ...data]);
      setCursor(data.at(-1)?.created_at ?? null);
      setHasMore(data.length === 20);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  }, [cursor, hasMore, loading]);

  /* ---------------- OBSERVER ---------------- */
  useEffect(() => {
    if (!sentinelRef.current) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && loadMore(),
      { rootMargin: "200px" }
    );
    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  /* ---------------- EVENTS ---------------- */
  const trackEvent = async (type: string, postId: string) => {
    if (type === "view") {
      if (viewedRef.current.has(postId)) return;
      viewedRef.current.add(postId);
    }
    await supabase.from("mentor_circle_events").insert({
      post_id: postId,
      event_type: type,
    });
  };

  /* ---------------- REALTIME REACTIONS ---------------- */
  const subscribeRealtimeReactions = () => {
    return supabase
      .channel("mentor-circle-reactions")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "post_reactions",
      }, (payload) => {
        const postId = payload.new?.post_id;
        if (!postId) return;
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, reactions_count: (p.reactions_count || 0) + 1 }
              : p
          )
        );
      })
      .subscribe();
  };

  /* ---------------- PREMIUM WRAPPER ---------------- */
  const premiumWrapper = (post: any, children: any) => {
    if (!post.post_is_premium) return children;

    if (!post.has_access) {
      return (
        <div className="relative rounded-2xl overflow-hidden border border-orange-300/50">
          <div className="blur-sm pointer-events-none">{children}</div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-3 shadow-lg">
              <Crown className="h-7 w-7 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-3">{t.premiumDesc}</p>
            <button
              onClick={() => trackEvent("premium_cta_click", post.id)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold text-sm hover:brightness-110 transition shadow-lg shadow-red-200/50"
            >
              {t.premiumUnlock}
            </button>
          </div>
        </div>
      );
    }
    return children;
  };

  /* ---------------- TAB FILTER ---------------- */
  const tabs = [
    { key: "trending", label: t.trending, icon: TrendingUp },
    { key: "latest", label: t.latest, icon: RefreshCw },
    { key: "premium", label: t.premium, icon: Crown },
  ];

  const filteredPosts = posts.filter((p) => {
    if (activeTab === "premium") return p.post_is_premium;
    return true;
  }).sort((a, b) => {
    if (activeTab === "latest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return (b.ai_score || 0) - (a.ai_score || 0);
  });

  /* ---------------- RENDER ---------------- */
  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${isRTL ? "rtl text-right" : ""}`}>
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-red-600/20 to-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-500/15 to-amber-400/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500/30 backdrop-blur-sm mb-6">
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-bold text-orange-300">{t.title}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            {t.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {t.subtitle}
          </p>

          {/* Live Stats */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-green-400 font-semibold">{t.liveIndicator}</span>
            </div>
            <div className="text-gray-500">
              <span className="text-white font-bold">24</span> {t.membersOnline}
            </div>
            <div className="text-gray-500">
              <span className="text-white font-bold">{posts.length}</span> {t.totalPosts}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-20">
        
        {/* Tab Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-1.5 flex gap-1 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-10 w-10 text-red-400" />
              </div>
              <p className="text-gray-500 text-lg">{t.noPosts}</p>
            </div>
          )}

          {filteredPosts.map((post) =>
            premiumWrapper(
              post,
              <div
                key={post.id}
                onMouseEnter={() => trackEvent("view", post.id)}
              >
                <PostCard post={post} />
              </div>
            )
          )}
        </div>

        {/* Infinite Scroll Sentinel */}
        {hasMore && (
          <div
            ref={sentinelRef}
            className="h-16 flex items-center justify-center"
          >
            {loading && (
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                <span className="text-sm">{t.loading}</span>
              </div>
            )}
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-500 text-sm">
              <span>✓</span>
              {t.noMore}
            </div>
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-12" />
      </div>
    </div>
  );
}
