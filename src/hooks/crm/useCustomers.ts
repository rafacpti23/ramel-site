
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Customer } from "@/types/crm";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data as Customer[]);
    } catch (error: any) {
      console.error("Erro ao buscar clientes:", error);
      toast({
        title: "Erro ao carregar clientes",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customer: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('crm_customers')
        .insert({
          name: customer.name!,
          email: customer.email!,
          phone: customer.phone!,
          company: customer.company,
          address: customer.address,
          status: customer.status || "potencial",
          notes: customer.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      setCustomers([data[0] as Customer, ...customers]);
      
      toast({
        title: "Cliente adicionado",
        description: "O novo cliente foi adicionado com sucesso."
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        title: "Erro ao salvar cliente",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const updateCustomer = async (customerId: string, customer: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('crm_customers')
        .update({
          name: customer.name!,
          email: customer.email!,
          phone: customer.phone!,
          company: customer.company,
          address: customer.address,
          status: customer.status,
          notes: customer.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId)
        .select();
      
      if (error) throw error;
      
      setCustomers(customers.map(c => 
        c.id === customerId ? {...data[0] as Customer} : c
      ));
      
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso."
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar cliente:", error);
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      // Excluir interações relacionadas
      const { error: interactionError } = await supabase
        .from('crm_interactions')
        .delete()
        .eq('customer_id', customerId);
      
      if (interactionError) throw interactionError;
      
      // Excluir negócios relacionados
      const { error: dealError } = await supabase
        .from('crm_deals')
        .delete()
        .eq('customer_id', customerId);
      
      if (dealError) throw dealError;
      
      // Excluir o cliente
      const { error } = await supabase
        .from('crm_customers')
        .delete()
        .eq('id', customerId);
      
      if (error) throw error;
      
      setCustomers(customers.filter(c => c.id !== customerId));
      
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso."
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao excluir cliente:", error);
      toast({
        title: "Erro ao excluir cliente",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    customers,
    loading,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
  };
};
