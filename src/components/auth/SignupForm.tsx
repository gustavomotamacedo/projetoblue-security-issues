
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { PasswordMatch } from './PasswordMatch';
import { PasswordInput } from './PasswordInput';
import { checkPasswordStrength } from '@/utils/passwordStrength';

interface SignupFormProps {
  onSubmit: (e: React.FormEvent, captchaToken?: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

// Define uma interface window personalizada para acessar os métodos do Turnstile
declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
    };
  }
}

export const SignupForm = ({ onSubmit, error, isLoading = false }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined);
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  
  useEffect(() => {
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    } else {
      setPasswordStrength('weak');
    }
    
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  // Carrega e inicializa o Cloudflare Turnstile (CAPTCHA)
  useEffect(() => {
    // Só inicializa o CAPTCHA se o script Turnstile já estiver carregado
    const initTurnstile = () => {
      if (window.turnstile && captchaContainerRef.current) {
        const widgetId = window.turnstile.render(captchaContainerRef.current, {
          sitekey: '0x4AAAAAAAl7U18OnlWbOmhR', // Sitekey do Cloudflare Turnstile (não sensível)
          callback: function(token: string) {
            setCaptchaToken(token);
          },
        });
        setWidgetId(widgetId);
      }
    };

    // Verifica se o script já está carregado
    if (window.turnstile) {
      initTurnstile();
    } else {
      // Carrega o script do Turnstile
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = initTurnstile;
      document.head.appendChild(script);
    }

    return () => {
      // Limpa o widget ao desmontar o componente
      if (window.turnstile && widgetId) {
        window.turnstile.reset(widgetId);
      }
    };
  }, []);

  // Reset do CAPTCHA quando ocorrer um erro
  useEffect(() => {
    if (error && window.turnstile && widgetId) {
      window.turnstile.reset(widgetId);
      setCaptchaToken(undefined);
    }
  }, [error, widgetId]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    
    await onSubmit(e, captchaToken);
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
        <PasswordInput 
          id="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-1"
        />
        <PasswordStrengthIndicator strength={passwordStrength} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Senha</Label>
        <PasswordInput 
          id="confirm-password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <PasswordMatch 
          passwordsMatch={passwordsMatch} 
          confirmPassword={confirmPassword} 
        />
      </div>

      {/* Container para o CAPTCHA */}
      <div className="flex justify-center my-4">
        <div ref={captchaContainerRef} className="captcha-container"></div>
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
        disabled={isLoading || !passwordsMatch || !captchaToken}
      >
        {isLoading ? 'Processando...' : 'Criar Conta'}
      </Button>
    </form>
  );
};
