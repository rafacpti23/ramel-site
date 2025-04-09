
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/ce5802ea-5404-48ed-ac8f-7ad335ff753c.png" 
            alt="Ramel Tecnologia" 
            className="h-12 w-auto" 
          />
        </div>
        
        {/* Mobile menu button */}
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <a href="#home" className="hover:text-ramel transition-colors">Home</a>
          <a href="#servicos" className="hover:text-ramel transition-colors">Serviços</a>
          <a href="#produtos" className="hover:text-ramel transition-colors">Produtos</a>
          <a href="#promocoes" className="hover:text-ramel transition-colors">Promoções</a>
          <a href="#contato" className="hover:text-ramel transition-colors">Contato</a>
          <Button>Fale Conosco</Button>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="lg:hidden flex flex-col items-center gap-6 py-6 bg-secondary/80 backdrop-blur-md border-b border-white/5">
          <a href="#home" className="hover:text-ramel transition-colors" onClick={() => setIsOpen(false)}>Home</a>
          <a href="#servicos" className="hover:text-ramel transition-colors" onClick={() => setIsOpen(false)}>Serviços</a>
          <a href="#produtos" className="hover:text-ramel transition-colors" onClick={() => setIsOpen(false)}>Produtos</a>
          <a href="#promocoes" className="hover:text-ramel transition-colors" onClick={() => setIsOpen(false)}>Promoções</a>
          <a href="#contato" className="hover:text-ramel transition-colors" onClick={() => setIsOpen(false)}>Contato</a>
          <Button>Fale Conosco</Button>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
