
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DeliveryFlow = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-background" style={{
      backgroundImage: "url('/images/bg-pattern.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed"
    }}>
      <Navbar />
      
      <main className="flex-1 pt-20 container mx-auto px-4 py-12">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')} 
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">DeliveryFlow</h1>
            <p className="text-xl text-muted-foreground">
              Sistema Completo para Gestão de Delivery
            </p>
          </div>
          
          <div className="grid gap-8">
            <Card className="glass-card">
              <CardHeader className="bg-gradient-to-r from-ramel to-ramel-light pb-10">
                <CardTitle className="text-2xl md:text-3xl text-white">Revolucione seu Delivery</CardTitle>
                <CardDescription className="text-white/80 text-lg">
                  Uma solução completa para empresas que desejam otimizar suas entregas
                </CardDescription>
              </CardHeader>
              
              <CardContent className="-mt-6 relative">
                <div className="absolute -top-5 right-6 bg-ramel text-white py-1 px-4 rounded-full">
                  Sistema Completo
                </div>
                
                <div className="bg-secondary/80 rounded-lg p-6 shadow-lg mt-8">
                  <h3 className="font-semibold text-xl mb-6">Principais Funcionalidades</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Gestão de Pedidos
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Controle total dos pedidos em tempo real, com status, notificações 
                        e integração com WhatsApp.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Gestão de Entregas
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Controle de entregadores, rotas e monitoramento em tempo real 
                        das entregas com mapa integrado.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Integração WhatsApp
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Integração completa com Evolution API, múltiplas instâncias, mensagens 
                        automáticas e chatbot via Typebot.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Cardápio Digital
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Cardápio online personalizado com categorias, opções de adicionais 
                        e promoções dinâmicas.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Pagamentos Integrados
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Aceite pagamentos online via PIX, cartão e outros métodos, com 
                        controle financeiro integrado.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Relatórios Avançados
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Acompanhe vendas, desempenho de produtos, tempos de entrega e 
                        satisfação dos clientes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Benefícios para Empresas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Aumento de até 40% na capacidade de entregas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Redução de 25% nos custos operacionais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Melhoria de 30% na satisfação dos clientes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Atendimento automático para até 70% dos pedidos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Dados estratégicos para crescimento do negócio</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Diferenciais</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Integração nativa com sistemas de POS e ERP</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Compatível com múltiplos aplicativos de delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Sistema de fidelidade e marketing integrado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Suporte técnico especializado 24/7</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Personalização completa para sua marca</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <Button size="lg" className="bg-ramel hover:bg-ramel-dark">
                Solicitar Demonstração
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Entre em contato para uma demonstração personalizada
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DeliveryFlow;
