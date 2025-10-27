import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MemberHeader from "@/components/MemberHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Grid3x3, Grid2x2, LayoutGrid, Maximize2, ZoomIn, ZoomOut, Play, Pause } from "lucide-react";

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
  const [fullscreenCamera, setFullscreenCamera] = useState<Camera | null>(null);
  const [autoTransition, setAutoTransition] = useState(false);
  const [transitionInterval, setTransitionInterval] = useState(5);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

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

  useEffect(() => {
    if (autoTransition && cameras.length > 0) {
      const interval = setInterval(() => {
        setCurrentCameraIndex((prev) => (prev + 1) % cameras.length);
      }, transitionInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoTransition, cameras.length, transitionInterval]);

  useEffect(() => {
    if (autoTransition && cameras.length > 0) {
      setFullscreenCamera(cameras[currentCameraIndex]);
    }
  }, [currentCameraIndex, autoTransition, cameras]);

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

  if (fullscreenCamera) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="bg-background/95 backdrop-blur p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{fullscreenCamera.name}</h2>
            {fullscreenCamera.location && (
              <p className="text-sm text-muted-foreground">{fullscreenCamera.location}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ZoomOut className="h-4 w-4" />
              <Slider 
                value={[zoom]} 
                onValueChange={(value) => setZoom(value[0])}
                min={1} 
                max={3} 
                step={0.1} 
                className="w-32"
              />
              <ZoomIn className="h-4 w-4" />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setFullscreenCamera(null);
                setAutoTransition(false);
                setZoom(1);
              }}
            >
              Fechar
            </Button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <iframe
              src={fullscreenCamera.rtsp_url}
              className="rounded-lg shadow-2xl"
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                transform: `scale(${zoom})`,
                transition: 'transform 0.3s ease'
              }}
              title={fullscreenCamera.name}
              allow="camera; microphone"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">MonitorCam</h1>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch 
                id="auto-transition" 
                checked={autoTransition}
                onCheckedChange={(checked) => {
                  setAutoTransition(checked);
                  if (checked && cameras.length > 0) {
                    setFullscreenCamera(cameras[0]);
                    setCurrentCameraIndex(0);
                  }
                }}
              />
              <Label htmlFor="auto-transition" className="text-sm">
                Transição Automática
              </Label>
            </div>
            
            {autoTransition && (
              <div className="flex items-center gap-2">
                <Label className="text-sm">Intervalo (s):</Label>
                <Select 
                  value={transitionInterval.toString()} 
                  onValueChange={(value) => setTransitionInterval(Number(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3s</SelectItem>
                    <SelectItem value="5">5s</SelectItem>
                    <SelectItem value="10">10s</SelectItem>
                    <SelectItem value="15">15s</SelectItem>
                    <SelectItem value="30">30s</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Label className="text-sm">Layout:</Label>
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
        </div>

        <div className={`grid ${getGridClass()} gap-4`}>
          {cameras.map((camera) => (
            <Card key={camera.id} className="glass-card overflow-hidden group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-video bg-secondary/20 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
                  <iframe
                    src={camera.rtsp_url}
                    className="w-full h-full"
                    title={camera.name}
                    allow="camera; microphone"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setFullscreenCamera(camera);
                        setZoom(1);
                      }}
                      className="gap-2"
                    >
                      <Maximize2 className="h-4 w-4" />
                      Expandir
                    </Button>
                  </div>
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
