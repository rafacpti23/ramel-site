
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scroll, setScroll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    setMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-lg transition-all ${
        scroll ? 'py-2 bg-background/80' : 'py-4 bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/lovable-uploads/ce5802ea-5404-48ed-ac8f-7ad335ff753c.png"
            alt="Logo Ramel"
            className="h-10"
          />
          <div className="font-bold text-xl">Ramel</div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-ramel">
            Início
          </Link>
          <button 
            className="text-sm font-medium transition-colors hover:text-ramel"
            onClick={() => scrollToSection('servicos')}
          >
            Nossos Serviços
          </button>
          <Link to="/produtos/agenda-pro-plus" className="text-sm font-medium transition-colors hover:text-ramel">
            Agenda Pro+
          </Link>
          <Link to="/produtos/deliveryflow" className="text-sm font-medium transition-colors hover:text-ramel">
            DeliveryFlow
          </Link>
          <Link to="/membro/arquivos" className="text-sm font-medium transition-colors hover:text-ramel">
            Recursos e Suporte
          </Link>
          <button 
            className="text-sm font-medium transition-colors hover:text-ramel"
            onClick={() => scrollToSection('contato')}
          >
            Fale Conosco
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <a 
              href="https://wa.me/5527999082624" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <span className="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                </svg>
              </span>
              Whatsapp
            </a>
          </Button>
          
          <Button asChild size="sm">
            <Link to="/auth">Área do Cliente</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background">
          <div className="flex flex-col space-y-3 p-4">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md hover:bg-white/5"
              onClick={() => setMenuOpen(false)}
            >
              Início
            </Link>
            <button 
              className="px-3 py-2 text-left rounded-md hover:bg-white/5"
              onClick={() => scrollToSection('servicos')}
            >
              Nossos Serviços
            </button>
            <Link 
              to="/produtos/agenda-pro-plus" 
              className="px-3 py-2 rounded-md hover:bg-white/5"
              onClick={() => setMenuOpen(false)}
            >
              Agenda Pro+
            </Link>
            <Link 
              to="/produtos/deliveryflow" 
              className="px-3 py-2 rounded-md hover:bg-white/5"
              onClick={() => setMenuOpen(false)}
            >
              DeliveryFlow
            </Link>
            <Link 
              to="/membro/arquivos" 
              className="px-3 py-2 rounded-md hover:bg-white/5"
              onClick={() => setMenuOpen(false)}
            >
              Recursos e Suporte
            </Link>
            <button 
              className="px-3 py-2 text-left rounded-md hover:bg-white/5"
              onClick={() => scrollToSection('contato')}
            >
              Fale Conosco
            </button>
            
            <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
              <Button asChild variant="outline" size="sm">
                <a 
                  href="https://wa.me/5527999082624" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1"
                >
                  <span className="text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    </svg>
                  </span>
                  Whatsapp
                </a>
              </Button>
              
              <Button asChild size="sm">
                <Link to="/auth" onClick={() => setMenuOpen(false)}>
                  Área do Cliente
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
