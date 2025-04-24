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
          updateState({
            user: currentSession?.user || null,
            isLoading: false,
          });

          if (event === 'SIGNED_OUT') {
            updateState({ profile: null });
          }

          if (event === 'SIGNED_IN' && currentSession?.user) {
            setTimeout(async () => {
              const profile = await profileService.fetchUserProfile(currentSession.user.id);
              updateState({ profile });
            }, 0);
          }
        }
      );

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      updateState({
        user: currentSession?.user || null,
        isLoading: false,
      });

      if (currentSession?.user) {
        const profile = await profileService.fetchUserProfile(currentSession.user.id);
        updateState({ profile });
      }

      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuth();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      updateState({ isLoading: true, error: null });
      
      const validation = authService.validateSignUpData({ email, password });
      if (!validation.isValid) {
        updateState({ error: validation.error });
        toast({
          title: "Erro de validação",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await authService.signUp(email, password);

      if (error) {
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
        
        updateState({ error: errorMessage });
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
          description: "Usuário criado com sucesso! Aguarde a aprovação do administrador para acessar o sistema.",
          variant: "default"
        });
        navigate('/login');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Ocorreu um erro inesperado durante o cadastro.';
      updateState({ error: errorMessage });
      toast({
        title: "Erro no processo de cadastro",
        description: errorMessage,
        variant: "destructive"
      });
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
        const profile = await profileService.fetchUserProfile(data.user.id);
        if (!profile || !profile.is_approved || !profile.is_active) {
          await authService.signOut();
          throw new Error('Sua conta está aguardando aprovação do administrador. Por favor, tente novamente mais tarde.');
        }
      }
      
      navigate('/');
    } catch (error: any) {
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
