
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const profileService = {
  async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (data) {
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userId);
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  },
};
