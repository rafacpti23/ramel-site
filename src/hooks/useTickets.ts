
import { useTicketState } from "./tickets/useTicketState";
import { useTicketQueries } from "./tickets/useTicketQueries";
import { useTicketMutations } from "./tickets/useTicketMutations";

export const useTickets = () => {
  const {
    tickets,
    setTickets,
    loading,
    setLoading,
    refreshing,
    setRefreshing,
    isLoading,
    setIsLoading
  } = useTicketState();
  
  const { fetchTickets, getTicket } = useTicketQueries(
    setLoading,
    setRefreshing,
    setTickets
  );
  
  const {
    updateTicketStatus,
    closeTicket,
    deleteTicket,
    createTicket,
    addMessage
  } = useTicketMutations(setTickets, setIsLoading);
  
  return {
    // Estado
    tickets,
    loading,
    refreshing,
    isLoading,
    
    // Consultas
    fetchTickets,
    getTicket,
    
    // Mutações
    updateTicketStatus,
    closeTicket,
    deleteTicket,
    createTicket,
    addMessage
  };
};
