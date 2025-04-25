
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/context/AuthTypes";
import { toast } from "@/hooks/use-toast";

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const isAdminEmail = (await supabase.auth.getUser()).data.user?.email === 'admin@admin.com';
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
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
          return {
            id: userId,
            email: 'admin@admin.com',
            full_name: 'Administrador',
            is_admin: true,
            payment_status: 'aprovado',
            whatsapp: ''
          };
        }
      }
      console.error('Error fetching profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};

export const handleAdminProfile = async (
  profile: UserProfile,
  userId: string,
  isAdminEmail: boolean
): Promise<void> => {
  if (isAdminEmail) {
    if (!profile.is_admin || profile.payment_status !== 'aprovado') {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_admin: true,
          payment_status: 'aprovado' 
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating admin profile:', updateError);
      }
    }
  }
};
