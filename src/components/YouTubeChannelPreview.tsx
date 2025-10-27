import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const YouTubeChannelPreview = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // IDs dos vídeos mais recentes do canal
  const videoIds = ["wDSYj8r36I0", "OhGE5zNgLXo", "5R6JgV7HBH0"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex(
        (prevIndex) => (prevIndex + 1) % videoIds.length
      );
    }, 10000); // Troca a cada 10 segundos

    return () => clearInterval(interval);
  }, [videoIds.length]);

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden h-auto max-w-3xl mx-auto">
      {/* Vídeo */}
      <div className="md:w-2/3 w-full aspect-video md:aspect-auto">
        <iframe
          width="100%"
          height="100%"
          src={`https://youtube.com/live/JR3SiGmj7yE?autoplay=0&mute=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Conteúdo */}
      <CardContent className="md:w-1/3 w-full flex flex-col justify-between p-4">
        <div>
          <CardHeader className="p-0 mb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Youtube className="h-5 w-5 text-red-500" />
              Nosso Canal no YouTube
            </CardTitle>
          </CardHeader>

          <p className="text-sm text-muted-foreground">
            Confira nossos tutoriais e conteúdos exclusivos.
          </p>
        </div>

        <Button asChild variant="outline" className="w-full mt-3">
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
