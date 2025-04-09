
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Server, Cloud, Zap } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <Bot className="h-10 w-10 text-ramel" />,
      title: "Agentes de IA",
      description: "Desenvolvemos agentes inteligentes personalizados para automatizar processos e melhorar o atendimento ao cliente."
    },
    {
      icon: <Server className="h-10 w-10 text-ramel" />,
      title: "Servidores e VPS",
      description: "Instalação e manutenção de servidores e VPS com configuração otimizada para suas necessidades."
    },
    {
      icon: <Cloud className="h-10 w-10 text-ramel" />,
      title: "Consultoria em Automações",
      description: "Análise e implementação de soluções para automatizar processos e aumentar a eficiência do seu negócio."
    },
    {
      icon: <Zap className="h-10 w-10 text-ramel" />,
      title: "Análise de Sistemas",
      description: "Avaliação técnica completa de sistemas e infraestrutura com recomendações para otimização."
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Serviços</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Oferecemos soluções completas em tecnologia para impulsionar seu negócio no mundo digital.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="glass-card h-full hover:shadow-ramel/20 hover:border-ramel/20 transition-all">
              <CardHeader className="pb-2">
                <div className="mb-4">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground/90 text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
