
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
import { Loader2, ArrowLeft, Plus, Video, X, Trash2 } from "lucide-react";

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
      setVideos(videosData as VideoLesson[]);
      
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
    }
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
      const { error } = await supabase
        .from('video_lessons')
        .insert([
          {
            title: newVideoTitle,
            description: newVideoDesc || null,
            video_url: newVideoUrl,
            category_id: newVideoCategory
          }
        ]);
        
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
        
        <div className="flex justify-end mb-6">
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
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4">Título</th>
                      <th className="text-left py-3 px-4">Categoria</th>
                      <th className="text-left py-3 px-4">Data de Adição</th>
                      <th className="text-left py-3 px-4">URL</th>
                      <th className="text-right py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video) => (
                      <tr key={video.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{video.title}</p>
                            {video.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {video.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {video.categories?.name || "Sem categoria"}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(video.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          <a 
                            href={video.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-ramel hover:underline truncate max-w-xs inline-block"
                          >
                            {video.video_url}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VideoManagement;
