
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MemberHeader from "@/components/MemberHeader";
import { Loader2, ArrowLeft, Plus, Video, X, Trash2, RefreshCw } from "lucide-react";

interface VideoLesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  category_id: string;
  created_at: string;
  categories?: {
    name: string;
  };
  thumbnail_url?: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

const VideoManagement = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDesc, setNewVideoDesc] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoCategory, setNewVideoCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      
      if (!isAdmin) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive",
        });
        navigate("/membro");
        return;
      }
      
      fetchData();
    }
  }, [user, loading, isAdmin, navigate]);
  
  const fetchData = async () => {
    setLoadingData(true);
    try {
      // Fetch videos
      const { data: videosData, error: videosError } = await supabase
        .from('video_lessons')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });
        
      if (videosError) throw videosError;
      
      const videosWithThumbnails = videosData ? await Promise.all(
        videosData.map(async (video) => {
          const thumbnailUrl = await getVideoThumbnail(video.video_url);
          return {
            ...video,
            thumbnail_url: thumbnailUrl
          };
        })
      ) : [];
      
      setVideos(videosWithThumbnails as VideoLesson[]);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (categoriesError) throw categoriesError;
      setCategories(categoriesData as Category[]);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os vídeos.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  };

  const getVideoThumbnail = (url: string): string => {
    try {
      // YouTube
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = extractYouTubeID(url);
        if (videoId) {
          return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
      
      // Vimeo
      if (url.includes('vimeo.com')) {
        // Note: Vimeo requires an API call to get the thumbnail,
        // which is not feasible on the client-side due to CORS
        // Using a placeholder for now
        return 'https://i.vimeocdn.com/filter/overlay?src=https://i.vimeocdn.com/video/default_1280x720.jpg';
      }
      
      // Default placeholder if no matching service
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
  
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newVideoTitle.trim() || !newVideoUrl.trim() || !newVideoCategory) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('video_lessons')
        .insert([
          {
            title: newVideoTitle,
            description: newVideoDesc || null,
            video_url: newVideoUrl,
            category_id: newVideoCategory
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Vídeo adicionado",
        description: "O vídeo foi adicionado com sucesso.",
      });
      
      resetForm();
      fetchData(); // Recarregar a lista após adicionar
      
    } catch (error: any) {
      console.error('Erro ao adicionar vídeo:', error);
      toast({
        title: "Erro ao adicionar vídeo",
        description: error.message || "Não foi possível adicionar o vídeo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Tem certeza que deseja excluir este vídeo?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('video_lessons')
        .delete()
        .eq('id', videoId);
        
      if (error) throw error;
      
      setVideos(videos.filter(video => video.id !== videoId));
      
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi excluído com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao excluir vídeo:', error);
      toast({
        title: "Erro ao excluir vídeo",
        description: error.message || "Não foi possível excluir o vídeo.",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setNewVideoTitle("");
    setNewVideoDesc("");
    setNewVideoUrl("");
    setNewVideoCategory("");
    setShowAddForm(false);
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
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/membro/admin")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Gerenciar Vídeo Aulas</h1>
        </div>
        
        <div className="flex justify-between mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData} 
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? "Atualizando..." : "Atualizar Lista"}
          </Button>
          
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Vídeo
              </>
            )}
          </Button>
        </div>
        
        {showAddForm && (
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle>Adicionar Novo Vídeo</CardTitle>
              <CardDescription>Preencha os campos para adicionar um novo vídeo</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddVideo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Vídeo *</Label>
                  <Input 
                    id="title" 
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    placeholder="Ex: Tutorial de Instalação"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea 
                    id="description" 
                    value={newVideoDesc}
                    onChange={(e) => setNewVideoDesc(e.target.value)}
                    placeholder="Uma breve descrição do conteúdo do vídeo"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="video_url">URL do Vídeo *</Label>
                  <Input 
                    id="video_url" 
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Insira um link para o vídeo (YouTube, Vimeo, etc.)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <select
                    id="category"
                    value={newVideoCategory}
                    onChange={(e) => setNewVideoCategory(e.target.value)}
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {newVideoUrl && (
                  <div className="space-y-2">
                    <Label htmlFor="preview">Pré-visualização</Label>
                    <div className="border border-border rounded-md p-4 bg-background/40">
                      <p className="text-sm mb-2">Miniatura do vídeo:</p>
                      <div className="max-w-xs mx-auto">
                        <img 
                          src={getVideoThumbnail(newVideoUrl)} 
                          alt="Thumbnail Preview" 
                          className="w-full h-auto rounded-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adicionando...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Vídeos Disponíveis</CardTitle>
            <CardDescription>Gerencie os vídeos disponíveis para os membros</CardDescription>
          </CardHeader>
          <CardContent>
            {videos.length === 0 ? (
              <div className="text-center py-8">
                <Video className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">Nenhum vídeo adicionado ainda.</p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Vídeo
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <Card key={video.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-video">
                      <img 
                        src={video.thumbnail_url || '/placeholder.svg'} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                      <a 
                        href={video.video_url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Video className="h-12 w-12 text-white" />
                      </a>
                    </div>
                    <CardContent className="py-4 flex-1 flex flex-col">
                      <h3 className="font-medium text-lg mb-1">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 flex-1">
                        {video.description || "Sem descrição"}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          {video.categories?.name || "Sem categoria"}
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VideoManagement;
