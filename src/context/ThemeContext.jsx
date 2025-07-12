// src/contexts/ThemeContext.jsx
import { createContext, useMemo, useState, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

// Custom hook to access theme context
// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Load initial mode from localStorage, fallback to light
    return localStorage.getItem('appTheme') || 'light';
  });

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Save mode to localStorage on change
  useEffect(() => {
    localStorage.setItem('appTheme', mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                background: {
                  default: '#f5f5f5',
                  paper: '#fff',
                },
              }
            : {
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
              }),
        },
        typography: {
          fontFamily: 'Poppins, sans-serif',
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
