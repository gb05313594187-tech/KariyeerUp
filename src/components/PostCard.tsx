// src/components/PostCard.tsx
// @ts-nocheck
import { useState } from "react";
import ReactionBar from "@/components/ReactionBar";
import PollView from "@/components/PollView";
import EventView from "@/components/EventView";
import JobDetail from "@/components/JobDetail";
import { Crown, Lock, Users, Globe, MoreHorizontal, Share2, Bookmark, Flag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  tr: {
    premium: "Premium",
    private: "Gizli",
    followers: "Takipçiler",
    public: "Herkese Açık",
    readMore: "Devamını oku",
    readLess: "Küçült",
    share: "Paylaş",
    save: "Kaydet",
    report: "Bildir",
    justNow: "Az önce",
    minutesAgo: "dk önce",
    hoursAgo: "sa önce",
    daysAgo: "gün önce",
    user: "Kullanıcı",
  },
  en: {
    premium: "Premium",
    private: "Private",
    followers: "Followers",
    public: "Public",
    readMore: "Read more",
    readLess: "Show less",
    share: "Share",
    save: "Save",
    report: "Report",
    justNow: "Just now",
    minutesAgo: "m ago",
    hoursAgo: "h ago",
    daysAgo: "d ago",
    user: "User",
  },
  ar: {
    premium: "بريميوم",
    private: "خاص",
    followers: "المتابعون",
    public: "عام",
    readMore: "اقرأ المزيد",
    readLess: "عرض أقل",
    share: "مشاركة",
    save: "حفظ",
    report: "إبلاغ",
    justNow: "الآن",
    minutesAgo: "د",
    hoursAgo: "س",
    daysAgo: "ي",
    user: "مستخدم",
  },
  fr: {
    premium: "Premium",
    private: "Privé",
    followers: "Abonnés",
    public: "Public",
    readMore: "Lire la suite",
    readLess: "Réduire",
    share: "Partager",
    save: "Enregistrer",
    report: "Signaler",
    justNow: "À l'instant",
    minutesAgo: "min",
    hoursAgo: "h",
    daysAgo: "j",
    user: "Utilisateur",
  },
};

function timeAgo(dateStr: string, t: any) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return t.justNow;
  if (diff < 3600) return `${Math.floor(diff / 60)}${t.minutesAgo}`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}${t.hoursAgo}`;
  return `${Math.floor(diff / 86400)}${t.daysAgo}`;
}

export default function PostCard({ post }) {
  if (!post) return null;

  const { language } = useLanguage();
  const t = translations[language] || translations.tr;
  const isRTL = language === "ar";

  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Author bilgileri — view'dan geliyor
  const name = post?.author_name || post?.profiles?.full_name || post?.profiles?.email?.split("@")?.[0] || t.user;
  const avatar = post?.author_avatar || post?.profiles?.avatar_url || null;
  const isPremiumAuthor = post?.author_is_premium || false;
  const isPremiumPost = post?.post_is_premium || post?.is_premium || false;

  // Content truncation
  const content = post?.content || "";
  const isLong = content.length > 300;
  const displayContent = isLong && !expanded ? content.slice(0, 300) + "..." : content;

  // Visibility badge
  const visibilityIcon = () => {
    if (post?.visibility === "private") return <Lock className="h-3 w-3" />;
    if (post?.visibility === "followers") return <Users className="h-3 w-3" />;
    return <Globe className="h-3 w-3" />;
  };

  const visibilityText = () => {
    if (post?.visibility === "private") return t.private;
    if (post?.visibility === "followers") return t.followers;
    return t.public;
  };

  // Initials for avatar fallback
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative rounded-2xl bg-white border transition-all duration-300 hover:shadow-lg ${
      isPremiumPost 
        ? "border-orange-200 shadow-[0_0_20px_rgba(234,88,12,0.08)]" 
        : "border-gray-200 shadow-sm"
    } ${isRTL ? "rtl text-right" : ""}`}>
      
      {/* Premium Post Badge */}
      {isPremiumPost && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-sm">
            <Crown className="h-3 w-3" />
            {t.premium}
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Header: Avatar + Name + Time + Menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className={`w-12 h-12 rounded-full object-cover ring-2 ${
                    isPremiumAuthor ? "ring-orange-400" : "ring-gray-200"
                  }`}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm ${
                  avatar ? "hidden" : "flex"
                }`}
              >
                {initials}
              </div>

              {/* Premium author indicator */}
              {isPremiumAuthor && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Crown className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>

            {/* Name & Meta */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 truncate">{name}</span>
                {isPremiumAuthor && (
                  <span className="flex-shrink-0 text-xs font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                    PRO
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span>{timeAgo(post?.created_at, t)}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  {visibilityIcon()}
                  {visibilityText()}
                </span>
              </div>
            </div>
          </div>

          {/* More Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className={`absolute z-50 top-10 bg-white rounded-xl shadow-xl border border-gray-200 py-1 min-w-[160px] ${isRTL ? "left-0" : "right-0"}`}>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Bookmark className="h-4 w-4" />
                    {t.save}
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Share2 className="h-4 w-4" />
                    {t.share}
                  </button>
                  <div className="h-px bg-gray-100 my-1" />
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <Flag className="h-4 w-4" />
                    {t.report}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {content && (
          <div className="mt-4">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-[15px]">
              {displayContent}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                {expanded ? t.readLess : t.readMore}
              </button>
            )}
          </div>
        )}

        {/* Special content types */}
        {post?.post_type === "poll" && (
          <div className="mt-4">
            <PollView postId={post.id} />
          </div>
        )}
        {post?.post_type === "event" && (
          <div className="mt-4">
            <EventView postId={post.id} />
          </div>
        )}
        {post?.post_type === "job" && (
          <div className="mt-4">
            <JobDetail postId={post.id} />
          </div>
        )}

        {/* Engagement Stats */}
        {(post?.reactions_count > 0) && (
          <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center border border-white">
                  <span className="text-[8px] text-white">❤️</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border border-white">
                  <span className="text-[8px] text-white">👍</span>
                </div>
              </div>
              <span className="ml-1">{post.reactions_count}</span>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="mt-4 h-px bg-gray-100" />

        {/* Reaction Bar */}
        {post?.id && (
          <div className="mt-2">
            <ReactionBar postId={post.id} />
          </div>
        )}
      </div>
    </div>
  );
}
