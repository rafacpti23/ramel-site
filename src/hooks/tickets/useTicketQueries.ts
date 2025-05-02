
import { supabase } from "@/integrations/supabase/client";
import { Ticket, TicketMessage, TicketWithMessages } from "@/types/ticket";
import { toast } from "@/hooks/use-toast";

export const useTicketQueries = (
  setLoading: (loading: boolean) => void,
  setRefreshing: (refreshing: boolean) => void,
  setTickets: (tickets: Ticket[]) => void
) => {
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
  
  return {
    fetchTickets,
    getTicket
  };
};
