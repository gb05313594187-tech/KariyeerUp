// src/lib/notionAI.ts
import { supabase } from "./supabase";

export const notionAIService = {
  /**
   * Yeni aday için Notion üzerinde bir değerlendirme raporu taslağı oluşturur.
   * Bu fonksiyon Cloudflare Worker veya Edge Function üzerinden çağrılmalıdır.
   */
  async createCandidateReport(name: string, intro: string, tags: string[]) {
    try {
      console.log("Notion Raporu Hazırlanıyor:", { name, tags });

      // Şimdilik sadece konsola basıyoruz ve başarılı dönüyoruz.
      // Buraya daha sonra Cloudflare Worker URL'ini ekleyeceğiz.
      
      return { success: true, message: "Report queued for Notion" };
    } catch (error) {
      console.error("Notion Entegrasyon Hatası:", error);
      return { success: false, error };
    }
  }
};
