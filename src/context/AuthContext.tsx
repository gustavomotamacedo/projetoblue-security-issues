
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { UserProfile, AuthState } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
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
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
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
