// src/components/ReactionBar.tsx
// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, Share2, Send, ThumbsUp } from "lucide-react";

const REACTIONS = [
  { key: "like", emoji: "👍", color: "text-blue-600", bg: "bg-blue-600", hoverBg: "hover:bg-blue-50" },
  { key: "celebrate", emoji: "👏", color: "text-green-600", bg: "bg-green-600", hoverBg: "hover:bg-green-50" },
  { key: "support", emoji: "💪", color: "text-purple-600", bg: "bg-purple-600", hoverBg: "hover:bg-purple-50" },
  { key: "love", emoji: "❤️", color: "text-red-600", bg: "bg-red-500", hoverBg: "hover:bg-red-50" },
  { key: "insightful", emoji: "💡", color: "text-amber-600", bg: "bg-amber-500", hoverBg: "hover:bg-amber-50" },
  { key: "funny", emoji: "😂", color: "text-orange-500", bg: "bg-orange-500", hoverBg: "hover:bg-orange-50" },
];

const translations = {
  tr: {
    like: "Beğen",
    celebrate: "Kutla",
    support: "Destek",
    love: "Sevgi",
    insightful: "Fikir",
    funny: "Eğlenceli",
    comment: "Yorum",
    share: "Paylaş",
    send: "Gönder",
    reactionsCount: "tepki",
  },
  en: {
    like: "Like",
    celebrate: "Celebrate",
    support: "Support",
    love: "Love",
    insightful: "Insightful",
    funny: "Funny",
    comment: "Comment",
    share: "Share",
    send: "Send",
    reactionsCount: "reactions",
  },
  ar: {
    like: "إعجاب",
    celebrate: "احتفال",
    support: "دعم",
    love: "حب",
    insightful: "ملهم",
    funny: "مضحك",
    comment: "تعليق",
    share: "مشاركة",
    send: "إرسال",
    reactionsCount: "تفاعل",
  },
  fr: {
    like: "J'aime",
    celebrate: "Bravo",
    support: "Soutien",
    love: "J'adore",
    insightful: "Instructif",
    funny: "Drôle",
    comment: "Commenter",
    share: "Partager",
    send: "Envoyer",
    reactionsCount: "réactions",
  },
};

export default function ReactionBar({ postId }) {
  const { language } = useLanguage();
  const t = translations[language] || translations.tr;
  const isRTL = language === "ar";

  const [counts, setCounts] = useState({});
  const [myReaction, setMyReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [animating, setAnimating] = useState(null);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0);

  // Top 3 reaction emojis for summary
  const topReactions = Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => REACTIONS.find((r) => r.key === key));

  useEffect(() => {
    loadReactions();

    const channel = supabase
      .channel(`post-reactions-${postId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "post_reactions",
        filter: `post_id=eq.${postId}`,
      }, () => {
        loadReactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const loadReactions = async () => {
    const { data, error } = await supabase
      .from("post_reactions")
      .select("type, user_id")
      .eq("post_id", postId);

    if (error) return;

    const map = {};
    let mine = null;
    const me = (await supabase.auth.getUser()).data?.user?.id;

    data.forEach((r) => {
      map[r.type] = (map[r.type] || 0) + 1;
      if (r.user_id === me) mine = r.type;
    });

    setCounts(map);
    setMyReaction(mine);
  };

  const react = async (type) => {
    const user = (await supabase.auth.getUser()).data?.user;
    if (!user) return;

    // Animation
    setAnimating(type);
    setTimeout(() => setAnimating(null), 600);

    if (myReaction === type) {
      // Optimistic update
      setMyReaction(null);
      setCounts((prev) => ({ ...prev, [type]: Math.max((prev[type] || 1) - 1, 0) }));

      await supabase
        .from("post_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .eq("type", type);
    } else {
      // Optimistic update
      if (myReaction) {
        setCounts((prev) => ({ ...prev, [myReaction]: Math.max((prev[myReaction] || 1) - 1, 0) }));
      }
      setMyReaction(type);
      setCounts((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));

      await supabase.from("post_reactions").delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      await supabase.from("post_reactions").insert({
        post_id: postId,
        user_id: user.id,
        type,
      });
    }

    setShowReactions(false);
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowReactions(true), 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowReactions(false), 500);
  };

  const currentReaction = myReaction ? REACTIONS.find((r) => r.key === myReaction) : null;

  return (
    <div className={`${isRTL ? "rtl text-right" : ""}`}>
      {/* Reaction Summary — Top bar */}
      {totalReactions > 0 && (
        <div className="flex items-center justify-between px-1 pb-2">
          <div className="flex items-center gap-1.5">
            {/* Emoji bubbles */}
            <div className="flex -space-x-1">
              {topReactions.map((r, i) => (
                <div
                  key={r?.key}
                  className={`w-5 h-5 rounded-full ${r?.bg} flex items-center justify-center border-2 border-white shadow-sm`}
                  style={{ zIndex: 3 - i }}
                >
                  <span className="text-[10px]">{r?.emoji}</span>
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              {totalReactions} {t.reactionsCount}
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-1" />

      {/* Action Buttons */}
      <div className="flex items-center" ref={containerRef}>
        {/* Like Button with hover popup */}
        <div
          className="relative flex-1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Reaction Popup */}
          {showReactions && (
            <div
              className={`absolute bottom-full mb-2 ${isRTL ? "right-0" : "left-0"} z-50`}
              onMouseEnter={() => clearTimeout(timeoutRef.current)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-white rounded-full shadow-2xl border border-gray-200 px-2 py-1.5 flex items-center gap-0.5">
                {REACTIONS.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => react(r.key)}
                    className={`group relative flex flex-col items-center transition-all duration-200 hover:scale-125 px-1 ${
                      animating === r.key ? "scale-150" : ""
                    }`}
                    title={t[r.key]}
                  >
                    <span className="text-2xl transition-transform duration-200 group-hover:-translate-y-1">
                      {r.emoji}
                    </span>
                    {/* Tooltip */}
                    <span className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap">
                      {t[r.key]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Like Button */}
          <button
            onClick={() => react(currentReaction ? currentReaction.key : "like")}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold ${
              myReaction
                ? `${currentReaction?.color} ${currentReaction?.hoverBg} bg-opacity-5`
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {myReaction ? (
              <span className={`text-lg transition-transform duration-300 ${animating === myReaction ? "scale-125" : ""}`}>
                {currentReaction?.emoji}
              </span>
            ) : (
              <ThumbsUp className="h-5 w-5" />
            )}
            <span>{myReaction ? t[myReaction] : t.like}</span>
          </button>
        </div>

        {/* Comment Button */}
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-200">
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">{t.comment}</span>
        </button>

        {/* Share Button */}
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-200">
          <Share2 className="h-5 w-5" />
          <span className="hidden sm:inline">{t.share}</span>
        </button>

        {/* Send Button */}
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-200">
          <Send className="h-5 w-5" />
          <span className="hidden sm:inline">{t.send}</span>
        </button>
      </div>
    </div>
  );
}
