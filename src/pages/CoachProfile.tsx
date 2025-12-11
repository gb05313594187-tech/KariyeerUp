{/* HERO – AÇIK TEMA */}
<section className="w-full bg-white border-b border-gray-100">
  <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-10">

    {/* Profil Fotoğrafı */}
    <div className="flex flex-col items-center">
      <img
        src={coach.photo_url || "https://via.placeholder.com/150"}
        alt={coach.name}
        className="w-36 h-36 rounded-2xl object-cover shadow-md border border-gray-200"
      />

      <button className="mt-3 px-4 py-1.5 text-xs rounded-full bg-orange-100 text-orange-600 font-medium">
        {coach.isOnline ? "• Şu An Uygun" : "• Meşgul"}
      </button>
    </div>

    {/* Koç Bilgisi */}
    <div className="flex-1 space-y-3">

      <h1 className="text-3xl font-bold text-gray-900">{coach.name}</h1>
      <p className="text-lg text-gray-700">{coach.title}</p>

      {/* Etiketler */}
      <div className="flex flex-wrap gap-2 mt-2">
        {coach.tags?.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs rounded-full bg-orange-50 text-orange-600 border border-orange-200"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* İstatistikler */}
      <div className="flex flex-wrap gap-6 mt-3 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          ⭐ <strong>{coach.rating}</strong> ({coach.reviewCount} değerlendirme)
        </div>
        <div className="flex items-center gap-1">
          👥 <strong>{coach.totalSessions}</strong> seans
        </div>
        <div className="flex items-center gap-1">
          ❤️ <strong>{coach.favoritesCount}</strong> favori
        </div>
      </div>

      {/* CTA Butonlar */}
      <div className="flex gap-3 mt-5">
        <button className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all shadow">
          Hemen Seans Al
        </button>

        <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">
          ❤️ Favorilere Ekle
        </button>
      </div>

    </div>
  </div>
</section>
