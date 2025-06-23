
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, MessageSquare, Users, Bot, BarChart3, Shield, Clock, Zap, Send, Calendar, Database } from "lucide-react";
import { Link } from "react-router-dom";

const WhatsPro = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Envio em Massa",
      description: "Envie milhares de mensagens personalizadas simultaneamente com nossa tecnologia avançada"
    },
    {
      icon: Users,
      title: "Gestão de Contatos",
      description: "Organize seus contatos em grupos e segmente suas campanhas para melhor conversão"
    },
    {
      icon: Bot,
      title: "Automação Inteligente",
      description: "Automatize suas campanhas com agendamento e pausas personalizáveis entre mensagens"
    },
    {
      icon: BarChart3,
      title: "Analytics Avançado",
      description: "Acompanhe métricas detalhadas de entrega, abertura e conversão em tempo real"
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Evolution API integrada com máxima segurança e proteção de dados"
    },
    {
      icon: Clock,
      title: "24/7 Disponível",
      description: "Sistema sempre online com suporte técnico especializado quando precisar"
    }
  ];

  const benefits = [
    "Múltiplas instâncias WhatsApp",
    "Envio personalizado em massa",
    "Agendamento de campanhas",
    "Gestão completa de contatos",
    "Relatórios detalhados",
    "API própria ou nossa Evolution API",
    "Interface intuitiva e responsiva",
    "Suporte técnico especializado"
  ];

  const stats = [
    { number: "+10.000", label: "Mensagens/dia" },
    { number: "98%", label: "Taxa de entrega" },
    { number: "24/7", label: "Disponibilidade" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-green-500 hover:bg-green-600 text-white">
                WhatsPro - Novo Lançamento
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Transforme seu WhatsApp em uma
                <span className="text-green-600 block mt-2">Máquina de Vendas</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                O sistema mais completo para automação de WhatsApp do mercado. 
                Usado por milhares de empresas para aumentar vendas e engagement.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8" asChild>
                  <a 
                    href="https://whatspro.ramelseg.com.br" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Começar Agora
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/agendamento" className="px-8">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-green-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshots Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Veja o Sistema em Ação
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Interface intuitiva e poderosa para gerenciar todas suas campanhas de WhatsApp
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">Dashboard Completo</CardTitle>
                  <CardDescription>
                    Acompanhe todas suas métricas em tempo real com nosso dashboard intuitivo
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <img 
                    src="/lovable-uploads/63de2175-e9e7-4ce5-83cc-5817019ce129.png" 
                    alt="Dashboard WhatsPro - Visão geral completa com métricas de campanhas"
                    className="w-full h-auto border-t"
                  />
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">Criação de Campanhas</CardTitle>
                  <CardDescription>
                    Interface simples para criar campanhas personalizadas com agendamento automático
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <img 
                    src="/lovable-uploads/88c54bb1-be6f-4f5b-a5a9-ff1b1c58ef64.png" 
                    alt="Tela de criação de campanhas do WhatsPro com opções de agendamento"
                    className="w-full h-auto border-t"
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl text-green-600">Planos Flexíveis</CardTitle>
                <CardDescription>
                  Escolha o plano ideal para seu negócio, desde teste gratuito até soluções empresariais
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <img 
                  src="/lovable-uploads/57413353-e0cf-4487-a8f8-5af0e9765eae.png" 
                  alt="Planos do WhatsPro - Teste Gratuito, Starter e Master com preços e recursos"
                  className="w-full h-auto border-t"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Recursos que Fazem a Diferença
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Descubra todas as funcionalidades que vão revolucionar sua comunicação no WhatsApp
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-green-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All-in-One Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Tudo que você precisa em um só lugar
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para Revolucionar suas Vendas?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de empresas que já transformaram seu WhatsApp em uma máquina de vendas
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-white text-green-600 hover:bg-white hover:text-green-700 px-8" asChild>
                <a 
                  href="https://whatspro.ramelseg.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Começar Gratuitamente
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white text-white hover:bg-white hover:text-green-600">
                <a 
                  href="https://wa.me/5527999082624" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Fale Conosco
                </a>
              </Button>
            </div>
            
            <div className="mt-6">
              <Button variant="outline" size="lg" asChild className="border-white text-white hover:bg-white hover:text-green-600">
                <Link to="/agendamento" className="px-8">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Reunião
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WhatsPro;
