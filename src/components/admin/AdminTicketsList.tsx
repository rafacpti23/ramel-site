
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  status: string;
  created_at: string;
  user_id: string;
  user_email?: string | null;
  user_name?: string | null;
}

const AdminTicketsList = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // First, get all tickets
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('support_tickets')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (ticketsError) throw ticketsError;
        
        if (!ticketsData || ticketsData.length === 0) {
          setTickets([]);
          setLoading(false);
          return;
        }
        
        // Now get user details for each ticket
        const ticketsWithProfiles = await Promise.all(
          ticketsData.map(async (ticket) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', ticket.user_id)
              .single();
              
            return {
              ...ticket,
              user_name: profileData?.full_name || null,
              user_email: profileData?.email || null
            };
          })
        );
        
        setTickets(ticketsWithProfiles);
      } catch (error) {
        console.error('Erro ao carregar tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, []);
  
  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);
        
      if (error) throw error;
      
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      
      toast({
        title: "Status atualizado",
        description: `O ticket foi marcado como ${newStatus}.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do ticket.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return <div className="text-center py-4"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>;
  }
  
  if (tickets.length === 0) {
    return <p className="text-center py-4">Nenhum ticket de suporte encontrado.</p>;
  }
  
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-white/10">
          <th className="text-left py-3 px-4">Título</th>
          <th className="text-left py-3 px-4">Usuário</th>
          <th className="text-left py-3 px-4">Data</th>
          <th className="text-left py-3 px-4">Status</th>
          <th className="text-right py-3 px-4">Ações</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id} className="border-b border-white/5 hover:bg-white/5">
            <td className="py-3 px-4">{ticket.title}</td>
            <td className="py-3 px-4">
              {ticket.user_name || 'N/A'}
              <br />
              <span className="text-xs text-muted-foreground">{ticket.user_email}</span>
            </td>
            <td className="py-3 px-4">{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</td>
            <td className="py-3 px-4">
              <span className={`px-2 py-1 rounded text-xs ${
                ticket.status === 'aberto' 
                  ? 'bg-blue-500/20 text-blue-300' 
                  : ticket.status === 'respondido'
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-gray-500/20 text-gray-300'
              }`}>
                {ticket.status === 'aberto' ? 'Aberto' : 
                 ticket.status === 'respondido' ? 'Respondido' : 'Fechado'}
              </span>
            </td>
            <td className="py-3 px-4 text-right">
              <div className="flex gap-2 justify-end">
                {ticket.status !== 'fechado' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateTicketStatus(ticket.id, 'fechado')}
                  >
                    Fechar
                  </Button>
                )}
                
                {ticket.status === 'fechado' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateTicketStatus(ticket.id, 'aberto')}
                  >
                    Reabrir
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/membro/suporte/${ticket.id}`)}
                >
                  Responder
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminTicketsList;
