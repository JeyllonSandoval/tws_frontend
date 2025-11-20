import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './ThemeContextValue';

type Theme = 'dark' | 'light';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Por defecto es dark
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || 'dark';
    
    // Aplicar tema inmediatamente al montar
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    return initialTheme;
  });

  useEffect(() => {
    // Guardar preferencia en localStorage
    localStorage.setItem('theme', theme);
    
    // Aplicar tema al documento
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
