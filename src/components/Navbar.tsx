
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <Link to="/">
            <img 
              src="/lovable-uploads/ce5802ea-5404-48ed-ac8f-7ad335ff753c.png" 
              alt="Ramel Tecnologia" 
              className="h-12 w-auto" 
            />
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <a 
            href="#home" 
            className="hover:text-ramel transition-colors"
            onClick={(e) => {e.preventDefault(); scrollToSection('home');}}
          >
            Home
          </a>
          <a 
            href="#servicos" 
            className="hover:text-ramel transition-colors"
            onClick={(e) => {e.preventDefault(); scrollToSection('servicos');}}
          >
            Serviços
          </a>
          <a 
            href="#produtos" 
            className="hover:text-ramel transition-colors"
            onClick={(e) => {e.preventDefault(); scrollToSection('produtos');}}
          >
            Produtos
          </a>
          <a 
            href="#promocoes" 
            className="hover:text-ramel transition-colors"
            onClick={(e) => {e.preventDefault(); scrollToSection('promocoes');}}
          >
            Promoções
          </a>
          <a 
            href="#contato" 
            className="hover:text-ramel transition-colors"
            onClick={(e) => {e.preventDefault(); scrollToSection('contato');}}
          >
            Contato
          </a>
          <Link to="/auth">
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Área de Membros
            </Button>
          </Link>
          <a href="https://wa.me/5527999082624" target="_blank" rel="noopener noreferrer">
            <Button>Fale Conosco</Button>
          </a>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="lg:hidden flex flex-col items-center gap-6 py-6 bg-secondary/80 backdrop-blur-md border-b border-white/5">
          <a 
            href="#home" 
            className="hover:text-ramel transition-colors"
            onClick={(e) => {e.preventDefault(); scrollToSection('home');}}
          >
            Home
          </a>
          <a 
            href="#servicos" 
            className="hover:text-ramel transition-colors"
            onClick={(e) => {e.preventDefault(); scrollToSection('servicos');}}
          >
            Serviços
          </a>
          <a 
            href="#produtos" 
            className="hover:text-ramel transition-colors"
            onClick={(e) => {e.preventDefault(); scrollToSection('produtos');}}
          >
            Produtos
          </a>
          <a 
            href="#promocoes" 
            className="hover:text-ramel transition-colors"
            onClick={(e) => {e.preventDefault(); scrollToSection('promocoes');}}
          >
            Promoções
          </a>
          <a 
            href="#contato" 
            className="hover:text-ramel transition-colors"
            onClick={(e) => {e.preventDefault(); scrollToSection('contato');}}
          >
            Contato
          </a>
          <Link to="/auth" onClick={() => setIsOpen(false)}>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Área de Membros
            </Button>
          </Link>
          <a href="https://wa.me/5527999082624" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
            <Button>Fale Conosco</Button>
          </a>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
