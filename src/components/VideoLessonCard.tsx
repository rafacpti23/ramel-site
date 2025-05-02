
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Play } from "lucide-react";

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    description: string | null;
    video_url: string;
    category_id: string;
    category: string;
    thumbnail_url?: string;
  };
}

const VideoLessonCard = ({ video }: VideoCardProps) => {
  // Determinando a cor com base na categoria
  const getVideoColor = () => {
    // Converte para minúsculas para comparação
    const category = video.category?.toLowerCase() || '';
    
    // CRMs - tons de azul
    if (category.includes('crm')) {
      return {
        gradientColor: "from-blue-600/20 to-blue-700/30",
        borderColor: "border-blue-600/30",
        overlayColor: "bg-blue-900/50"
      };
    } 
    // Tutoriais - tons de amarelo/âmbar
    else if (category.includes('tutorial')) {
      return {
        gradientColor: "from-amber-600/20 to-amber-700/30",
        borderColor: "border-amber-600/30",
        overlayColor: "bg-amber-900/50"
      };
    }
    // Marketing - tons de roxo
    else if (category.includes('marketing')) {
      return {
        gradientColor: "from-purple-600/20 to-purple-700/30",
        borderColor: "border-purple-600/30",
        overlayColor: "bg-purple-900/50"
      };
    }
    // Treinamentos - tons de verde
    else if (category.includes('treinamento')) {
      return {
        gradientColor: "from-green-600/20 to-green-700/30",
        borderColor: "border-green-600/30",
        overlayColor: "bg-green-900/50"
      };
    }
    // Webinars - tons de laranja
    else if (category.includes('webinar')) {
      return {
        gradientColor: "from-orange-600/20 to-orange-700/30",
        borderColor: "border-orange-600/30",
        overlayColor: "bg-orange-900/50"
      };
    }
    // Padrão - cor da marca Ramel
    else {
      return {
        gradientColor: "from-ramel/20 to-ramel-dark/30",
        borderColor: "border-ramel/30",
        overlayColor: "bg-ramel/50"
      };
    }
  };
  
  const { gradientColor, borderColor, overlayColor } = getVideoColor();
  
  return (
    <Card className={`overflow-hidden border ${borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className={`h-3 bg-gradient-to-r ${gradientColor}`}></div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{video.title}</CardTitle>
        <CardDescription>{video.category}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <a 
          href={video.video_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={video.thumbnail_url || '/placeholder.svg'} 
              alt={video.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            <div className={`absolute inset-0 ${overlayColor} opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
              <Play className="text-white h-16 w-16 opacity-90" />
              <ExternalLink className="absolute top-4 right-4 text-white h-6 w-6" />
            </div>
          </div>
          
          {video.description && (
            <div className="p-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {video.description}
              </p>
            </div>
          )}
        </a>
      </CardContent>
    </Card>
  );
};

export default VideoLessonCard;
