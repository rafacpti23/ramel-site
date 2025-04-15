
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSystemConfig } from "@/hooks/useSystemConfig";
import WebhooksTab from "@/components/system-config/WebhooksTab";
import LiveChatTab from "@/components/system-config/LiveChatTab";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const SystemConfig = () => {
  const {
    loading,
    saving,
    webhookContactForm,
    setWebhookContactForm,
    webhookTicketResponse,
    setWebhookTicketResponse,
    liveChatCode,
    setLiveChatCode,
    liveChatEnabled,
    setLiveChatEnabled,
    chatButtonText,
    setChatButtonText,
    saveConfig
  } = useSystemConfig();
  
  // Add validation state
  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  // Function to validate URLs before saving
  const handleSave = () => {
    // Basic URL validation
    const validateUrl = (url: string): boolean => {
      if (!url) return true; // Empty URLs are allowed
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    };

    const contactUrlValid = validateUrl(webhookContactForm);
    const ticketUrlValid = validateUrl(webhookTicketResponse);

    if (!contactUrlValid || !ticketUrlValid) {
      setHasValidationErrors(true);
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros nos webhooks antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    // If all validations pass
    setHasValidationErrors(false);
    saveConfig();
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>
          Personalize as integrações e funcionalidades do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="webhooks">
          <TabsList className="mb-6">
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="chat">Chat ao Vivo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="webhooks">
            <WebhooksTab 
              webhookContactForm={webhookContactForm}
              setWebhookContactForm={setWebhookContactForm}
              webhookTicketResponse={webhookTicketResponse}
              setWebhookTicketResponse={setWebhookTicketResponse}
            />
          </TabsContent>
          
          <TabsContent value="chat">
            <LiveChatTab 
              liveChatEnabled={liveChatEnabled}
              setLiveChatEnabled={setLiveChatEnabled}
              chatButtonText={chatButtonText}
              setChatButtonText={setChatButtonText}
              liveChatCode={liveChatCode}
              setLiveChatCode={setLiveChatCode}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-8">
          <Button onClick={handleSave} disabled={saving || hasValidationErrors}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemConfig;
