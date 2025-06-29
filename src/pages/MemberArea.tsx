
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Ticket, Calendar, Users } from "lucide-react";
import MemberHeader from "@/components/MemberHeader";
import Footer from "@/components/Footer";
import FileManagementCard from "@/components/FileManagementCard";
import VideoLessonCard from "@/components/VideoLessonCard";
import YouTubeChannelPreview from "@/components/YouTubeChannelPreview";
import { toast } from "@/hooks/use-toast";

interface SupportFile {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  category_id: string;
  created_at: string;
  file_type: string;
  category: string;
  category_image?: string | null;
  categories?: {
    name: string;
    image_url: string | null;
  };
}

interface VideoLesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  category_id: string;
  category: string;
  thumbnail_url?: string;
  categories?: {
    name: string;
  };
}

const MemberArea = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<SupportFile[]>([]);
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      fetchContent();
    }
  }, [user, loading, navigate]);

  const fetchContent = async () => {
    setLoadingContent(true);
    try {
      // Buscar arquivos
      const { data: filesData, error: filesError } = await supabase
        .from('support_files')
        .select(`
          *,
          categories(name, image_url)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (filesError) throw filesError;

      // Buscar vídeos
      const { data: videosData, error: videosError } = await supabase
        .from('video_lessons')
        .select(`
          *,
          categories(name)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (videosError) throw videosError;

      // Formatar arquivos
      const formattedFiles: SupportFile[] = filesData?.map((file: any) => ({
        ...file,
        category: file.categories?.name || "Sem categoria",
        category_image: file.categories?.image_url,
        file_type: file.file_url?.split('.').pop() || "unknown"
      })) || [];

      // Formatar vídeos
      const formattedVideos: VideoLesson[] = videosData?.map((video: any) => ({
        ...video,
        category: video.categories?.name || "Sem categoria"
      })) || [];

      setFiles(formattedFiles);
      setVideos(formattedVideos);

    } catch (error: any) {
      console.error('Erro ao carregar conteúdo:', error);
      toast({
        title: "Erro ao carregar conteúdo",
        description: "Não foi possível carregar os arquivos e vídeos.",
        variant: "destructive",
      });
    } finally {
      setLoadingContent(false);
    }
  };

  if (loading || loadingContent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-ramel border-opacity-50 border-t-ramel rounded-full"></div>
        <p className="mt-4">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      
      <main className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Área do Membro</h1>
          <p className="text-xl text-muted-foreground">
            Bem-vindo! Acesse todos os recursos disponíveis para você.
          </p>
        </div>

        {/* Cards de Navegação Rápida */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate("/membro/suporte")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-ramel/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-ramel/30 transition-colors">
                <Ticket className="h-6 w-6 text-ramel" />
              </div>
              <CardTitle className="group-hover:text-ramel transition-colors">Suporte</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Abra tickets e receba ajuda especializada
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate("/agendamento")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-500/30 transition-colors">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle className="group-hover:text-blue-500 transition-colors">Agendamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Agende reuniões e consultas
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate("/membro/admin/crm")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-500/30 transition-colors">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle className="group-hover:text-green-500 transition-colors">CRM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Gerencie seus clientes e vendas
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate("/produtos/whatspro")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-purple-500/30 transition-colors">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle className="group-hover:text-purple-500 transition-colors">WhatsPro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Automação para WhatsApp
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Preview do Canal YouTube */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Nosso Canal</h2>
          <div className="max-w-md mx-auto">
            <YouTubeChannelPreview />
          </div>
        </div>

        {/* Arquivos de Apoio */}
        {files.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Arquivos de Apoio</h2>
              <Button variant="outline" onClick={() => navigate("/membro/arquivos")}>
                Ver Todos
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <FileManagementCard key={file.id} file={file} />
              ))}
            </div>
          </div>
        )}

        {/* Vídeo Aulas */}
        {videos.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Vídeo Aulas</h2>
              <Button variant="outline" onClick={() => navigate("/membro/admin/videos")}>
                Ver Todos
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoLessonCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MemberArea;
