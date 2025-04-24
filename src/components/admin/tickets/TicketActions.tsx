
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TicketActionsProps {
  ticketId: string;
  status: string;
  onUpdateStatus: (ticketId: string, newStatus: string) => Promise<void>;
  onDelete: (ticketId: string) => void;
}

export const TicketActions = ({ 
  ticketId, 
  status, 
  onUpdateStatus, 
  onDelete 
}: TicketActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 justify-end">
      {status !== 'fechado' && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onUpdateStatus(ticketId, 'fechado')}
        >
          Fechar
        </Button>
      )}
      
      {status === 'fechado' && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onUpdateStatus(ticketId, 'aberto')}
        >
          Reabrir
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(`/membro/suporte/${ticketId}`)}
      >
        Responder
      </Button>
      
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => onDelete(ticketId)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
