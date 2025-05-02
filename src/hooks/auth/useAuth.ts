
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserProfile, handleAdminProfile } from "@/utils/auth/profileUtils";
import { useAuthState } from "./useAuthState";
import { useAuthActions } from "./useAuthActions";

export const useAuth = () => {
  const {
    user,
    setUser,
    session,
    setSession,
    userProfile,
    setUserProfile,
    loading,
    setLoading,
    isAdmin,
    setIsAdmin,
    isPaid,
    setIsPaid,
  } = useAuthState();
  
  const actions = useAuthActions();

  useEffect(() => {
    // Verifica se há uma sessão ativa
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          setUser(currentSession.user);
          setSession(currentSession);

          const profile = await fetchUserProfile(currentSession.user.id);
          if (profile) {
            setUserProfile(profile);
            setIsAdmin(profile.is_admin);
            setIsPaid(profile.payment_status === 'aprovado');

            // Se o email for admin@admin.com, garante que tenha permissão de admin
            const isAdminEmail = currentSession.user.email === 'admin@admin.com';
            if (isAdminEmail) {
              await handleAdminProfile(profile, currentSession.user.id, isAdminEmail);
              setIsAdmin(true);
              setIsPaid(true);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    // Configura o listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        
        if (newSession) {
          setUser(newSession.user);
          setSession(newSession);
          
          // Use setTimeout para evitar deadlocks com o cliente Supabase
          setTimeout(async () => {
            const profile = await fetchUserProfile(newSession.user.id);
            if (profile) {
              setUserProfile(profile);
              setIsAdmin(profile.is_admin);
              setIsPaid(profile.payment_status === 'aprovado');
              
              // Se o email for admin@admin.com, garante que tenha permissão de admin
              const isAdminEmail = newSession.user.email === 'admin@admin.com';
              if (isAdminEmail) {
                await handleAdminProfile(profile, newSession.user.id, isAdminEmail);
                setIsAdmin(true);
                setIsPaid(true);
              }
            }
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setSession(null);
          setUserProfile(null);
          setIsAdmin(false);
          setIsPaid(false);
          setLoading(false);
        }
      }
    );

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const redirectToStripe = async () => {
    if (!session) return null;
    
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {},
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
        return true;
      } else {
        throw new Error("Falha ao obter URL de checkout");
      }
    } catch (error) {
      console.error("Erro ao redirecionar para o Stripe:", error);
      return false;
    }
  };

  // Modificar os métodos de autenticação para corresponder aos tipos esperados
  const signIn = async (email: string, password: string) => {
    try {
      const response = await actions.signIn(email, password);
      return { error: null, data: response };
    } catch (error: any) {
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string, userData: { fullName: string; whatsapp?: string }) => {
    try {
      const response = await actions.signUp(email, password, userData.fullName, userData.whatsapp);
      return { error: null, data: response };
    } catch (error: any) {
      return { error, data: null };
    }
  };

  return {
    user,
    session,
    userProfile,
    loading,
    isAdmin,
    isPaid,
    signIn,
    signUp,
    signOut: actions.signOut,
    redirectToStripe
  };
};
