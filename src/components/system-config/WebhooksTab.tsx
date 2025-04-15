
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface WebhooksTabProps {
  webhookContactForm: string;
  setWebhookContactForm: (value: string) => void;
  webhookTicketResponse: string;
  setWebhookTicketResponse: (value: string) => void;
}

const WebhooksTab = ({
  webhookContactForm,
  setWebhookContactForm,
  webhookTicketResponse,
  setWebhookTicketResponse
}: WebhooksTabProps) => {
  const [contactUrlError, setContactUrlError] = useState<string | null>(null);
  const [ticketUrlError, setTicketUrlError] = useState<string | null>(null);

  // Validate URL format
  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty URLs are allowed
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle contact form webhook URL change
  const handleContactWebhookChange = (value: string) => {
    setWebhookContactForm(value);
    if (value && !validateUrl(value)) {
      setContactUrlError("Por favor, insira uma URL válida (ex: https://exemplo.com/webhook)");
    } else {
      setContactUrlError(null);
    }
  };

  // Handle ticket response webhook URL change
  const handleTicketWebhookChange = (value: string) => {
    setWebhookTicketResponse(value);
    if (value && !validateUrl(value)) {
      setTicketUrlError("Por favor, insira uma URL válida (ex: https://exemplo.com/webhook)");
    } else {
      setTicketUrlError(null);
    }
  };

  // Validate URLs on component mount
  useEffect(() => {
    if (webhookContactForm) handleContactWebhookChange(webhookContactForm);
    if (webhookTicketResponse) handleTicketWebhookChange(webhookTicketResponse);
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Webhooks de Integração</h3>
      
      <div className="space-y-3">
        <Label htmlFor="webhook-contact">Webhook de Formulário de Contato</Label>
        <Input
          id="webhook-contact"
          placeholder="https://seuwebhook.com/contato"
          value={webhookContactForm}
          onChange={(e) => handleContactWebhookChange(e.target.value)}
          className={contactUrlError ? "border-destructive" : ""}
        />
        {contactUrlError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs ml-2">{contactUrlError}</AlertDescription>
          </Alert>
        )}
        <p className="text-sm text-muted-foreground">
          Quando um visitante preencher o formulário de contato, os dados serão enviados para este webhook.
        </p>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="webhook-ticket">Webhook de Resposta de Ticket</Label>
        <Input
          id="webhook-ticket"
          placeholder="https://seuwebhook.com/tickets"
          value={webhookTicketResponse}
          onChange={(e) => handleTicketWebhookChange(e.target.value)}
          className={ticketUrlError ? "border-destructive" : ""}
        />
        {ticketUrlError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs ml-2">{ticketUrlError}</AlertDescription>
          </Alert>
        )}
        <p className="text-sm text-muted-foreground">
          Quando um ticket receber uma resposta, os dados serão enviados para este webhook.
          O número de WhatsApp do usuário será incluído para possíveis integrações.
        </p>
      </div>
      
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-4 mt-4">
        <h4 className="font-medium text-amber-500 mb-2">Instruções para Webhooks</h4>
        <p className="text-sm">
          1. Crie um fluxo no seu serviço preferido (Make.com, Zapier, etc)<br />
          2. Adicione um trigger de "Webhook" e copie a URL fornecida<br />
          3. Cole a URL nos campos acima de acordo com a integração desejada<br />
          4. Configure suas ações com os dados recebidos no webhook
        </p>
      </div>
    </div>
  );
};

export default WebhooksTab;
