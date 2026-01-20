"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase'; // Kendi supabase yoluna göre düzelt
import { Info, Flame, Share2, MessageCircle, Crown } from 'lucide-react';

interface PostProps {
  post: any; // mentor_circle_feed_ai view'ından gelen veri
}

export default function AIEnhancedPostCard({ post }: PostProps) {
  const [showAI, setShowAI] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const postRef = useRef(null);

  // --- MİLYON DOLARLIK EVENT TRACKER MANTIĞI ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Eğer post 2 saniye boyunca ekranın %50'sinden fazlasında durursa "view" say
        if (entry.isIntersecting && !hasTrackedView) {
          setTimeout(() => {
            trackEvent(post.id, 'view', 0.1);
            setHasTrackedView(true);
          }, 2000); 
        }
      },
      { threshold: 0.5 }
    );

    if (postRef.current) observer.observe(postRef.current);
    return () => observer.disconnect();
  }, [post.id, hasTrackedView]);

  const trackEvent = async (postId: string, type: string, weight: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('post_events').insert({
        post_id: postId,
        user_id: user?.id,
        event_type: type,
        weight: weight
      });
    } catch (err) {
      console.error("AI Tracking Error:", err);
    }
  };

  return (
    <div 
      ref={postRef}
      onClick={() => trackEvent(post.id, 'click', 0.5)}
      className="relative w-full max-w-xl bg-white border border-gray-100 rounded-3xl p-6 mb-4 shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      {/* ÜST KISIM: Yazar ve AI İkonu */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={post.author_avatar || '/default-avatar.png'} className="w-12 h-12 rounded-full object-cover border-2 border-gray-50" />
            {post.author_is_premium && <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5"><Crown size={12} className="text-white" /></div>}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-1">
              {post.author_name} 
              {post.author_is_verified && <span className="text-blue-500 text-xs">✔</span>}
            </h3>
            <p className="text-xs text-gray-400 italic">AI Score: {post.ai_score?.toFixed(1)}</p>
          </div>
        </div>

        {/* AI INSIGHT BUTONU */}
        <div className="relative">
          <button 
            onMouseEnter={() => setShowAI(true)}
            onMouseLeave={() => setShowAI(false)}
            className="p-2 bg-gray-50 rounded-2xl text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            <Info size={20} />
          </button>

          {/* MİLYON DOLARLIK ANALİZ KUTUSU */}
          {showAI && (
            <div className="absolute right-0 top-12 z-[100] w-56 p-5 bg-gray-900/95 backdrop-blur-xl text-white rounded-3xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-top-2">
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 text-center">AI Algoritma Raporu</div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]"><span className="text-gray-400">🔥 Etkileşim</span><span className="font-mono">{post.engagement_score?.toFixed(1)}</span></div>
                <div className="flex justify-between text-[11px]"><span className="text-gray-400">💬 Sosyal Kanıt</span><span className="font-mono">{post.social_proof_score?.toFixed(1)}</span></div>
                <div className="flex justify-between text-[11px]"><span className="text-gray-400">🕒 Tazelik</span><span className="font-mono">{post.freshness_score?.toFixed(1)}</span></div>
                
                {post.post_is_premium && (
                  <div className="mt-2 py-1.5 px-2 bg-yellow-500/20 rounded-xl border border-yellow-500/30 text-center text-yellow-400 text-[10px] font-bold tracking-tighter">
                    ✨ 4.0x PREMIUM BOOST AKTİF
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400">TOPLAM</span>
                  <span className="text-xl font-black text-green-400 font-mono italic">
                    {post.ai_score?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* İÇERİK */}
      <div className="text-gray-700 leading-relaxed mb-6 font-medium">
        {post.content}
      </div>

      {/* ALT ETKİLEŞİM BAR BAR */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex gap-6">
          <button className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors">
            <Flame size={18} />
            <span className="text-xs font-bold">{post.reactions_count}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
            <MessageCircle size={18} />
          </button>
          <button onClick={() => trackEvent(post.id, 'share', 2.0)} className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors">
            <Share2 size={18} />
          </button>
        </div>
        
        {post.post_is_premium && (
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
            Featured
          </span>
        )}
      </div>
    </div>
  );
}
