
import { Server, Clock, Shield } from "lucide-react";
import { useSystemConfig } from "@/hooks/useSystemConfig";
import PromoBanner from "./promotions/PromoBanner";
import PromoCard from "./promotions/PromoCard";

const PromotionSection = () => {
  const { webhookContactForm } = useSystemConfig();

  const vpsFeatures = [
    { text: "3 vCPU Cores" },
    { text: "8GB RAM" },
    { text: "75GB NVMe ou 150GB SSD" },
    { text: "1 Snapshot" },
    { text: "32TB Tráfego*" },
    { text: "Entrada Ilimitada" }
  ];

  const siteFeatures = [
    { text: "Design Responsivo" },
    { text: "Até 5 Páginas" },
    { text: "Formulário de Contato" },
    { text: "Otimização SEO" },
    { text: "1 Mês de Suporte" }
  ];

  const securityFeatures = [
    { text: "Certificado SSL" },
    { text: "Firewall Avançado" },
    { text: "Backup Diário" },
    { text: "Monitoramento 24/7" },
    { text: "Suporte Prioritário" }
  ];

  return (
    <>
      <PromoBanner />

      <section className="py-16 bg-gradient-to-b from-background/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Ofertas Especiais</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Confira nossas promoções exclusivas e garanta as melhores condições para seus projetos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <PromoCard
              icon={Server}
              title="VPS PREMIUM 10"
              price="R$ 29,10"
              period="/mês"
              features={vpsFeatures}
              buttonText="Contratar Agora"
              onClick={() => window.open("https://www.kqzyfj.com/click-101209511-12740671", "_blank")}
            />
            
            <PromoCard
              icon={Clock}
              title="Site Profissional"
              price="R$ 899"
              period="/único"
              features={siteFeatures}
              buttonText="Solicitar Orçamento"
              buttonVariant="outline"
              onClick={() => window.open("https://wa.me/5527999082624?text=Olá,%20tenho%20interesse%20no%20pacote%20de%20criação%20de%20site", "_blank")}
            />
            
            <PromoCard
              icon={Shield}
              title="Segurança Digital"
              price="R$ 399"
              period="/semestral"
              features={securityFeatures}
              buttonText="Solicitar Orçamento"
              buttonVariant="outline"
              onClick={() => window.open("https://wa.me/5527999082624?text=Olá,%20tenho%20interesse%20no%20pacote%20de%20segurança%20digital", "_blank")}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default PromotionSection;
