
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ClientLogo {
  id: string;
  name: string;
  logo_url: string;
  created_at: string;
}

const HeroSection = () => {
  const [scroll, setScroll] = useState(false);
  const [clients, setClients] = useState<ClientLogo[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao carregar logos dos clientes:', error);
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-90 z-10"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 pattern-bg" style={{
        backgroundImage: "url('/images/bg-pattern.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.3
      }}></div>
      
      {/* Animated background */}
      <div className="absolute inset-0 z-0 animated-bg">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className={`floating-circle bg-ramel/10 rounded-full absolute`}
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 30 + 20}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 z-20 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">
              Soluções tecnológicas para
              <span className="text-ramel"> impulsionar</span> o seu negócio
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Sistemas personalizados, hospedagem confiável e consultoria especializada para 
              transformar sua presença digital.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/produtos/agenda-pro-plus" className="px-8">
                  Agenda Pro+
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild className="animate-pulse hover:animate-none">
                <Link to="/agendamento" className="px-8">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Horário
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <a 
                  href="https://wa.me/5527999082624" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8"
                >
                  Fale Conosco
                </a>
              </Button>
            </div>
            
            <div className="flex items-center gap-6 mt-12">
              <div className="flex -space-x-2">
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <div 
                      key={client.id}
                      className="w-12 h-12 rounded-full border-2 border-background overflow-hidden bg-white"
                    >
                      <img 
                        src={client.logo_url} 
                        alt={client.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  ))
                ) : (
                  [1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className="w-12 h-12 rounded-full bg-gray-400 border-2 border-background"
                    ></div>
                  ))
                )}
              </div>
              <div>
                <div className="font-bold">Vários clientes</div>
                <div className="text-sm text-muted-foreground">confiam em nossas soluções</div>
              </div>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-radial from-ramel/20 to-transparent rounded-full"></div>
            <img 
              src="/lovable-uploads/ce5802ea-5404-48ed-ac8f-7ad335ff753c.png" 
              alt="Ramel Tecnologia" 
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
