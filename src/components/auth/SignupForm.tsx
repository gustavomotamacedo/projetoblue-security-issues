
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { UsernameAvailability } from './UsernameAvailability';
import { PasswordMatch } from './PasswordMatch';
import { checkPasswordStrength } from '@/utils/passwordStrength';
import { supabase } from '@/integrations/supabase/client';

interface SignupFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const SignupForm = ({ onSubmit }: SignupFormProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameCheckError, setUsernameCheckError] = useState<string | null>(null);
  
  const { error, isLoading } = useAuth();

  useEffect(() => {
    // Atualiza a força da senha sempre que ela muda
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    } else {
      setPasswordStrength('weak');
    }
    
    // Verifica se as senhas coincidem
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  // Verifica disponibilidade do nome de usuário
  useEffect(() => {
    const checkUsername = async () => {
      // Resetar estados anteriores
      setUsernameAvailable(null);
      setUsernameCheckError(null);
      
      // Verificar apenas se houver um username com pelo menos 3 caracteres
      if (username.length < 3) return;
      
      setCheckingUsername(true);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .limit(1);
        
        if (error) {
          console.error('Error checking username:', error);
          setUsernameCheckError('Erro ao verificar disponibilidade do nome de usuário');
        } else {
          setUsernameAvailable(!data || data.length === 0);
        }
      } catch (err) {
        console.error('Exception checking username:', err);
        setUsernameCheckError('Erro ao verificar disponibilidade do nome de usuário');
      } finally {
        setCheckingUsername(false);
      }
    };
    
    // Debounce para evitar múltiplas chamadas
    const timeoutId = setTimeout(() => {
      if (username.length >= 3) {
        checkUsername();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    
    if (usernameCheckError || (username.length >= 3 && usernameAvailable === false)) {
      return;
    }
    
    await onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-4">
      <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-500" />
        <AlertDescription className="text-sm text-blue-700 dark:text-blue-400">
          Após o cadastro, sua conta precisará ser aprovada por um administrador antes de acessar o sistema.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="username">Nome de Usuário</Label>
        <Input 
          id="username" 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="seunome"
          required
          className={`${
            usernameAvailable === true && username.length >= 3 
              ? 'border-green-500' 
              : usernameAvailable === false || usernameCheckError 
                ? 'border-red-500' 
                : ''
          }`}
        />
        <UsernameAvailability
          username={username}
          usernameAvailable={usernameAvailable}
          usernameCheckError={usernameCheckError}
          checkingUsername={checkingUsername}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="mb-1"
        />
        <PasswordStrengthIndicator strength={passwordStrength} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Senha</Label>
        <Input 
          id="confirm-password" 
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <PasswordMatch 
          passwordsMatch={passwordsMatch} 
          confirmPassword={confirmPassword} 
        />
      </div>
      
      {error && (
        <div className="bg-destructive/10 p-3 rounded-md border border-destructive/30">
          <p className="text-sm text-destructive flex items-center">
            <AlertCircle size={14} className="mr-2 flex-shrink-0" />
            {error}
          </p>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={
          isLoading || 
          !passwordsMatch || 
          (username.length >= 3 && usernameAvailable === false) || 
          !!usernameCheckError
        }
      >
        {isLoading ? 'Processando...' : 'Criar Conta'}
      </Button>
    </form>
  );
};
