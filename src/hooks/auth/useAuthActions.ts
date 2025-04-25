
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAuthActions = () => {
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, whatsapp: string = "") => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            whatsapp: whatsapp
          },
        },
      });

      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Seu cadastro foi realizado, aguarde a confirmação do pagamento para ter acesso.",
      });
    } catch (error: any) {
      console.error('Erro ao fazer cadastro:', error);
      toast({
        title: "Erro ao fazer cadastro",
        description: error.message || "Ocorreu um erro ao tentar fazer cadastro.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao sair:', error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
  };
};
