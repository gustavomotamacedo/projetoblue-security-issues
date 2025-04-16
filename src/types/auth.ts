
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'tech' | 'analyst';

export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  email?: string;
  created_at: string;
  last_login?: string;
  is_active: boolean;
  is_approved: boolean;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}
