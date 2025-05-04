
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users } from "lucide-react";

const SystemConfigLink = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Sistema
          </CardTitle>
          <CardDescription>
            Gerencie as configurações globais da plataforma RamelSeg
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Acesse as configurações de webhook, integrações e outras opções do sistema
          </p>
        </CardContent>
        <CardFooter>
          <Link to="/membro/admin/configuracoes">
            <Button>Acessar Configurações</Button>
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            CRM
          </CardTitle>
          <CardDescription>
            Gerencie seus clientes, negócios e interações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Acesse o sistema de gestão de relacionamento com clientes (CRM)
          </p>
        </CardContent>
        <CardFooter>
          <Link to="/membro/admin/crm">
            <Button>Acessar CRM</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SystemConfigLink;
