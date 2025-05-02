import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTickets } from "@/hooks/useTickets";
import { toast } from "@/hooks/use-toast";
import MemberHeader from "@/components/MemberHeader";
import { ArrowLeft, Send, MessageSquare, Check, Clock, AlertCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TicketMessage, TicketWithMessages } from "@/types/ticket";

interface Message {
  id: string;
  ticket_id: string;
  user_id: string;
  is_admin: boolean;
  content: string;
  created_at: string;
  user_name?: string;
}

const TicketDetail = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { ticketId } = useParams<{ ticketId: string }>();
  const { getTicket, addMessage, closeTicket } = useTickets();
  
  const [ticket, setTicket] = useState<TicketWithMessages | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    
    if (ticketId) {
      loadTicketData();
    }
  }, [user, loading, ticketId, navigate]);
  
  const loadTicketData = async () => {
    if (!ticketId) return;
    
    setIsLoading(true);
    try {
      const data = await getTicket(ticketId);
      if (data) {
        setTicket(data);
      } else {
        toast({
          title: "Ticket não encontrado",
          description: "O ticket solicitado não existe ou foi removido.",
          variant: "destructive",
        });
        navigate("/membro/suporte");
      }
    } catch (error) {
      console.error("Erro ao carregar ticket:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do ticket.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ticketId) return;
    
    setIsSending(true);
    try {
      const message = await addMessage(ticketId, newMessage);
      
      if (message) {
        setTicket(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, message]
          };
        });
        setNewMessage("");
      }
      
      // Reload ticket data to get updated status
      loadTicketData();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua mensagem.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleCloseTicket = async () => {
    if (!ticketId) return;
    
    setIsClosing(true);
    try {
      await closeTicket(ticketId);
      
      toast({
        title: "Ticket fechado",
        description: "O ticket foi fechado com sucesso.",
      });
      
      // Reload ticket data
      loadTicketData();
    } catch (error) {
      console.error("Erro ao fechar ticket:", error);
      toast({
        title: "Erro",
        description: "Não foi possível fechar o ticket.",
        variant: "destructive",
      });
    } finally {
      setIsClosing(false);
    }
  };
  
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
  
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-ramel animate-spin" />
        <p className="mt-4">Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      
      <main className="container mx-auto px-4 py-10">
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
        
        {ticket && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Coluna da esquerda - Informações do ticket */}
            <div>
              <Card className="sticky top-4 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Detalhes do Ticket</CardTitle>
                  <CardDescription>
                    Criado em {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label>Status</Label>
                    <div>
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>Assunto</Label>
                    <p className="font-medium">{ticket.title}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>Descrição</Label>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {ticket.description}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  {ticket.status !== 'fechado' && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleCloseTicket}
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
            </div>
            
            {/* Coluna da direita - Conversa */}
            <div className="lg:col-span-3">
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
                          {ticket.user_name?.charAt(0).toUpperCase() || user?.user_metadata?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <span className="font-medium">{ticket.user_name || user?.user_metadata?.name || "Você"}</span>
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
                        <div key={message.id} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.is_admin 
                                ? "bg-ramel/20 text-ramel" 
                                : "bg-secondary"
                            }`}>
                              {message.is_admin 
                                ? <MessageSquare className="h-4 w-4" /> 
                                : message.user_name?.charAt(0).toUpperCase() || user?.user_metadata?.name?.charAt(0).toUpperCase() || "U"
                              }
                            </div>
                            <div>
                              <span className="font-medium">
                                {message.is_admin 
                                  ? "Suporte Ramel" 
                                  : message.user_name || user?.user_metadata?.name || "Você"
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
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TicketDetail;
