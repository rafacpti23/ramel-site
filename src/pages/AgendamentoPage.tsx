
import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, CheckCircle, Star, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AgendamentoPage = () => {
  const [calApiKey, setCalApiKey] = useState<string>("");

  useEffect(() => {
    const fetchCalConfig = async () => {
      try {
        const { data } = await supabase
          .from('system_config')
          .select('cal_api_key')
          .single();
        
        if (data?.cal_api_key) {
          setCalApiKey(data.cal_api_key);
        }
      } catch (error) {
        console.error('Erro ao carregar configuração Cal.com:', error);
      }
    };

    fetchCalConfig();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-ramel-dark to-ramel text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/lovable-uploads/59485cf7-0a0a-478c-8191-5a602b57e487.png"
                alt="Rafa Martins"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Rafa Martins</h1>
            <p className="text-xl md:text-2xl mb-6">
              Especialista em Tecnologia & Soluções Digitais
            </p>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Agende uma conversa personalizada para discutir suas necessidades tecnológicas 
              e descobrir como podemos impulsionar seu negócio.
            </p>
          </div>
        </section>

        {/* Booking Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Cal.com Integration */}
              <div className="order-2 md:order-1">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-ramel" />
                      Agende Seu Horário
                    </CardTitle>
                    <CardDescription>
                      Escolha o melhor horário para nossa conversa
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {calApiKey ? (
                      <div 
                        data-cal-link="rafa-martins/consultoria"
                        data-cal-config='{"layout":"month_view"}'
                        className="min-h-[600px] bg-white rounded-lg"
                      >
                        <script
                          type="text/javascript"
                          src="https://app.cal.com/embed/embed.js"
                          async
                        ></script>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-6">
                          Sistema de agendamento em configuração
                        </p>
                        <div className="space-y-4">
                          <Button asChild size="lg" className="w-full">
                            <a 
                              href="https://cal.com/rafa-martins/consultoria" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              <Video className="h-5 w-5" />
                              Agendar Reunião Online
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="lg" className="w-full">
                            <a 
                              href="https://wa.me/5527999082624?text=Olá,%20gostaria%20de%20agendar%20uma%20conversa" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              <span className="text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                                </svg>
                              </span>
                              Agendar via WhatsApp
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Information */}
              <div className="order-1 md:order-2">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-ramel" />
                        Sobre a Consultoria
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">
                        Uma conversa personalizada de 30 minutos para entender suas necessidades 
                        e apresentar as melhores soluções tecnológicas para seu negócio.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Análise gratuita das suas necessidades</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Apresentação de soluções personalizadas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Orçamento sem compromisso</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Suporte técnico especializado</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-ramel" />
                        Informações da Reunião
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <strong>Duração:</strong> 30 minutos
                        </div>
                        <div>
                          <strong>Formato:</strong> Online (Google Meet/Zoom)
                        </div>
                        <div>
                          <strong>Horário:</strong> Segunda a Sexta, 08:00 - 18:00
                        </div>
                        <div>
                          <strong>Investimento:</strong> Consulta gratuita
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-ramel" />
                        Experiência
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">
                        Com mais de 10 anos de experiência em tecnologia, tenho ajudado 
                        empresas de todos os tamanhos a digitalizarem seus processos e 
                        alcançarem melhores resultados.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-ramel">100+</div>
                          <div className="text-sm text-muted-foreground">Clientes Atendidos</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-ramel">10+</div>
                          <div className="text-sm text-muted-foreground">Anos de Experiência</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AgendamentoPage;
