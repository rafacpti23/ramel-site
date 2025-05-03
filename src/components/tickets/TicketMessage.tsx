
import { TicketMessage as TicketMessageType } from "@/types/ticket";

interface TicketMessageProps {
  message: TicketMessageType;
  currentUserName?: string | null;
}

export const TicketMessage = ({ message, currentUserName }: TicketMessageProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          message.is_admin 
            ? "bg-ramel/20 text-ramel" 
            : "bg-secondary"
        }`}>
          {message.is_admin 
            ? <MessageSquareIcon className="h-4 w-4" /> 
            : message.user?.full_name?.charAt(0).toUpperCase() || currentUserName?.charAt(0).toUpperCase() || "U"
          }
        </div>
        <div>
          <span className="font-medium">
            {message.is_admin 
              ? "Suporte Ramel" 
              : message.user?.full_name || currentUserName || "Você"
            }
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            {new Date(message.created_at).toLocaleString('pt-BR')}
          </span>
        </div>
      </div>
      
      <div className={`rounded-lg p-3 ml-10 ${
        message.is_admin 
          ? "bg-ramel/10 border border-ramel/20" 
          : "bg-muted/30"
      }`}>
        <p className="whitespace-pre-line">{message.content}</p>
      </div>
    </div>
  );
};

// Importação necessária do ícone do Lucide React
import { MessageSquare as MessageSquareIcon } from "lucide-react";
