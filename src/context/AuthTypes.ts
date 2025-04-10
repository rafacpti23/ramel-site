
import { Session, User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  is_admin: boolean;
  payment_status: string;
}

export interface AuthContextProps {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isPaid: boolean;
}
