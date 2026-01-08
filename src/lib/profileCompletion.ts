// src/lib/profileCompletion.ts
// @ts-nocheck

export function calculateProfileCompletion(p: any) {
  // Not: Buradaki alan listesini, senin "UserProfileEdit" sayfanda gerçekten doldurttuğun alanlarla birebir aynı tut.
  const checks = [
    !!p?.full_name,
    !!p?.title,
    !!p?.sector,
    !!p?.city,
    !!p?.phone,
    !!p?.goal,      // örn: interview / career-change vs
    !!p?.level,     // örn: junior/mid/senior
    !!p?.linkedin,  // varsa
    // İstersen: !!p?.bio,
  ];

  const done = checks.filter(Boolean).length;
  const total = checks.length;

  const percent = Math.round((done / total) * 100);
  return { percent, done, total };
}
