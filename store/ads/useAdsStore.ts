import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AdsState {
  // Tracking de Interstitial Ads
  hasShownInterstitialThisSession: boolean;
  lastInterstitialShownAt: Date | null;

  // Actions
  markInterstitialAsShown: () => void;
  resetInterstitialSession: () => void;
}

const store = create<AdsState>()(
  persist(
    (set) => ({
      // Estado inicial
      hasShownInterstitialThisSession: false,
      lastInterstitialShownAt: null,

      // Marca que ya se mostró el interstitial en esta sesión
      markInterstitialAsShown: () => {
        console.log('🔒 Marking Interstitial as shown this session');
        set(() => ({
          hasShownInterstitialThisSession: true,
          lastInterstitialShownAt: new Date(),
        }));
      },

      // Resetea el tracking cuando se cierra/abre la app
      resetInterstitialSession: () => {
        console.log('🔄 Resetting Interstitial session');
        set(() => ({
          hasShownInterstitialThisSession: false,
        }));
      },
    }),
    {
      name: 'ads-storage',
      // NO persistir hasShownInterstitialThisSession (solo lastInterstitialShownAt para estadísticas)
      partialize: (state) => ({
        lastInterstitialShownAt: state.lastInterstitialShownAt,
        // hasShownInterstitialThisSession NO se persiste (siempre inicia en false)
      }),
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

// Hook con valores por defecto
export const useAdsStore = () => {
  const state = store();

  // Si el store no está hidratado aún, devolver valores por defecto
  if (!state) {
    return {
      hasShownInterstitialThisSession: false,
      lastInterstitialShownAt: null,
      markInterstitialAsShown: () => {},
      resetInterstitialSession: () => {},
    };
  }

  return state;
};

// Exportar también getState para usar fuera de React components
useAdsStore.getState = store.getState;
