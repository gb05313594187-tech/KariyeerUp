import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Video, VideoOff, Mic, MicOff, Monitor, MessageSquare, Phone, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface JitsiMeetAPI {
  dispose: () => void;
  executeCommand: (command: string) => void;
  addEventListener: (event: string, listener: (data: unknown) => void) => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: Record<string, unknown>) => JitsiMeetAPI;
  }
}

export default function VideoSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<JitsiMeetAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  // Mock session data - gerçek uygulamada Supabase'den gelecek
  const sessionData = {
    id: sessionId,
    coachName: 'Dr. Ayşe Yılmaz',
    clientName: 'Mehmet Demir',
    duration: 45, // dakika
    startTime: new Date().toISOString(),
  };

  useEffect(() => {
    // Jitsi Meet API'yi yükle
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => initializeJitsi();
    document.body.appendChild(script);

    return () => {
      if (api) {
        api.dispose();
      }
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Seans süresini takip et
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const initializeJitsi = () => {
    if (!jitsiContainerRef.current || !window.JitsiMeetExternalAPI) return;

    const domain = 'meet.jit.si';
    const options = {
      roomName: `KariyeerSession_${sessionId}`,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        toolbarButtons: [
          'microphone',
          'camera',
          'desktop',
          'chat',
          'raisehand',
          'tileview',
          'settings',
        ],
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: '',
        DEFAULT_BACKGROUND: '#1e3a8a',
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        TOOLBAR_ALWAYS_VISIBLE: true,
      },
      userInfo: {
        displayName: sessionData.clientName, // Gerçek uygulamada kullanıcı adı
      },
    };

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);

    jitsiApi.addEventListener('videoConferenceJoined', () => {
      setIsLoading(false);
      toast.success('Seansa başarıyla katıldınız!');
    });

    jitsiApi.addEventListener('videoConferenceLeft', () => {
      handleEndSession();
    });

    jitsiApi.addEventListener('audioMuteStatusChanged', (event: unknown) => {
      const audioEvent = event as { muted: boolean };
      setIsAudioOn(!audioEvent.muted);
    });

    jitsiApi.addEventListener('videoMuteStatusChanged', (event: unknown) => {
      const videoEvent = event as { muted: boolean };
      setIsVideoOn(!videoEvent.muted);
    });

    setApi(jitsiApi);
  };

  const handleEndSession = () => {
    if (api) {
      api.dispose();
    }
    toast.success('Seans tamamlandı. Geri bildirim bırakmayı unutmayın!');
    navigate('/dashboard');
  };

  const toggleVideo = () => {
    if (api) {
      api.executeCommand('toggleVideo');
    }
  };

  const toggleAudio = () => {
    if (api) {
      api.executeCommand('toggleAudio');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = sessionData.duration * 60 - sessionTime;
  const isNearEnd = remainingTime <= 300; // Son 5 dakika

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-bold">Video Seans</h1>
              <p className="text-sm text-blue-200">Koç: {sessionData.coachName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg">{formatTime(sessionTime)}</span>
              <span className="text-sm text-blue-200">/ {sessionData.duration} dk</span>
            </div>
            {isNearEnd && (
              <Badge variant="destructive" className="animate-pulse">
                Son 5 Dakika!
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative h-[calc(100vh-80px)]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <Card className="w-96">
              <CardHeader>
                <CardTitle className="text-center">Seansa Bağlanılıyor...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Lütfen kamera ve mikrofon izinlerini verin
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={jitsiContainerRef} className="w-full h-full" />

        {/* Custom Controls Overlay */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl">
          <Button
            size="lg"
            variant={isVideoOn ? 'default' : 'destructive'}
            onClick={toggleVideo}
            className="rounded-full w-14 h-14"
          >
            {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          <Button
            size="lg"
            variant={isAudioOn ? 'default' : 'destructive'}
            onClick={toggleAudio}
            className="rounded-full w-14 h-14"
          >
            {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>

          <Button
            size="lg"
            variant="destructive"
            onClick={handleEndSession}
            className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700"
          >
            <Phone className="h-6 w-6 rotate-135" />
          </Button>
        </div>

        {/* Session Info Card */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-xl max-w-xs">
          <h3 className="font-semibold text-gray-900 mb-2">Seans Bilgileri</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Video Kalitesi: HD</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span>Ekran paylaşımı aktif</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Chat kullanılabilir</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500">
              Seans kaydedilmemektedir. Gizliliğiniz korunmaktadır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}