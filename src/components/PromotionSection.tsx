
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Server } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const PromotionSection = () => {
  return (
    <section id="promocoes" className="py-20 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ofertas Especiais</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Confira nossas promoções exclusivas para impulsionar seu negócio com a melhor infraestrutura.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* VPS Promocional */}
          <Card className="glass-card overflow-hidden border-ramel/20 relative">
            <div className="absolute top-4 right-4 bg-ramel text-white text-sm py-1 px-3 rounded-full">
              Oferta Limitada
            </div>
            
            <CardHeader className="pb-0">
              <div className="w-16 h-16 bg-ramel/10 rounded-lg flex items-center justify-center mb-4">
                <Server className="h-8 w-8 text-ramel" />
              </div>
              <CardTitle className="text-2xl">VPS Promocional</CardTitle>
              <CardDescription className="text-lg">
                Servidor virtual com performance garantida
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold">R$ 25</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-ramel mt-0.5" />
                  <span>Instalação de <span className="text-ramel">Portainer</span> GRÁTIS</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-ramel mt-0.5" />
                  <span>Instalação de <span className="text-ramel">Docker</span> GRÁTIS</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-ramel mt-0.5" />
                  <span>Instalação de <span className="text-ramel">Traefik</span> GRÁTIS</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-ramel mt-0.5" />
                  <span>Suporte técnico especializado</span>
                </li>
              </ul>
              
              <div className="flex justify-between items-center">
                <a href="https://www.kqzyfj.com/click-101209511-12740671" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-ramel hover:bg-ramel-dark">Contratar Agora</Button>
                </a>
                
                <a href="https://www.kqzyfj.com/click-101209511-12740671" target="_blank" rel="noopener noreferrer" className="ml-4">
                  <img src="https://www.ftjcfx.com/image-101209511-12740671" width="150" height="150" alt="VPS Promocional" className="rounded-lg hover:opacity-90 transition-opacity" />
                </a>
              </div>
            </CardContent>
          </Card>
          
          {/* Serviço de Monitoramento */}
          <Card className="glass-card overflow-hidden border-ramel/20">
            <CardHeader>
              <CardTitle className="text-2xl">Serviço de Monitoramento Uptime</CardTitle>
              <CardDescription className="text-lg">
                Monitore suas VPS e sites com o serviço Guard
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold">R$ 69</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="font-medium mb-2">O pacote inclui:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-ramel flex-shrink-0" />
                      <span>Monitoramento de 3 VPS</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-ramel flex-shrink-0" />
                      <span>10 links de sites</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-ramel flex-shrink-0" />
                      <span>5 checks personalizados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-ramel flex-shrink-0" />
                      <span>Notificações em tempo real</span>
                    </li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Benefícios:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Detecte falhas antes que seus clientes percebam</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Monitore a performance e tempo de resposta</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Relatórios detalhados de disponibilidade</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <Button className="w-full bg-ramel hover:bg-ramel-dark">
                Conhecer o Guard Monitoring
              </Button>
              <div className="text-center mt-2">
                <a href="https://guard.ramelseg.com.br" target="_blank" rel="noopener noreferrer" className="text-sm text-ramel hover:underline">
                  guard.ramelseg.com.br
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PromotionSection;
