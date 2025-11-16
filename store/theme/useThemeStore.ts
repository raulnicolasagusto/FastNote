import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS } from '../../constants/theme';
import { ColorScheme } from '../../types';
import { changeLanguage } from '../../utils/i18n';

interface ThemeState {
  isDarkMode: boolean;
  colors: ColorScheme;
  calloutsEnabled: boolean;
  currentLanguage: 'en' | 'es' | 'pt';
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
  toggleCallouts: () => void;
  setLanguage: (lang: 'en' | 'es' | 'pt') => void;
}

const store = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      colors: LIGHT_COLORS,
      calloutsEnabled: true,
      currentLanguage: 'es',
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
      toggleCallouts: () =>
        set((state) => ({
          calloutsEnabled: !state.calloutsEnabled,
        })),
      setLanguage: (lang: 'en' | 'es' | 'pt') =>
        set(() => ({
          currentLanguage: lang,
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
      onRehydrateStorage: () => {
        return (state) => {
          if (state && state.currentLanguage) {
            // Sincronizar idioma con i18n después de hidratar
            changeLanguage(state.currentLanguage);
          }
        };
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
      calloutsEnabled: true,
      currentLanguage: 'es' as 'en' | 'es' | 'pt',
      toggleTheme: () => {},
      setDarkMode: () => {},
      toggleCallouts: () => {},
      setLanguage: () => {},
    };
  }

  return state;
};