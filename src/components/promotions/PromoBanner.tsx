
import { useState } from "react";
import { Zap } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

const PromoBanner = () => {
  const [showBanner, setShowBanner] = useState(true);

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 shadow-lg">
      <div className="glass-card py-2 px-4 bg-gradient-to-r from-ramel/90 to-ramel-dark/90 text-white border border-ramel/50 animate-pulse">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              <h3 className="text-sm md:text-lg font-bold">
                Oferta Especial: VPS R$: 29,10 com instalação de Portainer e Traefik GRÁTIS!
              </h3>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <CountdownTimer />
              <button 
                onClick={handleCloseBanner} 
                className="ml-4 text-white/80 hover:text-white"
                aria-label="Fechar banner"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
