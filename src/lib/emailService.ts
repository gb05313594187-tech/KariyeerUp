import { supabase } from './supabase';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/app_2dff6511da_send_email`;

interface EmailTemplate {
  subject: string;
  html: string;
}

export const emailTemplates = {
  welcome: (userName: string, language: 'tr' | 'en' | 'fr'): EmailTemplate => {
    const templates = {
      tr: {
        subject: 'Kariyeer\'e Hoş Geldiniz! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Hoş Geldiniz, ${userName}! 🎉</h1>
              </div>
              <div class="content">
                <p>Merhaba ${userName},</p>
                <p>Kariyeer ailesine katıldığınız için çok mutluyuz! Kariyer yolculuğunuzda size rehberlik edecek profesyonel koçlarımızla tanışmaya hazır mısınız?</p>
                
                <h3>Neler Yapabilirsiniz?</h3>
                <ul>
                  <li>✨ <strong>Mavi Tik veya Altın Tik</strong> rozeti alarak profilinizi öne çıkarın</li>
                  <li>🎯 Alanında uzman koçlarla bire bir görüşmeler yapın</li>
                  <li>💼 Kariyer hedeflerinize ulaşmak için kişiselleştirilmiş rehberlik alın</li>
                  <li>🚀 MentorCircle topluluğuna katılın ve deneyimlerinizi paylaşın</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/dashboard" class="button">Dashboard'a Git</a>
                </div>

                <p>Herhangi bir sorunuz olursa, bize ulaşmaktan çekinmeyin!</p>
                <p>İyi günler dileriz,<br><strong>Kariyeer Ekibi</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      en: {
        subject: 'Welcome to Kariyeer! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome, ${userName}! 🎉</h1>
              </div>
              <div class="content">
                <p>Hello ${userName},</p>
                <p>We're thrilled to have you join the Kariyeer family! Are you ready to meet our professional coaches who will guide you on your career journey?</p>
                
                <h3>What Can You Do?</h3>
                <ul>
                  <li>✨ Get a <strong>Blue Tick or Gold Tick</strong> badge to highlight your profile</li>
                  <li>🎯 Have one-on-one sessions with expert coaches</li>
                  <li>💼 Get personalized guidance to reach your career goals</li>
                  <li>🚀 Join the MentorCircle community and share your experiences</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/dashboard" class="button">Go to Dashboard</a>
                </div>

                <p>If you have any questions, don't hesitate to reach out!</p>
                <p>Best regards,<br><strong>Kariyeer Team</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      fr: {
        subject: 'Bienvenue chez Kariyeer! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Bienvenue, ${userName}! 🎉</h1>
              </div>
              <div class="content">
                <p>Bonjour ${userName},</p>
                <p>Nous sommes ravis de vous accueillir dans la famille Kariyeer! Êtes-vous prêt à rencontrer nos coachs professionnels qui vous guideront dans votre parcours professionnel?</p>
                
                <h3>Que Pouvez-Vous Faire?</h3>
                <ul>
                  <li>✨ Obtenez un badge <strong>Tick Bleu ou Tick Or</strong> pour mettre en valeur votre profil</li>
                  <li>🎯 Ayez des sessions individuelles avec des coachs experts</li>
                  <li>💼 Obtenez des conseils personnalisés pour atteindre vos objectifs de carrière</li>
                  <li>🚀 Rejoignez la communauté MentorCircle et partagez vos expériences</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/dashboard" class="button">Aller au Tableau de Bord</a>
                </div>

                <p>Si vous avez des questions, n'hésitez pas à nous contacter!</p>
                <p>Cordialement,<br><strong>L'équipe Kariyeer</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tous droits réservés.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
    };
    return templates[language];
  },

  bookingReminder: (userName: string, coachName: string, sessionDate: string, sessionTime: string, language: 'tr' | 'en' | 'fr'): EmailTemplate => {
    const templates = {
      tr: {
        subject: '⏰ Yaklaşan Seans Hatırlatması',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .info { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⏰ Seans Hatırlatması</h1>
              </div>
              <div class="content">
                <p>Merhaba ${userName},</p>
                
                <div class="info">
                  <strong>Yaklaşan Seansınız:</strong><br><br>
                  <strong>Koç:</strong> ${coachName}<br>
                  <strong>Tarih:</strong> ${sessionDate}<br>
                  <strong>Saat:</strong> ${sessionTime}
                </div>

                <p>Seansınıza hazırlanmayı unutmayın! Görüşmek istediğiniz konuları önceden not alabilirsiniz.</p>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/my-bookings" class="button">Seanslarımı Görüntüle</a>
                </div>

                <p>İyi günler dileriz,<br><strong>Kariyeer Ekibi</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      en: {
        subject: '⏰ Upcoming Session Reminder',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .info { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⏰ Session Reminder</h1>
              </div>
              <div class="content">
                <p>Hello ${userName},</p>
                
                <div class="info">
                  <strong>Your Upcoming Session:</strong><br><br>
                  <strong>Coach:</strong> ${coachName}<br>
                  <strong>Date:</strong> ${sessionDate}<br>
                  <strong>Time:</strong> ${sessionTime}
                </div>

                <p>Don't forget to prepare for your session! You can take notes on topics you'd like to discuss.</p>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/my-bookings" class="button">View My Sessions</a>
                </div>

                <p>Best regards,<br><strong>Kariyeer Team</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      fr: {
        subject: '⏰ Rappel de Session à Venir',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .info { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⏰ Rappel de Session</h1>
              </div>
              <div class="content">
                <p>Bonjour ${userName},</p>
                
                <div class="info">
                  <strong>Votre Session à Venir:</strong><br><br>
                  <strong>Coach:</strong> ${coachName}<br>
                  <strong>Date:</strong> ${sessionDate}<br>
                  <strong>Heure:</strong> ${sessionTime}
                </div>

                <p>N'oubliez pas de vous préparer pour votre session! Vous pouvez prendre des notes sur les sujets que vous souhaitez discuter.</p>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/my-bookings" class="button">Voir Mes Sessions</a>
                </div>

                <p>Cordialement,<br><strong>L'équipe Kariyeer</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tous droits réservés.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
    };
    return templates[language];
  },

  riskyCoachAlert: (adminName: string, coachName: string, kpiScore: number, issues: string[], language: 'tr' | 'en' | 'fr'): EmailTemplate => {
    const templates = {
      tr: {
        subject: '⚠️ Riskli Koç Tespit Edildi - Acil İnceleme Gerekli',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .warning { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚠️ Riskli Koç Uyarısı</h1>
              </div>
              <div class="content">
                <p>Merhaba ${adminName},</p>
                
                <div class="warning">
                  <strong>Dikkat!</strong> AI analiz sistemi riskli bir koç tespit etti.<br><br>
                  <strong>Koç:</strong> ${coachName}<br>
                  <strong>KPI Skoru:</strong> ${kpiScore}/100 (Riskli Seviye)
                </div>

                <h3>Tespit Edilen Sorunlar:</h3>
                <ul>
                  ${issues.map(issue => `<li>${issue}</li>`).join('')}
                </ul>

                <p><strong>Önerilen Aksiyonlar:</strong></p>
                <ul>
                  <li>Koçla bire bir görüşme yapın</li>
                  <li>Müşteri geri bildirimlerini inceleyin</li>
                  <li>Gerekirse ek eğitim sağlayın</li>
                  <li>Performans iyileştirme planı oluşturun</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/advanced-analytics" class="button">AI Analitik'i Görüntüle</a>
                </div>

                <p>Bu durum acil inceleme gerektirir.</p>
                <p>Saygılarımızla,<br><strong>Kariyeer AI Sistemi</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      en: {
        subject: '⚠️ Risky Coach Detected - Urgent Review Required',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .warning { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚠️ Risky Coach Alert</h1>
              </div>
              <div class="content">
                <p>Hello ${adminName},</p>
                
                <div class="warning">
                  <strong>Attention!</strong> The AI analysis system has detected a risky coach.<br><br>
                  <strong>Coach:</strong> ${coachName}<br>
                  <strong>KPI Score:</strong> ${kpiScore}/100 (Risky Level)
                </div>

                <h3>Detected Issues:</h3>
                <ul>
                  ${issues.map(issue => `<li>${issue}</li>`).join('')}
                </ul>

                <p><strong>Recommended Actions:</strong></p>
                <ul>
                  <li>Have a one-on-one meeting with the coach</li>
                  <li>Review customer feedback</li>
                  <li>Provide additional training if needed</li>
                  <li>Create a performance improvement plan</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/advanced-analytics" class="button">View AI Analytics</a>
                </div>

                <p>This situation requires urgent review.</p>
                <p>Best regards,<br><strong>Kariyeer AI System</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      fr: {
        subject: '⚠️ Coach à Risque Détecté - Examen Urgent Requis',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .warning { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚠️ Alerte Coach à Risque</h1>
              </div>
              <div class="content">
                <p>Bonjour ${adminName},</p>
                
                <div class="warning">
                  <strong>Attention!</strong> Le système d'analyse IA a détecté un coach à risque.<br><br>
                  <strong>Coach:</strong> ${coachName}<br>
                  <strong>Score KPI:</strong> ${kpiScore}/100 (Niveau Risqué)
                </div>

                <h3>Problèmes Détectés:</h3>
                <ul>
                  ${issues.map(issue => `<li>${issue}</li>`).join('')}
                </ul>

                <p><strong>Actions Recommandées:</strong></p>
                <ul>
                  <li>Avoir une réunion individuelle avec le coach</li>
                  <li>Examiner les commentaires des clients</li>
                  <li>Fournir une formation supplémentaire si nécessaire</li>
                  <li>Créer un plan d'amélioration des performances</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/advanced-analytics" class="button">Voir l'Analyse IA</a>
                </div>

                <p>Cette situation nécessite un examen urgent.</p>
                <p>Cordialement,<br><strong>Système IA Kariyeer</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tous droits réservés.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
    };
    return templates[language];
  },

  subscriptionExpiring: (userName: string, badgeType: string, daysLeft: number, language: 'tr' | 'en' | 'fr'): EmailTemplate => {
    const templates = {
      tr: {
        subject: `⚠️ ${badgeType === 'blue' ? 'Mavi Tik' : 'Altın Tik'} Rozetiniz ${daysLeft} Gün İçinde Sona Eriyor!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚠️ Rozet Süresi Dolmak Üzere</h1>
              </div>
              <div class="content">
                <p>Merhaba ${userName},</p>
                
                <div class="warning">
                  <strong>Dikkat!</strong> ${badgeType === 'blue' ? 'Mavi Tik' : 'Altın Tik'} rozetiniz <strong>${daysLeft} gün</strong> içinde sona erecek.
                </div>

                <p>Rozetinizin avantajlarından yararlanmaya devam etmek için hemen yenileyebilirsiniz:</p>
                <ul>
                  <li>✨ Profiliniz öne çıkmaya devam edecek</li>
                  <li>🎯 Koçlara öncelikli erişim</li>
                  <li>💼 Premium özellikler</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/dashboard" class="button">Şimdi Yenile</a>
                </div>

                <p>Sorularınız için bizimle iletişime geçebilirsiniz.</p>
                <p>İyi günler dileriz,<br><strong>Kariyeer Ekibi</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      en: {
        subject: `⚠️ Your ${badgeType === 'blue' ? 'Blue Tick' : 'Gold Tick'} Badge Expires in ${daysLeft} Days!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚠️ Badge Expiring Soon</h1>
              </div>
              <div class="content">
                <p>Hello ${userName},</p>
                
                <div class="warning">
                  <strong>Attention!</strong> Your ${badgeType === 'blue' ? 'Blue Tick' : 'Gold Tick'} badge will expire in <strong>${daysLeft} days</strong>.
                </div>

                <p>Renew now to continue enjoying your badge benefits:</p>
                <ul>
                  <li>✨ Your profile stays highlighted</li>
                  <li>🎯 Priority access to coaches</li>
                  <li>💼 Premium features</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/dashboard" class="button">Renew Now</a>
                </div>

                <p>Contact us if you have any questions.</p>
                <p>Best regards,<br><strong>Kariyeer Team</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      fr: {
        subject: `⚠️ Votre Badge ${badgeType === 'blue' ? 'Tick Bleu' : 'Tick Or'} Expire dans ${daysLeft} Jours!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚠️ Badge Expirant Bientôt</h1>
              </div>
              <div class="content">
                <p>Bonjour ${userName},</p>
                
                <div class="warning">
                  <strong>Attention!</strong> Votre badge ${badgeType === 'blue' ? 'Tick Bleu' : 'Tick Or'} expirera dans <strong>${daysLeft} jours</strong>.
                </div>

                <p>Renouvelez maintenant pour continuer à profiter des avantages de votre badge:</p>
                <ul>
                  <li>✨ Votre profil reste mis en avant</li>
                  <li>🎯 Accès prioritaire aux coachs</li>
                  <li>💼 Fonctionnalités premium</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/dashboard" class="button">Renouveler Maintenant</a>
                </div>

                <p>Contactez-nous si vous avez des questions.</p>
                <p>Cordialement,<br><strong>L'équipe Kariyeer</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tous droits réservés.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
    };
    return templates[language];
  },

  paymentConfirmation: (userName: string, amount: number, badgeType: string, invoiceNumber: string, language: 'tr' | 'en' | 'fr'): EmailTemplate => {
    const templates = {
      tr: {
        subject: '✅ Ödemeniz Onaylandı!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
              .invoice { background: white; border: 1px solid #e5e7eb; padding: 20px; margin: 20px 0; border-radius: 5px; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Ödeme Başarılı!</h1>
              </div>
              <div class="content">
                <p>Merhaba ${userName},</p>
                
                <div class="success">
                  <strong>Tebrikler!</strong> ${badgeType === 'blue' ? 'Mavi Tik' : 'Altın Tik'} rozet ödemeniz başarıyla alındı.
                </div>

                <div class="invoice">
                  <h3>Ödeme Detayları</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <td style="padding: 10px 0;"><strong>Fatura No:</strong></td>
                      <td style="padding: 10px 0; text-align: right;">${invoiceNumber}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <td style="padding: 10px 0;"><strong>Rozet Tipi:</strong></td>
                      <td style="padding: 10px 0; text-align: right;">${badgeType === 'blue' ? 'Mavi Tik' : 'Altın Tik'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <td style="padding: 10px 0;"><strong>Tutar:</strong></td>
                      <td style="padding: 10px 0; text-align: right;">₺${amount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0;"><strong>Durum:</strong></td>
                      <td style="padding: 10px 0; text-align: right; color: #10b981;"><strong>Ödendi</strong></td>
                    </tr>
                  </table>
                </div>

                <p>Faturanızı dashboard'unuzdan indirebilirsiniz.</p>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/dashboard" class="button">Dashboard'a Git</a>
                </div>

                <p>İyi günler dileriz,<br><strong>Kariyeer Ekibi</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      en: {
        subject: '✅ Payment Confirmed!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
              .invoice { background: white; border: 1px solid #e5e7eb; padding: 20px; margin: 20px 0; border-radius: 5px; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Payment Successful!</h1>
              </div>
              <div class="content">
                <p>Hello ${userName},</p>
                
                <div class="success">
                  <strong>Congratulations!</strong> Your ${badgeType === 'blue' ? 'Blue Tick' : 'Gold Tick'} badge payment was successful.
                </div>

                <div class="invoice">
                  <h3>Payment Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <td style="padding: 10px 0;"><strong>Invoice No:</strong></td>
                      <td style="padding: 10px 0; text-align: right;">${invoiceNumber}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <td style="padding: 10px 0;"><strong>Badge Type:</strong></td>
                      <td style="padding: 10px 0; text-align: right;">${badgeType === 'blue' ? 'Blue Tick' : 'Gold Tick'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <td style="padding: 10px 0;"><strong>Amount:</strong></td>
                      <td style="padding: 10px 0; text-align: right;">₺${amount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0;"><strong>Status:</strong></td>
                      <td style="padding: 10px 0; text-align: right; color: #10b981;"><strong>Paid</strong></td>
                    </tr>
                  </table>
                </div>

                <p>You can download your invoice from your dashboard.</p>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/dashboard" class="button">Go to Dashboard</a>
                </div>

                <p>Best regards,<br><strong>Kariyeer Team</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      fr: {
        subject: '✅ Paiement Confirmé!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
              .invoice { background: white; border: 1px solid #e5e7eb; padding: 20px; margin: 20px 0; border-radius: 5px; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Paiement Réussi!</h1>
              </div>
              <div class="content">
                <p>Bonjour ${userName},</p>
                
                <div class="success">
                  <strong>Félicitations!</strong> Votre paiement pour le badge ${badgeType === 'blue' ? 'Tick Bleu' : 'Tick Or'} a été effectué avec succès.
                </div>

                <div class="invoice">
                  <h3>Détails du Paiement</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <td style="padding: 10px 0;"><strong>N° Facture:</strong></td>
                      <td style="padding: 10px 0; text-align: right;">${invoiceNumber}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <td style="padding: 10px 0;"><strong>Type de Badge:</strong></td>
                      <td style="padding: 10px 0; text-align: right;">${badgeType === 'blue' ? 'Tick Bleu' : 'Tick Or'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <td style="padding: 10px 0;"><strong>Montant:</strong></td>
                      <td style="padding: 10px 0; text-align: right;">₺${amount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0;"><strong>Statut:</strong></td>
                      <td style="padding: 10px 0; text-align: right; color: #10b981;"><strong>Payé</strong></td>
                    </tr>
                  </table>
                </div>

                <p>Vous pouvez télécharger votre facture depuis votre tableau de bord.</p>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/dashboard" class="button">Aller au Tableau de Bord</a>
                </div>

                <p>Cordialement,<br><strong>L'équipe Kariyeer</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tous droits réservés.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
    };
    return templates[language];
  },

  coachApproved: (coachName: string, language: 'tr' | 'en' | 'fr'): EmailTemplate => {
    const templates = {
      tr: {
        subject: '🎉 Koç Başvurunuz Onaylandı!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Tebrikler!</h1>
              </div>
              <div class="content">
                <p>Merhaba ${coachName},</p>
                
                <div class="success">
                  <strong>Harika Haber!</strong> Koç başvurunuz onaylandı. Artık Kariyeer platformunda profesyonel koç olarak hizmet verebilirsiniz!
                </div>

                <h3>Sırada Ne Var?</h3>
                <ul>
                  <li>✨ Profilinizi tamamlayın ve özelleştirin</li>
                  <li>🎯 Uzmanlık alanlarınızı belirtin</li>
                  <li>💼 Müşterilerinizle seans planlayın</li>
                  <li>🚀 MentorCircle'da içerik paylaşın</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/profile" class="button">Profilimi Tamamla</a>
                </div>

                <p>Kariyeer ailesine hoş geldiniz!</p>
                <p>İyi günler dileriz,<br><strong>Kariyeer Ekibi</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      en: {
        subject: '🎉 Your Coach Application Was Approved!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Congratulations!</h1>
              </div>
              <div class="content">
                <p>Hello ${coachName},</p>
                
                <div class="success">
                  <strong>Great News!</strong> Your coach application has been approved. You can now serve as a professional coach on the Kariyeer platform!
                </div>

                <h3>What's Next?</h3>
                <ul>
                  <li>✨ Complete and customize your profile</li>
                  <li>🎯 Specify your areas of expertise</li>
                  <li>💼 Schedule sessions with your clients</li>
                  <li>🚀 Share content on MentorCircle</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/profile" class="button">Complete My Profile</a>
                </div>

                <p>Welcome to the Kariyeer family!</p>
                <p>Best regards,<br><strong>Kariyeer Team</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      fr: {
        subject: '🎉 Votre Candidature de Coach a été Approuvée!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Félicitations!</h1>
              </div>
              <div class="content">
                <p>Bonjour ${coachName},</p>
                
                <div class="success">
                  <strong>Excellente Nouvelle!</strong> Votre candidature de coach a été approuvée. Vous pouvez maintenant servir en tant que coach professionnel sur la plateforme Kariyeer!
                </div>

                <h3>Et Maintenant?</h3>
                <ul>
                  <li>✨ Complétez et personnalisez votre profil</li>
                  <li>🎯 Spécifiez vos domaines d'expertise</li>
                  <li>💼 Planifiez des sessions avec vos clients</li>
                  <li>🚀 Partagez du contenu sur MentorCircle</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${window.location.origin}/profile" class="button">Compléter Mon Profil</a>
                </div>

                <p>Bienvenue dans la famille Kariyeer!</p>
                <p>Cordialement,<br><strong>L'équipe Kariyeer</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tous droits réservés.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
    };
    return templates[language];
  },

  coachRejected: (coachName: string, reason: string, language: 'tr' | 'en' | 'fr'): EmailTemplate => {
    const templates = {
      tr: {
        subject: 'Koç Başvurunuz Hakkında',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .info { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Başvuru Sonucu</h1>
              </div>
              <div class="content">
                <p>Merhaba ${coachName},</p>
                
                <p>Kariyeer platformuna koç başvurunuz için teşekkür ederiz. Başvurunuzu dikkatlice inceledik.</p>

                <div class="info">
                  <strong>Başvuru Durumu:</strong> Şu anda onaylanamadı<br><br>
                  <strong>Sebep:</strong> ${reason}
                </div>

                <p>Bu durum, gelecekte tekrar başvuru yapmanıza engel değildir. Belirtilen konularda gelişim sağladıktan sonra yeniden başvurabilirsiniz.</p>

                <p>Sorularınız için bizimle iletişime geçebilirsiniz.</p>
                <p>İyi günler dileriz,<br><strong>Kariyeer Ekibi</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      en: {
        subject: 'About Your Coach Application',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .info { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Application Result</h1>
              </div>
              <div class="content">
                <p>Hello ${coachName},</p>
                
                <p>Thank you for your coach application to the Kariyeer platform. We have carefully reviewed your application.</p>

                <div class="info">
                  <strong>Application Status:</strong> Not approved at this time<br><br>
                  <strong>Reason:</strong> ${reason}
                </div>

                <p>This does not prevent you from reapplying in the future. You may reapply after making improvements in the mentioned areas.</p>

                <p>Contact us if you have any questions.</p>
                <p>Best regards,<br><strong>Kariyeer Team</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      fr: {
        subject: 'À Propos de Votre Candidature de Coach',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .info { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Résultat de la Candidature</h1>
              </div>
              <div class="content">
                <p>Bonjour ${coachName},</p>
                
                <p>Merci pour votre candidature de coach sur la plateforme Kariyeer. Nous avons examiné attentivement votre candidature.</p>

                <div class="info">
                  <strong>Statut de la Candidature:</strong> Non approuvée pour le moment<br><br>
                  <strong>Raison:</strong> ${reason}
                </div>

                <p>Cela ne vous empêche pas de postuler à nouveau à l'avenir. Vous pouvez postuler à nouveau après avoir apporté des améliorations dans les domaines mentionnés.</p>

                <p>Contactez-nous si vous avez des questions.</p>
                <p>Cordialement,<br><strong>L'équipe Kariyeer</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 Kariyeer. Tous droits réservés.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
    };
    return templates[language];
  },
};

export const sendEmail = async (
  to: string,
  template: EmailTemplate,
  type?: 'welcome' | 'booking_reminder' | 'risky_coach_alert' | 'subscription_expiring' | 'payment_confirmation' | 'coach_approved' | 'coach_rejected'
): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        to,
        subject: template.subject,
        html: template.html,
        type,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};