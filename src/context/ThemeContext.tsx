
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return (savedTheme as Theme) || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light'; // Fallback para SSR ou quando window não está disponível
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      
      // Adiciona a classe para a animação antes de mudar o tema
      root.classList.add('theme-transition');
      
      // Remove as classes de tema
      root.classList.remove('light', 'dark');
      
      // Adiciona a nova classe de tema
      root.classList.add(theme);
      
      // Salva no localStorage
      localStorage.setItem('theme', theme);
      
      // Remove a classe de animação após a transição
      const timeoutId = setTimeout(() => {
        root.classList.remove('theme-transition');
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
