
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function RegisterForm() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValidated, setFormValidated] = useState(false);

  const validateForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    // Formulário validado, mostra diálogo para pagamento
    setFormValidated(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Remove qualquer formatação do WhatsApp para armazenar só os números
      const cleanWhatsapp = whatsapp.replace(/\D/g, '');
      
      await signUp(email, password, fullName, cleanWhatsapp);
      // A navegação será tratada no AuthContext após o login bem-sucedido
    } catch (error: any) {
      console.error('Erro de cadastro:', error);
      setErrorMessage(error.message || 'Ocorreu um erro ao tentar fazer o cadastro.');
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const redirectToMercadoPago = () => {
    // URL do Mercado Pago fornecida
    window.location.href = "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c93808496006df9019639ee18ef20d6";
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={validateForm}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              placeholder="Seu nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="exemplo@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              placeholder="(99) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Seu WhatsApp será usado para comunicações importantes
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirme a senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          {errorMessage && (
            <div className="bg-destructive/20 text-destructive p-3 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
          
          <Button type="submit" className="w-full">
            Prosseguir para pagamento
          </Button>
        </div>
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pagamento da Assinatura</DialogTitle>
            <DialogDescription>
              Para finalizar seu cadastro, você será redirecionado para o Mercado Pago para realizar o pagamento da assinatura.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p>
              Após o pagamento, você terá acesso completo à nossa plataforma. Você pode pagar com cartão de crédito, boleto 
              ou PIX (itau@ramelseg.com.br).
            </p>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={redirectToMercadoPago}>
                Ir para pagamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
