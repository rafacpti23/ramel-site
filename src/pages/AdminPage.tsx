import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MemberHeader from "@/components/MemberHeader";
import { Loader2, UserCheck, X, CheckCheck, Edit, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  payment_status: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

const AdminPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserPaymentStatus, setEditUserPaymentStatus] = useState("pendente");
  const [editUserWhatsapp, setEditUserWhatsapp] = useState("");
  
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
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (usersError) throw usersError;
      setUsers(usersData as UserProfile[]);
      
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
        description: "Não foi possível carregar os dados administrativos.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };
  
  const approvePayment = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ payment_status: 'aprovado' })
        .eq('id', userId);
        
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, payment_status: 'aprovado' } : user
      ));
      
      toast({
        title: "Pagamento aprovado",
        description: "O acesso do usuário foi liberado com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao aprovar pagamento:', error);
      toast({
        title: "Erro ao aprovar pagamento",
        description: error.message || "Não foi possível aprovar o pagamento.",
        variant: "destructive",
      });
    }
  };
  
  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);
        
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: !currentStatus } : user
      ));
      
      toast({
        title: currentStatus ? "Permissão de admin removida" : "Permissão de admin concedida",
        description: `O usuário agora ${!currentStatus ? 'é' : 'não é mais'} um administrador.`,
      });
    } catch (error: any) {
      console.error('Erro ao alterar status de admin:', error);
      toast({
        title: "Erro ao alterar permissões",
        description: error.message || "Não foi possível alterar as permissões do usuário.",
        variant: "destructive",
      });
    }
  };
  
  const openEditUserDialog = (userProfile: UserProfile) => {
    setEditingUser(userProfile);
    setEditUserName(userProfile.full_name || "");
    setEditUserEmail(userProfile.email || "");
    setEditUserPaymentStatus(userProfile.payment_status);
    setEditUserWhatsapp(userProfile.whatsapp || "");
    setIsEditDialogOpen(true);
  };
  
  const handleSaveUserEdit = async () => {
    if (!editingUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: editUserName,
          email: editUserEmail,
          payment_status: editUserPaymentStatus,
          whatsapp: editUserWhatsapp || null
        })
        .eq('id', editingUser.id);
        
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              full_name: editUserName,
              email: editUserEmail,
              payment_status: editUserPaymentStatus,
              whatsapp: editUserWhatsapp || null
            } 
          : user
      ));
      
      toast({
        title: "Usuário atualizado",
        description: "Os dados do usuário foram atualizados com sucesso.",
      });
      
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message || "Não foi possível atualizar os dados do usuário.",
        variant: "destructive",
      });
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
            description: newCategoryDescription || null
          }
        ])
        .select();
        
      if (error) throw error;
      
      setCategories([...(data as Category[]), ...categories]);
      setNewCategoryName("");
      setNewCategoryDescription("");
      
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
        <h1 className="text-3xl font-bold mb-8">Administração</h1>
        
        <Tabs defaultValue="users">
          <TabsList className="mb-8">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="tickets">Tickets de Suporte</TabsTrigger>
            <TabsTrigger value="configs">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Gerenciar Usuários</CardTitle>
                <CardDescription>Aprovar pagamentos e gerenciar permissões</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4">Nome</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Data de Cadastro</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Admin</th>
                        <th className="text-right py-3 px-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4">{user.full_name || "Sem nome"}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.payment_status === 'aprovado' 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {user.payment_status === 'aprovado' ? 'Aprovado' : 'Pendente'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {user.is_admin ? 'Sim' : 'Não'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openEditUserDialog(user)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              
                              {user.payment_status !== 'aprovado' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => approvePayment(user.id)}
                                >
                                  <CheckCheck className="h-4 w-4 mr-1" />
                                  Aprovar
                                </Button>
                              )}
                              
                              <Button 
                                size="sm" 
                                variant={user.is_admin ? "destructive" : "outline"}
                                onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                              >
                                {user.is_admin ? (
                                  <>
                                    <X className="h-4 w-4 mr-1" />
                                    Remover Admin
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    Tornar Admin
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
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
                    {categories.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        Nenhuma categoria cadastrada.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center justify-between p-4 border border-white/10 rounded-md">
                            <div>
                              <h3 className="font-medium">{category.name}</h3>
                              {category.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {category.description}
                                </p>
                              )}
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Gerenciar Conteúdo</CardTitle>
                <CardDescription>Adicione e gerencie arquivos e vídeos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Arquivos de Apoio</h3>
                    <Button onClick={() => navigate("/membro/admin/arquivos")}>
                      Gerenciar Arquivos
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Vídeo Aulas</h3>
                    <Button onClick={() => navigate("/membro/admin/videos")}>
                      Gerenciar Vídeos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tickets">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Gerenciar Tickets de Suporte</CardTitle>
                <CardDescription>Visualize e responda todos os tickets de suporte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <AdminTicketsList />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configs">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>Configure webhooks, chat ao vivo e outras integrações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 text-center">
                  <p className="mb-4">
                    Acesse a página de configurações completa para gerenciar webhooks,
                    integrações e recursos avançados do sistema.
                  </p>
                  <Button onClick={() => navigate("/membro/admin/configuracoes")}>
                    Ir para Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nome
              </Label>
              <Input
                id="edit-name"
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                value={editUserEmail}
                onChange={(e) => setEditUserEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-whatsapp" className="text-right">
                WhatsApp
              </Label>
              <Input
                id="edit-whatsapp"
                value={editUserWhatsapp || ""}
                onChange={(e) => setEditUserWhatsapp(e.target.value)}
                placeholder="Ex: 11999887766"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <select
                id="edit-status"
                value={editUserPaymentStatus}
                onChange={(e) => setEditUserPaymentStatus(e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleSaveUserEdit}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AdminTicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data, error } = await supabase
          .from('support_tickets')
          .select('*, profiles(full_name, email)')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setTickets(data || []);
      } catch (error) {
        console.error('Erro ao carregar tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, []);
  
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);
        
      if (error) throw error;
      
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      
      toast({
        title: "Status atualizado",
        description: `O ticket foi marcado como ${newStatus}.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do ticket.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return <div className="text-center py-4"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>;
  }
  
  if (tickets.length === 0) {
    return <p className="text-center py-4">Nenhum ticket de suporte encontrado.</p>;
  }
  
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-white/10">
          <th className="text-left py-3 px-4">Título</th>
          <th className="text-left py-3 px-4">Usuário</th>
          <th className="text-left py-3 px-4">Data</th>
          <th className="text-left py-3 px-4">Status</th>
          <th className="text-right py-3 px-4">Ações</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket: any) => (
          <tr key={ticket.id} className="border-b border-white/5 hover:bg-white/5">
            <td className="py-3 px-4">{ticket.title}</td>
            <td className="py-3 px-4">
              {ticket.profiles?.full_name || 'N/A'}
              <br />
              <span className="text-xs text-muted-foreground">{ticket.profiles?.email}</span>
            </td>
            <td className="py-3 px-4">{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</td>
            <td className="py-3 px-4">
              <span className={`px-2 py-1 rounded text-xs ${
                ticket.status === 'aberto' 
                  ? 'bg-blue-500/20 text-blue-300' 
                  : ticket.status === 'respondido'
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-gray-500/20 text-gray-300'
              }`}>
                {ticket.status === 'aberto' ? 'Aberto' : 
                 ticket.status === 'respondido' ? 'Respondido' : 'Fechado'}
              </span>
            </td>
            <td className="py-3 px-4 text-right">
              <div className="flex gap-2 justify-end">
                {ticket.status !== 'fechado' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateTicketStatus(ticket.id, 'fechado')}
                  >
                    Fechar
                  </Button>
                )}
                
                {ticket.status === 'fechado' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateTicketStatus(ticket.id, 'aberto')}
                  >
                    Reabrir
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/membro/suporte/${ticket.id}`)}
                >
                  Responder
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminPage;
