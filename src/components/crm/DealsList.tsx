import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Deal, Customer } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DealForm from "./forms/DealForm";
import { StatusBadge } from "./components/StatusBadge";

const DealsList = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);

  useEffect(() => {
    fetchDeals();
    fetchCustomers();
  }, []);

  const fetchDeals = async () => {
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeals(data as any[]);
    } catch (error: any) {
      console.error("Erro ao buscar negócios:", error);
      toast({
        title: "Erro ao carregar negócios",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_customers')
        .select('id, name')
        .eq('status', 'ativo')
        .order('name');

      if (error) throw error;
      setCustomers(data as Customer[]);
    } catch (error: any) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === "todos" ? null : value);
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.customer?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? deal.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddDeal = () => {
    if (customers.length > 0) {
      setIsCustomerDialogOpen(true);
    } else {
      toast({
        title: "Nenhum cliente disponível",
        description: "Adicione clientes antes de criar negócios.",
        variant: "destructive"
      });
    }
  };

  const handleCustomerSelected = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setIsCustomerDialogOpen(false);
    setIsFormDialogOpen(true);
  };

  const handleSaveDeal = async (deal: Partial<Deal>) => {
    if (!selectedCustomerId) return;
    
    try {
      const { data, error } = await supabase
        .from('crm_deals')
        .insert({
          ...deal,
          customer_id: selectedCustomerId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          crm_customers:customer_id (
            name,
            email,
            phone
          )
        `);
      
      if (error) throw error;
      
      setDeals([data[0] as any, ...deals]);
      setIsFormDialogOpen(false);
      
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
    } finally {
      setSelectedCustomerId(null);
    }
  };

  const getDealStatusBadge = (status: string) => {
    switch (status) {
      case 'prospeccao':
        return <Badge className="bg-purple-500">Prospecção</Badge>;
      case 'qualificado':
        return <Badge className="bg-blue-500">Qualificado</Badge>;
      case 'proposta':
        return <Badge className="bg-yellow-500">Proposta</Badge>;
      case 'negociacao':
        return <Badge className="bg-orange-500">Negociação</Badge>;
      case 'fechado_ganho':
        return <Badge className="bg-green-500">Fechado (Ganho)</Badge>;
      case 'fechado_perdido':
        return <Badge className="bg-destructive">Fechado (Perdido)</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Negócios ({deals.length})</h2>
        <Button onClick={handleAddDeal}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Negócio
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar negócios..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Select onValueChange={handleStatusFilterChange} defaultValue="todos">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="prospeccao">Prospecção</SelectItem>
            <SelectItem value="qualificado">Qualificado</SelectItem>
            <SelectItem value="proposta">Proposta</SelectItem>
            <SelectItem value="negociacao">Negociação</SelectItem>
            <SelectItem value="fechado_ganho">Fechado (Ganho)</SelectItem>
            <SelectItem value="fechado_perdido">Fechado (Perdido)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-ramel" />
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum negócio encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Previsão Fechamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map((deal: any) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">
                    {deal.customer?.name || "Cliente Desconhecido"}
                  </TableCell>
                  <TableCell>{deal.title}</TableCell>
                  <TableCell>{formatCurrency(deal.value)}</TableCell>
                  <TableCell>{getDealStatusBadge(deal.status)}</TableCell>
                  <TableCell>{new Date(deal.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    {deal.expected_close_date
                      ? new Date(deal.expected_close_date).toLocaleDateString('pt-BR')
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Diálogo de seleção de cliente */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Selecione um cliente</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select onValueChange={handleCustomerSelected}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Formulário de negócio */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Negócio</DialogTitle>
          </DialogHeader>
          <DealForm
            onSave={handleSaveDeal}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DealsList;
