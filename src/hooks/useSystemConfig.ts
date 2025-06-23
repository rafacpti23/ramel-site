
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { LiveChatService } from "@/services/LiveChatService";
import { SystemConfigData } from "@/types/systemConfig";
import { SystemConfigService } from "@/services/systemConfigService";
import { validateWebhookUrls } from "@/utils/systemConfigValidation";

export const useSystemConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [webhookContactForm, setWebhookContactForm] = useState("");
  const [webhookTicketResponse, setWebhookTicketResponse] = useState("");
  const [liveChatCode, setLiveChatCode] = useState("");
  const [liveChatEnabled, setLiveChatEnabled] = useState(true);
  const [chatButtonText, setChatButtonText] = useState("Estamos aqui!");
  const [calApiKey, setCalApiKey] = useState("");
  const [config, setConfig] = useState<SystemConfigData | null>(null);
  
  const fetchConfig = async () => {
    try {
      const data = await SystemConfigService.fetchConfig();
      
      if (data) {
        setWebhookContactForm(data.webhook_contact_form || "");
        setWebhookTicketResponse(data.webhook_ticket_response || "");
        setLiveChatCode(data.live_chat_code || "");
        setCalApiKey(data.cal_api_key || "");
        
        setLiveChatEnabled(
          typeof data.live_chat_enabled !== 'undefined' 
            ? (data.live_chat_enabled as boolean) 
            : true
        );
        
        setChatButtonText(
          typeof data.chat_button_text !== 'undefined' 
            ? (data.chat_button_text as string) 
            : "Estamos aqui!"
        );

        setConfig({
          ...data,
          contactFormWebhookUrl: data.webhook_contact_form || "",
          ticketCloseWebhookUrl: data.webhook_ticket_response || ""
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações do sistema.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const saveConfig = async () => {
    const validation = validateWebhookUrls(webhookContactForm, webhookTicketResponse);
    
    if (!validation.isValid) {
      toast({
        title: "URL inválida",
        description: validation.errors[0],
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    try {
      await SystemConfigService.saveConfig({
        webhook_contact_form: webhookContactForm,
        webhook_ticket_response: webhookTicketResponse,
        live_chat_code: liveChatCode,
        cal_api_key: calApiKey,
        live_chat_enabled: liveChatEnabled,
        chat_button_text: chatButtonText
      });

      setConfig({
        ...(config || {}),
        webhook_contact_form: webhookContactForm,
        webhook_ticket_response: webhookTicketResponse,
        live_chat_code: liveChatCode,
        cal_api_key: calApiKey,
        live_chat_enabled: liveChatEnabled,
        chat_button_text: chatButtonText,
        contactFormWebhookUrl: webhookContactForm,
        ticketCloseWebhookUrl: webhookTicketResponse,
        updated_at: new Date().toISOString()
      } as SystemConfigData);
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso."
      });
      
      LiveChatService.updateLiveChat(liveChatEnabled, chatButtonText, liveChatCode);
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar as configurações do sistema.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = async (configData: Partial<SystemConfigData>) => {
    if (configData.contactFormWebhookUrl !== undefined) {
      setWebhookContactForm(configData.contactFormWebhookUrl);
    }
    if (configData.ticketCloseWebhookUrl !== undefined) {
      setWebhookTicketResponse(configData.ticketCloseWebhookUrl);
    }
    
    return saveConfig();
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (!loading) {
      LiveChatService.updateLiveChat(liveChatEnabled, chatButtonText, liveChatCode);
    }
  }, [loading]);

  return {
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
    calApiKey,
    setCalApiKey,
    saveConfig,
    config,
    updateConfig
  };
};
