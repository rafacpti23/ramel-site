
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Calendar, Check } from "lucide-react";

const ProductBanner = () => {
  const [currentProduct, setCurrentProduct] = useState(0);

  const products = [
    {
      id: "agendapro",
      title: "LANÇAMENTO: Agenda Pro+",
      subtitle: "Sistema de Agendamentos com Inteligência Artificial",
      description: "Revolucione sua agenda com IA, chatbot automático para agendamentos, lembretes via WhatsApp e muito mais!",
      buttonText: "Conhecer Agenda Pro+",
      link: "/produtos/agendapro",
      stats: [
        { value: "30%", label: "Redução de faltas" },
        { value: "25%", label: "Aumento de produtividade" },
        { value: "20h", label: "Economia semanal" },
        { value: "24/7", label: "Atendimento via IA" }
      ],
      bgGradient: "from-ramel-dark to-ramel",
      color: "ramel"
    },
    {
      id: "whatspro",
      title: "NOVO: WhatsPro",
      subtitle: "Transforme seu WhatsApp em uma Máquina de Vendas",
      description: "O sistema mais completo para automação de WhatsApp do mercado. Usado por milhares de empresas para aumentar vendas e engagement.",
      buttonText: "Conhecer WhatsPro",
      link: "/produtos/whatspro",
      stats: [
        { value: "+10k", label: "Mensagens/dia" },
        { value: "98%", label: "Taxa de entrega" },
        { value: "24/7", label: "Disponibilidade" },
        { value: "100%", label: "Seguro Evolution API" }
      ],
      bgGradient: "from-green-600 to-green-500",
      color: "green"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProduct((prev) => (prev + 1) % products.length);
    }, 8000); // Troca a cada 8 segundos

    return () => clearInterval(interval);
  }, []);

  const current = products[currentProduct];

  return (
    <div className={`py-10 bg-gradient-to-r ${current.bgGradient} text-white transition-all duration-1000`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{current.title}</h2>
            <p className="text-xl md:text-2xl mb-6">
              {current.subtitle}
            </p>
            <p className="mb-8 text-white/80">
              {current.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={current.link}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  {current.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {current.id === "whatspro" && (
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Demo Gratuita
                </Button>
              )}
            </div>
          </div>
          <div className="flex-1">
            <Card className="bg-white/10 border-none">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {current.stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
                      <span className="text-4xl font-bold">{stat.value}</span>
                      <CardDescription className="text-center text-white/80">{stat.label}</CardDescription>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Indicadores */}
        <div className="flex justify-center mt-8 space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentProduct ? 'bg-white' : 'bg-white/40'
              }`}
              onClick={() => setCurrentProduct(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductBanner;
