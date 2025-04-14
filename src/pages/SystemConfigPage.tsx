
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import MemberHeader from "@/components/MemberHeader";
import { ArrowLeft } from "lucide-react";
import SystemConfig from "@/components/SystemConfig";

const SystemConfigPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      
      if (!isAdmin) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive",
        });
        navigate("/membro");
        return;
      }
    }
  }, [user, loading, isAdmin, navigate]);
  
  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/membro/admin")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
        </div>
        
        <div className="glass-card">
          <SystemConfig />
        </div>
      </main>
    </div>
  );
};

export default SystemConfigPage;
