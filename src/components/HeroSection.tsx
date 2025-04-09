
import { Button } from "@/components/ui/button";
import { Bot, Server } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 bg-hero-pattern opacity-30 z-0"></div>
      <div className="absolute inset-0 bg-ai-gradient z-0"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="text-left max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Soluções Tecnológicas <span className="text-gradient">Inteligentes</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Transformamos seu negócio com tecnologia avançada, automação e inteligência artificial. 
              Da instalação de servidores ao desenvolvimento de agentes de IA personalizados.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-ramel hover:bg-ramel-dark">
                Nossos Serviços
              </Button>
              <Button size="lg" variant="outline">
                Fale Conosco
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-ramel/10 p-3 rounded-lg">
                  <Bot className="h-6 w-6 text-ramel" />
                </div>
                <div>
                  <h3 className="font-semibold">Agentes de IA</h3>
                  <p className="text-muted-foreground">Soluções inteligentes para automação e atendimento</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-ramel/10 p-3 rounded-lg">
                  <Server className="h-6 w-6 text-ramel" />
                </div>
                <div>
                  <h3 className="font-semibold">Servidores e VPS</h3>
                  <p className="text-muted-foreground">Instalação, manutenção e monitoramento</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative w-full max-w-md">
            <div className="aspect-square rounded-full bg-ramel/10 absolute inset-0 m-auto animate-pulse-slow"></div>
            <div className="relative z-10 animate-float">
              <img 
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e" 
                alt="IA Ramel Tecnologia" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
