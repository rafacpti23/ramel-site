
// Define the interface for system config data
export interface SystemConfigData {
  id: string;
  webhook_contact_form: string | null;
  webhook_ticket_response: string | null;
  live_chat_code: string | null;
  updated_at: string | null;
  updated_by: string | null;
  live_chat_enabled: boolean;
  chat_button_text: string;
  cal_api_key: string | null;
  contactFormWebhookUrl?: string;
  ticketCloseWebhookUrl?: string;
}
