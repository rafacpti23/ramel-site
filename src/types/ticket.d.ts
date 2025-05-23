
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  user_whatsapp?: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  created_at: string;
  is_admin?: boolean;
  user?: {
    full_name?: string;
    email?: string;
  };
}

export interface TicketWithMessages extends Ticket {
  messages: TicketMessage[];
}
