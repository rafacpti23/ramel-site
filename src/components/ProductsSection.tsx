
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, MessageSquare, Users, BarChart3, MessageCircle, Send, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const ProductsSection = ({ deliveryLogoUrl }: { deliveryLogoUrl?: string }) => {
  return (
    <section id="produtos" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Produtos Digitais</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluções completas para gestão, agendamento, delivery, CRM multicanal e automação que transformam a operação do seu negócio.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* WhatsVix - CRM de Mensagens */}
          <Card className="glass-card overflow-hidden border-blue-500/20 h-full">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 pb-8">
              <Badge className="w-fit mb-3 bg-white/20 hover:bg-white/30">WhatsVix</Badge>
              <CardTitle className="text-xl text-white">CRM de Mensagens Multicanal</CardTitle>
              <CardDescription className="text-white/80">
                Centralize todos os seus atendimentos em uma única plataforma
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-sm">Integrações:</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">WhatsApp</Badge>
                  <Badge variant="secondary" className="text-xs">Telegram</Badge>
                  <Badge variant="secondary" className="text-xs">Facebook</Badge>
                  <Badge variant="secondary" className="text-xs">Instagram</Badge>
                  <Badge variant="outline" className="text-xs">iFood (em breve)</Badge>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Multiatendimento simultâneo</span>
                </li>
                <li className="flex items-start gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Chatbot inteligente com IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Respostas rápidas automáticas</span>
                </li>
                <li className="flex items-start gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Dashboard de desempenho</span>
                </li>
                <li className="flex items-start gap-2">
                  <Send className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Campanhas de marketing</span>
                </li>
              </ul>
              <div className="text-right text-sm text-muted-foreground">
                A partir de R$ 149/mês
              </div>
            </CardContent>
            
            <CardFooter>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Em Breve</Button>
            </CardFooter>
          </Card>
          {/* Agenda Pro+ */}
          <Card className="glass-card overflow-hidden border-ramel/20 h-full">
            <CardHeader className="bg-gradient-to-r from-ramel-dark to-ramel pb-8">
              <Badge className="w-fit mb-3 bg-white/20 hover:bg-white/30">Agenda Pro+</Badge>
              <CardTitle className="text-xl text-white">Sistema de Agendamentos com IA</CardTitle>
              <CardDescription className="text-white/80">
                Revolucione seus agendamentos com inteligência artificial
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-ramel mt-1" />
                  <span className="text-sm">Chatbot com IA para agendamentos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-ramel mt-1" />
                  <span className="text-sm">Lembretes automáticos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-ramel mt-1" />
                  <span className="text-sm">Dashboard com análises</span>
                </li>
              </ul>
              <div className="text-right text-sm text-muted-foreground">
                A partir de R$ 99/mês
              </div>
            </CardContent>
            
            <CardFooter>
              <Link to="/produtos/agendapro" className="w-full">
                <Button className="w-full bg-ramel hover:bg-ramel-dark">Saiba Mais</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* WhatsPro */}
          <Card className="glass-card overflow-hidden border-green-500/20 h-full">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 pb-8">
              <Badge className="w-fit mb-3 bg-white/20 hover:bg-white/30">WhatsPro</Badge>
              <CardTitle className="text-xl text-white">Automação de WhatsApp</CardTitle>
              <CardDescription className="text-white/80">
                Transforme seu WhatsApp em uma máquina de vendas
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-sm">Envio em massa personalizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-sm">Gestão avançada de contatos</span>
                </li>
                <li className="flex items-start gap-2">
                  <BarChart3 className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-sm">Analytics em tempo real</span>
                </li>
              </ul>
              <div className="text-right text-sm text-muted-foreground">
                +10k mensagens/dia
              </div>
            </CardContent>
            
            <CardFooter>
              <Link to="/produtos/whatspro" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">Saiba Mais</Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* DeliveryFlow */}
          <Card className="glass-card overflow-hidden border-ramel/20 h-full">
            <CardHeader className="bg-gradient-to-r from-ramel to-ramel-light pb-8">
              <Badge className="w-fit mb-3 bg-white/20 hover:bg-white/30">DeliveryFlow</Badge>
              <CardTitle className="text-xl text-white">Sistema de Delivery</CardTitle>
              <CardDescription className="text-white/80">
                Sistema completo para gestão de pedidos e entregas
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-ramel mt-1" />
                  <span className="text-sm">Gestão de pedidos em tempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-ramel mt-1" />
                  <span className="text-sm">Controle de entregadores</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-ramel mt-1" />
                  <span className="text-sm">Integração WhatsApp</span>
                </li>
              </ul>
              <div className="text-right text-sm text-muted-foreground">
                Sistema Completo
              </div>
            </CardContent>
            
            <CardFooter>
              <Link to="/produtos/deliveryflow" className="w-full">
                <Button className="w-full bg-ramel hover:bg-ramel-dark">Saiba Mais</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
