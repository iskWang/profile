import React, { useEffect, useState } from 'react';
import { ThemeContext } from './useTheme';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';

    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

      window.localStorage.setItem('theme', nextTheme);
      document.documentElement.dataset.theme = nextTheme;

      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
