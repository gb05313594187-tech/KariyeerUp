/**
 * Jitsi Meet Integration
 * Free, open-source video conferencing solution
 * No installation required, works in browser
 */

export interface JitsiMeetConfig {
  roomName: string;
  displayName: string;
  email?: string;
  subject?: string;
  startWithAudioMuted?: boolean;
  startWithVideoMuted?: boolean;
}

/**
 * Generate a unique Jitsi Meet room URL
 */
export function generateJitsiRoomUrl(bookingId: string, coachName: string, clientName: string): string {
  // Create a unique room name using booking ID and timestamp
  const timestamp = Date.now();
  const roomName = `kariyeer-${bookingId}-${timestamp}`;
  
  // Use the public Jitsi Meet server
  return `https://meet.jit.si/${roomName}`;
}

/**
 * Generate a Jitsi Meet URL with configuration parameters
 */
export function generateConfiguredJitsiUrl(config: JitsiMeetConfig): string {
  const baseUrl = `https://meet.jit.si/${config.roomName}`;
  const params = new URLSearchParams();

  if (config.displayName) {
    params.append('displayName', config.displayName);
  }
  
  if (config.email) {
    params.append('email', config.email);
  }

  if (config.subject) {
    params.append('subject', config.subject);
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}#config.${queryString}` : baseUrl;
}

/**
 * Open Jitsi Meet in a new window
 */
export function openJitsiMeeting(meetingUrl: string): void {
  const width = 1200;
  const height = 800;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  window.open(
    meetingUrl,
    'Kariyeer Video Call',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
}

/**
 * Extract room name from Jitsi Meet URL
 */
export function extractRoomName(meetingUrl: string): string | null {
  try {
    const url = new URL(meetingUrl);
    const pathParts = url.pathname.split('/');
    return pathParts[pathParts.length - 1] || null;
  } catch {
    return null;
  }
}

/**
 * Validate Jitsi Meet URL
 */
export function isValidJitsiUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'meet.jit.si' && urlObj.pathname.length > 1;
  } catch {
    return false;
  }
}

/**
 * Generate meeting instructions for users
 */
export function getMeetingInstructions(language: 'tr' | 'en' | 'fr' = 'tr'): string {
  const instructions = {
    tr: `
🎥 Video Görüşme Talimatları:

1. Toplantı linkine tıklayın
2. Tarayıcınız mikrofon ve kamera izni isteyecek - izin verin
3. İsminizi girin ve "Toplantıya Katıl" butonuna tıklayın
4. Görüşme sırasında:
   - 🎤 Mikrofonu aç/kapat
   - 📹 Kamerayı aç/kapat
   - 💬 Sohbet panelini kullan
   - 🖥️ Ekranınızı paylaşın
   - 📞 Görüşmeyi bitirmek için "Ayrıl" butonuna tıklayın

Not: Kararlı bir internet bağlantısı önerilir.
    `,
    en: `
🎥 Video Call Instructions:

1. Click on the meeting link
2. Your browser will request microphone and camera permission - allow it
3. Enter your name and click "Join Meeting"
4. During the call:
   - 🎤 Mute/unmute microphone
   - 📹 Turn camera on/off
   - 💬 Use chat panel
   - 🖥️ Share your screen
   - 📞 Click "Leave" to end the call

Note: A stable internet connection is recommended.
    `,
    fr: `
🎥 Instructions pour l'appel vidéo:

1. Cliquez sur le lien de la réunion
2. Votre navigateur demandera l'autorisation du microphone et de la caméra - autorisez-le
3. Entrez votre nom et cliquez sur "Rejoindre la réunion"
4. Pendant l'appel:
   - 🎤 Activer/désactiver le microphone
   - 📹 Activer/désactiver la caméra
   - 💬 Utiliser le panneau de discussion
   - 🖥️ Partager votre écran
   - 📞 Cliquez sur "Quitter" pour terminer l'appel

Note: Une connexion Internet stable est recommandée.
    `
  };

  return instructions[language];
}