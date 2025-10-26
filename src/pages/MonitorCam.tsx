import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MemberHeader from "@/components/MemberHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Grid3x3, Grid2x2, LayoutGrid } from "lucide-react";

interface Camera {
  id: string;
  name: string;
  rtsp_url: string;
  description: string | null;
  location: string | null;
  is_active: boolean;
}

type GridLayout = "1x1" | "2x2" | "1x3" | "4x4" | "6x6";

const MonitorCam = () => {
  const { user, isPaid, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridLayout, setGridLayout] = useState<GridLayout>("2x2");

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      
      if (!isPaid) {
        toast({
          title: "Acesso negado",
          description: "Você precisa ter pagamento aprovado para acessar esta área.",
          variant: "destructive",
        });
        navigate("/membro");
        return;
      }
      
      fetchCameras();
    }
  }, [user, authLoading, isPaid, navigate]);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cameras")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      
      setCameras(data || []);
    } catch (error) {
      console.error("Erro ao carregar câmeras:", error);
      toast({
        title: "Erro ao carregar câmeras",
        description: "Não foi possível carregar suas câmeras de monitoramento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGridClass = () => {
    switch (gridLayout) {
      case "1x1":
        return "grid-cols-1";
      case "2x2":
        return "grid-cols-1 md:grid-cols-2";
      case "1x3":
        return "grid-cols-1 md:grid-cols-3";
      case "4x4":
        return "grid-cols-2 md:grid-cols-4";
      case "6x6":
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
      default:
        return "grid-cols-1 md:grid-cols-2";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Carregando câmeras...</p>
      </div>
    );
  }

  if (cameras.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <MemberHeader />
        <main className="container mx-auto px-4 py-10">
          <Card className="glass-card">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Nenhuma câmera disponível</h2>
              <p className="text-muted-foreground">
                Você ainda não tem câmeras de monitoramento atribuídas. Entre em contato com o administrador.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">MonitorCam</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Layout:</span>
            <Select value={gridLayout} onValueChange={(value) => setGridLayout(value as GridLayout)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1x1">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    <span>1x1</span>
                  </div>
                </SelectItem>
                <SelectItem value="2x2">
                  <div className="flex items-center gap-2">
                    <Grid2x2 className="h-4 w-4" />
                    <span>2x2</span>
                  </div>
                </SelectItem>
                <SelectItem value="1x3">
                  <div className="flex items-center gap-2">
                    <Grid3x3 className="h-4 w-4" />
                    <span>1x3</span>
                  </div>
                </SelectItem>
                <SelectItem value="4x4">4x4</SelectItem>
                <SelectItem value="6x6">6x6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className={`grid ${getGridClass()} gap-4`}>
          {cameras.map((camera) => (
            <Card key={camera.id} className="glass-card overflow-hidden">
              <CardContent className="p-4">
                <div className="aspect-video bg-secondary/20 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    src={camera.rtsp_url}
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<div class="text-center text-muted-foreground text-sm p-4">Câmera indisponível<br/>Configure conversão RTSP para HLS/WebRTC</div>';
                    }}
                  >
                    Seu navegador não suporta este formato de vídeo.
                  </video>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm truncate">{camera.name}</h3>
                  {camera.location && (
                    <p className="text-xs text-muted-foreground truncate">{camera.location}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MonitorCam;
