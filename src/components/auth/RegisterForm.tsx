import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PixPaymentInfo from "./PixPaymentInfo";

export function RegisterForm() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);

  const validateForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Remove qualquer formatação do WhatsApp para armazenar só os números
      const cleanWhatsapp = whatsapp.replace(/\D/g, '');
      
      // Realizar o cadastro
      await signUp(email, password, {
        fullName,
        whatsapp: cleanWhatsapp
      });
      
      // Indica que o usuário foi registrado com sucesso
      setUserRegistered(true);
    } catch (error: any) {
      console.error('Erro de cadastro:', error);
      setErrorMessage(error.message || 'Ocorreu um erro ao tentar fazer o cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      {userRegistered ? (
        <div className="space-y-4">
          <div className="bg-green-500/20 p-4 rounded-md text-green-300">
            <p className="font-semibold">Cadastro realizado com sucesso!</p>
            <p className="text-sm mt-1">
              Para finalizar seu cadastro, realize o pagamento via PIX conforme as instruções abaixo.
            </p>
          </div>
          
          <PixPaymentInfo 
            fullName={fullName} 
            email={email} 
            pixKey="nubank@ramelseg.com.br" 
          />
          
          <Button onClick={() => window.location.href = "/auth"} className="w-full">
            Voltar para login
          </Button>
        </div>
      ) : (
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
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registrando...
                </>
              ) : "Cadastrar"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
