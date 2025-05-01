
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExtendedUserProfile } from "@/types/user";

export const useUserManagement = () => {
  const [users, setUsers] = useState<ExtendedUserProfile[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ExtendedUserProfile | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserPaymentStatus, setEditUserPaymentStatus] = useState("pendente");
  const [editUserWhatsapp, setEditUserWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);

  const countTotalUsers = async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      setTotalUsers(count || 0);
    } catch (error) {
      console.error('Erro ao contar usuários:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setUsers(data as ExtendedUserProfile[] || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const deleteUser = async (userId: string) => {
    try {
      // Primeiro remover dados relacionados ao usuário
      
      // Remover tickets e respostas de tickets
      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('user_id', userId);
        
      if (tickets && tickets.length > 0) {
        const ticketIds = tickets.map(ticket => ticket.id);
        
        // Excluir respostas de tickets
        await supabase
          .from('ticket_responses')
          .delete()
          .in('ticket_id', ticketIds);
          
        // Excluir tickets
        await supabase
          .from('support_tickets')
          .delete()
          .eq('user_id', userId);
      }
      
      // Remover assinantes
      await supabase
        .from('subscribers')
        .delete()
        .eq('user_id', userId);
        
      // Remover perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (profileError) throw profileError;
      
      // Remover usuário da autenticação
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        throw authError;
      }
      
      // Atualizar estado local
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso do sistema.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      
      toast({
        title: "Erro ao excluir usuário",
        description: error.message || "Não foi possível excluir o usuário. Tente novamente.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const openEditUserDialog = (userProfile: ExtendedUserProfile) => {
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

  useEffect(() => {
    fetchUsers();
    countTotalUsers();
  }, []);

  const filteredUsers = searchTerm 
    ? users.filter(user => 
        (user.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  return {
    users: filteredUsers,
    loading,
    totalUsers,
    searchTerm,
    setSearchTerm,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingUser,
    editUserName,
    editUserEmail,
    editUserPaymentStatus,
    editUserWhatsapp,
    setEditUserName,
    setEditUserEmail,
    setEditUserPaymentStatus,
    setEditUserWhatsapp,
    fetchUsers,
    approvePayment,
    toggleAdminStatus,
    openEditUserDialog,
    handleSaveUserEdit,
    deleteUser,
  };
};
