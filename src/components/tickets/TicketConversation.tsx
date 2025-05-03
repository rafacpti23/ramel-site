
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TicketWithMessages } from "@/types/ticket";
import { useState } from "react";
import { TicketMessage } from "./TicketMessage";

interface TicketConversationProps {
  ticket: TicketWithMessages;
  currentUserName?: string | null;
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
}

export const TicketConversation = ({ 
  ticket, 
  currentUserName, 
  onSendMessage, 
  isSending 
}: TicketConversationProps) => {
  const [newMessage, setNewMessage] = useState("");
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await onSendMessage(newMessage);
    setNewMessage("");
  };
  
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Conversa</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Mensagem inicial - descrição do ticket */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                {ticket.user_name?.charAt(0).toUpperCase() || currentUserName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <span className="font-medium">{ticket.user_name || currentUserName || "Você"}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {new Date(ticket.created_at).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-3 ml-10">
              <p className="whitespace-pre-line">{ticket.description}</p>
            </div>
          </div>
          
          {/* Separador com data */}
          <div className="relative">
            <Separator className="my-6" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
              Mensagens
            </span>
          </div>
          
          {/* Lista de mensagens */}
          {ticket.messages.length > 0 ? (
            ticket.messages.map((message) => (
              <TicketMessage 
                key={message.id} 
                message={message} 
                currentUserName={currentUserName} 
              />
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto opacity-30 mb-2" />
              <p>Ainda não há respostas neste ticket.</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {ticket.status !== 'fechado' ? (
        <CardFooter className="p-4 border-t bg-muted/20">
          <div className="w-full space-y-2">
            <Textarea 
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || isSending}
              >
                {isSending ? (
                  <span className="flex items-center">
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-current animate-spin mr-2" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardFooter>
      ) : (
        <CardFooter className="p-4 border-t bg-muted/20">
          <div className="w-full flex items-center justify-center p-2 rounded-md bg-secondary/40">
            <X className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-muted-foreground">
              Este ticket está fechado. Não é possível enviar novas mensagens.
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
