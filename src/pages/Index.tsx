
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProductsSection from "@/components/ProductsSection";
import PromotionSection from "@/components/PromotionSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background" style={{
      backgroundImage: "url('/images/bg-pattern.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed"
    }}>
      <Navbar />
      <main className="flex-1 pt-20">
        <HeroSection />
        
        {/* AgendaPro+ Banner */}
        <div className="py-10 bg-gradient-to-r from-ramel-dark to-ramel text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">LANÇAMENTO: Agenda Pro+</h2>
                <p className="text-xl md:text-2xl mb-6">
                  Sistema de Agendamentos com Inteligência Artificial
                </p>
                <p className="mb-8 text-white/80">
                  Revolucione sua agenda com IA, chatbot automático para agendamentos, 
                  lembretes via WhatsApp e muito mais!
                </p>
                <Link to="/produtos/agenda-pro-plus">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ramel">
                    Conhecer Agenda Pro+ <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex-1">
                <Card className="bg-white/10 border-none">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
                        <span className="text-4xl font-bold">30%</span>
                        <CardDescription className="text-center text-white/80">Redução de faltas</CardDescription>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
                        <span className="text-4xl font-bold">25%</span>
                        <CardDescription className="text-center text-white/80">Aumento de produtividade</CardDescription>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
                        <span className="text-4xl font-bold">20h</span>
                        <CardDescription className="text-center text-white/80">Economia semanal</CardDescription>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
                        <span className="text-4xl font-bold">24/7</span>
                        <CardDescription className="text-center text-white/80">Atendimento via IA</CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        <ServicesSection />
        <ProductsSection deliveryLogoUrl="https://i.ibb.co/qgRmCS7/3.png" />
        <PromotionSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
