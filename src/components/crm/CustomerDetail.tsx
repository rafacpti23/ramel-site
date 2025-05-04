import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Customer, Deal, Interaction } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Edit, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import DealForm from "./forms/DealForm";
import InteractionForm from "./forms/InteractionForm";
import { StatusBadge } from "./components/StatusBadge";

interface CustomerDetailProps {
  customerId: string;
  onEdit: () => void;
  onClose: () => void;
}

const CustomerDetail = ({ customerId, onEdit, onClose }: CustomerDetailProps) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDealFormOpen, setIsDealFormOpen] = useState(false);
  const [isInteractionFormOpen, setIsInteractionFormOpen] = useState(false);
  
  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);
  
  const fetchCustomerDetails = async () => {
    setLoading(true);
    try {
      // Buscar dados do cliente
      const { data: customerData, error: customerError } = await supabase
        .from('crm_customers')
        .select('*')
        .eq('id', customerId)
        .single();
      
      if (customerError) throw customerError;
      setCustomer(customerData as Customer);
      
      // Buscar negócios do cliente
      const { data: dealsData, error: dealsError } = await supabase
        .from('crm_deals')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (dealsError) throw dealsError;
      setDeals(dealsData as Deal[]);
      
      // Buscar interações do cliente
      const { data: interactionsData, error: interactionsError } = await supabase
        .from('crm_interactions')
        .select(`
          *,
          profiles:created_by (full_name)
        `)
        .eq('customer_id', customerId)
        .order('date', { ascending: false });
      
      if (interactionsError) throw interactionsError;
      setInteractions(interactionsData as Interaction[]);
      
    } catch (error: any) {
      console.error("Erro ao buscar detalhes do cliente:", error);
      toast({
        title: "Erro ao carregar detalhes",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveDeal = async (deal: Partial<Deal>) => {
    try {
      const { data, error } = await supabase
        .from('crm_deals')
        .insert({
          customer_id: customerId,
          title: deal.title!,
          value: deal.value || 0,
          status: deal.status,
          expected_close_date: deal.expected_close_date,
          notes: deal.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      setDeals([data[0] as Deal, ...deals]);
      setIsDealFormOpen(false);
      
      toast({
        title: "Negócio adicionado",
        description: "O negócio foi adicionado com sucesso."
      });
    } catch (error: any) {
      console.error("Erro ao adicionar negócio:", error);
      toast({
        title: "Erro ao adicionar negócio",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleSaveInteraction = async (interaction: Partial<Interaction>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error("Usuário não autenticado");
      }
      
      const { data, error } = await supabase
        .from('crm_interactions')
        .insert({
          customer_id: customerId,
          type: interaction.type!,
          description: interaction.description!,
          date: interaction.date!,
          created_by: userData.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      // Recarregar interações para obter o nome do usuário criador
      fetchCustomerDetails();
      setIsInteractionFormOpen(false);
      
      toast({
        title: "Interação registrada",
        description: "A interação foi registrada com sucesso."
      });
    } catch (error: any) {
      console.error("Erro ao registrar interação:", error);
      toast({
        title: "Erro ao registrar interação",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-ramel" />
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Cliente não encontrado.</p>
        <Button onClick={onClose} className="mt-4">Fechar</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{customer.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={customer.status} type="customer" />
            {customer.company && <span className="text-muted-foreground">{customer.company}</span>}
          </div>
        </div>
        <Button onClick={onEdit} size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Email:</p>
          <p>{customer.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Telefone:</p>
          <p>{customer.phone}</p>
        </div>
        {customer.address && (
          <div className="col-span-1 md:col-span-2">
            <p className="text-sm font-medium">Endereço:</p>
            <p>{customer.address}</p>
          </div>
        )}
        {customer.notes && (
          <div className="col-span-1 md:col-span-2">
            <p className="text-sm font-medium">Observações:</p>
            <p className="whitespace-pre-line">{customer.notes}</p>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="deals" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="deals">Negócios ({deals.length})</TabsTrigger>
          <TabsTrigger value="interactions">Interações ({interactions.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deals">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Negócios</h3>
            <Button size="sm" onClick={() => setIsDealFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Negócio
            </Button>
          </div>
          
          {deals.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Nenhum negócio registrado para este cliente.
            </p>
          ) : (
            <div className="space-y-3">
              {deals.map((deal) => (
                <div key={deal.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{deal.title}</h4>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(deal.value)}</p>
                      <StatusBadge status={deal.status} type="deal" />
                    </div>
                  </div>
                  {deal.expected_close_date && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Data esperada de fechamento: {new Date(deal.expected_close_date).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  {deal.notes && (
                    <p className="mt-2 text-sm whitespace-pre-line">{deal.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="interactions">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Interações</h3>
            <Button size="sm" onClick={() => setIsInteractionFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Interação
            </Button>
          </div>
          
          {interactions.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Nenhuma interação registrada para este cliente.
            </p>
          ) : (
            <div className="space-y-3">
              {interactions.map((interaction: any) => (
                <div key={interaction.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={interaction.type} type="interaction" />
                      <p className="text-sm text-muted-foreground">
                        {new Date(interaction.date).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Por: {interaction.profiles?.full_name || "Usuário"}
                    </p>
                  </div>
                  <p className="mt-2 whitespace-pre-line">{interaction.description}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>
      
      {/* Formulário de Negócio */}
      <Dialog open={isDealFormOpen} onOpenChange={setIsDealFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Negócio</DialogTitle>
          </DialogHeader>
          <DealForm
            onSave={handleSaveDeal}
            onCancel={() => setIsDealFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Formulário de Interação */}
      <Dialog open={isInteractionFormOpen} onOpenChange={setIsInteractionFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Interação</DialogTitle>
          </DialogHeader>
          <InteractionForm
            onSave={handleSaveInteraction}
            onCancel={() => setIsInteractionFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDetail;
