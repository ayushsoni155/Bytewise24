// src/components/ThemeToggleButton.jsx
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from '../context/ThemeContext';

export default function ThemeToggleButton() {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
