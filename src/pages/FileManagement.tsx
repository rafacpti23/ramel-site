
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
import { Loader2, ArrowLeft, Plus, FileText, X, Trash2, Image } from "lucide-react";
import Footer from "@/components/Footer";

interface SupportFile {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  category_id: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url?: string | null;
}

const FileManagement = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  const [files, setFiles] = useState<SupportFile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [newFileTitle, setNewFileTitle] = useState("");
  const [newFileDesc, setNewFileDesc] = useState("");
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newFileCategory, setNewFileCategory] = useState("");
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
      // Fetch files
      const { data: filesData, error: filesError } = await supabase
        .from('support_files')
        .select('*, categories(name, image_url)')
        .order('created_at', { ascending: false });
        
      if (filesError) throw filesError;
      setFiles(filesData as SupportFile[]);
      
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
        description: "Não foi possível carregar os arquivos.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };
  
  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFileTitle.trim() || !newFileUrl.trim() || !newFileCategory) {
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
        .from('support_files')
        .insert([
          {
            title: newFileTitle,
            description: newFileDesc || null,
            file_url: newFileUrl,
            category_id: newFileCategory
          }
        ])
        .select();
        
      if (error) throw error;
      
      setFiles([...(data as SupportFile[]), ...files]);
      resetForm();
      
      toast({
        title: "Arquivo adicionado",
        description: "O arquivo foi adicionado com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao adicionar arquivo:', error);
      toast({
        title: "Erro ao adicionar arquivo",
        description: error.message || "Não foi possível adicionar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Tem certeza que deseja excluir este arquivo?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('support_files')
        .delete()
        .eq('id', fileId);
        
      if (error) throw error;
      
      setFiles(files.filter(file => file.id !== fileId));
      
      toast({
        title: "Arquivo excluído",
        description: "O arquivo foi excluído com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao excluir arquivo:', error);
      toast({
        title: "Erro ao excluir arquivo",
        description: error.message || "Não foi possível excluir o arquivo.",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setNewFileTitle("");
    setNewFileDesc("");
    setNewFileUrl("");
    setNewFileCategory("");
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
          <h1 className="text-3xl font-bold">Gerenciar Arquivos de Apoio</h1>
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
                Adicionar Arquivo
              </>
            )}
          </Button>
        </div>
        
        {showAddForm && (
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle>Adicionar Novo Arquivo</CardTitle>
              <CardDescription>Preencha os campos para adicionar um novo arquivo</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Arquivo *</Label>
                  <Input 
                    id="title" 
                    value={newFileTitle}
                    onChange={(e) => setNewFileTitle(e.target.value)}
                    placeholder="Ex: Manual de Instalação"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea 
                    id="description" 
                    value={newFileDesc}
                    onChange={(e) => setNewFileDesc(e.target.value)}
                    placeholder="Uma breve descrição do conteúdo do arquivo"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file_url">URL do Arquivo *</Label>
                  <Input 
                    id="file_url" 
                    value={newFileUrl}
                    onChange={(e) => setNewFileUrl(e.target.value)}
                    placeholder="https://exemplo.com/arquivo.pdf"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Insira um link para o arquivo hospedado (Google Drive, Dropbox, etc.)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <select
                    id="category"
                    value={newFileCategory}
                    onChange={(e) => setNewFileCategory(e.target.value)}
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
            <CardTitle>Arquivos Disponíveis</CardTitle>
            <CardDescription>Gerencie os arquivos de apoio para os membros</CardDescription>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">Nenhum arquivo adicionado ainda.</p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Arquivo
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4">Título</th>
                      <th className="text-left py-3 px-4">Categoria</th>
                      <th className="text-left py-3 px-4">Imagem da Categoria</th>
                      <th className="text-left py-3 px-4">Data de Adição</th>
                      <th className="text-left py-3 px-4">URL</th>
                      <th className="text-right py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{file.title}</p>
                            {file.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {file.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {(file as any).categories?.name || "Sem categoria"}
                        </td>
                        <td className="py-3 px-4">
                          {(file as any).categories?.image_url ? (
                            <img 
                              src={(file as any).categories.image_url} 
                              alt={(file as any).categories.name}
                              className="h-16 w-auto object-cover rounded-md"
                            />
                          ) : (
                            <span className="text-muted-foreground text-sm">Sem imagem</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(file.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          <a 
                            href={file.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-ramel hover:underline truncate max-w-xs inline-block"
                          >
                            {file.file_url}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteFile(file.id)}
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
      
      <Footer />
    </div>
  );
};

export default FileManagement;
