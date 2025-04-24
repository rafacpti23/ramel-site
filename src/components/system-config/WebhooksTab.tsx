
import { Button } from "@/components/ui/button";
import { useSystemConfig } from "@/hooks/useSystemConfig";
import WebhookInput from "./webhooks/WebhookInput";
import WebhookTestButtons from "./webhooks/WebhookTestButtons";
import { useWebhookValidation } from "./webhooks/useWebhookValidation";

const WebhooksTab = () => {
  const { config, updateConfig, saving } = useSystemConfig();
  
  const {
    value: contactFormWebhook,
    isValid: isContactFormWebhookValid,
    handleChange: handleContactFormWebhookChange,
  } = useWebhookValidation(config?.contactFormWebhookUrl || "");

  const {
    value: ticketCloseWebhook,
    isValid: isTicketCloseWebhookValid,
    handleChange: handleTicketCloseWebhookChange,
  } = useWebhookValidation(config?.ticketCloseWebhookUrl || "");

  const handleSave = async () => {
    if (!isContactFormWebhookValid || !isTicketCloseWebhookValid) {
      return;
    }

    await updateConfig({
      contactFormWebhookUrl: contactFormWebhook,
      ticketCloseWebhookUrl: ticketCloseWebhook,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Configurações de Webhooks</h3>
        <p className="text-sm text-muted-foreground">
          Configure URLs de webhook para receber notificações de eventos do sistema.
        </p>
      </div>

      <div className="space-y-4">
        <WebhookInput
          id="contactFormWebhook"
          label="Webhook para Formulário de Contato"
          description="Receba notificações quando o formulário de contato for preenchido."
          value={contactFormWebhook}
          onChange={handleContactFormWebhookChange}
          isValid={isContactFormWebhookValid}
          showValidation={true}
        />

        <WebhookInput
          id="ticketCloseWebhook"
          label="Webhook para Fechamento de Tickets"
          description="Receba notificações quando um ticket de suporte for fechado."
          value={ticketCloseWebhook}
          onChange={handleTicketCloseWebhookChange}
          isValid={isTicketCloseWebhookValid}
          showValidation={true}
        />

        <WebhookTestButtons 
          contactFormWebhook={contactFormWebhook}
          ticketCloseWebhook={ticketCloseWebhook}
        />

        <Button 
          onClick={handleSave} 
          className="w-full" 
          disabled={saving || !isContactFormWebhookValid || !isTicketCloseWebhookValid}
        >
          {saving ? "Salvando..." : "Salvar Configurações de Webhook"}
        </Button>
      </div>
    </div>
  );
};

export default WebhooksTab;
