import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS } from '../../constants/theme';
import { ColorScheme } from '../../types';

interface ThemeState {
  isDarkMode: boolean;
  colors: ColorScheme;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const store = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      colors: LIGHT_COLORS,
      toggleTheme: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
          colors: !state.isDarkMode ? DARK_COLORS : LIGHT_COLORS,
        })),
      setDarkMode: (isDark: boolean) =>
        set(() => ({
          isDarkMode: isDark,
          colors: isDark ? DARK_COLORS : LIGHT_COLORS,
        })),
    }),
    {
      name: 'theme-storage',
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

// Hook que garantiza valores por defecto
export const useThemeStore = () => {
  const state = store();

  // Si el store no está hidratado aún, devolver valores por defecto
  if (!state || !state.colors) {
    return {
      isDarkMode: false,
      colors: LIGHT_COLORS,
      toggleTheme: () => {},
      setDarkMode: () => {},
    };
  }

  return state;
};