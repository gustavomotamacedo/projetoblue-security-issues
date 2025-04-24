import { supabase } from '@/integrations/supabase/client';
import { checkPasswordStrength } from '@/utils/passwordStrength';

interface SignUpData {
  email: string;
  password: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const authService = {
  validateSignUpData({ email, password }: SignUpData): ValidationResult {
    if (!email || !email.includes('@') || !email.includes('.')) {
      return {
        isValid: false,
        error: 'Email inválido. Por favor, forneça um email válido.'
      };
    }
    
    if (!password || password.length < 6) {
      return {
        isValid: false,
        error: 'Senha muito curta. Deve ter pelo menos 6 caracteres.'
      };
    }
    
    const passwordStrength = checkPasswordStrength(password);
    if (passwordStrength === 'weak') {
      return {
        isValid: false,
        error: 'Senha fraca. Use uma combinação de letras, números e caracteres especiais.'
      };
    }
    
    return { isValid: true };
  },

  async signUp(email: string, password: string) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'analyst',
          is_approved: false
        }
      }
    });
  },

  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    return supabase.auth.signOut();
  }
};
