
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Clock, MessageSquare, AlertCircle } from "lucide-react";

interface TicketInfoProps {
  title: string;
  description: string;
  status: string;
  createdAt: string;
  onClose: () => void;
  isClosing: boolean;
}

export const TicketInfo = ({ 
  title, 
  description, 
  status, 
  createdAt, 
  onClose, 
  isClosing 
}: TicketInfoProps) => {
  
  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
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
            <AlertCircle className="h-3 w-3" /> Urgente
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
  
  return (
    <Card className="sticky top-4 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Detalhes do Ticket</CardTitle>
        <CardDescription>
          Criado em {new Date(createdAt).toLocaleDateString('pt-BR')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label>Status</Label>
          <div>
            {getStatusBadge(status)}
          </div>
        </div>
        
        <div className="space-y-1">
          <Label>Assunto</Label>
          <p className="font-medium">{title}</p>
        </div>
        
        <div className="space-y-1">
          <Label>Descrição</Label>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {description}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        {status !== 'fechado' && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onClose}
            disabled={isClosing}
          >
            {isClosing ? (
              <span className="flex items-center">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-current animate-spin mr-2" />
                Processando...
              </span>
            ) : (
              <span className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Marcar como Resolvido
              </span>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
