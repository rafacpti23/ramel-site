
export interface Ticket {
  id: string;
  title: string;
  status: string;
  created_at: string;
  user_id: string;
  user_email?: string | null;
  user_name?: string | null;
  user_whatsapp?: string | null;
}
