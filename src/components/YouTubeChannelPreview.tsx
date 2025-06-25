
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, ExternalLink, Play } from "lucide-react";

const YouTubeChannelPreview = () => {
  const channelUrl = "https://www.youtube.com/@Meltechplus/videos?view=0&sort=dd&shelf_id=2";
  
  const handleOpenChannel = () => {
    window.open(channelUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="overflow-hidden border border-red-600/30 shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group cursor-pointer"
          onClick={handleOpenChannel}>
      <div className="h-3 bg-gradient-to-r from-red-600/20 to-red-700/30 group-hover:animate-pulse"></div>
      
      <CardHeader className="pb-2 relative">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-red-600/20 to-red-700/30 transition-transform duration-300 group-hover:rotate-12">
            <Youtube className="h-10 w-10 text-red-500" />
          </div>
          
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-red-500 transition-colors duration-300 flex items-center gap-2">
              Canal Meltech Plus
              <Play className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </CardTitle>
            <CardDescription className="group-hover:text-muted-foreground/80 transition-colors duration-300">
              Vídeos e tutoriais sobre tecnologia
            </CardDescription>
          </div>
        </div>
        
        {/* Ícone de link externo que aparece no hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink className="h-4 w-4 text-red-500" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 mb-4">
          Acesse nosso canal no YouTube para ver os últimos vídeos, tutoriais e conteúdos sobre tecnologia e automação.
        </p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Conteúdo sempre atualizado</span>
        </div>
      </CardContent>
      
      <div className="px-6 pb-6">
        <Button 
          variant="outline" 
          className="w-full flex gap-2 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenChannel();
          }}
        >
          <Youtube className="h-4 w-4" />
          Visitar Canal
        </Button>
      </div>
    </Card>
  );
};

export default YouTubeChannelPreview;
