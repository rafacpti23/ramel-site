
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PixPaymentInfoProps {
  fullName: string;
  email: string;
  pixKey: string;
}

const PixPaymentInfo = ({ fullName, email, pixKey }: PixPaymentInfoProps) => {
  const [pixDescription, setPixDescription] = useState('');
  
  useEffect(() => {
    // Create a description with user information for identification
    const description = `Cadastro Ramel - ${fullName} (${email})`;
    setPixDescription(description);
  }, [fullName, email]);
  
  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    toast({
      title: "Chave PIX copiada!",
      description: "A chave PIX foi copiada para sua área de transferência.",
    });
  };
  
  const handleCopyDescription = () => {
    navigator.clipboard.writeText(pixDescription);
    toast({
      title: "Descrição copiada!",
      description: "A descrição do pagamento foi copiada para sua área de transferência.",
    });
  };

  return (
    <Card className="p-6 bg-secondary/30 border border-primary/20 mb-4">
      <h3 className="text-xl font-bold mb-4">Pagamento via PIX</h3>
      <p className="mb-4">
        Para finalizar seu cadastro, realize o pagamento de R$ 29,90 via PIX usando os dados abaixo:
      </p>
      
      <div className="space-y-4">
        <div className="bg-background p-3 rounded-md flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Chave PIX:</p>
            <p className="font-medium">{pixKey}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyPixKey}
            className="flex items-center"
          >
            <Copy className="h-4 w-4 mr-1" /> Copiar
          </Button>
        </div>
        
        <div className="bg-background p-3 rounded-md flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Descrição (importante):</p>
            <p className="font-medium break-all">{pixDescription}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyDescription}
            className="flex items-center"
          >
            <Copy className="h-4 w-4 mr-1" /> Copiar
          </Button>
        </div>
      </div>
      
      <div className="mt-6 text-sm">
        <p className="text-muted-foreground">
          Após realizar o pagamento, aguarde a aprovação do administrador.
          Você receberá uma notificação por email quando seu acesso for liberado.
        </p>
      </div>
    </Card>
  );
};

export default PixPaymentInfo;
