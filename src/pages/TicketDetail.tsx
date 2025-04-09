
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MemberHeader from "@/components/MemberHeader";
import { ArrowLeft, Loader2, Send } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

interface TicketResponse {
  id: string;
  content: string;
  is_admin: boolean;
  created_at: string;
  user_id: string;
}

const TicketDetail = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [newResponse, setNewResponse] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    
    if (!loading && user && ticketId) {
      fetchTicketData();
    }
  }, [user, loading, ticketId, navigate]);
  
  const fetchTicketData = async () => {
    setLoadingData(true);
    try {
      // Buscar informações do ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();
        
      if (ticketError) throw ticketError;
      setTicket(ticketData as Ticket);
      
      // Buscar respostas do ticket
      const { data: responsesData, error: responsesError } = await supabase
        .from('ticket_responses')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
        
      if (responsesError) throw responsesError;
      setResponses(responsesData as TicketResponse[]);
      
    } catch (error) {
      console.error('Erro ao carregar dados do ticket:', error);
      toast({
        title: "Erro ao carregar ticket",
        description: "Não foi possível carregar os detalhes do ticket.",
        variant: "destructive",
      });
      navigate("/membro/suporte");
    } finally {
      setLoadingData(false);
    }
  };
  
  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponse.trim() || !user) return;
    
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('ticket_responses')
        .insert([
          {
            ticket_id: ticketId,
            user_id: user.id,
            content: newResponse,
            is_admin: isAdmin
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Se é admin e o ticket está aberto, atualize o status para respondido
      if (isAdmin && ticket?.status === 'aberto') {
        const { error: updateError } = await supabase
          .from('support_tickets')
          .update({ status: 'respondido' })
          .eq('id', ticketId);
          
        if (updateError) throw updateError;
        
        setTicket(prev => prev ? {...prev, status: 'respondido'} : null);
      }
      
      setResponses([...responses, ...(data as TicketResponse[])]);
      setNewResponse("");
      
      toast({
        title: "Resposta enviada",
        description: "Sua resposta foi enviada com sucesso."
      });
    } catch (error: any) {
      console.error('Erro ao enviar resposta:', error);
      toast({
        title: "Erro ao enviar resposta",
        description: error.message || "Não foi possível enviar sua resposta.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ramel" />
        <p className="mt-4">Carregando...</p>
      </div>
    );
  }
  
  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500">Ticket não encontrado.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate("/membro/suporte")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Suporte
        </Button>
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Ticket #{ticket.id.slice(0, 8)}</h1>
          <div className={`ml-auto px-2 py-1 rounded text-xs ${
            ticket.status === 'aberto' 
              ? 'bg-blue-500/20 text-blue-300' 
              : ticket.status === 'respondido'
              ? 'bg-green-500/20 text-green-300'
              : 'bg-gray-500/20 text-gray-300'
          }`}>
            {ticket.status === 'aberto' ? 'Aberto' : 
             ticket.status === 'respondido' ? 'Respondido' : 'Fechado'}
          </div>
        </div>
        
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle>{ticket.title}</CardTitle>
            <CardDescription>
              {new Date(ticket.created_at).toLocaleDateString('pt-BR')} às {new Date(ticket.created_at).toLocaleTimeString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{ticket.description}</p>
          </CardContent>
        </Card>
        
        {responses.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold">Respostas</h2>
            {responses.map((response) => (
              <Card key={response.id} className={`glass-card ${response.is_admin ? 'border-green-500/30' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {response.is_admin ? 'Administrador' : 'Você'}
                    </CardTitle>
                    <CardDescription>
                      {new Date(response.created_at).toLocaleDateString('pt-BR')} às {new Date(response.created_at).toLocaleTimeString('pt-BR')}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{response.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {ticket.status !== 'fechado' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Enviar Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitResponse} className="space-y-4">
                <Textarea 
                  placeholder="Digite sua resposta..."
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  rows={5}
                  required
                />
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Resposta
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default TicketDetail;
