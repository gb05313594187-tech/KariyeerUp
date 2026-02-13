// src/components/MeetingRoom.tsx
// @ts-nocheck
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

interface Props {
  roomName?: string;
  displayName?: string;
  onEnd?: () => void;
}

export default function MeetingRoom({ roomName, displayName = "Katılımcı", onEnd }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  useEffect(() => {
    if (!roomName || !containerRef.current) return;

    const loadAndInit = () => {
      if (window.JitsiMeetExternalAPI) {
        initJitsi();
      } else {
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => initJitsi();
        script.onerror = () => fallbackIframe();
        document.head.appendChild(script);
      }
    };

    const initJitsi = () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";

      try {
        const jitsiRoomName = roomName.startsWith("kocvaktim-")
          ? roomName
          : `kocvaktim-${roomName}`;

        const api = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName: jitsiRoomName,
          parentNode: containerRef.current,
          width: "100%",
          height: "100%",
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            defaultLanguage: "tr",
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_POWERED_BY: false,
            MOBILE_APP_PROMO: false,
          },
          userInfo: { displayName },
        });

        api.addEventListener("readyToClose", () => {
          api.dispose();
          onEnd?.();
        });

        apiRef.current = api;
      } catch (e) {
        console.error("Jitsi init error:", e);
        fallbackIframe();
      }
    };

    const fallbackIframe = () => {
      if (!containerRef.current) return;
      const jitsiRoomName = roomName.startsWith("kocvaktim-")
        ? roomName
        : `kocvaktim-${roomName}`;

      containerRef.current.innerHTML = `
        <iframe
          src="https://meet.jit.si/${jitsiRoomName}"
          allow="camera; microphone; fullscreen; display-capture"
          style="width:100%;height:100%;border:none;"
        ></iframe>`;
    };

    loadAndInit();

    return () => {
      if (apiRef.current) {
        try { apiRef.current.dispose(); } catch (e) {}
      }
    };
  }, [roomName, displayName]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
