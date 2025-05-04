
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface DashboardStats {
  totalCustomers: number;
  totalDeals: number;
  totalOpenDeals: number;
  totalClosedDeals: number;
  totalRevenue: number;
  customersByStatus: Array<{name: string, value: number}>;
  dealsByStatus: Array<{name: string, value: number, amount: number}>;
}

const initialStats: DashboardStats = {
  totalCustomers: 0,
  totalDeals: 0,
  totalOpenDeals: 0,
  totalClosedDeals: 0,
  totalRevenue: 0,
  customersByStatus: [],
  dealsByStatus: []
};

const statusColors = {
  prospeccao: "#9333ea",  // purple-500
  qualificado: "#3b82f6",  // blue-500
  proposta: "#eab308",  // yellow-500
  negociacao: "#f97316",  // orange-500
  fechado_ganho: "#22c55e",  // green-500
  fechado_perdido: "#ef4444",  // red-500
  ativo: "#22c55e",  // green-500
  inativo: "#6b7280",  // gray-500
  potencial: "#3b82f6"  // blue-500
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const customerStatusNames = {
  ativo: "Ativo",
  inativo: "Inativo",
  potencial: "Potencial"
};

const dealStatusNames = {
  prospeccao: "Prospecção",
  qualificado: "Qualificado",
  proposta: "Proposta",
  negociacao: "Negociação",
  fechado_ganho: "Fechado (Ganho)",
  fechado_perdido: "Fechado (Perdido)"
};

const CrmDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  
  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Buscar estatísticas de clientes
      const { count: customerCount, error: customerError } = await supabase
        .from('crm_customers')
        .select('*', { count: 'exact', head: true });
      
      if (customerError) throw customerError;
      
      // Buscar estatísticas de negócios
      const { data: deals, error: dealsError } = await supabase
        .from('crm_deals')
        .select('*');
      
      if (dealsError) throw dealsError;
      
      // Calcular estatísticas de clientes por status
      const { data: customerStatusData, error: customerStatusError } = await supabase
        .from('crm_customers')
        .select('status');
      
      if (customerStatusError) throw customerStatusError;
      
      // Processar dados de status de clientes manualmente
      const customerStatusCounts: {[key: string]: number} = {};
      customerStatusData?.forEach(customer => {
        const status = customer.status;
        customerStatusCounts[status] = (customerStatusCounts[status] || 0) + 1;
      });
      
      const formattedCustomersByStatus = Object.keys(customerStatusCounts).map(status => ({
        name: customerStatusNames[status as keyof typeof customerStatusNames] || status,
        value: customerStatusCounts[status]
      }));
      
      // Calcular estatísticas de negócios por status
      const { data: dealStatusData, error: dealStatusError } = await supabase
        .from('crm_deals')
        .select('status, value');
      
      if (dealStatusError) throw dealStatusError;
      
      // Processar dados de status de negócios manualmente
      const dealStatusCounts: {[key: string]: {count: number, sum: number}} = {};
      dealStatusData?.forEach(deal => {
        const status = deal.status;
        if (!dealStatusCounts[status]) {
          dealStatusCounts[status] = { count: 0, sum: 0 };
        }
        dealStatusCounts[status].count += 1;
        dealStatusCounts[status].sum += Number(deal.value) || 0;
      });
      
      const formattedDealsByStatus = Object.keys(dealStatusCounts).map(status => ({
        name: dealStatusNames[status as keyof typeof dealStatusNames] || status,
        value: dealStatusCounts[status].count,
        amount: dealStatusCounts[status].sum
      }));
      
      // Processar os dados
      const closedDeals = deals?.filter(d => d.status === 'fechado_ganho' || d.status === 'fechado_perdido') || [];
      const openDeals = deals?.filter(d => d.status !== 'fechado_ganho' && d.status !== 'fechado_perdido') || [];
      const totalRevenue = deals
        ?.filter(d => d.status === 'fechado_ganho')
        .reduce((sum, deal) => sum + (Number(deal.value) || 0), 0) || 0;
      
      setStats({
        totalCustomers: customerCount || 0,
        totalDeals: deals?.length || 0,
        totalOpenDeals: openDeals.length,
        totalClosedDeals: closedDeals.length,
        totalRevenue,
        customersByStatus: formattedCustomersByStatus,
        dealsByStatus: formattedDealsByStatus
      });
      
    } catch (error: any) {
      console.error("Erro ao buscar estatísticas:", error);
      toast({
        title: "Erro ao carregar dashboard",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-ramel" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Negócios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeals}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalOpenDeals} em aberto • {stats.totalClosedDeals} fechados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total (Negócios Fechados)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clientes por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {stats.customersByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.customersByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.customersByStatus.map((entry, index) => {
                        const status = Object.keys(customerStatusNames).find(
                          key => customerStatusNames[key as keyof typeof customerStatusNames] === entry.name
                        );
                        const color = status ? statusColors[status as keyof typeof statusColors] : "#cbd5e1";
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value} clientes`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Nenhum dado disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Negócios por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {stats.dealsByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.dealsByStatus}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name, props) => {
                      return name === "amount" 
                        ? [formatCurrency(value as number), "Valor"] 
                        : [`${value} negócios`, "Quantidade"];
                    }} />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name="Quantidade" 
                      fill="#4b5563" 
                    />
                    <Bar 
                      dataKey="amount" 
                      name="Valor" 
                      fill="#14b8a6" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Nenhum dado disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrmDashboard;
