import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  payment_status: string;
  whatsapp: string | null;
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, whatsapp?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isPaid: boolean;
}

export interface AuthContextProps {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, whatsapp?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isPaid: boolean;
}
