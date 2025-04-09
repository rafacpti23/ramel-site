
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import MemberHeader from "@/components/MemberHeader";
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
}

interface VideoLesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  category_id: string;
}

const MemberArea = () => {
  const { user, isPaid, loading } = useAuth();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [supportFiles, setSupportFiles] = useState<SupportFile[]>([]);
  const [videoLessons, setVideoLessons] = useState<VideoLesson[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (!loading && user && !isPaid) {
      navigate("/membro/aguardando");
      return;
    }
    
    // Carregar dados quando o usuário estiver autenticado e for pagante
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
      
      // Buscar arquivos
      const { data: filesData, error: filesError } = await supabase
        .from('support_files')
        .select('*');
        
      if (filesError) throw filesError;
      setSupportFiles(filesData || []);
      
      // Buscar vídeos
      const { data: videosData, error: videosError } = await supabase
        .from('video_lessons')
        .select('*');
        
      if (videosError) throw videosError;
      setVideoLessons(videosData || []);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoadingData(false);
    }
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
                          <ul className="space-y-3">
                            {categoryFiles.map((file) => (
                              <li key={file.id}>
                                <a 
                                  href={file.file_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex flex-col p-3 rounded-md border border-white/10 hover:bg-white/5 transition-colors"
                                >
                                  <span className="font-medium">{file.title}</span>
                                  {file.description && (
                                    <span className="text-sm text-muted-foreground mt-1">
                                      {file.description}
                                    </span>
                                  )}
                                </a>
                              </li>
                            ))}
                          </ul>
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
                          <ul className="space-y-3">
                            {categoryVideos.map((video) => (
                              <li key={video.id}>
                                <a 
                                  href={video.video_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex flex-col p-3 rounded-md border border-white/10 hover:bg-white/5 transition-colors"
                                >
                                  <span className="font-medium">{video.title}</span>
                                  {video.description && (
                                    <span className="text-sm text-muted-foreground mt-1">
                                      {video.description}
                                    </span>
                                  )}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="suporte">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MemberArea;
