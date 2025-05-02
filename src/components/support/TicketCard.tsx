
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MessageSquare, ChevronRight, Check, Clock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
    user_id: string;
  };
}

const TicketCard = ({ ticket }: TicketCardProps) => {
  const navigate = useNavigate();
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "aberto":
        return (
          <Badge className="flex items-center gap-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30">
            <Clock className="h-3 w-3" /> Aberto
          </Badge>
        );
      case "respondido":
        return (
          <Badge className="flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30">
            <MessageSquare className="h-3 w-3" /> Respondido
          </Badge>
        );
      case "fechado":
        return (
          <Badge className="flex items-center gap-1 bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30">
            <Check className="h-3 w-3" /> Fechado
          </Badge>
        );
      case "urgente":
        return (
          <Badge className="flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
            <X className="h-3 w-3" /> Urgente
          </Badge>
        );
      default:
        return (
          <Badge className="flex items-center gap-1">
            {status}
          </Badge>
        );
    }
  };
  
  const formattedDate = new Date(ticket.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <Card className="overflow-hidden border-t-2 border-t-ramel shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2 bg-gradient-to-r from-secondary/60 to-secondary flex flex-row items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{ticket.title}</h3>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
        {getStatusBadge(ticket.status)}
      </CardHeader>
      
      <CardContent className="pt-4">
        <p className="text-muted-foreground line-clamp-3 whitespace-pre-line">
          {ticket.description}
        </p>
      </CardContent>
      
      <CardFooter className="border-t border-border/40 pt-3 pb-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto flex items-center gap-1"
          onClick={() => navigate(`/membro/suporte/${ticket.id}`)}
        >
          Ver Detalhes <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
