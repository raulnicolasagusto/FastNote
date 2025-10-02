import '../global.css';

import { Stack, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as QuickActions from 'expo-quick-actions';
import { useQuickActionRouting } from 'expo-quick-actions/router';
import mobileAds from 'react-native-google-mobile-ads';
import { useThemeStore } from '../store/theme/useThemeStore';
import { t } from '../utils/i18n';

export default function Layout() {
  const router = useRouter();
  const { currentLanguage } = useThemeStore();

  // Enable routing for quick actions
  useQuickActionRouting();

  useEffect(() => {
    // Initialize Google Mobile Ads SDK
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('🎯 AdMob SDK initialized:', adapterStatuses);
      })
      .catch(error => {
        console.error('❌ AdMob SDK initialization failed:', error);
      });

    // Configure quick actions (actualizar cuando cambie el idioma)
    const updateQuickActions = () => {
      QuickActions.setItems([
        {
          id: "voice_note",
          title: t('quickActions.voiceNote'),
          subtitle: t('quickActions.voiceNoteSubtitle'),
          icon: "voice_note",
          params: { action: "voice_note" },
        },
      ]);
    };

    updateQuickActions();

    // Listen for quick action triggers
    const subscription = QuickActions.addListener((action) => {
      if (action.params?.action === 'voice_note') {
        // Navegar a la pantalla principal con parámetro para activar grabación
        router.push('/?voiceNote=true' as any);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [currentLanguage]); // Re-run cuando cambie el idioma

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <Stack />
    </SafeAreaProvider>
  );
}
