
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ProductsSectionProps {
  deliveryLogoUrl?: string;
}

const ProductsSection = ({ deliveryLogoUrl }: ProductsSectionProps) => {
  return (
    <section id="produtos" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Produtos Digitais</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluções completas para gestão, agendamento e delivery que transformam a operação do seu negócio.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Agenda Pro+ */}
          <div>
            <Card className="glass-card overflow-hidden border-ramel/20 h-full">
              <CardHeader className="bg-gradient-to-r from-ramel-dark to-ramel pb-10">
                <Badge className="w-fit mb-3 bg-white/20 hover:bg-white/30">Agenda Pro+</Badge>
                <CardTitle className="text-2xl md:text-3xl text-white">Sistema de Agendamentos com IA</CardTitle>
                <CardDescription className="text-white/80 text-lg">
                  Revolucione seus agendamentos com inteligência artificial
                </CardDescription>
              </CardHeader>
              
              <CardContent className="-mt-6 relative">
                <div className="absolute -top-5 right-6 bg-ramel text-white py-1 px-4 rounded-full">
                  A partir de R$ 99/mês
                </div>
                
                <div className="bg-secondary/80 rounded-lg p-6 shadow-lg mt-8">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Multiatendimento integrado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Sistema de agendamento inteligente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Chatbot com IA para agendamentos automáticos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Lembretes automáticos para clientes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Dashboard com análises e relatórios</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full bg-ramel hover:bg-ramel-dark">Saiba Mais</Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* DeliveryFlow */}
          <div>
            <Card className="glass-card overflow-hidden border-ramel/20 h-full">
              <CardHeader className="bg-gradient-to-r from-ramel to-ramel-light pb-10">
                <Badge className="w-fit mb-3 bg-white/20 hover:bg-white/30">DeliveryFlow</Badge>
                <CardTitle className="text-2xl md:text-3xl text-white">Revolucione seu Delivery</CardTitle>
                <CardDescription className="text-white/80 text-lg">
                  Sistema completo para gestão de pedidos e entregas
                </CardDescription>
              </CardHeader>
              
              <CardContent className="-mt-6 relative">
                <div className="absolute -top-5 right-6 bg-ramel text-white py-1 px-4 rounded-full">
                  Sistema Completo
                </div>
                
                <div className="bg-secondary/80 rounded-lg p-6 shadow-lg mt-8">
                  <h3 className="font-semibold text-lg mb-4">Principais Funcionalidades</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Gestão de Pedidos
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Controle total dos pedidos em tempo real, com status, notificações e integração com WhatsApp.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Gestão de Entregas
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Controle de entregadores, rotas e monitoramento em tempo real das entregas.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Integração WhatsApp
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Integração completa com Evolution API, múltiplas instâncias, mensagens automáticas e chatbot via Typebot.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full bg-ramel hover:bg-ramel-dark">Saiba Mais</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
