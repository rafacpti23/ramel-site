
import { supabase } from "@/integrations/supabase/client";
import { SystemConfigData } from "@/types/systemConfig";

export class SystemConfigService {
  static async fetchConfig(): Promise<SystemConfigData | null> {
    const { data, error } = await supabase
      .from('system_config')
      .select('*')
      .maybeSingle();
      
    if (error) throw error;
    return data;
  }

  static async saveConfig(configData: {
    webhook_contact_form: string;
    webhook_ticket_response: string;
    live_chat_code: string;
    cal_api_key: string;
    live_chat_enabled: boolean;
    chat_button_text: string;
  }): Promise<void> {
    // Primeiro verifica se existe uma configuração na tabela
    const { data: existingConfig, error: fetchError } = await supabase
      .from('system_config')
      .select('id')
      .maybeSingle();
      
    if (fetchError) throw fetchError;
    
    const updateData = {
      ...configData,
      updated_at: new Date().toISOString()
    };
    
    let result;
    
    if (existingConfig) {
      // Atualiza a configuração existente
      result = await supabase
        .from('system_config')
        .update(updateData)
        .eq('id', existingConfig.id);
    } else {
      // Insere uma nova configuração
      result = await supabase
        .from('system_config')
        .insert(updateData);
    }
    
    if (result.error) throw result.error;
  }
}
