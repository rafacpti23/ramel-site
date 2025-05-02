
import { useState } from "react";
import { Ticket } from "@/types/ticket";

export const useTicketState = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  return {
    tickets,
    setTickets,
    loading,
    setLoading,
    refreshing,
    setRefreshing,
    isLoading,
    setIsLoading
  };
};
