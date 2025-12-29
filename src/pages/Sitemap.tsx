// src/pages/Sitemap.tsx
// @ts-nocheck
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Sitemap() {
  useEffect(() => {
    const run = async () => {
      const { data } = await supabase
        .from("app_2dff6511da_coaches")
        .select("slug, updated_at")
        .eq("status", "active");

      const base = window.location.origin;

      let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      data?.forEach((c) => {
        if (!c.slug) return;
        xml += `
  <url>
    <loc>${base}/coach/${c.slug}</loc>
    <lastmod>${new Date(c.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });

      xml += `</urlset>`;

      document.body.innerHTML = "";
      document.write(xml);
    };

    run();
  }, []);

  return null;
}
