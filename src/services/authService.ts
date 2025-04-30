
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
    console.log('Iniciando processo de cadastro:', { email });
    
    try {
      // Log completo da configuração de auth sendo usada
      console.log('Configuração para cadastro:', {
        email,
        passwordLength: password?.length || 0,
        captchaDisabled: true,
      });
      
      // Tenta criar o usuário no Supabase Auth com is_approved = true
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'analyst',
            is_approved: true  // Mudado de false para true
          }
        }
      });
      
      if (error) {
        console.error('Erro detalhado do Supabase Auth:', {
          message: error.message,
          name: error.name,
          status: error.status,
          stack: error.stack
        });
        
        // Traduz os erros mais comuns do Supabase
        if (error.message.includes('already registered')) {
          throw new Error('Este email já está cadastrado.');
        } else if (error.message.includes('password')) {
          throw new Error('Problema com a senha: ' + error.message);
        } else if (error.message.includes('email')) {
          throw new Error('Problema com o email: ' + error.message);
        }
        
        throw error;
      }
      
      // Verificar se o usuário foi criado com sucesso
      if (!data.user || !data.user.id) {
        console.error('Usuário não foi criado corretamente:', data);
        throw new Error('Falha ao criar usuário: dados incompletos retornados');
      }
      
      console.log('Usuário criado com sucesso:', {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at
      });
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro detalhado durante o cadastro:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    return supabase.auth.signOut();
  }
};
