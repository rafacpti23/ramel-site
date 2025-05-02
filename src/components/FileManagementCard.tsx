
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, MessageSquare, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FileCardProps {
  file: {
    id: string;
    title: string;
    description: string;
    file_url: string;
    category: string;
    created_at: string;
    file_type: string;
  };
}

const FileManagementCard = ({ file }: FileCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      window.open(file.file_url, '_blank');
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Determinando o ícone e cor com base na categoria
  const getFileIconAndColor = () => {
    // Converte para minúsculas para comparação
    const category = file.category?.toLowerCase() || '';
    const fileType = file.file_type?.toLowerCase() || '';
    
    // CRMs - tons de azul
    if (category.includes('crm')) {
      return { 
        icon: <FileText className="h-10 w-10" />,
        color: "from-blue-600/20 to-blue-700/30",
        borderColor: "border-blue-600/30"
      };
    } 
    // Manuais - tons de verde
    else if (category.includes('manual') || category.includes('documento') || fileType.includes('pdf')) {
      return { 
        icon: <FileText className="h-10 w-10" />,
        color: "from-green-600/20 to-green-700/30", 
        borderColor: "border-green-600/30"
      };
    } 
    // Suporte - tons de roxo
    else if (category.includes('suporte') || category.includes('ajuda')) {
      return { 
        icon: <MessageSquare className="h-10 w-10" />,
        color: "from-purple-600/20 to-purple-700/30",
        borderColor: "border-purple-600/30" 
      };
    } 
    // Tutoriais - tons de amarelo
    else if (category.includes('tutorial')) {
      return { 
        icon: <Ticket className="h-10 w-10" />,
        color: "from-yellow-600/20 to-yellow-700/30",
        borderColor: "border-yellow-600/30" 
      };
    } 
    // Marketing - tons de laranja
    else if (category.includes('marketing')) {
      return { 
        icon: <FileText className="h-10 w-10" />,
        color: "from-orange-600/20 to-orange-700/30",
        borderColor: "border-orange-600/30" 
      };
    }
    // Padrão - cor da marca
    else {
      return { 
        icon: <FileText className="h-10 w-10" />,
        color: "from-ramel/20 to-ramel-dark/30",
        borderColor: "border-ramel/30" 
      };
    }
  };
  
  const { icon, color, borderColor } = getFileIconAndColor();
  
  return (
    <Card className={`overflow-hidden border ${borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className={`h-3 bg-gradient-to-r ${color}`}></div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{file.title}</CardTitle>
            <CardDescription>
              {file.category} • {new Date(file.created_at).toLocaleDateString('pt-BR')}
            </CardDescription>
          </div>
          
          <div className={`p-3 rounded-full bg-gradient-to-br ${color}`}>
            {icon}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground line-clamp-2">
          {file.description}
        </p>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full flex gap-2"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download className="h-4 w-4" />
          {isDownloading ? "Baixando..." : "Baixar Arquivo"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileManagementCard;
