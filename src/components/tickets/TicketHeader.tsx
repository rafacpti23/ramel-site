
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TicketHeaderProps {
  ticketId?: string;
}

export const TicketHeader = ({ ticketId }: TicketHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 mb-8">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate("/membro/suporte")}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>
      <h1 className="text-2xl font-bold">Ticket #{ticketId?.slice(0, 8)}</h1>
    </div>
  );
};
