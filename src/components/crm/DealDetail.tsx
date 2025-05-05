
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Deal } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import DealForm from "./forms/DealForm";
import { StatusBadge } from "./components/StatusBadge";

interface DealDetailProps {
  dealId: string;
  onClose: () => void;
}

const DealDetail = ({ dealId, onClose }: DealDetailProps) => {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    fetchDeal();
  }, [dealId]);
  
  const fetchDeal = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_deals')
        .select(`
          *,
          crm_customers:customer_id (
            name,
            email,
            phone
          )
        `)
        .eq('id', dealId)
        .single();
        
      if (error) throw error;
      setDeal(data as Deal);
    } catch (error: any) {
      console.error("Erro ao carregar detalhes do negócio:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do negócio.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateDeal = async (updatedDeal: Partial<Deal>) => {
    try {
      const { error } = await supabase
        .from('crm_deals')
        .update({
          title: updatedDeal.title,
          value: updatedDeal.value,
          status: updatedDeal.status,
          expected_close_date: updatedDeal.expected_close_date,
          notes: updatedDeal.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', dealId);
        
      if (error) throw error;
      
      toast({
        title: "Negócio atualizado",
        description: "As informações foram atualizadas com sucesso."
      });
      
      setIsEditing(false);
      fetchDeal();
    } catch (error: any) {
      console.error("Erro ao atualizar negócio:", error);
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-ramel" />
      </div>
    );
  }
  
  if (!deal) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Não foi possível encontrar o negócio.</p>
        <Button onClick={onClose} className="mt-4">Voltar</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onClose} 
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para lista
      </Button>
      
      {isEditing ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Editar Negócio</h2>
          <DealForm 
            deal={deal} 
            onSave={handleUpdateDeal}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{deal.title}</h2>
              <p className="text-muted-foreground">Cliente: {deal.customer?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{formatCurrency(deal.value)}</p>
              <StatusBadge status={deal.status} type="deal" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Cliente:</p>
              <p>{deal.customer?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email do cliente:</p>
              <p>{deal.customer?.email || "Não informado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Telefone do cliente:</p>
              <p>{deal.customer?.phone || "Não informado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Data esperada de fechamento:</p>
              <p>{deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString('pt-BR') : "Não definida"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Data de criação:</p>
              <p>{new Date(deal.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Última atualização:</p>
              <p>{new Date(deal.updated_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          
          {deal.notes && (
            <div>
              <p className="text-sm font-medium">Observações:</p>
              <p className="whitespace-pre-line bg-muted p-4 rounded-md">{deal.notes}</p>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button onClick={() => setIsEditing(true)}>
              Editar Negócio
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DealDetail;
