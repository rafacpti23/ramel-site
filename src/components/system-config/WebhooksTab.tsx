
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSystemConfig } from "@/hooks/useSystemConfig";
import { Check, X } from "lucide-react";

const WebhooksTab = () => {
  const { config, updateConfig, saving } = useSystemConfig();
  const [contactFormWebhook, setContactFormWebhook] = useState("");
  const [ticketCloseWebhook, setTicketCloseWebhook] = useState("");
  const [isContactFormWebhookValid, setIsContactFormWebhookValid] = useState(true);
  const [isTicketCloseWebhookValid, setIsTicketCloseWebhookValid] = useState(true);

  useEffect(() => {
    if (config) {
      setContactFormWebhook(config.contactFormWebhookUrl || "");
      setTicketCloseWebhook(config.ticketCloseWebhookUrl || "");
    }
  }, [config]);

  const validateURL = (url: string) => {
    if (!url) return true; // Campo vazio é válido
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleContactFormWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContactFormWebhook(value);
    setIsContactFormWebhookValid(validateURL(value));
  };

  const handleTicketCloseWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTicketCloseWebhook(value);
    setIsTicketCloseWebhookValid(validateURL(value));
  };

  const handleSave = async () => {
    if (!isContactFormWebhookValid || !isTicketCloseWebhookValid) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os URLs inválidos antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateConfig({
        contactFormWebhookUrl: contactFormWebhook,
        ticketCloseWebhookUrl: ticketCloseWebhook,
      });

      toast({
        title: "Configurações de webhooks salvas",
        description: "Os webhooks foram atualizados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações de webhooks.",
        variant: "destructive",
      });
    }
  };

  const testWebhook = async (url: string, type: string) => {
    if (!url) {
      toast({
        title: "Webhook não configurado",
        description: `Adicione um URL de webhook para ${type} antes de testar.`,
        variant: "destructive",
      });
      return;
    }

    if (!validateURL(url)) {
      toast({
        title: "URL inválido",
        description: "Por favor, insira um URL válido antes de testar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const testData = {
        event: "test_event",
        message: `Teste de webhook para ${type}`,
        timestamp: new Date().toISOString(),
      };

      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
        mode: "no-cors", // Para evitar erros de CORS
      });

      toast({
        title: "Webhook testado",
        description: "Uma requisição de teste foi enviada para o webhook. Verifique se foi recebida corretamente.",
      });
    } catch (error) {
      toast({
        title: "Erro ao testar webhook",
        description: "Ocorreu um erro ao enviar a requisição de teste.",
        variant: "destructive",
      });
    }
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
        <div className="space-y-2">
          <Label htmlFor="contactFormWebhook">
            Webhook para Formulário de Contato
          </Label>
          <div className="relative">
            <Input
              id="contactFormWebhook"
              placeholder="https://exemplo.com/webhook"
              value={contactFormWebhook}
              onChange={handleContactFormWebhookChange}
              className={`pr-8 ${!isContactFormWebhookValid ? 'border-red-500' : ''}`}
            />
            {contactFormWebhook && (
              <div className="absolute right-2 top-2.5">
                {isContactFormWebhookValid ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          {!isContactFormWebhookValid && (
            <p className="text-xs text-red-500">URL inválido. Insira uma URL válida.</p>
          )}
          <p className="text-xs text-muted-foreground">
            Receba notificações quando o formulário de contato for preenchido.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticketCloseWebhook">
            Webhook para Fechamento de Tickets
          </Label>
          <div className="relative">
            <Input
              id="ticketCloseWebhook"
              placeholder="https://exemplo.com/webhook"
              value={ticketCloseWebhook}
              onChange={handleTicketCloseWebhookChange}
              className={`pr-8 ${!isTicketCloseWebhookValid ? 'border-red-500' : ''}`}
            />
            {ticketCloseWebhook && (
              <div className="absolute right-2 top-2.5">
                {isTicketCloseWebhookValid ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          {!isTicketCloseWebhookValid && (
            <p className="text-xs text-red-500">URL inválido. Insira uma URL válida.</p>
          )}
          <p className="text-xs text-muted-foreground">
            Receba notificações quando um ticket de suporte for fechado.
          </p>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button 
            onClick={() => testWebhook(contactFormWebhook, "formulário de contato")}
            variant="outline"
          >
            Testar Webhook de Contato
          </Button>
          <Button 
            onClick={() => testWebhook(ticketCloseWebhook, "fechamento de tickets")}
            variant="outline"
          >
            Testar Webhook de Tickets
          </Button>
        </div>

        <Button onClick={handleSave} className="w-full" disabled={saving || !isContactFormWebhookValid || !isTicketCloseWebhookValid}>
          {saving ? "Salvando..." : "Salvar Configurações de Webhook"}
        </Button>
      </div>
    </div>
  );
};

export default WebhooksTab;
