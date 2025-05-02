
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ticket, TicketMessage, TicketWithMessages } from "@/types/ticket";
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
        .select("*")
        .eq("id", ticketId)
        .single();
        
      if (ticketError) throw ticketError;
      
      // Buscar as mensagens do ticket
      const { data: messagesData, error: messagesError } = await supabase
        .from("ticket_responses")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });
        
      if (messagesError) throw messagesError;
      
      // Formatar o resultado
      const result: TicketWithMessages = {
        ...ticketData as Ticket,
        messages: messagesData as TicketMessage[] || []
      };
      
      return result;
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
  
  const addMessage = async (ticketId: string, content: string) => {
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
