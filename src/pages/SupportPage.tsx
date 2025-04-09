
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MemberHeader from "@/components/MemberHeader";
import { Loader2, Plus } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

const SupportPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketDescription, setNewTicketDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    
    if (!loading && user) {
      fetchTickets();
    }
  }, [user, loading, navigate]);
  
  const fetchTickets = async () => {
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Erro ao carregar tickets:', error);
      toast({
        title: "Erro ao carregar tickets",
        description: "Não foi possível carregar seus tickets de suporte.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };
  
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([
          {
            user_id: user.id,
            title: newTicketTitle,
            description: newTicketDescription,
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Ticket criado com sucesso",
        description: "Seu ticket foi enviado e será respondido em breve.",
      });
      
      setTickets([...(data as Ticket[] || []), ...tickets]);
      setShowNewTicketForm(false);
      setNewTicketTitle("");
      setNewTicketDescription("");
    } catch (error: any) {
      console.error('Erro ao criar ticket:', error);
      toast({
        title: "Erro ao criar ticket",
        description: error.message || "Não foi possível criar o ticket.",
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
  
  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Suporte</h1>
          <Button onClick={() => setShowNewTicketForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Ticket
          </Button>
        </div>
        
        {showNewTicketForm && (
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle>Novo Ticket de Suporte</CardTitle>
              <CardDescription>Preencha o formulário para enviar sua dúvida ou solicitação</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input 
                    id="title" 
                    placeholder="Resumo da sua solicitação" 
                    value={newTicketTitle}
                    onChange={(e) => setNewTicketTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Descreva sua dúvida ou problema em detalhes" 
                    value={newTicketDescription}
                    onChange={(e) => setNewTicketDescription(e.target.value)}
                    rows={5}
                    required
                  />
                </div>
                
                <div className="flex gap-3 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowNewTicketForm(false)}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Enviando..." : "Enviar Ticket"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Você ainda não tem tickets de suporte.
                </p>
              </CardContent>
            </Card>
          ) : (
            tickets.map((ticket) => (
              <Card key={ticket.id} className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    <div className={`px-2 py-1 rounded text-xs ${
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
                  <CardDescription>
                    {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{ticket.description}</p>
                </CardContent>
                <CardFooter className="border-t border-white/10 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/membro/suporte/${ticket.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default SupportPage;
