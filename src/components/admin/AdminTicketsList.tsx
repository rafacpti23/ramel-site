
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
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
import { useTickets } from "@/hooks/useTickets";
import { TicketsTable } from "./tickets/TicketsTable";

const AdminTicketsList = () => {
  const { tickets, loading, refreshing, fetchTickets, updateTicketStatus, deleteTicket } = useTickets();
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTickets();
  }, []);
  
  const handleDelete = async (ticketId: string) => {
    const success = await deleteTicket(ticketId);
    if (success) {
      setTicketToDelete(null);
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
