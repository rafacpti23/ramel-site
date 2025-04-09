
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const AdminRegistrationInfo = () => {
  const [isCreating, setIsCreating] = useState(false);
  
  const createAdminUser = async () => {
    setIsCreating(true);
    
    try {
      // Primeiro, verifica se o usuário admin já existe
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'admin@admin.com');
      
      if (checkError) throw checkError;
      
      // Se o usuário admin já existe, não precisamos criá-lo
      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "Usuário admin já existe",
          description: "O usuário admin@admin.com já está cadastrado no sistema."
        });
        return;
      }
      
      // Cria o usuário admin no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'admin@admin.com',
        password: '123456',
        options: {
          data: {
            full_name: 'Administrador',
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Atualiza o perfil do usuário para administrador
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            is_admin: true,
            payment_status: 'aprovado' 
          })
          .eq('id', authData.user.id);
          
        if (profileError) throw profileError;
        
        toast({
          title: "Usuário admin criado com sucesso",
          description: "Agora você pode fazer login com admin@admin.com e senha 123456",
        });
      }
    } catch (error: any) {
      console.error('Erro ao criar usuário admin:', error);
      toast({
        title: "Erro ao criar usuário admin",
        description: error.message || "Não foi possível criar o usuário admin.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="bg-card rounded-lg border p-4 mt-8 max-w-md mx-auto">
      <h3 className="font-semibold text-lg mb-2">Informações sobre Validação de Pagamento</h3>
      <p className="text-sm text-muted-foreground mb-4">
        No sistema atual, a validação de pagamento é feita manualmente por um administrador do sistema. 
        O usuário padrão já possui status <strong>"aprovado"</strong> para acesso à área de membros.
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Um administrador pode validar o pagamento de qualquer usuário na página de administração, 
        alterando o status de "pendente" para "aprovado".
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Se o usuário admin padrão (admin@admin.com) ainda não foi criado, você pode criá-lo clicando no botão abaixo:
      </p>
      
      <Button 
        onClick={createAdminUser} 
        disabled={isCreating} 
        className="w-full"
      >
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando usuário admin...
          </>
        ) : (
          "Criar usuário admin padrão"
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground mt-2 text-center">
        (Email: admin@admin.com, Senha: 123456)
      </p>
    </div>
  );
};
