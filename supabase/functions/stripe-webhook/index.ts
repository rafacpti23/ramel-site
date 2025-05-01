
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  try {
    // Obter a chave secreta do Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Chave secreta do Stripe não configurada");
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Obter payload do webhook
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) throw new Error("Assinatura do webhook não fornecida");
    
    // Verificar a assinatura do webhook (normalmente você configuraria uma chave de webhook específica)
    // Nota: Em produção, você usaria uma chave de webhook específica
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeKey // Idealmente, use uma chave específica do webhook em produção
    );
    
    console.log("Evento Stripe recebido:", event.type);
    
    // Inicializar cliente Supabase com service role para contornar RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Processar eventos diferentes
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      // Extrair metadata da sessão
      const userId = session.metadata?.user_id;
      if (!userId) {
        console.error("ID do usuário não encontrado nos metadados da sessão");
        return new Response("ID do usuário não encontrado", { status: 400 });
      }
      
      // Atualizar status de pagamento do perfil para 'aprovado'
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ payment_status: 'aprovado' })
        .eq('id', userId);
        
      if (profileUpdateError) {
        console.error("Erro ao atualizar perfil:", profileUpdateError);
        throw new Error(`Erro ao atualizar perfil: ${profileUpdateError.message}`);
      }
      
      // Atualizar informações do assinante
      const { error: subscriberUpdateError } = await supabase
        .from('subscribers')
        .upsert({
          user_id: userId,
          subscribed: true,
          subscription_tier: "mensal",
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
        
      if (subscriberUpdateError) {
        console.error("Erro ao atualizar assinante:", subscriberUpdateError);
        throw new Error(`Erro ao atualizar assinante: ${subscriberUpdateError.message}`);
      }
      
      console.log("Pagamento processado com sucesso para o usuário:", userId);
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao processar webhook" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
