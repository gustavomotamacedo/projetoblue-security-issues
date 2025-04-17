
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { NamedLogo } from '@/components/ui/namedlogo';
import { SignupForm } from '@/components/auth/SignupForm';
import { ThemeToggle } from '@/components/auth/ThemeToggle';

const Signup = () => {
  const { signUp, isAuthenticated, error, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent, captchaToken?: string) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    
    try {
      await signUp(email, password, captchaToken);
    } catch (error) {
      console.error("Error in signup process:", error);
      // Error is already handled in the AuthContext
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
          <SignupForm 
            onSubmit={handleSubmit} 
            error={error}
            isLoading={isLoading}
          />
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
          <ThemeToggle />
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} - Sistema BLUE
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
