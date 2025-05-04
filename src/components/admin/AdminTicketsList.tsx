
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
      // Corrigindo o relacionamento com profiles
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`
          *,
          profiles:user_id (
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
      console.error('Erro ao buscar tickets:', error);
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
  
  const updateTicketStatus = async (ticketId: string, newStatus: string): Promise<void> => {
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
      
      toast({
        title: "Status atualizado",
        description: `O status do ticket foi alterado para ${newStatus}`,
      });
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
      throw error;
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
      
      // Atualizar o estado local
      setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
      setTicketToDelete(null);
      
      toast({
        title: "Ticket excluído",
        description: "O ticket foi excluído com sucesso",
      });
    } catch (error: any) {
      console.error('Erro ao excluir ticket:', error);
      toast({
        title: "Erro ao excluir ticket",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
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
      
      {loading ? (
        <div className="text-center py-4">
          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          <p className="mt-2">Carregando tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <p className="text-center py-4">Nenhum ticket de suporte encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <TicketsTable
            tickets={tickets}
            onUpdateStatus={updateTicketStatus}
            onDelete={(ticketId) => setTicketToDelete(ticketId)}
          />
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
              onClick={() => ticketToDelete && handleDelete(ticketToDelete)}
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
