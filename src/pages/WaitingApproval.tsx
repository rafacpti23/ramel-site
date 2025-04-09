
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const WaitingApproval = () => {
  const { user, isPaid, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (isPaid) {
        navigate("/membro");
      }
    }
  }, [user, loading, isPaid, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ramel" />
        <p className="mt-4">Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      backgroundImage: "url('/images/bg-pattern.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed"
    }}>
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <img 
            src="/lovable-uploads/ce5802ea-5404-48ed-ac8f-7ad335ff753c.png" 
            alt="Ramel Tecnologia" 
            className="h-16 mx-auto mb-4" 
          />
          <CardTitle className="text-xl">Aguardando Aprovação</CardTitle>
          <CardDescription>
            Seu acesso está pendente de aprovação
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="py-6">
            <p className="mb-4">
              Obrigado por se cadastrar! Seu acesso à área de membros está aguardando a 
              confirmação do pagamento.
            </p>
            <p className="mb-4">
              Assim que seu pagamento for confirmado, você receberá acesso completo a 
              todos os recursos exclusivos.
            </p>
            <p>
              Em caso de dúvidas, entre em contato através do formulário no site ou pelo WhatsApp.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => signOut()}>
            Sair
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WaitingApproval;
