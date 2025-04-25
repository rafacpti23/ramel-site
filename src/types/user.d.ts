
import { UserProfile } from "@/context/AuthTypes";

export interface ExtendedUserProfile extends UserProfile {
  created_at: string;
}
