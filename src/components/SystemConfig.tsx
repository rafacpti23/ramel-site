
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SystemConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [webhookContactForm, setWebhookContactForm] = useState("");
  const [webhookTicketResponse, setWebhookTicketResponse] = useState("");
  const [liveChatCode, setLiveChatCode] = useState("");
  
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
        setWebhookContactForm(data.webhook_contact_form || "");
        setWebhookTicketResponse(data.webhook_ticket_response || "");
        setLiveChatCode(data.live_chat_code || "");
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
        // Atualiza a configuração existente
        result = await supabase
          .from('system_config')
          .update({
            webhook_contact_form: webhookContactForm,
            webhook_ticket_response: webhookTicketResponse,
            live_chat_code: liveChatCode,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfig.id);
      } else {
        // Insere uma nova configuração
        result = await supabase
          .from('system_config')
          .insert({
            webhook_contact_form: webhookContactForm,
            webhook_ticket_response: webhookTicketResponse,
            live_chat_code: liveChatCode,
            updated_at: new Date().toISOString()
          });
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso."
      });
      
      // Se o código de chat ao vivo foi alterado, avise para recarregar a página
      toast({
        title: "Aviso importante",
        description: "Para que as alterações no chat ao vivo entrem em vigor, é necessário recarregar a página."
      });
      
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
              
              <div className="space-y-3">
                <Label htmlFor="chat-code">Código do Chat ao Vivo</Label>
                <Textarea
                  id="chat-code"
                  placeholder="<!-- Cole aqui o código do seu serviço de chat (Tawk.to, Crisp, etc) -->"
                  value={liveChatCode}
                  onChange={(e) => setLiveChatCode(e.target.value)}
                  rows={8}
                />
                <p className="text-sm text-muted-foreground">
                  Cole o código de integração fornecido pelo seu serviço de chat ao vivo,
                  como Tawk.to, Crisp, LiveChat, etc.
                </p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 mt-4">
                <h4 className="font-medium text-green-500 mb-2">Código Tawk.to Já Configurado</h4>
                <p className="text-sm">
                  O código do Tawk.to já foi adicionado ao site. Caso queira alterá-lo, 
                  cole o novo código no campo acima e salve as configurações. Para usar o código padrão,
                  deixe este campo em branco.
                </p>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-4 mt-4">
                <h4 className="font-medium text-amber-500 mb-2">Instruções para Chat ao Vivo</h4>
                <p className="text-sm">
                  1. Registre-se em um serviço de chat ao vivo (Tawk.to, Crisp, etc)<br />
                  2. Configure seu widget de chat na plataforma escolhida<br />
                  3. Obtenha o código de integração (geralmente snippets JavaScript)<br />
                  4. Cole o código completo no campo acima<br />
                  5. Salve as configurações
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
