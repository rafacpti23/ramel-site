
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "./useAuthState";
import { useAuthActions } from "./useAuthActions";
import { fetchUserProfile, handleAdminProfile } from "@/utils/auth/profileUtils";

export const useAuth = () => {
  const navigate = useNavigate();
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

  const { signIn, signUp, signOut } = useAuthActions();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id).then((profile) => {
              if (profile) {
                setUserProfile(profile);
                if (profile.is_admin) {
                  setIsAdmin(true);
                  setIsPaid(true);
                } else {
                  setIsAdmin(false);
                  setIsPaid(profile.payment_status === 'aprovado');
                }
              }
              setLoading(false);
            });
          }, 0);
        } else {
          setUserProfile(null);
          setIsAdmin(false);
          setIsPaid(false);
          setLoading(false);
        }
      }
    );

    const initAuth = async () => {
      setLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log("Current session:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        const profile = await fetchUserProfile(currentSession.user.id);
        if (profile) {
          setUserProfile(profile);
          if (profile.is_admin) {
            setIsAdmin(true);
            setIsPaid(true);
          } else {
            setIsAdmin(false);
            setIsPaid(profile.payment_status === 'aprovado');
          }
        }
      }
      setLoading(false);
    };

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isPaid,
  };
};
