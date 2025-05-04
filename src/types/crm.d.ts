
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  status: 'ativo' | 'inativo' | 'potencial';
  notes?: string;
}

export interface Interaction {
  id: string;
  customer_id: string;
  type: 'email' | 'ligacao' | 'reuniao' | 'whatsapp' | 'outro';
  description: string;
  date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  customer_id: string;
  title: string;
  value: number;
  status: 'prospeccao' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado_ganho' | 'fechado_perdido';
  created_at: string;
  expected_close_date?: string;
  updated_at: string;
  notes?: string;
  customer?: Customer;
}

export interface CustomerWithDeals extends Customer {
  deals?: Deal[];
  interactions?: Interaction[];
}
