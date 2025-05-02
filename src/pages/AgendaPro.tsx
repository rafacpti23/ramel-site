
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowLeft, Calendar, MessageCircle, Bell, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AgendaPro = () => {
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
              Sistema de Agendamentos com Inteligência Artificial
            </p>
          </div>
          
          <div className="grid gap-8">
            <Card className="glass-card overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-ramel-dark to-ramel pb-10">
                <CardTitle className="text-2xl md:text-3xl text-white">Revolucione seus Agendamentos</CardTitle>
                <CardDescription className="text-white/80 text-lg">
                  Uma solução completa para empresas que desejam otimizar seu atendimento
                </CardDescription>
              </CardHeader>
              
              <CardContent className="-mt-6 relative">
                <div className="absolute -top-5 right-6 bg-ramel text-white py-1 px-4 rounded-full">
                  A partir de R$ 99/mês
                </div>
                
                <div className="bg-secondary/80 rounded-lg p-6 shadow-lg mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-lg">
                      <Calendar className="h-12 w-12 text-ramel mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Agendamento Inteligente</h3>
                      <p className="text-muted-foreground">
                        Sistema que otimiza sua agenda para maximizar atendimentos e evitar conflitos
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-lg">
                      <MessageCircle className="h-12 w-12 text-ramel mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Chatbot com IA</h3>
                      <p className="text-muted-foreground">
                        Automatize seus agendamentos com um assistente virtual que trabalha 24/7
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-lg">
                      <Bell className="h-12 w-12 text-ramel mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Lembretes Automáticos</h3>
                      <p className="text-muted-foreground">
                        Reduza faltas e atrasos com lembretes personalizados via WhatsApp
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-lg">
                      <BarChart3 className="h-12 w-12 text-ramel mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Dashboard Analítico</h3>
                      <p className="text-muted-foreground">
                        Acompanhe métricas importantes para otimizar seu negócio
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-semibold text-xl mb-6">Benefícios do Agenda Pro+</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                          <Check className="h-5 w-5 text-ramel" />
                          Redução de 30% em faltas
                        </h4>
                        <p className="text-muted-foreground ml-7">
                          Sistema inteligente de lembretes e confirmações que minimiza perdas.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                          <Check className="h-5 w-5 text-ramel" />
                          Aumento de 25% na produtividade
                        </h4>
                        <p className="text-muted-foreground ml-7">
                          Otimização de agenda e horários que maximiza seu tempo útil.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                          <Check className="h-5 w-5 text-ramel" />
                          Economia de 20 horas semanais
                        </h4>
                        <p className="text-muted-foreground ml-7">
                          Automações inteligentes que eliminam trabalhos manuais repetitivos.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium flex items-center gap-2 text-lg mb-2">
                          <Check className="h-5 w-5 text-ramel" />
                          Atendimento 24/7
                        </h4>
                        <p className="text-muted-foreground ml-7">
                          Chatbot com IA que realiza agendamentos mesmo quando você não está disponível.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
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

export default AgendaPro;
