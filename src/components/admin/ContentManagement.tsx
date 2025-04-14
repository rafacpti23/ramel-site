
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ContentManagement = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Gerenciar Conteúdo</CardTitle>
        <CardDescription>Adicione e gerencie arquivos e vídeos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Arquivos de Apoio</h3>
            <Button onClick={() => navigate("/membro/admin/arquivos")}>
              Gerenciar Arquivos
            </Button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Vídeo Aulas</h3>
            <Button onClick={() => navigate("/membro/admin/videos")}>
              Gerenciar Vídeos
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentManagement;
