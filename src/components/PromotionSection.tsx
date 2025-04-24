import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Server, Clock, Shield, Zap } from "lucide-react";
import { useSystemConfig } from "@/hooks/useSystemConfig";

const PromotionSection = () => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const { webhookContactForm } = useSystemConfig();

  useEffect(() => {
    // Verificar se já existe um timestamp salvo no localStorage
    const storedExpiry = localStorage.getItem('offerExpiryTime');
    
    if (storedExpiry) {
      // Usar o timestamp existente
      const expiryTime = parseInt(storedExpiry);
      startCountdown(expiryTime);
    } else {
      // Criar novo timestamp (atual + 6 horas)
      const expiryTime = Date.now() + (6 * 60 * 60 * 1000);
      localStorage.setItem('offerExpiryTime', expiryTime.toString());
      startCountdown(expiryTime);
    }
  }, []);

  const startCountdown = (expiryTimestamp: number) => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = expiryTimestamp - now;
      
      if (diff <= 0) {
        setTimeRemaining(0);
        clearInterval(intervalId);
      } else {
        setTimeRemaining(diff);
      }
    };
    
    // Atualizar imediatamente e depois a cada segundo
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(intervalId);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Ofertas Especiais</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira nossas promoções exclusivas e garanta as melhores condições para seus projetos.
          </p>
        </div>
        
        {timeRemaining !== null && timeRemaining > 0 && (
          <div className="glass-card mb-8 p-4 bg-gradient-to-r from-ramel/80 to-ramel-dark/80 text-white border border-ramel/50 animate-pulse">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center">
                <Zap className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-bold">Oferta Especial: VPS com Portainer e Traefik GRÁTIS!</h3>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-mono text-lg font-bold">
                  Expira em: {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Servidor VPS */}
          <div className="glass-card p-6 rounded-lg transition-transform hover:-translate-y-1 duration-300">
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-ramel/20 mb-6">
              <Server className="h-6 w-6 text-ramel" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">VPS Premium</h3>
            <div className="text-3xl font-bold mb-4">
              R$ 29,10<span className="text-sm font-normal text-muted-foreground">/mês</span>
            </div>
            
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>4 vCPU Cores</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>4GB RAM</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>100GB NVMe ou 200GB SSD</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>1 Snapshot</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>32TB Tráfego*</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Entrada Ilimitada</span>
              </li>
            </ul>
            
            <Button 
              className="w-full"
              onClick={() => window.open("https://www.kqzyfj.com/click-101209511-12740671", "_blank")}
            >
              Contratar Agora
            </Button>
            
            <p className="text-xs text-center mt-4 text-muted-foreground">
              *Oferta por tempo limitado
            </p>
          </div>
          
          {/* Criação de Site */}
          <div className="glass-card p-6 rounded-lg transition-transform hover:-translate-y-1 duration-300">
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-ramel/20 mb-6">
              <Clock className="h-6 w-6 text-ramel" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">Site Profissional</h3>
            <div className="text-3xl font-bold mb-4">
              R$ 899<span className="text-sm font-normal text-muted-foreground">/único</span>
            </div>
            
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Design Responsivo</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Até 5 Páginas</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Formulário de Contato</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Otimização SEO</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>1 Mês de Suporte</span>
              </li>
            </ul>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open("https://wa.me/5527999082624?text=Olá,%20tenho%20interesse%20no%20pacote%20de%20criação%20de%20site", "_blank")}
            >
              Solicitar Orçamento
            </Button>
          </div>
          
          {/* Segurança Digital */}
          <div className="glass-card p-6 rounded-lg transition-transform hover:-translate-y-1 duration-300">
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-ramel/20 mb-6">
              <Shield className="h-6 w-6 text-ramel" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">Segurança Digital</h3>
            <div className="text-3xl font-bold mb-4">
              R$ 399<span className="text-sm font-normal text-muted-foreground">/semestral</span>
            </div>
            
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Certificado SSL</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Firewall Avançado</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Backup Diário</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Monitoramento 24/7</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Suporte Prioritário</span>
              </li>
            </ul>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open("https://wa.me/5527999082624?text=Olá,%20tenho%20interesse%20no%20pacote%20de%20segurança%20digital", "_blank")}
            >
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionSection;
