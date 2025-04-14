
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AgendaProPlus = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Agenda Pro+</h1>
            <p className="text-xl text-muted-foreground">
              Sistema de Agendamentos Inteligente com IA
            </p>
          </div>
          
          <div className="grid gap-8">
            <Card className="glass-card">
              <CardHeader className="bg-gradient-to-r from-ramel-dark to-ramel pb-10">
                <CardTitle className="text-2xl md:text-3xl text-white">Revolucione seus Agendamentos</CardTitle>
                <CardDescription className="text-white/80 text-lg">
                  Uma solução completa para empresas que desejam otimizar sua agenda
                </CardDescription>
              </CardHeader>
              
              <CardContent className="-mt-6 relative">
                <div className="absolute -top-5 right-6 bg-ramel text-white py-1 px-4 rounded-full">
                  A partir de R$ 99/mês
                </div>
                
                <div className="bg-secondary/80 rounded-lg p-6 shadow-lg mt-8">
                  <h3 className="font-semibold text-xl mb-6">Principais Funcionalidades</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Multiatendimento Integrado
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Gerencie múltiplos atendentes, salas e recursos em uma única agenda. 
                        Controle de permissões por usuário.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Agendamento Inteligente
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Algoritmo que distribui automaticamente os horários para maximizar 
                        a eficiência dos atendimentos.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Chatbot com IA
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Assistente virtual capaz de agendar horários, responder dúvidas e 
                        gerenciar cancelamentos sem intervenção humana.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Lembretes Automáticos
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Envio automático de confirmações e lembretes por WhatsApp, SMS e email para 
                        reduzir faltas e atrasos.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Dashboard Analítico
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Relatórios detalhados sobre ocupação, faturamento, clientes mais frequentes e 
                        horários de pico.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                        <Check className="h-5 w-5 text-ramel" />
                        Pagamentos Integrados
                      </h4>
                      <p className="text-muted-foreground ml-7">
                        Aceite pagamentos antecipados, parciais ou totais diretamente na plataforma, 
                        com emissão de recibos.
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
                      <span>Redução de 30% nas faltas com sistema de confirmação</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Aumento de 25% na produtividade com agendamento inteligente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Economia de até 20 horas semanais em tarefas administrativas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Atendimento 24/7 com chatbot, sem custo adicional com pessoal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-ramel mt-0.5" />
                      <span>Análise de dados para tomada de decisões estratégicas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Planos e Preços</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 border border-white/10 rounded-md">
                      <h3 className="font-medium text-lg">Plano Básico</h3>
                      <p className="text-2xl font-bold mt-2 mb-2">R$ 99/mês</p>
                      <p className="text-sm text-muted-foreground mb-4">Ideal para pequenos negócios</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-ramel mt-0.5" />
                          <span>Até 3 atendentes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-ramel mt-0.5" />
                          <span>Agendamento online</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-ramel mt-0.5" />
                          <span>Lembretes por email</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border border-ramel/30 rounded-md bg-secondary/50">
                      <h3 className="font-medium text-lg">Plano Profissional</h3>
                      <p className="text-2xl font-bold mt-2 mb-2">R$ 199/mês</p>
                      <p className="text-sm text-muted-foreground mb-4">Para empresas em crescimento</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-ramel mt-0.5" />
                          <span>Até 10 atendentes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-ramel mt-0.5" />
                          <span>Chatbot com IA</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-ramel mt-0.5" />
                          <span>Lembretes por WhatsApp e email</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-ramel mt-0.5" />
                          <span>Dashboard analítico completo</span>
                        </li>
                      </ul>
                    </div>
                  </div>
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

export default AgendaProPlus;
