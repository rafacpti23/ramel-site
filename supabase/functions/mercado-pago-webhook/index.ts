
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuração do cliente Supabase
const supabaseUrl = "https://sdwizlvmaavmgjagmuyj.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Processar eventos do Mercado Pago
async function processPaymentEvent(payload: any) {
  console.log("Processando evento de pagamento:", payload);
  
  // Estrutura esperada para o webhook do Mercado Pago
  // https://www.mercadopago.com.br/developers/pt/docs/checkout-api/webhooks/ipn
  try {
    // Verificamos o tipo de notificação
    if (payload.type === "payment" && payload.data) {
      const paymentId = payload.data.id;
      
      // Buscar os detalhes do pagamento na API do Mercado Pago
      // Nota: Em produção, você deve usar a API do Mercado Pago para verificar o status do pagamento
      // Aqui estamos apenas simulando para fins de exemplo
      
      // Obter o e-mail do comprador do pagamento (simulado)
      const userEmail = payload.user?.email || payload.payer?.email;
      
      if (!userEmail) {
        console.error("Email do usuário não encontrado na notificação");
        return { success: false, error: "Email do usuário não encontrado" };
      }
      
      // Atualizar o status de pagamento do usuário no banco de dados
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .limit(1);
      
      if (profilesError || !profiles.length) {
        console.error("Erro ao buscar perfil do usuário:", profilesError || "Usuário não encontrado");
        return { success: false, error: "Usuário não encontrado" };
      }
      
      // Atualizar o status de pagamento para aprovado
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ payment_status: 'aprovado' })
        .eq('id', profiles[0].id);
      
      if (updateError) {
        console.error("Erro ao atualizar status de pagamento:", updateError);
        return { success: false, error: "Erro ao atualizar status de pagamento" };
      }
      
      // Registrar o pagamento
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: profiles[0].id,
          payment_id: paymentId.toString(),
          amount: payload.data.transaction_amount || 0,
          payment_method: 'mercado_pago',
          status: 'aprovado'
        });
      
      if (paymentError) {
        console.error("Erro ao registrar pagamento:", paymentError);
        // Não retornamos erro aqui porque o status já foi atualizado
      }
      
      return { success: true };
    }
    
    return { success: false, error: "Tipo de notificação não suportado" };
  } catch (error) {
    console.error("Erro ao processar evento de pagamento:", error);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  // Lidar com requisições OPTIONS (pré-voo CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Verificar método da requisição
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Método não suportado" }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Obter o corpo da requisição
    const payload = await req.json();
    console.log("Webhook do Mercado Pago recebido:", payload);
    
    // Processar o evento
    const result = await processPaymentEvent(payload);
    
    if (result.success) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
