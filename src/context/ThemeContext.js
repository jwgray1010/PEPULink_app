import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { secureStorage } from '../utils/mobile';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Light Theme
const lightTheme = {
  name: 'light',
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E1E1E1',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    
    // Gradient colors
    gradientPrimary: ['#007AFF', '#5856D6'],
    gradientSecondary: ['#FF6B6B', '#4ECDC4'],
    gradientCard: ['#1a1a2e', '#16213e', '#0f3460'],
    
    // Status bar
    statusBarStyle: 'dark-content',
    
    // Shadows
    shadowColor: '#000000',
    shadowOpacity: 0.1,
  },
  
  // Component specific styles
  components: {
    button: {
      borderRadius: 12,
      shadowOpacity: 0.15,
    },
    card: {
      borderRadius: 16,
      shadowOpacity: 0.1,
    },
    input: {
      borderRadius: 8,
      backgroundColor: '#F8F9FA',
      borderColor: '#E1E1E1',
    },
  },
};

// Dark Theme
const darkTheme = {
  name: 'dark',
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    surface: '#1C1C1E',
    card: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    
    // Gradient colors
    gradientPrimary: ['#0A84FF', '#5E5CE6'],
    gradientSecondary: ['#FF6B6B', '#4ECDC4'],
    gradientCard: ['#1C1C1E', '#2C2C2E', '#3A3A3C'],
    
    // Status bar
    statusBarStyle: 'light-content',
    
    // Shadows
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.2,
  },
  
  // Component specific styles
  components: {
    button: {
      borderRadius: 12,
      shadowOpacity: 0.25,
    },
    card: {
      borderRadius: 16,
      shadowOpacity: 0.2,
    },
    input: {
      borderRadius: 8,
      backgroundColor: '#1C1C1E',
      borderColor: '#38383A',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [themePreference, setThemePreference] = useState('system'); // 'light', 'dark', 'system'

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (themePreference === 'system') {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, themePreference]);

  const loadThemePreference = async () => {
    try {
      const savedPreference = await secureStorage.getItem('theme_preference');
      if (savedPreference) {
        setThemePreference(savedPreference);
        if (savedPreference === 'light') {
          setIsDark(false);
        } else if (savedPreference === 'dark') {
          setIsDark(true);
        }
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (preference) => {
    try {
      await secureStorage.setItem('theme_preference', preference);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newPreference = isDark ? 'light' : 'dark';
    setThemePreference(newPreference);
    setIsDark(!isDark);
    saveThemePreference(newPreference);
  };

  const setSystemTheme = () => {
    setThemePreference('system');
    setIsDark(systemColorScheme === 'dark');
    saveThemePreference('system');
  };

  const setLightTheme = () => {
    setThemePreference('light');
    setIsDark(false);
    saveThemePreference('light');
  };

  const setDarkTheme = () => {
    setThemePreference('dark');
    setIsDark(true);
    saveThemePreference('dark');
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value = {
    theme,
    isDark,
    themePreference,
    toggleTheme,
    setSystemTheme,
    setLightTheme,
    setDarkTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Helper function to create themed styles
export const createThemedStyles = (styleFunction) => {
  return (theme) => styleFunction(theme);
};

// Common themed components
export const getThemedTextStyle = (theme, variant = 'body') => {
  const variants = {
    h1: { fontSize: 32, fontWeight: 'bold', color: theme.colors.text },
    h2: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text },
    h3: { fontSize: 24, fontWeight: '600', color: theme.colors.text },
    h4: { fontSize: 20, fontWeight: '600', color: theme.colors.text },
    body: { fontSize: 16, color: theme.colors.text },
    caption: { fontSize: 14, color: theme.colors.textSecondary },
    small: { fontSize: 12, color: theme.colors.textSecondary },
  };
  
  return variants[variant] || variants.body;
};

export const getThemedCardStyle = (theme) => ({
  backgroundColor: theme.colors.card,
  borderRadius: theme.components.card.borderRadius,
  shadowColor: theme.colors.shadowColor,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: theme.colors.shadowOpacity,
  shadowRadius: 4,
  elevation: 3,
});

export const getThemedButtonStyle = (theme, variant = 'primary') => {
  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.components.button.borderRadius,
      shadowColor: theme.colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.components.button.shadowOpacity,
      shadowRadius: 4,
      elevation: 3,
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.components.button.borderRadius,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: theme.components.button.borderRadius,
    },
  };
  
  return variants[variant] || variants.primary;
};

export default ThemeProvider;
