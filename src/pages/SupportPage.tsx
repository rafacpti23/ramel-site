
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTickets } from "@/hooks/useTickets";
import { toast } from "@/hooks/use-toast";
import MemberHeader from "@/components/MemberHeader";
import EnhancedTicketCard from "@/components/support/EnhancedTicketCard";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Ticket } from "@/types/ticket";

const SupportPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { tickets, isLoading, createTicket, fetchTickets } = useTickets();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para enviar um ticket.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    try {
      await createTicket({ title, description });
      toast({
        title: "Ticket criado",
        description: "Seu ticket foi enviado com sucesso. Em breve responderemos.",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setShowForm(false);
      
      // Refresh tickets list
      fetchTickets();
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o ticket. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading || isLoading) {
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Central de Suporte</h1>
            <p className="text-muted-foreground mt-1">
              Envie suas dúvidas ou solicite suporte técnico
            </p>
          </div>
          
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="w-full md:w-auto"
          >
            {showForm ? (
              <>Cancelar</>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Novo Ticket
              </>
            )}
          </Button>
        </div>
        
        {showForm && (
          <Card className="mb-8 border border-ramel/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-ramel/10 to-transparent">
              <CardTitle>Criar Novo Ticket</CardTitle>
              <CardDescription>
                Descreva seu problema ou dúvida para que possamos ajudar
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assunto</Label>
                  <Input
                    id="title"
                    placeholder="Resumo do seu problema ou dúvida"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva detalhadamente sua dúvida ou problema"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Ticket"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Seus Tickets</h2>
          
          {tickets.length === 0 ? (
            <Card className="bg-muted/50 border border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium">Nenhum ticket encontrado</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  Você ainda não abriu nenhum ticket de suporte
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Ticket
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tickets.map((ticket: Ticket) => (
                <EnhancedTicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SupportPage;
