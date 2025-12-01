// @ts-nocheck
import { useState } from 'react';

export default function MentorCircle() {
  // Saf Veri
  const posts = [
    {
      id: 1,
      name: "Dr. Ayşe Yılmaz",
      title: "Kariyer Koçu",
      content: "Kariyer değişikliği yaparken en sık karşılaşılan hata: Acele etmek. Planlama yapmadan atılan adımlar genellikle hayal kırıklığı ile sonuçlanır.",
      time: "2 saat önce",
      tag: "Kariyer"
    },
    {
      id: 2,
      name: "Mehmet Demir",
      title: "Yazılım Müdürü",
      content: "Remote çalışırken ekip içi iletişimi nasıl güçlü tutuyorsunuz? Kullandığınız araçlar neler?",
      time: "5 saat önce",
      tag: "Remote"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL: PROFİL */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="bg-white rounded-xl shadow overflow-hidden text-center pb-6">
            <div className="h-20 bg-gradient-to-r from-purple-600 to-pink-600"></div>
            <div className="font-bold text-xl mt-4">Misafir Kullanıcı</div>
            <div className="text-gray-500">Premium Üye</div>
            <button onClick={() => window.location.href='/dashboard'} className="mt-4 text-blue-600 hover:underline text-sm">Panele Git →</button>
          </div>
        </div>

        {/* ORTA: AKIŞ */}
        <div className="col-span-1 lg:col-span-6 space-y-6">
            {/* Yazı Kutusu */}
            <div className="bg-white p-4 rounded-xl shadow">
                <textarea placeholder="Bir şeyler paylaş..." className="w-full bg-gray-50 rounded-lg p-3 border border-gray-200 focus:border-purple-500 outline-none resize-none" rows={3}></textarea>
                <div className="flex justify-end mt-2">
                    <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700">
                        Paylaş 🚀
                    </button>
                </div>
            </div>

            {/* Gönderiler */}
            {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow overflow-hidden p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-gray-900">{post.name}</h4>
                            <p className="text-xs text-gray-500">{post.title} • {post.time}</p>
                        </div>
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">#{post.tag}</span>
                    </div>
                    <p className="text-gray-800 mb-4">{post.content}</p>
                    <div className="border-t pt-3 flex gap-4 text-sm text-gray-500 font-medium">
                        <button className="hover:text-purple-600">❤️ Beğen</button>
                        <button className="hover:text-purple-600">💬 Yorum Yap</button>
                        <button className="hover:text-purple-600">Example Paylaş</button>
                    </div>
                </div>
            ))}
        </div>

        {/* SAĞ: GÜNDEM */}
        <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold text-gray-900 mb-4">🔥 Gündem</h3>
                <div className="space-y-3">
                    <div className="text-sm">#YapayZeka <span className="text-gray-400 text-xs block">2.5k gönderi</span></div>
                    <div className="text-sm">#Liderlik <span className="text-gray-400 text-xs block">1.2k gönderi</span></div>
                    <div className="text-sm">#Mülakat <span className="text-gray-400 text-xs block">850 gönderi</span></div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
