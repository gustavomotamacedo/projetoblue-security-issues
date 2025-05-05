
import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AuthRouteProps {
  children: ReactNode;
}

export const AuthRoute = ({ children }: AuthRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Se ainda está carregando, mostra nada ou um loading spinner
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // MODO DE DESENVOLVIMENTO: Ignorando verificação de autenticação temporariamente
  console.log("AVISO: Bypass de autenticação ativado - modo de desenvolvimento");
  
  // Renderiza as rotas sem verificação de autenticação
  return <>{children}</>;
};
