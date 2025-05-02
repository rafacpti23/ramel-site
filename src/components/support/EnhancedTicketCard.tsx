
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MessageSquare, ChevronRight, Check, Clock, X, AlertCircle } from "lucide-react";
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

const EnhancedTicketCard = ({ ticket }: TicketCardProps) => {
  const navigate = useNavigate();
  
  // Determinar a cor e o estilo com base no status
  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case "aberto":
        return {
          badge: (
            <Badge className="flex items-center gap-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30">
              <Clock className="h-3 w-3" /> Aberto
            </Badge>
          ),
          borderColor: "border-t-blue-500",
          gradientColor: "from-blue-500/10 to-blue-600/20",
          icon: <Clock className="h-12 w-12 text-blue-400/50" />
        };
      case "respondido":
        return {
          badge: (
            <Badge className="flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30">
              <MessageSquare className="h-3 w-3" /> Respondido
            </Badge>
          ),
          borderColor: "border-t-green-500",
          gradientColor: "from-green-500/10 to-green-600/20",
          icon: <MessageSquare className="h-12 w-12 text-green-400/50" />
        };
      case "fechado":
        return {
          badge: (
            <Badge className="flex items-center gap-1 bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30">
              <Check className="h-3 w-3" /> Fechado
            </Badge>
          ),
          borderColor: "border-t-gray-500",
          gradientColor: "from-gray-500/10 to-gray-600/20",
          icon: <Check className="h-12 w-12 text-gray-400/50" />
        };
      case "urgente":
        return {
          badge: (
            <Badge className="flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
              <AlertCircle className="h-3 w-3" /> Urgente
            </Badge>
          ),
          borderColor: "border-t-red-500",
          gradientColor: "from-red-500/10 to-red-600/20",
          icon: <AlertCircle className="h-12 w-12 text-red-400/50" />
        };
      default:
        return {
          badge: (
            <Badge className="flex items-center gap-1">
              {status}
            </Badge>
          ),
          borderColor: "border-t-ramel",
          gradientColor: "from-ramel/10 to-ramel-dark/20",
          icon: <MessageSquare className="h-12 w-12 text-ramel/50" />
        };
    }
  };
  
  const { badge, borderColor, gradientColor, icon } = getStatusStyle(ticket.status);
  
  const formattedDate = new Date(ticket.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Extraindo o mês para exibição visual
  const month = new Date(ticket.created_at).toLocaleDateString('pt-BR', { month: 'short' });
  const day = new Date(ticket.created_at).getDate();
  
  return (
    <Card className={`overflow-hidden border-t-4 ${borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className={`absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl ${gradientColor} opacity-20 rounded-bl-full -z-0`}></div>
      
      <CardHeader className="pb-2 bg-gradient-to-r from-secondary/60 to-secondary flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex flex-col items-center justify-center bg-secondary rounded-lg border border-white/10">
            <span className="text-xs uppercase text-muted-foreground">{month}</span>
            <span className="text-xl font-bold">{day}</span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold line-clamp-1">{ticket.title}</h3>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        
        <div className="z-10">
          {badge}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 relative">
        <div className="absolute right-4 bottom-4 opacity-10 z-0">
          {icon}
        </div>
        <p className="text-muted-foreground line-clamp-3 whitespace-pre-line z-10 relative">
          {ticket.description}
        </p>
      </CardContent>
      
      <CardFooter className="border-t border-border/40 pt-3 pb-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto flex items-center gap-1 z-10"
          onClick={() => navigate(`/membro/suporte/${ticket.id}`)}
        >
          Ver Detalhes <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnhancedTicketCard;
