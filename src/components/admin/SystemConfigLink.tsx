
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SystemConfigLink = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>Configure webhooks, chat ao vivo e outras integrações</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-6 text-center">
          <p className="mb-4">
            Acesse a página de configurações completa para gerenciar webhooks,
            integrações e recursos avançados do sistema.
          </p>
          <Button onClick={() => navigate("/membro/admin/configuracoes")}>
            Ir para Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemConfigLink;
