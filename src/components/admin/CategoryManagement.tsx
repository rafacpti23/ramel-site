
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, Image, Loader2, Edit, Check } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryImageUrl, setNewCategoryImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Estados para edição
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setCategories(data as Category[]);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: error.message || "Não foi possível carregar as categorias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da categoria é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([
          { 
            name: newCategoryName,
            description: newCategoryDescription || null,
            image_url: newCategoryImageUrl || null
          }
        ])
        .select();
        
      if (error) throw error;
      
      const updatedCategories = [...categories];
      updatedCategories.unshift(...(data as Category[]));
      setCategories(updatedCategories);
      resetForm();
      
      toast({
        title: "Categoria adicionada",
        description: "A categoria foi adicionada com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao adicionar categoria:', error);
      toast({
        title: "Erro ao adicionar categoria",
        description: error.message || "Não foi possível adicionar a categoria.",
        variant: "destructive",
      });
    }
  };
  
  const handleStartEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || "");
    setEditImageUrl(category.image_url || "");
  };
  
  const handleCancelEdit = () => {
    setEditingCategoryId(null);
  };
  
  const handleUpdateCategory = async (categoryId: string) => {
    if (!editName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da categoria é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editName,
          description: editDescription || null,
          image_url: editImageUrl || null
        })
        .eq('id', categoryId);
        
      if (error) throw error;
      
      // Atualizar a lista local
      const updatedCategories = categories.map(cat => 
        cat.id === categoryId ? {
          ...cat,
          name: editName,
          description: editDescription || null,
          image_url: editImageUrl || null
        } : cat
      );
      
      setCategories(updatedCategories);
      setEditingCategoryId(null);
      
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar categoria:', error);
      toast({
        title: "Erro ao atualizar categoria",
        description: error.message || "Não foi possível atualizar a categoria.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria? Isso excluirá também todos os arquivos e vídeos relacionados.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
        
      if (error) throw error;
      
      setCategories(categories.filter(cat => cat.id !== categoryId));
      
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error);
      toast({
        title: "Erro ao excluir categoria",
        description: error.message || "Não foi possível excluir a categoria.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewCategoryName("");
    setNewCategoryDescription("");
    setNewCategoryImageUrl("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="glass-card h-full">
          <CardHeader>
            <CardTitle>Nova Categoria</CardTitle>
            <CardDescription>Adicione uma nova categoria de conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Palestras, Tutoriais, etc" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input 
                  id="description" 
                  placeholder="Breve descrição da categoria" 
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">URL da Imagem (opcional)</Label>
                <Input 
                  id="image_url" 
                  placeholder="https://exemplo.com/imagem.jpg" 
                  value={newCategoryImageUrl}
                  onChange={(e) => setNewCategoryImageUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Forneça um link para uma imagem de banner/thumbnail para esta categoria
                </p>
              </div>
              
              <Button type="submit" className="w-full">
                Adicionar Categoria
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Categorias Existentes</CardTitle>
            <CardDescription>Gerencie as categorias de conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-ramel" />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma categoria cadastrada.
              </p>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex flex-col p-4 border border-white/10 rounded-md">
                    {editingCategoryId === category.id ? (
                      // Modo de edição
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`edit-name-${category.id}`}>Nome</Label>
                          <Input 
                            id={`edit-name-${category.id}`}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`edit-desc-${category.id}`}>Descrição</Label>
                          <Input 
                            id={`edit-desc-${category.id}`}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`edit-img-${category.id}`}>URL da Imagem</Label>
                          <Input 
                            id={`edit-img-${category.id}`}
                            value={editImageUrl}
                            onChange={(e) => setEditImageUrl(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        {editImageUrl && (
                          <div>
                            <p className="text-sm font-medium mb-2">Pré-visualização</p>
                            <img 
                              src={editImageUrl}
                              alt="Pré-visualização"
                              className="h-24 w-auto object-cover rounded-md"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://placehold.co/400x300?text=Imagem+Inválida";
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex gap-2 justify-end mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleUpdateCategory(category.id)}
                          >
                            <Check className="h-4 w-4 mr-1" /> Salvar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Modo de visualização
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <h3 className="font-medium">{category.name}</h3>
                            {category.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {category.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStartEdit(category)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </div>
                        
                        {category.image_url && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2 flex items-center gap-1">
                              <Image className="h-4 w-4" /> Imagem
                            </p>
                            <img 
                              src={category.image_url} 
                              alt={category.name} 
                              className="h-24 w-auto object-cover rounded-md"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://placehold.co/400x300?text=Imagem+Indisponível";
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryManagement;
