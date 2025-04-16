
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { UserProfile, AuthState } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { checkPasswordStrength } from '@/utils/passwordStrength';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    error: null,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const setupAuth = async () => {
      // Configurar o listener de mudanças de autenticação
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          setSession(currentSession);
          setState(prevState => ({
            ...prevState,
            user: currentSession?.user || null,
            isLoading: false,
          }));

          if (event === 'SIGNED_OUT') {
            setState(prevState => ({
              ...prevState,
              profile: null,
            }));
          }

          if (event === 'SIGNED_IN' && currentSession?.user) {
            // Buscar o perfil do usuário usando setTimeout para evitar deadlock
            setTimeout(async () => {
              await fetchUserProfile(currentSession.user.id);
            }, 0);
          }
        }
      );

      // Verificar sessão existente
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setState(prevState => ({
        ...prevState,
        user: currentSession?.user || null,
        isLoading: false,
      }));

      // Buscar perfil se houver um usuário logado
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      }

      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuth();
  }, []);

  const fetchUserProfile = async (userId: string) => {
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
        setState(prevState => ({
          ...prevState,
          profile: data as UserProfile,
        }));

        // Atualizar o último login
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userId);
      } else {
        console.warn('No profile found for user:', userId);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const validateSignUpData = (email: string, password: string, username: string) => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      return 'Email inválido. Por favor, forneça um email válido.';
    }
    
    if (!username || username.length < 3) {
      return 'Nome de usuário inválido. Deve ter pelo menos 3 caracteres.';
    }
    
    if (!password || password.length < 6) {
      return 'Senha muito curta. Deve ter pelo menos 6 caracteres.';
    }
    
    const passwordStrength = checkPasswordStrength(password);
    if (passwordStrength === 'weak') {
      return 'Senha fraca. Use uma combinação de letras, números e caracteres especiais.';
    }
    
    return null;
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      
      // Validação prévia dos dados
      const validationError = validateSignUpData(email, password, username);
      if (validationError) {
        setState(prevState => ({ ...prevState, error: validationError }));
        toast({
          title: "Erro de validação",
          description: validationError,
          variant: "destructive"
        });
        return;
      }

      // Verificar se o email já existe
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .limit(1);

      if (checkError) {
        console.error('Error checking existing username:', checkError);
        throw new Error('Erro ao verificar disponibilidade do nome de usuário');
      }

      if (existingUsers && existingUsers.length > 0) {
        setState(prevState => ({ ...prevState, error: 'Nome de usuário já cadastrado' }));
        toast({
          title: "Erro de cadastro",
          description: "Este nome de usuário já está em uso.",
          variant: "destructive"
        });
        return;
      }

      // Criar usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username,
            role: 'analyst' // Papel padrão para novos usuários
          }
        }
      });

      if (error) {
        console.error('Supabase Auth SignUp Error:', error);
        
        // Mensagens de erro mais descritivas baseadas no código/mensagem recebida
        let errorMessage = 'Falha ao criar usuário';
        
        if (error.message.includes('already registered')) {
          errorMessage = 'Este email já está cadastrado.';
        } else if (error.message.includes('password')) {
          errorMessage = 'Senha inválida: ' + error.message;
        } else if (error.message.includes('email')) {
          errorMessage = 'Email inválido: ' + error.message;
        } else if (error.message.includes('database')) {
          errorMessage = 'Erro de banco de dados: Falha ao criar perfil do usuário.';
        }
        
        setState(prevState => ({ ...prevState, error: errorMessage }));
        toast({
          title: "Erro de cadastro",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Cadastro realizado",
          description: "Usuário criado com sucesso! Faça o login para continuar.",
          variant: "default"
        });
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Signup process error:', error);
      const errorMessage = error.message || 'Ocorreu um erro inesperado durante o cadastro.';
      setState(prevState => ({ ...prevState, error: errorMessage }));
      toast({
        title: "Erro no processo de cadastro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error);
        
        // Mensagens de erro mais descritivas
        let errorMessage = 'Erro ao fazer login';
        
        if (error.message.includes('credentials')) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (error.message.includes('disabled')) {
          errorMessage = 'Esta conta está desativada. Entre em contato com o administrador.';
        }
        
        throw new Error(errorMessage);
      }
      
      navigate('/');
    } catch (error: any) {
      setState(prevState => ({ 
        ...prevState, 
        error: error.message || 'Erro ao fazer login' 
      }));
      toast({
        title: "Erro de autenticação",
        description: error.message || 'Falha no login. Verifique suas credenciais.',
        variant: "destructive"
      });
    } finally {
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const signOut = async () => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true }));
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || 'Ocorreu um erro ao tentar sair.',
        variant: "destructive"
      });
    } finally {
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!state.user && !!state.profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
