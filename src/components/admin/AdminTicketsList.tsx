
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";
import { useSystemConfig } from "@/hooks/useSystemConfig";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [refreshing, setRefreshing] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const { config } = useSystemConfig();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchTickets();
  }, []);
  
  const fetchTickets = async () => {
    try {
      setRefreshing(true);
      // First, get all tickets
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
      
      // Enviar webhook quando o ticket for fechado
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
      // Primeiro excluir todas as respostas do ticket
      const { error: responsesError } = await supabase
        .from("ticket_responses")
        .delete()
        .eq("ticket_id", ticketId);
      
      if (responsesError) throw responsesError;
      
      // Depois excluir o ticket
      const { error: ticketError } = await supabase
        .from("support_tickets")
        .delete()
        .eq("id", ticketId);
      
      if (ticketError) throw ticketError;
      
      // Atualizar a lista de tickets
      setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
      
      toast({
        title: "Ticket excluído",
        description: "O ticket foi excluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir ticket:", error);
      toast({
        title: "Erro ao excluir ticket",
        description: "Não foi possível excluir o ticket. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setTicketToDelete(null); // Fechar o diálogo
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
          previous_status: ticket.status,
          new_status: newStatus,
          user_name: ticket.user_name || "Não identificado",
          user_email: ticket.user_email || "Não identificado",
          closed_at: new Date().toISOString(),
        }
      };
      
      await fetch(config.ticketCloseWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookData),
        mode: "no-cors", // Para evitar problemas de CORS
      });
      
      console.log("Webhook enviado com sucesso para ticket fechado", webhookData);
    } catch (error) {
      console.error("Erro ao enviar webhook:", error);
      // Não exibir toast para não interromper o fluxo da aplicação
    }
  };
  
  if (loading) {
    return <div className="text-center py-4"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>;
  }
  
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchTickets} 
          disabled={refreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? "Atualizando..." : "Atualizar Lista"}
        </Button>
      </div>
      
      {tickets.length === 0 ? (
        <p className="text-center py-4">Nenhum ticket de suporte encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
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
                      
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => setTicketToDelete(ticket.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <AlertDialog open={!!ticketToDelete} onOpenChange={(open) => !open && setTicketToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este ticket? Esta ação não pode ser desfeita.
              Todas as respostas associadas a este ticket também serão excluídas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => ticketToDelete && deleteTicket(ticketToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminTicketsList;
