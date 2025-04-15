
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LiveChatService } from "@/services/LiveChatService";

// Define the interface for system config data
interface SystemConfigData {
  id: string;
  webhook_contact_form: string | null;
  webhook_ticket_response: string | null;
  live_chat_code: string | null;
  updated_at: string | null;
  updated_by: string | null;
  // Add additional fields with correct types
  live_chat_enabled: boolean;
  chat_button_text: string;
}

export const useSystemConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [webhookContactForm, setWebhookContactForm] = useState("");
  const [webhookTicketResponse, setWebhookTicketResponse] = useState("");
  const [liveChatCode, setLiveChatCode] = useState("");
  const [liveChatEnabled, setLiveChatEnabled] = useState(true);
  const [chatButtonText, setChatButtonText] = useState("Estamos aqui!");
  
  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('*')
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        // Use the data with safe type assertions and fallbacks
        setWebhookContactForm(data.webhook_contact_form || "");
        setWebhookTicketResponse(data.webhook_ticket_response || "");
        setLiveChatCode(data.live_chat_code || "");
        
        // For the properties not in the type definition, use type assertion with fallbacks
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
    setSaving(true);
    try {
      // Primeiro verifica se existe uma configuração na tabela
      const { data: existingConfig, error: fetchError } = await supabase
        .from('system_config')
        .select('id')
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      
      let result;
      
      if (existingConfig) {
        // Atualiza a configuração existente com todos os campos esperados
        result = await supabase
          .from('system_config')
          .update({
            webhook_contact_form: webhookContactForm,
            webhook_ticket_response: webhookTicketResponse,
            live_chat_code: liveChatCode,
            // Add these fields with our local variables
            live_chat_enabled: liveChatEnabled,
            chat_button_text: chatButtonText,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfig.id);
      } else {
        // Insere uma nova configuração com todos os campos esperados
        result = await supabase
          .from('system_config')
          .insert({
            webhook_contact_form: webhookContactForm,
            webhook_ticket_response: webhookTicketResponse,
            live_chat_code: liveChatCode,
            // Add these fields with our local variables
            live_chat_enabled: liveChatEnabled,
            chat_button_text: chatButtonText,
            updated_at: new Date().toISOString()
          });
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso."
      });
      
      // Atualiza o chat ao vivo sem precisar recarregar a página
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

  useEffect(() => {
    fetchConfig();
  }, []);

  // If chat settings change and chat is enabled, update the live chat
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
    saveConfig
  };
};
