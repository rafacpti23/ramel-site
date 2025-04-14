
import { Button } from "@/components/ui/button";
import { Server, Clock, Shield } from "lucide-react";

const PromotionSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Ofertas Especiais</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira nossas promoções exclusivas e garanta as melhores condições para seus projetos.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Servidor VPS */}
          <div className="glass-card p-6 rounded-lg transition-transform hover:-translate-y-1 duration-300">
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-ramel/20 mb-6">
              <Server className="h-6 w-6 text-ramel" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">VPS Premium</h3>
            <div className="text-3xl font-bold mb-4">
              R$ 59,90<span className="text-sm font-normal text-muted-foreground">/mês</span>
            </div>
            
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>2 Cores</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>4GB RAM</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>80GB SSD NVMe</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Tráfego Ilimitado</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Painel de Controle</span>
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
