
import { useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "@/context/AuthTypes";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  return {
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
  };
};
