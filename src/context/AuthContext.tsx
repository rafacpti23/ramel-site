
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isPaid: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Primeiro configuramos o listener de auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Importante usar setTimeout para evitar bloqueios e loops infinitos
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setUserProfile(null);
          setIsAdmin(false);
          setIsPaid(false);
          setLoading(false);
        }
      }
    );

    // Depois verificamos se já existe uma sessão
    const initAuth = async () => {
      setLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      } else {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        setUserProfile(null);
        setIsAdmin(false);
        setIsPaid(false);
        setLoading(false);
        return;
      }

      setUserProfile(profile);
      setIsAdmin(profile?.is_admin || false);
      
      // Administradores sempre têm acesso, independente do pagamento
      if (profile?.is_admin) {
        setIsPaid(true);
      } else {
        setIsPaid(profile?.payment_status === 'aprovado');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      setUserProfile(null);
      setIsAdmin(false);
      setIsPaid(false);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      // Navegação será feita automaticamente pelo useEffect após atualização do estado
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Seu cadastro foi realizado, aguarde a confirmação do pagamento para ter acesso.",
      });
      
      // Navegação será feita automaticamente pelo useEffect após atualização do estado
    } catch (error: any) {
      console.error('Erro ao fazer cadastro:', error);
      toast({
        title: "Erro ao fazer cadastro",
        description: error.message || "Ocorreu um erro ao tentar fazer cadastro.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      console.error('Erro ao sair:', error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
        isPaid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
