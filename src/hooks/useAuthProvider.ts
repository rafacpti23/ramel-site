
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { UserProfile } from "@/context/AuthTypes";

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Primeiro configuramos o listener de auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
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
      console.log("Current session:", currentSession?.user?.email);
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
      console.log("Fetching profile for user ID:", userId);
      
      // Especial handling for admin@admin.com
      // First check if this is the admin email
      const isAdminEmail = user?.email === 'admin@admin.com';
      
      // Get the profile from the database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        
        // If this is admin@admin.com and we couldn't find the profile, let's create it
        if (isAdminEmail) {
          const { error: updateError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: 'admin@admin.com',
              full_name: 'Administrador',
              is_admin: true,
              payment_status: 'aprovado'
            });
            
          if (!updateError) {
            // Successfully created admin profile
            setUserProfile({
              id: userId,
              email: 'admin@admin.com',
              full_name: 'Administrador',
              is_admin: true,
              payment_status: 'aprovado',
              whatsapp: ''
            });
            setIsAdmin(true);
            setIsPaid(true);
            setLoading(false);
            return;
          }
        }
        
        setUserProfile(null);
        setIsAdmin(false);
        setIsPaid(false);
        setLoading(false);
        return;
      }

      console.log("Profile data:", profile);
      setUserProfile(profile);
      
      // Se o email é admin@admin.com, forçar status de admin e pagamento aprovado
      if (isAdminEmail) {
        setIsAdmin(true);
        setIsPaid(true);
        
        // Se por algum motivo o banco de dados não está consistente, vamos corrigir
        if (!profile.is_admin || profile.payment_status !== 'aprovado') {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              is_admin: true,
              payment_status: 'aprovado' 
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Erro ao atualizar perfil do admin:', updateError);
          }
        }
      } else {
        // Para usuários normais, usar os dados do perfil
        setIsAdmin(profile?.is_admin || false);
        
        // Administradores sempre têm acesso, independente do pagamento
        if (profile?.is_admin) {
          setIsPaid(true);
        } else {
          setIsPaid(profile?.payment_status === 'aprovado');
        }
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

  const signUp = async (email: string, password: string, fullName: string, whatsapp: string = "") => {
    try {
      setLoading(true);
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

  return {
    session,
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isPaid,
  };
};
