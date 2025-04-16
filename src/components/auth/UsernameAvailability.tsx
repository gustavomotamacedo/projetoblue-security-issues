
import React from 'react';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

interface UsernameAvailabilityProps {
  username: string;
  usernameAvailable: boolean | null;
  usernameCheckError: string | null;
  checkingUsername: boolean;
}

export const UsernameAvailability = ({ 
  username, 
  usernameAvailable, 
  usernameCheckError,
  checkingUsername 
}: UsernameAvailabilityProps) => {
  
  if (usernameCheckError) {
    return (
      <p className="text-sm text-red-500 flex items-center mt-1">
        <AlertCircle size={14} className="mr-1" />
        {usernameCheckError}
      </p>
    );
  }
  
  if (username.length >= 3 && usernameAvailable === false) {
    return (
      <p className="text-sm text-red-500 flex items-center mt-1">
        <AlertCircle size={14} className="mr-1" />
        Nome de usuário já está em uso
      </p>
    );
  }
  
  if (username.length >= 3 && usernameAvailable === true) {
    return (
      <p className="text-sm text-green-500 flex items-center mt-1">
        <Check size={14} className="mr-1" />
        Nome de usuário disponível
      </p>
    );
  }
  
  if (checkingUsername) {
    return (
      <p className="text-sm text-muted-foreground flex items-center mt-1">
        <Loader2 size={14} className="mr-1 animate-spin" />
        Verificando disponibilidade...
      </p>
    );
  }
  
  return null;
};
