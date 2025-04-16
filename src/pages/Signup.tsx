
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { NamedLogo } from '@/components/ui/namedlogo';
import { MoonStar, Sun, AlertCircle, Check, Info } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { checkPasswordStrength } from '@/utils/passwordStrength';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameCheckError, setUsernameCheckError] = useState<string | null>(null);
  
  const { signUp, isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

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

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    
    if (usernameCheckError || (username.length >= 3 && usernameAvailable === false)) {
      return;
    }
    
    await signUp(email, password, username);
  };

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTheme(theme === 'dark' ? 'light' : 'dark', e);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getPasswordStrengthValue = () => {
    switch (passwordStrength) {
      case 'strong': return 100;
      case 'medium': return 66;
      case 'weak': return 33;
      default: return 0;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center justify-center pt-8">
          <div className="w-full flex justify-center py-4">
            <NamedLogo size="lg" />
          </div>
          <h2 className="text-2xl font-bold text-center">Criar Conta</h2>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            <AlertDescription className="text-sm text-blue-700 dark:text-blue-400">
              Após o cadastro, sua conta precisará ser aprovada por um administrador antes de acessar o sistema.
            </AlertDescription>
          </Alert>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {usernameCheckError ? (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle size={14} className="mr-1" />
                  {usernameCheckError}
                </p>
              ) : username.length >= 3 && usernameAvailable === false ? (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle size={14} className="mr-1" />
                  Nome de usuário já está em uso
                </p>
              ) : username.length >= 3 && usernameAvailable === true ? (
                <p className="text-sm text-green-500 flex items-center mt-1">
                  <Check size={14} className="mr-1" />
                  Nome de usuário disponível
                </p>
              ) : null}
              {checkingUsername && (
                <p className="text-sm text-muted-foreground mt-1">
                  Verificando disponibilidade...
                </p>
              )}
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
              <div className="space-y-1">
                <Progress value={getPasswordStrengthValue()} className={getPasswordStrengthColor()} />
                <p className="text-xs text-muted-foreground">
                  Força da senha: 
                  <span className={`ml-1 font-medium ${
                    passwordStrength === 'weak' ? 'text-red-500' : 
                    passwordStrength === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {passwordStrength === 'weak' ? 'Fraca' : 
                     passwordStrength === 'medium' ? 'Média' : 'Forte'}
                  </span>
                </p>
              </div>
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
              {!passwordsMatch && confirmPassword && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle size={14} className="mr-1" />
                  As senhas não coincidem
                </p>
              )}
              {passwordsMatch && confirmPassword && (
                <p className="text-sm text-green-500 flex items-center mt-1">
                  <Check size={14} className="mr-1" />
                  As senhas coincidem
                </p>
              )}
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
              disabled={isLoading || !passwordsMatch || (username.length >= 3 && usernameAvailable === false) || !!usernameCheckError}
            >
              {isLoading ? 'Processando...' : 'Criar Conta'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Já possui uma conta?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <MoonStar size={20} />}
          </Button>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} - Sistema BLUE
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Signup;
