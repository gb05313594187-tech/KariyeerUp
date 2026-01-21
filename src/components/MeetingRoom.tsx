// src/components/MeetingRoom.tsx
import React from 'react';

export default function MeetingRoom({ roomName, displayName }) {
  // roomName: İlanID-AdayID gibi eşsiz bir isim olmalı
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&userInfo.displayName="${displayName}"`;

  return (
    <div className="w-full h-[600px] rounded-[32px] overflow-hidden shadow-2xl border-8 border-slate-900 bg-slate-900 relative">
      <iframe
        src={jitsiUrl}
        allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; amv"
        style={{ width: '100%', height: '100%', border: '0' }}
      />
      
      {/* Premium Overlay: İşverene özel soruları sağda gösterebilirsin */}
      <div className="absolute top-4 right-4 w-64 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white pointer-events-none">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2 text-red-400">AI Mülakat Rehberi</p>
        <p className="text-[11px] leading-relaxed italic">
          "Adaya pozisyon hakkındaki teknik deneyimlerini sormayı unutmayın."
        </p>
      </div>
    </div>
  );
}
