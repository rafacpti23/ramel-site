
import { Shield, Lock, CreditCard } from "lucide-react";

const SecurityBadges = () => {
  return (
    <section className="py-8 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Segurança e Confiabilidade</h2>
          <p className="text-muted-foreground">Sua tranquilidade é nossa prioridade</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg shadow-sm border border-white/10">
            <Shield className="h-10 w-10 mb-3 text-green-500" />
            <h3 className="text-lg font-medium mb-1">Site Protegido</h3>
            <p className="text-sm text-center text-muted-foreground">
              Proteção por Cloudflare contra ataques DDoS e vulnerabilidades
            </p>
            <div className="mt-3">
              <img 
                src="https://www.cloudflare.com/img/logo-cloudflare-dark.svg" 
                alt="Cloudflare" 
                className="h-6 opacity-70"
              />
            </div>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg shadow-sm border border-white/10">
            <Lock className="h-10 w-10 mb-3 text-blue-500" />
            <h3 className="text-lg font-medium mb-1">Conexão Segura</h3>
            <p className="text-sm text-center text-muted-foreground">
              Certificado SSL ativo para garantir transferência segura de dados
            </p>
            <div className="mt-3 flex justify-center">
              <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-md text-xs">
                <Lock className="h-3 w-3 mr-1" />
                <span>SSL Secure</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg shadow-sm border border-white/10">
            <CreditCard className="h-10 w-10 mb-3 text-purple-500" />
            <h3 className="text-lg font-medium mb-1">Pagamento Seguro</h3>
            <p className="text-sm text-center text-muted-foreground">
              Processamento de pagamentos confiável via Stripe
            </p>
            <div className="mt-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" 
                alt="Stripe" 
                className="h-6 opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityBadges;
