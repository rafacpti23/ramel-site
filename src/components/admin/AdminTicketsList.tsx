
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { toast } from "@/hooks/use-toast";
import { TicketsTable } from "./tickets/TicketsTable";
import { Ticket } from "@/types/ticket";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminTicketsList = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar se o usuário é administrador
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem acessar esta página.",
        variant: "destructive",
      });
      navigate("/membro");
      return;
    }
    
    fetchTickets();
  }, [isAdmin, navigate]);
  
  const fetchTickets = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      // Buscar todos os tickets com informações do usuário
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`
          *,
          profiles(
            full_name,
            email,
            whatsapp
          )
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      // Formatar os dados para corresponder ao tipo Ticket
      const formattedTickets: Ticket[] = data.map((ticket: any) => ({
        ...ticket,
        user_name: ticket.profiles?.full_name || "Usuário Desconhecido",
        user_email: ticket.profiles?.email || "",
        user_whatsapp: ticket.profiles?.whatsapp || ""
      }));
      
      setTickets(formattedTickets);
    } catch (error: any) {
      console.error("Erro ao carregar tickets:", error);
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
  
  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: newStatus })
        .eq("id", ticketId);
        
      if (error) throw error;
      
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      
      toast({
        title: "Status atualizado",
        description: `O ticket foi marcado como ${newStatus}.`
      });
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (ticketId: string) => {
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
      
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
      
      toast({
        title: "Ticket excluído",
        description: "O ticket foi removido com sucesso."
      });
      
      setTicketToDelete(null);
    } catch (error: any) {
      console.error("Erro ao excluir ticket:", error);
      toast({
        title: "Erro ao excluir ticket",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteConfirmation = (ticketId: string) => {
    setTicketToDelete(ticketId);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tickets de Suporte ({tickets.length})</h2>
        <Button 
          variant="outline" 
          onClick={() => fetchTickets()}
          disabled={refreshing}
        >
          {refreshing ? "Atualizando..." : "Atualizar"}
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-ramel border-opacity-50 border-t-ramel rounded-full"></div>
        </div>
      ) : tickets.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">Nenhum ticket de suporte encontrado.</p>
      ) : (
        <TicketsTable 
          tickets={tickets}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteConfirmation}
        />
      )}
      
      <AlertDialog open={!!ticketToDelete} onOpenChange={(open) => !open && setTicketToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este ticket? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => ticketToDelete && handleDelete(ticketToDelete)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTicketsList;
