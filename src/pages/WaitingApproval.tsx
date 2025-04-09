
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WaitingApproval = () => {
  const { user, isPaid, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (isPaid) {
        navigate("/membro");
      }
    }
  }, [user, loading, isPaid, navigate]);
  
  const createAdminUser = async () => {
    if (!user) return;
    
    setCreatingAdmin(true);
    try {
      // Atualiza o perfil do usuário atual para administrador
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_admin: true,
          payment_status: 'aprovado' 
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Privilégios de administrador concedidos",
        description: "Seu usuário agora tem acesso de administrador.",
      });
      
      // Recarrega a página para atualizar o estado
      window.location.href = '/membro';
    } catch (error: any) {
      console.error('Erro ao conceder privilégios de admin:', error);
      toast({
        title: "Erro ao atualizar privilégios",
        description: error.message || "Não foi possível conceder privilégios de administrador.",
        variant: "destructive",
      });
    } finally {
      setCreatingAdmin(false);
    }
  };
  
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
            <p className="mb-6">
              Em caso de dúvidas, entre em contato através do formulário no site ou pelo WhatsApp.
            </p>
            
            {/* Botão para transformar o usuário atual em admin */}
            <Button 
              variant="default" 
              className="mt-4 w-full"
              onClick={createAdminUser}
              disabled={creatingAdmin}
            >
              {creatingAdmin ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                "Tornar este usuário Administrador"
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Este botão concede acesso administrativo ao usuário atual (apenas para desenvolvimento)
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
