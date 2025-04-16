
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthIndicatorProps {
  strength: 'weak' | 'medium' | 'strong';
}

export const PasswordStrengthIndicator = ({ strength }: PasswordStrengthIndicatorProps) => {
  const getPasswordStrengthColor = () => {
    switch (strength) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getPasswordStrengthValue = () => {
    switch (strength) {
      case 'strong': return 100;
      case 'medium': return 66;
      case 'weak': return 33;
      default: return 0;
    }
  };

  return (
    <div className="space-y-1">
      <Progress value={getPasswordStrengthValue()} className={getPasswordStrengthColor()} />
      <p className="text-xs text-muted-foreground">
        Força da senha: 
        <span className={`ml-1 font-medium ${
          strength === 'weak' ? 'text-red-500' : 
          strength === 'medium' ? 'text-yellow-500' : 'text-green-500'
        }`}>
          {strength === 'weak' ? 'Fraca' : 
           strength === 'medium' ? 'Média' : 'Forte'}
        </span>
      </p>
    </div>
  );
};
