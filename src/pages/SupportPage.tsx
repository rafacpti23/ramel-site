
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
import { Loader2, Plus, Search } from "lucide-react";
import TicketCard from "@/components/support/TicketCard";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  user_id: string;
}

const SupportPage = () => {
  const { user, loading, isAdmin, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketDescription, setNewTicketDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
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
      let query = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
        
      // Se não for admin, filtrar apenas os tickets do usuário atual
      if (!isAdmin && user?.id) {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query;
      
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
      
      // Verificar se o usuário tem WhatsApp cadastrado
      if (!userProfile?.whatsapp && !isAdmin) {
        toast({
          title: "WhatsApp necessário",
          description: "Por favor, atualize seu perfil com um número de WhatsApp para criar tickets.",
          variant: "destructive",
        });
        throw new Error("WhatsApp não cadastrado");
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
      if (error.message !== "WhatsApp não cadastrado") {
        toast({
          title: "Erro ao criar ticket",
          description: error.message || "Não foi possível criar o ticket.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  const filteredTickets = searchTerm
    ? tickets.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tickets;
  
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
          <Button onClick={() => setShowNewTicketForm(true)} className="bg-ramel hover:bg-ramel-dark">
            <Plus className="h-4 w-4 mr-2" />
            Novo Ticket
          </Button>
        </div>
        
        {/* Barra de busca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar tickets..." 
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {showNewTicketForm && (
          <Card className="glass-card mb-8 border-t-4 border-t-ramel">
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
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-ramel hover:bg-ramel-dark"
                  >
                    {submitting ? 
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</> : 
                      'Enviar Ticket'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTickets.length === 0 ? (
            <Card className="glass-card md:col-span-2">
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm ? 
                    "Nenhum ticket encontrado com os termos da pesquisa." : 
                    "Você ainda não tem tickets de suporte."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default SupportPage;
