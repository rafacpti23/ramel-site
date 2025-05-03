
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTickets } from "@/hooks/useTickets";
import { toast } from "@/hooks/use-toast";
import MemberHeader from "@/components/MemberHeader";
import { TicketWithMessages } from "@/types/ticket";

// Importando os novos componentes refatorados
import { TicketHeader } from "@/components/tickets/TicketHeader";
import { TicketInfo } from "@/components/tickets/TicketInfo";
import { TicketConversation } from "@/components/tickets/TicketConversation";
import { LoadingSpinner } from "@/components/tickets/LoadingSpinner";

const TicketDetail = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { ticketId } = useParams<{ ticketId: string }>();
  const { getTicket, addMessage, closeTicket } = useTickets();
  
  const [ticket, setTicket] = useState<TicketWithMessages | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    
    if (ticketId) {
      loadTicketData();
    }
  }, [user, loading, ticketId, navigate]);
  
  const loadTicketData = async () => {
    if (!ticketId) return;
    
    setIsLoading(true);
    try {
      const data = await getTicket(ticketId);
      if (data) {
        setTicket(data);
      } else {
        toast({
          title: "Ticket não encontrado",
          description: "O ticket solicitado não existe ou foi removido.",
          variant: "destructive",
        });
        navigate("/membro/suporte");
      }
    } catch (error) {
      console.error("Erro ao carregar ticket:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do ticket.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || !ticketId) return;
    
    setIsSending(true);
    try {
      const message = await addMessage(ticketId, newMessage);
      
      if (message) {
        setTicket(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, message]
          };
        });
      }
      
      // Reload ticket data to get updated status
      loadTicketData();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua mensagem.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleCloseTicket = async () => {
    if (!ticketId) return;
    
    setIsClosing(true);
    try {
      await closeTicket(ticketId);
      
      toast({
        title: "Ticket fechado",
        description: "O ticket foi fechado com sucesso.",
      });
      
      // Reload ticket data
      loadTicketData();
    } catch (error) {
      console.error("Erro ao fechar ticket:", error);
      toast({
        title: "Erro",
        description: "Não foi possível fechar o ticket.",
        variant: "destructive",
      });
    } finally {
      setIsClosing(false);
    }
  };
  
  if (loading || isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      
      <main className="container mx-auto px-4 py-10">
        <TicketHeader ticketId={ticketId} />
        
        {ticket && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Coluna da esquerda - Informações do ticket */}
            <div>
              <TicketInfo
                title={ticket.title}
                description={ticket.description}
                status={ticket.status}
                createdAt={ticket.created_at}
                onClose={handleCloseTicket}
                isClosing={isClosing}
              />
            </div>
            
            {/* Coluna da direita - Conversa */}
            <div className="lg:col-span-3">
              <TicketConversation
                ticket={ticket}
                currentUserName={user?.user_metadata?.name}
                onSendMessage={handleSendMessage}
                isSending={isSending}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TicketDetail;
