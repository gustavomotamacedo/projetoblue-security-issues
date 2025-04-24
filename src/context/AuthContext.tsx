
import React, { createContext, useContext, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AuthState } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/useAuthState';
import { authService } from '@/services/authService';
import { profileService } from '@/services/profileService';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, updateState } = useAuthState();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const setupAuth = async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log('Auth state changed:', event, currentSession?.user?.email);
          
          updateState({
            user: currentSession?.user || null,
            isLoading: false,
          });

          if (event === 'SIGNED_OUT') {
            updateState({ profile: null });
          }

          if (event === 'SIGNED_IN' && currentSession?.user) {
            setTimeout(async () => {
              try {
                const profile = await profileService.fetchUserProfile(currentSession.user.id);
                console.log('Profile fetched after sign in:', profile);
                updateState({ profile });
              } catch (error) {
                console.error('Error fetching profile after sign in:', error);
              }
            }, 0);
          }
        }
      );

      try {
        console.log('Checking for existing session...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Existing session:', currentSession?.user?.email || 'None');
        
        updateState({
          user: currentSession?.user || null,
          isLoading: false,
        });

        if (currentSession?.user) {
          try {
            const profile = await profileService.fetchUserProfile(currentSession.user.id);
            console.log('Profile fetched from existing session:', profile);
            updateState({ profile });
          } catch (error) {
            console.error('Error fetching profile from existing session:', error);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        updateState({ isLoading: false });
      }

      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuth();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Iniciando processo de cadastro');
      updateState({ isLoading: true, error: null });
      
      // Validar os dados antes de enviar para o Supabase
      const validation = authService.validateSignUpData({ email, password });
      if (!validation.isValid) {
        console.error('Erro de validação:', validation.error);
        updateState({ error: validation.error });
        toast({
          title: "Erro de validação",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }

      console.log('AuthContext: Dados validados, enviando para o serviço de autenticação');
      
      // Chamar o serviço para criar o usuário
      const { data, error } = await authService.signUp(email, password);

      if (error) {
        console.error('Erro no Supabase auth.signUp:', error);
        
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
        
        console.error('Erro traduzido:', errorMessage);
        updateState({ error: errorMessage });
        toast({
          title: "Erro de cadastro",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        console.log('Usuário criado com sucesso:', data.user.id);
        toast({
          title: "Cadastro realizado",
          description: "Usuário criado com sucesso! Aguarde a aprovação do administrador para acessar o sistema.",
          variant: "default"
        });
        navigate('/login');
      } else {
        console.error('Usuário não foi criado, dados incompletos:', data);
        throw new Error('Falha ao criar usuário: dados incompletos retornados');
      }
    } catch (error: any) {
      console.error('Erro não tratado no processo de cadastro:', error);
      const errorMessage = error.message || 'Ocorreu um erro inesperado durante o cadastro.';
      updateState({ error: errorMessage });
      toast({
        title: "Erro no processo de cadastro",
        description: errorMessage,
        variant: "destructive"
      });
      throw error; // Re-throw para captura no componente
    } finally {
      updateState({ isLoading: false });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      updateState({ isLoading: true, error: null });
      
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }
      
      console.log('AuthContext: Iniciando login para:', email);
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        let errorMessage = 'Erro ao fazer login';
        
        if (error.message.includes('credentials')) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (error.message.includes('disabled')) {
          errorMessage = 'Esta conta está desativada. Entre em contato com o administrador.';
        }
        
        throw new Error(errorMessage);
      }

      if (data.user) {
        console.log('Login bem-sucedido para:', email);
        try {
          const profile = await profileService.fetchUserProfile(data.user.id);
          console.log('Perfil obtido após login:', profile);
          
          if (!profile || !profile.is_approved || !profile.is_active) {
            console.log('Perfil não aprovado ou inativo, fazendo logout:', profile);
            await authService.signOut();
            throw new Error('Sua conta está aguardando aprovação do administrador. Por favor, tente novamente mais tarde.');
          }
        } catch (profileError) {
          console.error('Erro ao verificar perfil após login:', profileError);
          await authService.signOut();
          throw profileError;
        }
      } else {
        console.error('Login falhou, dados incompletos:', data);
        throw new Error('Falha no login: dados incompletos retornados');
      }
      
      navigate('/');
    } catch (error: any) {
      console.error('Erro durante o login:', error);
      updateState({ error: error.message || 'Erro ao fazer login' });
      toast({
        title: "Erro de autenticação",
        description: error.message || 'Falha no login. Verifique suas credenciais.',
        variant: "destructive"
      });
    } finally {
      updateState({ isLoading: false });
    }
  };

  const signOut = async () => {
    try {
      updateState({ isLoading: true });
      await authService.signOut();
      navigate('/login');
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao sair",
        description: error.message || 'Ocorreu um erro ao tentar sair.',
        variant: "destructive"
      });
    } finally {
      updateState({ isLoading: false });
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
