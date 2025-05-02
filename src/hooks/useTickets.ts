
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "@/types/ticket";
import { toast } from "./use-toast";

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;
      
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setTickets(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar tickets:", error);
      toast({
        title: "Erro ao carregar tickets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const getTicket = async (ticketId: string) => {
    setLoading(true);
    try {
      // Buscar o ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from("support_tickets")
        .select("*, support_messages(*)")
        .eq("id", ticketId)
        .single();
        
      if (ticketError) throw ticketError;
      
      return ticketData;
    } catch (error: any) {
      console.error("Erro ao buscar detalhes do ticket:", error);
      toast({
        title: "Erro ao carregar detalhes",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
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
      
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      return { success: false, error: error.message };
    }
  };
  
  const closeTicket = async (ticketId: string) => {
    return await updateTicketStatus(ticketId, "closed");
  };
  
  const deleteTicket = async (ticketId: string) => {
    try {
      // Primeiro excluir mensagens relacionadas
      const { error: msgError } = await supabase
        .from("support_messages")
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
      
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao excluir ticket:", error);
      return { success: false, error: error.message };
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
            status: "open",
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
  
  const addMessage = async (ticketId: string, content: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error("Usuário não autenticado");
      }
      
      const { data, error } = await supabase
        .from("support_messages")
        .insert([
          {
            ticket_id: ticketId,
            user_id: userData.user.id,
            content,
          },
        ])
        .select();
        
      if (error) throw error;
      
      return { success: true, message: data?.[0] || null };
    } catch (error: any) {
      console.error("Erro ao adicionar mensagem:", error);
      return { success: false, error: error.message };
    }
  };
  
  return {
    tickets,
    loading,
    refreshing,
    isLoading,
    fetchTickets,
    updateTicketStatus,
    deleteTicket,
    createTicket,
    getTicket,
    addMessage,
    closeTicket
  };
};
