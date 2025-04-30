
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { PasswordMatch } from './PasswordMatch';
import { PasswordInput } from './PasswordInput';
import { checkPasswordStrength } from '@/utils/passwordStrength';

interface SignupFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

export const SignupForm = ({ onSubmit, error, isLoading = false }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formIsValid, setFormIsValid] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  
  // Verifica a força da senha e se as senhas coincidem
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

  // Valida o formulário completo
  useEffect(() => {
    const isEmailValid = email && email.includes('@') && email.includes('.');
    const isPasswordValid = password && password.length >= 6;
    const isPasswordStrengthValid = passwordStrength === 'medium' || passwordStrength === 'strong';
    const isConfirmPasswordValid = confirmPassword && password === confirmPassword;
    
    const isValid = isEmailValid && 
                    isPasswordValid && 
                    isPasswordStrengthValid && 
                    isConfirmPasswordValid;
    
    console.log('Validade do formulário:', {
      isEmailValid,
      isPasswordValid,
      isPasswordStrengthValid,
      isConfirmPasswordValid,
      formIsValid: isValid
    });
    
    setFormIsValid(isValid);
  }, [email, password, confirmPassword, passwordStrength]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    // Verifica novamente todos os campos antes de enviar
    if (!email || !email.includes('@') || !email.includes('.')) {
      console.log('Email inválido no envio:', email);
      return;
    }
    
    if (!password || password.length < 6) {
      console.log('Senha muito curta no envio:', { passwordLength: password.length });
      return;
    }
    
    if (password !== confirmPassword) {
      console.log('Senhas não conferem no envio');
      setPasswordsMatch(false);
      return;
    }
    
    const passwordStr = checkPasswordStrength(password);
    if (passwordStr === 'weak') {
      console.log('Senha fraca no envio');
      return;
    }
    
    console.log('Formulário válido, enviando dados:', { email });
    await onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          className={submitAttempted && (!email || !email.includes('@') || !email.includes('.')) ? "border-red-500" : ""}
        />
        {submitAttempted && (!email || !email.includes('@') || !email.includes('.')) && (
          <p className="text-sm text-red-500 mt-1">Por favor, insira um email válido</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <PasswordInput 
          id="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`mb-1 ${submitAttempted && (!password || password.length < 6) ? "border-red-500" : ""}`}
        />
        <PasswordStrengthIndicator strength={passwordStrength} />
        {submitAttempted && (!password || password.length < 6) && (
          <p className="text-sm text-red-500 mt-1">A senha deve ter pelo menos 6 caracteres</p>
        )}
        {submitAttempted && passwordStrength === 'weak' && password.length >= 6 && (
          <p className="text-sm text-red-500 mt-1">A senha é muito fraca</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Senha</Label>
        <PasswordInput 
          id="confirm-password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={submitAttempted && (!confirmPassword || password !== confirmPassword) ? "border-red-500" : ""}
        />
        <PasswordMatch 
          passwordsMatch={passwordsMatch} 
          confirmPassword={confirmPassword} 
        />
        {submitAttempted && (!confirmPassword || password !== confirmPassword) && (
          <p className="text-sm text-red-500 mt-1">As senhas não conferem</p>
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
        disabled={isLoading}
      >
        {isLoading ? 'Processando...' : 'Criar Conta'}
      </Button>
    </form>
  );
};
