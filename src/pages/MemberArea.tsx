
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import MemberHeader from "@/components/MemberHeader";
import FileManagementCard from "@/components/FileManagementCard";
import VideoLessonCard from "@/components/VideoLessonCard";
import EnhancedTicketCard from "@/components/support/EnhancedTicketCard";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface SupportFile {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  category_id: string;
  category: string;
  created_at: string;
  file_type: string;
}

interface VideoLesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  category_id: string;
  category: string;
  thumbnail_url?: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  user_id: string;
}

const MemberArea = () => {
  const { user, isPaid, loading } = useAuth();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [supportFiles, setSupportFiles] = useState<SupportFile[]>([]);
  const [videoLessons, setVideoLessons] = useState<VideoLesson[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (!loading && user && !isPaid) {
      navigate("/aguardando-aprovacao");
      return;
    }
    
    if (!loading && user && isPaid) {
      fetchData();
    }
  }, [user, loading, isPaid, navigate]);
  
  const fetchData = async () => {
    setLoadingData(true);
    try {
      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);
      
      // Buscar arquivos com informações da categoria
      const { data: filesData, error: filesError } = await supabase
        .from('support_files')
        .select('*, categories(name)');
        
      if (filesError) throw filesError;
      
      // Transformar os dados para incluir o nome da categoria diretamente no objeto
      const formattedFiles = filesData?.map(file => ({
        ...file,
        category: (file.categories as any)?.name || 'Sem categoria',
        file_type: file.file_url.split('.').pop() || ''
      })) || [];
      
      setSupportFiles(formattedFiles);
      
      // Buscar vídeos com informações da categoria
      const { data: videosData, error: videosError } = await supabase
        .from('video_lessons')
        .select('*, categories(name)');
        
      if (videosError) throw videosError;
      
      // Processar vídeos e obter thumbnails
      const processedVideos = videosData ? await Promise.all(
        videosData.map(async (video) => {
          const thumbnailUrl = await getVideoThumbnail(video.video_url);
          return {
            ...video,
            category: (video.categories as any)?.name || 'Sem categoria',
            thumbnail_url: thumbnailUrl
          };
        })
      ) : [];
      
      setVideoLessons(processedVideos);
      
      // Buscar tickets do usuário
      if (user?.id) {
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (ticketsError) throw ticketsError;
        setTickets(ticketsData || []);
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoadingData(false);
    }
  };
  
  const getVideoThumbnail = (url: string): string => {
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = extractYouTubeID(url);
        if (videoId) {
          return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
      
      if (url.includes('vimeo.com')) {
        return 'https://i.vimeocdn.com/filter/overlay?src=https://i.vimeocdn.com/video/default_1280x720.jpg';
      }
      
      return '/placeholder.svg';
    } catch (error) {
      console.error("Error extracting video thumbnail:", error);
      return '/placeholder.svg';
    }
  };
  
  const extractYouTubeID = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };
  
  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ramel" />
        <p className="mt-4">Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Área de Membros</h1>
        
        <Tabs defaultValue="arquivos">
          <TabsList className="mb-8">
            <TabsTrigger value="arquivos">Arquivos de Apoio</TabsTrigger>
            <TabsTrigger value="videos">Vídeo Aulas</TabsTrigger>
            <TabsTrigger value="suporte">Suporte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="arquivos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground py-8">
                  Nenhuma categoria disponível no momento.
                </p>
              ) : (
                categories.map((category) => {
                  const categoryFiles = supportFiles.filter(file => file.category_id === category.id);
                  
                  return (
                    <Card key={category.id} className="glass-card h-full">
                      <CardHeader>
                        <CardTitle>{category.name}</CardTitle>
                        {category.description && (
                          <CardDescription>{category.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        {categoryFiles.length === 0 ? (
                          <p className="text-muted-foreground text-sm">
                            Nenhum arquivo disponível nesta categoria.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {categoryFiles.map((file) => (
                              <FileManagementCard key={file.id} file={file} />
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground py-8">
                  Nenhuma categoria disponível no momento.
                </p>
              ) : (
                categories.map((category) => {
                  const categoryVideos = videoLessons.filter(video => video.category_id === category.id);
                  
                  return (
                    <Card key={category.id} className="glass-card h-full">
                      <CardHeader>
                        <CardTitle>{category.name}</CardTitle>
                        {category.description && (
                          <CardDescription>{category.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        {categoryVideos.length === 0 ? (
                          <p className="text-muted-foreground text-sm">
                            Nenhum vídeo disponível nesta categoria.
                          </p>
                        ) : (
                          <div className="space-y-6">
                            {categoryVideos.map((video) => (
                              <VideoLessonCard key={video.id} video={video} />
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="suporte">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Suporte ao Membro</CardTitle>
                  <CardDescription>
                    Envie suas dúvidas ou solicite suporte técnico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6">
                    <p className="mb-4">
                      Para criar um novo ticket de suporte ou visualizar seus tickets anteriores, 
                      clique no botão abaixo.
                    </p>
                    <Button onClick={() => navigate("/membro/suporte")}>
                      Acessar Tickets de Suporte
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Tickets Recentes</h3>
                
                {tickets.length === 0 ? (
                  <p className="text-muted-foreground">
                    Você não possui tickets de suporte.
                  </p>
                ) : (
                  tickets.map((ticket) => (
                    <EnhancedTicketCard key={ticket.id} ticket={ticket} />
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MemberArea;
