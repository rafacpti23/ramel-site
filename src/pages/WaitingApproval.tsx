
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import MemberHeader from "@/components/MemberHeader";
import { Loader2, CreditCard } from "lucide-react";

const WaitingApproval = () => {
  const { user, userProfile, isPaid, loading, redirectToStripe } = useAuth();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [initiatingCheckout, setInitiatingCheckout] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (isPaid) {
      navigate("/membro");
      return;
    }
    
    // Verifica se o usuário voltou do checkout com sucesso
    if (searchParams.get("checkout_success") === "true") {
      setCheckoutSuccess(true);
      toast({
        title: "Pagamento iniciado",
        description: "Seu pagamento está sendo processado. Você será notificado quando for aprovado."
      });
    }
  }, [user, isPaid, loading, navigate, searchParams]);
  
  const handlePaymentRedirect = async () => {
    setInitiatingCheckout(true);
    try {
      const success = await redirectToStripe();
      if (!success) {
        toast({
          title: "Erro",
          description: "Não foi possível iniciar o pagamento. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao redirecionar para pagamento:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar iniciar o pagamento.",
        variant: "destructive"
      });
    } finally {
      setInitiatingCheckout(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ramel" />
        <p className="mt-4 text-lg">Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="glass-card p-8 rounded-lg text-center">
            <h1 className="text-2xl font-bold mb-6">Aguardando aprovação</h1>
            
            {checkoutSuccess ? (
              <div className="bg-green-500/20 text-green-300 p-4 rounded-md mb-6">
                <p className="font-medium">Pagamento iniciado!</p>
                <p className="text-sm mt-2">
                  Seu pagamento está sendo processado. Você será notificado assim que for aprovado.
                </p>
              </div>
            ) : null}
            
            <p className="mb-6">
              Olá {userProfile?.full_name || "Usuário"}, seu cadastro foi recebido com sucesso, mas o acesso à plataforma ainda não foi liberado.
            </p>
            
            <div className="mb-8 p-4 bg-white/5 rounded-md">
              <h2 className="font-semibold mb-2 text-lg">Escolha uma forma de pagamento:</h2>
              
              <div className="mb-4">
                <Button 
                  className="w-full mb-2" 
                  onClick={handlePaymentRedirect}
                  disabled={initiatingCheckout}
                >
                  {initiatingCheckout ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pagar com cartão de crédito (R$ 49,00/mês)
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Pagamento seguro via Stripe. Seu acesso será liberado automaticamente após a confirmação.
                </p>
              </div>
              
              <div className="border-t border-white/10 pt-4 mt-4">
                <h3 className="text-sm font-medium mb-2">Aguardando aprovação manual</h3>
                <p className="text-xs text-muted-foreground">
                  Caso já tenha realizado o pagamento ou precise de suporte, entre em contato pelo WhatsApp: (18) 99613-4646
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaitingApproval;
