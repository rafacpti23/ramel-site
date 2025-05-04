
import { supabase } from "@/integrations/supabase/client";
import { TicketMessage } from "@/types/ticket";
import { toast } from "@/hooks/use-toast";

export const useTicketMutations = (
  setTickets: (updater: (prev: any[]) => any[]) => void,
  setIsLoading: (loading: boolean) => void
) => {
  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: newStatus })
        .eq("id", ticketId);
        
      if (error) throw error;
      
      // Atualizar o estado local
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
      
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const closeTicket = async (ticketId: string) => {
    await updateTicketStatus(ticketId, "fechado");
  };
  
  const deleteTicket = async (ticketId: string) => {
    try {
      // Primeiro excluir mensagens relacionadas
      const { error: msgError } = await supabase
        .from("ticket_responses")
        .delete()
        .eq("ticket_id", ticketId);
        
      if (msgError) throw msgError;
      
      // Depois excluir o ticket
      const { error } = await supabase
        .from("support_tickets")
        .delete()
        .eq("id", ticketId);
        
      if (error) throw error;
      
      // Atualizar o estado local
      setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
      
      return true;
    } catch (error: any) {
      console.error("Erro ao excluir ticket:", error);
      toast({
        title: "Erro ao excluir ticket",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };
  
  const createTicket = async (title: string, description: string) => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error("Usuário não autenticado");
      }
      
      const { data, error } = await supabase
        .from("support_tickets")
        .insert([
          {
            title,
            description,
            user_id: userData.user.id,
            status: "aberto",
          },
        ])
        .select();
        
      if (error) throw error;
      
      // Adicionar o novo ticket ao estado local
      if (data && data.length > 0) {
        setTickets((prev) => [data[0], ...prev]);
        return { success: true, ticket: data[0] };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao criar ticket:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  const addMessage = async (ticketId: string, content: string, isAdmin = false) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error("Usuário não autenticado");
      }
      
      const { data, error } = await supabase
        .from("ticket_responses")
        .insert([
          {
            ticket_id: ticketId,
            user_id: userData.user.id,
            content,
            is_admin: isAdmin
          },
        ])
        .select();
        
      if (error) throw error;
      
      return data?.[0] as TicketMessage;
    } catch (error: any) {
      console.error("Erro ao adicionar mensagem:", error);
      throw error;
    }
  };

  return {
    updateTicketStatus,
    closeTicket,
    deleteTicket,
    createTicket,
    addMessage
  };
};
