
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Webhooks de Integração</h3>
      
      <div className="space-y-3">
        <Label htmlFor="webhook-contact">Webhook de Formulário de Contato</Label>
        <Input
          id="webhook-contact"
          placeholder="https://seuwebhook.com/contato"
          value={webhookContactForm}
          onChange={(e) => setWebhookContactForm(e.target.value)}
        />
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
          onChange={(e) => setWebhookTicketResponse(e.target.value)}
        />
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
