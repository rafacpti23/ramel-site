import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const YouTubeChannelPreview = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // IDs dos vídeos mais recentes do canal
  const videoIds = [
    "wDSYj8r36I0",
    "OhGE5zNgLXo",
    "5R6JgV7HBH0",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoIds.length);
    }, 10000); // Troca a cada 10 segundos

    return () => clearInterval(interval);
  }, [videoIds.length]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Youtube className="h-6 w-6 text-red-500" />
          Nosso Canal no YouTube
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/watch?v=m0dOvJ62Gs4&list=PLDai3Q4XfkKoDnjSF683sPS57ogG5N6BF&index=2`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Confira nossos tutoriais e conteúdos exclusivos
        </p>
        <Button asChild variant="outline" className="w-full">
          <a 
            href="https://www.youtube.com/@Meltechplus/featured" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Ver Canal Completo
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default YouTubeChannelPreview;
