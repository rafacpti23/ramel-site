
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface WebhookTestButtonsProps {
  contactFormWebhook: string;
  ticketCloseWebhook: string;
}

const WebhookTestButtons = ({ contactFormWebhook, ticketCloseWebhook }: WebhookTestButtonsProps) => {
  const testWebhook = async (url: string, type: string) => {
    if (!url) {
      toast({
        title: "Webhook não configurado",
        description: `Adicione um URL de webhook para ${type} antes de testar.`,
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
        mode: "no-cors",
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
  );
};

export default WebhookTestButtons;
