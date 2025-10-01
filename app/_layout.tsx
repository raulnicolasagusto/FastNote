import '../global.css';

import { Stack, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as QuickActions from 'expo-quick-actions';
import { useQuickActionRouting } from 'expo-quick-actions/router';
import mobileAds from 'react-native-google-mobile-ads';

export default function Layout() {
  const router = useRouter();

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

    // Configure quick actions
    QuickActions.setItems([
      {
        id: "voice_note",
        title: "Nota de Voz Rápida",
        subtitle: "Grabar una nota hablando",
        icon: "voice_note",
        params: { action: "voice_note" },
      },
      // Preparamos espacio para el segundo shortcut futuro
      // {
      //   id: "quick_note",
      //   title: "Nota Rápida", 
      //   subtitle: "Crear nota de texto",
      //   icon: "voice_note",
      //   params: { action: "quick_note" },
      // },
    ]);

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
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <Stack />
    </SafeAreaProvider>
  );
}
