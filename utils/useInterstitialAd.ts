import { useEffect, useState } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { useAdsStore } from '../store/ads/useAdsStore';

// TODO: Reemplazar con tu Ad Unit ID real de AdMob cuando esté listo
// Para obtenerlo:
// 1. Ve a https://apps.admob.google.com
// 2. Selecciona tu app "FastNote"
// 3. Ve a "Ad units" y crea un nuevo "Interstitial ad"
// 4. Copia el Ad Unit ID (formato: ca-app-pub-xxxxxxxx/yyyyyyyyyy)
const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-1467750216848197/1470493448'; // ⚠️ CAMBIAR POR TU AD UNIT ID

/**
 * Hook para manejar Interstitial Ads
 *
 * Características:
 * - Precarga el ad al iniciar
 * - Solo muestra 1 vez por sesión de app
 * - Se resetea automáticamente al cerrar/abrir app
 * - Recarga un nuevo ad después de mostrar uno
 *
 * @returns {
 *   loaded: boolean - Si el ad está listo para mostrar
 *   showInterstitialIfEligible: () => void - Muestra el ad si cumple condiciones
 *   canShowInterstitial: boolean - Si se puede mostrar (no se ha mostrado esta sesión)
 * }
 */
export const useInterstitialAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);

  const {
    hasShownInterstitialThisSession,
    markInterstitialAsShown
  } = useAdsStore();

  useEffect(() => {
    // Crear instancia del Interstitial Ad
    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      keywords: ['productivity', 'notes', 'organization', 'tools'],
    });

    setInterstitial(ad);

    // Suscribirse a eventos
    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      console.log('🎯 Interstitial Ad loaded successfully');
      setLoaded(true);
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('❌ Interstitial Ad error:', error);
      setLoaded(false);
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('✅ Interstitial Ad closed by user');

      // Marcar como mostrado en esta sesión INMEDIATAMENTE
      markInterstitialAsShown();

      // Mantener loaded en false para evitar que se muestre de nuevo
      setLoaded(false);

      console.log('🔒 Interstitial Ad session locked - won\'t show again until app restart');
    });

    const unsubscribeOpened = ad.addAdEventListener(AdEventType.OPENED, () => {
      console.log('👀 Interstitial Ad opened');
    });

    // Precargar el ad inmediatamente
    ad.load();

    // Cleanup
    return () => {
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
      unsubscribeOpened();
    };
  }, [markInterstitialAsShown]);

  /**
   * Muestra el Interstitial Ad si:
   * 1. El ad está cargado
   * 2. No se ha mostrado en esta sesión
   *
   * Uso: llamar cuando usuario vuelve de nota → home
   */
  const showInterstitialIfEligible = () => {
    console.log('🔍 Checking if Interstitial Ad is eligible:', {
      hasInterstitial: !!interstitial,
      loaded,
      hasShownThisSession: hasShownInterstitialThisSession
    });

    if (!interstitial) {
      console.log('⚠️ Interstitial Ad instance not ready');
      return;
    }

    if (hasShownInterstitialThisSession) {
      console.log('⏭️ Interstitial Ad already shown this session, skipping');
      return;
    }

    if (!loaded) {
      console.log('⏳ Interstitial Ad not loaded yet, skipping');
      return;
    }

    console.log('🎬 Showing Interstitial Ad NOW');
    interstitial.show();
  };

  return {
    loaded,
    showInterstitialIfEligible,
    canShowInterstitial: !hasShownInterstitialThisSession && loaded,
  };
};
