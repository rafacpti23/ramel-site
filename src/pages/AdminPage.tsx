
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MemberHeader from "@/components/MemberHeader";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import UserManagement from "@/components/admin/UserManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import ContentManagement from "@/components/admin/ContentManagement";
import AdminTicketsList from "@/components/admin/AdminTicketsList";
import SystemConfigLink from "@/components/admin/SystemConfigLink";
import CameraManagement from "@/components/admin/CameraManagement";
import { UserProfile } from "@/context/AuthTypes";

const AdminPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
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
      setCategories(categoriesData);
      
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
            <TabsTrigger value="cameras">Câmeras</TabsTrigger>
            <TabsTrigger value="configs">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>
          
          <TabsContent value="tickets">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <AdminTicketsList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cameras">
            <CameraManagement />
          </TabsContent>
          
          <TabsContent value="configs">
            <SystemConfigLink />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
