
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, MessageSquare, Ticket, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FileCardProps {
  file: {
    id: string;
    title: string;
    description: string;
    file_url: string;
    category: string;
    category_image?: string | null;
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

  const handleCardClick = () => {
    // Navegar para detalhes do arquivo ou página de suporte
    navigate('/membro/suporte');
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
        borderColor: "border-blue-600/30",
        glowColor: "shadow-blue-500/25"
      };
    } 
    // Manuais - tons de verde
    else if (category.includes('manual') || category.includes('documento') || fileType.includes('pdf')) {
      return { 
        icon: <FileText className="h-10 w-10" />,
        color: "from-green-600/20 to-green-700/30", 
        borderColor: "border-green-600/30",
        glowColor: "shadow-green-500/25"
      };
    } 
    // Suporte - tons de roxo
    else if (category.includes('suporte') || category.includes('ajuda')) {
      return { 
        icon: <MessageSquare className="h-10 w-10" />,
        color: "from-purple-600/20 to-purple-700/30",
        borderColor: "border-purple-600/30",
        glowColor: "shadow-purple-500/25"
      };
    } 
    // Tutoriais - tons de amarelo
    else if (category.includes('tutorial')) {
      return { 
        icon: <Ticket className="h-10 w-10" />,
        color: "from-yellow-600/20 to-yellow-700/30",
        borderColor: "border-yellow-600/30",
        glowColor: "shadow-yellow-500/25"
      };
    } 
    // Marketing - tons de laranja
    else if (category.includes('marketing')) {
      return { 
        icon: <FileText className="h-10 w-10" />,
        color: "from-orange-600/20 to-orange-700/30",
        borderColor: "border-orange-600/30",
        glowColor: "shadow-orange-500/25"
      };
    }
    // Padrão - cor da marca
    else {
      return { 
        icon: <FileText className="h-10 w-10" />,
        color: "from-ramel/20 to-ramel-dark/30",
        borderColor: "border-ramel/30",
        glowColor: "shadow-ramel/25"
      };
    }
  };
  
  const { icon, color, borderColor, glowColor } = getFileIconAndColor();
  
  return (
    <Card className={`overflow-hidden border ${borderColor} shadow-lg hover:shadow-xl hover:${glowColor} hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer group`}
          onClick={handleCardClick}>
      <div className={`h-3 bg-gradient-to-r ${color} group-hover:animate-pulse`}></div>
      
      <CardHeader className="pb-2 relative">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-ramel transition-colors duration-300">{file.title}</CardTitle>
            <CardDescription className="group-hover:text-muted-foreground/80 transition-colors duration-300">
              {file.category} • {new Date(file.created_at).toLocaleDateString('pt-BR')}
            </CardDescription>
          </div>
          
          {file.category_image ? (
            <img 
              src={file.category_image}
              alt={file.category}
              className="h-12 w-12 rounded-full object-cover transition-transform duration-300 group-hover:rotate-12"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // Mostrar o ícone alternativo quando a imagem falhar
                const iconContainer = document.createElement('div');
                iconContainer.className = `p-3 rounded-full bg-gradient-to-br ${color}`;
                target.parentNode?.appendChild(iconContainer);
              }}
            />
          ) : (
            <div className={`p-3 rounded-full bg-gradient-to-br ${color} transition-transform duration-300 group-hover:rotate-12`}>
              {icon}
            </div>
          )}
        </div>
        
        {/* Ícone de link externo que aparece no hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink className="h-4 w-4 text-ramel" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
          {file.description}
        </p>
      </CardContent>
      
      <CardFooter className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full flex gap-2 group-hover:bg-ramel group-hover:text-white group-hover:border-ramel transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
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
