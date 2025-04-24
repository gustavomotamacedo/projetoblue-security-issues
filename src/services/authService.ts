
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
      // Verificar se o usuário já existe antes de tentar criar
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();
      
      if (existingUser) {
        console.error('Usuário já existe:', existingUser);
        throw new Error('Este email já está cadastrado.');
      }
      
      // Tenta criar o usuário no Supabase Auth
      console.log('Enviando dados para Supabase Auth...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'analyst',
            is_approved: false
          }
        }
      });
      
      // Log detalhado da resposta
      console.log('Resposta completa do Supabase Auth:', JSON.stringify(data, null, 2));
      console.log('Erro do Supabase Auth (se houver):', error ? JSON.stringify(error, null, 2) : 'Nenhum');
      
      if (error) {
        // Traduz os erros mais comuns do Supabase
        if (error.message.includes('already registered')) {
          throw new Error('Este email já está cadastrado.');
        } else if (error.message.includes('password')) {
          throw new Error('Problema com a senha: ' + error.message);
        } else if (error.message.includes('email')) {
          throw new Error('Problema com o email: ' + error.message);
        }
        
        // Se chegou aqui, é um erro não específico
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
        stack: error.stack,
        cause: error.cause
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
