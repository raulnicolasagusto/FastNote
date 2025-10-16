import { TestIds } from 'react-native-google-mobile-ads';

/**
 * AdMob Configuration
 *
 * IMPORTANTE: Los Ad Unit IDs NO son secretos y es seguro tenerlos en el código.
 * Solo permiten mostrar anuncios, no dan acceso a la cuenta de AdMob.
 *
 * En desarrollo (__DEV__ = true): Usa TestIds de Google
 * En producción (__DEV__ = false): Usa IDs reales de la cuenta de AdMob
 */

export const ADMOB_CONFIG = {
  // App IDs (configurados en app.json)
  ANDROID_APP_ID: 'ca-app-pub-1467750216848197~2756187783',
  IOS_APP_ID: 'ca-app-pub-xxxxxxxx~xxxxxxxx', // TODO: Agregar si publicas en iOS

  // Banner Ad Unit IDs
  BANNER_HOME: __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-1467750216848197/2716711608', // FastVoiceNote Home Banner

  BANNER_NOTE_DETAIL: __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-1467750216848197/9713364798', // FastVoiceNote Note Detail Banner

  // Interstitial Ad Unit ID
  INTERSTITIAL: __DEV__
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-1467750216848197/1470493448', // Muro Intersticial
};

/**
 * Helper para obtener el Ad Unit ID correcto según el ambiente
 */
export const getAdUnitId = (adType: 'banner_home' | 'banner_note' | 'interstitial'): string => {
  switch (adType) {
    case 'banner_home':
      return ADMOB_CONFIG.BANNER_HOME;
    case 'banner_note':
      return ADMOB_CONFIG.BANNER_NOTE_DETAIL;
    case 'interstitial':
      return ADMOB_CONFIG.INTERSTITIAL;
    default:
      return TestIds.BANNER;
  }
};
