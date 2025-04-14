
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      // Enviar para o email configurado e webhook se existir
      const { data: configData } = await supabase
        .from('system_config')
        .select('webhook_contact_form')
        .single();
      
      // Se tiver webhook configurado, enviar os dados
      if (configData?.webhook_contact_form) {
        try {
          await fetch(configData.webhook_contact_form, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'no-cors',
            body: JSON.stringify({
              name,
              email,
              phone,
              message,
              date: new Date().toISOString()
            }),
          });
        } catch (webhookError) {
          console.error('Erro ao enviar para webhook:', webhookError);
        }
      }
      
      // Independente do webhook, enviar para o email configurado
      try {
        await fetch('mailto:contato@ramelseg.com.br', {
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            phone,
            message
          })
        });
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
      }
      
      toast({
        title: "Mensagem enviada",
        description: "Agradecemos seu contato. Retornaremos em breve!",
      });

      // Limpar formulário
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Fale Conosco</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tem alguma dúvida ou deseja mais informações sobre nossos serviços? 
            Entre em contato conosco através do formulário abaixo ou pelos nossos canais de atendimento.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="glass-card p-6 rounded-lg">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    placeholder="Seu nome completo" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone/WhatsApp</Label>
                  <Input 
                    id="phone" 
                    placeholder="(99) 99999-9999" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Descreva sua solicitação" 
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="space-y-8">
            <div className="glass-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Informações de Contato</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Email:</p>
                  <a href="mailto:contato@ramelseg.com.br" className="text-ramel hover:underline">
                    contato@ramelseg.com.br
                  </a>
                </div>
                
                <div>
                  <p className="font-medium">WhatsApp:</p>
                  <a href="https://wa.me/5527999082624" target="_blank" rel="noopener noreferrer" className="text-ramel hover:underline">
                    (27) 99908-2624
                  </a>
                </div>
                
                <div>
                  <p className="font-medium">Atendimento:</p>
                  <p>Segunda a Sexta: 08:00 - 18:00</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Suporte Técnico</h3>
              <p className="mb-4">
                Precisa de ajuda com nossos produtos? Nossa equipe de suporte está pronta para ajudar.
              </p>
              <Button variant="outline" asChild>
                <a href="https://wa.me/5527999082624?text=Olá,%20preciso%20de%20suporte%20técnico" target="_blank" rel="noopener noreferrer">
                  Contatar Suporte
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
