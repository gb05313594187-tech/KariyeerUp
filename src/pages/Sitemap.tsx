// src/pages/Sitemap.tsx
// @ts-nocheck
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Sitemap() {
  useEffect(() => {
    const generate = async () => {
      const { data } = await supabase
        .from("app_2dff6511da_coaches")
        .select("slug, updated_at")
        .eq("status", "active");

      const baseUrl = window.location.origin;

      const urls =
        data?.map(
          (c) => `
  <url>
    <loc>${baseUrl}/coach/${c.slug}</loc>
    <lastmod>${new Date(c.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
        ) || [];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

      document.open();
      document.write(xml);
      document.close();
    };

    generate();
  }, []);

  return null;
}
