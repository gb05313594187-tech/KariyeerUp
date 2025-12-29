// src/pages/Sitemap.tsx
// @ts-nocheck
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Sitemap() {
  useEffect(() => {
    const run = async () => {
      const { data, error } = await supabase
        .from("app_2dff6511da_coaches")
        .select("slug, updated_at")
        .eq("status", "active");

      const baseUrl = window.location.origin;

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- SITEMAP_V2 -->\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      if (!error && Array.isArray(data)) {
        data.forEach((coach) => {
          if (!coach?.slug) return;

          const lastmod = coach.updated_at
            ? new Date(coach.updated_at).toISOString()
            : new Date().toISOString();

          xml += `
  <url>
    <loc>${baseUrl}/coach/${coach.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });
      }

      xml += `\n</urlset>`;

      // Sayfayı tamamen XML ile değiştir
      document.open();
      document.write(xml);
      document.close();
    };

    run();
  }, []);

  return null;
}
