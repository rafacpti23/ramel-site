
import { Zap } from "lucide-react";
import YouTubeChannelPreview from "./YouTubeChannelPreview";

const Footer = () => {
  return (
    <footer className="bg-secondary py-12 border-t border-white/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-ramel" />
              <span className="text-xl font-bold">Ramel Tecnologia</span>
            </div>
            <p className="text-muted-foreground">
              Soluções inteligentes para seu negócio crescer no mundo digital.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li>Email: <a href="mailto:contato@ramelseg.com.br" className="text-ramel hover:underline">contato@ramelseg.com.br</a></li>
              <li>WhatsApp: <a href="https://wa.me/5527999082624" className="text-ramel hover:underline">(27) 99908-2624</a></li>
              <li>Localização: Vitória - ES</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li><a href="#servicos" className="hover:text-ramel transition-colors">Serviços</a></li>
              <li><a href="#produtos" className="hover:text-ramel transition-colors">Produtos</a></li>
              <li><a href="#promocoes" className="hover:text-ramel transition-colors">Promoções</a></li>
              <li><a href="https://guard.ramelseg.com.br" className="hover:text-ramel transition-colors">Guard Monitoramento</a></li>
            </ul>
          </div>
          
          <div>
            <YouTubeChannelPreview />
          </div>
        </div>
        
        <div className="flex justify-center mt-8 pt-8 border-t border-white/5">
          <a href="https://www.kqzyfj.com/click-101209511-13484398" target="_top" className="block">
            <img 
              src="https://www.lduhtrp.net/image-101209511-13484398" 
              width="728" 
              height="90" 
              alt="Banner promocional" 
              className="max-w-full h-auto border-0" 
            />
          </a>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-muted-foreground">© {new Date().getFullYear()} Ramel Tecnologia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
