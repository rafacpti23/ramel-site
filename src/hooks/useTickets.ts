
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Ticket } from "@/types/ticket";
import { useSystemConfig } from "@/hooks/useSystemConfig";

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { config } = useSystemConfig();

  const fetchTickets = async () => {
    try {
      setRefreshing(true);
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
          
      if (ticketsError) throw ticketsError;
      
      if (!ticketsData || ticketsData.length === 0) {
        setTickets([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      const ticketsWithProfiles = await Promise.all(
        ticketsData.map(async (ticket) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, email, whatsapp')
            .eq('id', ticket.user_id)
            .single();
              
          return {
            ...ticket,
            user_name: profileData?.full_name || null,
            user_email: profileData?.email || null,
            user_whatsapp: profileData?.whatsapp || null
          };
        })
      );
      
      setTickets(ticketsWithProfiles);
    } catch (error) {
      console.error('Erro ao carregar tickets:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os tickets de suporte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);
        
      if (error) throw error;
      
      const updatedTicket = tickets.find(ticket => ticket.id === ticketId);
      
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      
      toast({
        title: "Status atualizado",
        description: `O ticket foi marcado como ${newStatus}.`,
      });
      
      if (newStatus === "fechado" && config?.ticketCloseWebhookUrl && updatedTicket) {
        await sendWebhook(updatedTicket, newStatus);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do ticket.",
        variant: "destructive",
      });
    }
  };

  const deleteTicket = async (ticketId: string) => {
    try {
      // Primeiro exclui as respostas relacionadas ao ticket
      const { error: responsesError } = await supabase
        .from("ticket_responses")
        .delete()
        .eq("ticket_id", ticketId);
      
      if (responsesError) throw responsesError;
      
      // Depois exclui o ticket em si
      const { error: ticketError } = await supabase
        .from("support_tickets")
        .delete()
        .eq("id", ticketId);
      
      if (ticketError) throw ticketError;
      
      // Atualiza o estado local removendo o ticket excluído
      setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
      
      toast({
        title: "Ticket excluído",
        description: "O ticket foi excluído com sucesso.",
      });

      return true;
    } catch (error) {
      console.error("Erro ao excluir ticket:", error);
      toast({
        title: "Erro ao excluir ticket",
        description: "Não foi possível excluir o ticket. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const sendWebhook = async (ticket: Ticket, newStatus: string) => {
    if (!config?.ticketCloseWebhookUrl) return;
    
    try {
      const webhookData = {
        event: "ticket_closed",
        ticket: {
          id: ticket.id,
          title: ticket.title,
          ticket_number: ticket.id.slice(0, 8),
          previous_status: ticket.status,
          new_status: newStatus,
          user_name: ticket.user_name || "Não identificado",
          user_email: ticket.user_email || "Não identificado",
          user_whatsapp: ticket.user_whatsapp || "Não informado",
          closed_at: new Date().toISOString(),
        }
      };
      
      await fetch(config.ticketCloseWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookData),
        mode: "no-cors",
      });
      
      console.log("Webhook enviado com sucesso para ticket fechado", webhookData);
    } catch (error) {
      console.error("Erro ao enviar webhook:", error);
    }
  };

  return {
    tickets,
    loading,
    refreshing,
    fetchTickets,
    updateTicketStatus,
    deleteTicket
  };
};
