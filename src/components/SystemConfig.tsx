
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Define a local interface to extend the database type with our expected fields
interface SystemConfigData {
  id: string;
  webhook_contact_form: string | null;
  webhook_ticket_response: string | null;
  live_chat_code: string | null;
  updated_at: string | null;
  updated_by: string | null;
  // Add these fields with correct types even if they're not in the type definition
  live_chat_enabled: boolean;
  chat_button_text: string;
}

const SystemConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [webhookContactForm, setWebhookContactForm] = useState("");
  const [webhookTicketResponse, setWebhookTicketResponse] = useState("");
  const [liveChatCode, setLiveChatCode] = useState("");
  const [liveChatEnabled, setLiveChatEnabled] = useState(true);
  const [chatButtonText, setChatButtonText] = useState("Estamos aqui!");
  
  useEffect(() => {
    fetchConfig();
  }, []);
  
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
      updateLiveChat();
      
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

  // Função para atualizar o chat ao vivo dinamicamente
  const updateLiveChat = () => {
    // Remove qualquer script Tawk.to existente
    const existingScript = document.getElementById('tawk-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Se o chat estiver habilitado, adiciona o script novamente
    if (liveChatEnabled) {
      const tawkScript = document.createElement('script');
      tawkScript.id = 'tawk-script';
      tawkScript.type = 'text/javascript';
      
      // Se tiver código personalizado, use-o
      if (liveChatCode.trim()) {
        tawkScript.innerHTML = liveChatCode;
      } else {
        // Caso contrário, use o código padrão
        tawkScript.innerHTML = `
          var Tawk_API=Tawk_API||{};
          Tawk_API.customStyle = {
            zIndex: 1000,
            visibility: {
              desktop: {
                bubble: true,
                text: "${chatButtonText}"
              },
              mobile: {
                bubble: true,
                text: "${chatButtonText}"
              }
            }
          };
          Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/67fd89792656e4190ca976b2/1ior6215a';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `;
      }
      
      document.body.appendChild(tawkScript);
    }

    // Notifica o usuário sobre a atualização
    toast({
      title: liveChatEnabled ? "Chat ao vivo ativado" : "Chat ao vivo desativado",
      description: liveChatEnabled ? "O chat ao vivo foi ativado com suas configurações." : "O chat ao vivo foi desativado."
    });
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
          
          <TabsContent value="webhooks" className="space-y-6">
            <div className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="chat" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Chat ao Vivo</h3>
              
              <div className="flex items-center space-x-2 mb-6">
                <Switch 
                  id="chat-enabled"
                  checked={liveChatEnabled} 
                  onCheckedChange={setLiveChatEnabled}
                />
                <Label htmlFor="chat-enabled" className="font-medium">
                  {liveChatEnabled ? "Chat ao vivo ativado" : "Chat ao vivo desativado"}
                </Label>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="chat-text">Texto do Botão de Chat</Label>
                <Input
                  id="chat-text"
                  placeholder="Estamos aqui!"
                  value={chatButtonText}
                  onChange={(e) => setChatButtonText(e.target.value)}
                  disabled={!liveChatEnabled}
                />
                <p className="text-sm text-muted-foreground">
                  Este texto será exibido no botão de chat quando o visitante acessar seu site.
                </p>
              </div>

              <div className="space-y-3 mt-6">
                <Label htmlFor="chat-code">Código Personalizado (Opcional)</Label>
                <Textarea
                  id="chat-code"
                  placeholder="<!-- Cole aqui o código do seu serviço de chat (Tawk.to, Crisp, etc) -->"
                  value={liveChatCode}
                  onChange={(e) => setLiveChatCode(e.target.value)}
                  rows={8}
                  disabled={!liveChatEnabled}
                />
                <p className="text-sm text-muted-foreground">
                  Se desejar usar código completamente personalizado, cole-o aqui. 
                  Caso contrário, deixe em branco para usar as configurações acima.
                </p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 mt-4">
                <h4 className="font-medium text-green-500 mb-2">Chat do Tawk.to Configurado</h4>
                <p className="text-sm">
                  Um chat do Tawk.to já está pré-configurado para seu site. Você pode:
                  <br />1. Ativar/desativar o chat usando o botão acima
                  <br />2. Personalizar o texto do botão de chat
                  <br />3. Ou substituir completamente colando seu próprio código no campo acima
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-8">
          <Button onClick={saveConfig} disabled={saving}>
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
