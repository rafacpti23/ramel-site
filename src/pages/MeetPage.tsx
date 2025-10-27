"use client";

import { useEffect, useRef } from "react";
import MemberHeader from "@/components/MemberHeader";

const MeetPage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Garante que o script do Jitsi foi carregado antes de usar
    const script = document.createElement("script");
    script.src = "https://8x8.vc/vpaas-magic-cookie-806f272ee5954f9d9b35470c4cb86a5b/external_api.js";
    script.async = true;

    script.onload = () => {
      // @ts-ignore - a API é global
      const api = new JitsiMeetExternalAPI("8x8.vc", {
        roomName:
          "vpaas-magic-cookie-806f272ee5954f9d9b35470c4cb86a5b/SampleAppPerfectArchivesDisplaceAngrily",
        parentNode: containerRef.current,
        // Se quiser habilitar recursos premium, inclua seu JWT:
        // jwt: "seu-token-jwt-aqui",
      });
    };

    document.body.appendChild(script);

    return () => {
      // Limpa ao desmontar o componente
      const existingScript = document.querySelector(
        "script[src*='external_api.js']"
      );
      if (existingScript) existingScript.remove();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      <div
        className="h-[calc(100vh-64px)]"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div
          id="jaas-container"
          ref={containerRef}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
};

export default MeetPage;
