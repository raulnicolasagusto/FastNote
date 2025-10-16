import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { useAdsStore } from '../store/ads/useAdsStore';
import { ADMOB_CONFIG } from '../constants/admob';

/**
 * Servicio Singleton para manejar Interstitial Ads
 *
 * Solo existe UNA instancia del ad en toda la app,
 * evitando múltiples instancias al navegar entre pantallas.
 */
class InterstitialAdService {
  private interstitial: InterstitialAd | null = null;
  private isLoaded: boolean = false;
  private isInitialized: boolean = false;

  /**
   * Inicializa el Interstitial Ad (llamar solo una vez al inicio de la app)
   */
  initialize() {
    if (this.isInitialized) {
      console.log('⚠️ Interstitial Ad Service already initialized');
      return;
    }

    console.log('🎯 Initializing Interstitial Ad Service');

    // Crear instancia del Interstitial Ad
    this.interstitial = InterstitialAd.createForAdRequest(ADMOB_CONFIG.INTERSTITIAL, {
      keywords: ['productivity', 'notes', 'organization', 'tools'],
    });

    // Suscribirse a eventos
    this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('🎯 Interstitial Ad loaded successfully');
      this.isLoaded = true;
    });

    this.interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('❌ Interstitial Ad error:', error);
      this.isLoaded = false;
    });

    this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('✅ Interstitial Ad closed by user');

      // Marcar como mostrado en esta sesión INMEDIATAMENTE
      const store = useAdsStore.getState();
      store.markInterstitialAsShown();

      // Marcar como no cargado
      this.isLoaded = false;

      console.log('🔒 Interstitial Ad session locked - won\'t show again until app restart');

      // NO recargar otro ad automáticamente - esperamos al siguiente reinicio de app
      // Esto evita que se muestre múltiples veces por sesión
    });

    this.interstitial.addAdEventListener(AdEventType.OPENED, () => {
      console.log('👀 Interstitial Ad opened');
    });

    // Precargar el ad inmediatamente
    this.interstitial.load();

    this.isInitialized = true;
  }

  /**
   * Muestra el Interstitial Ad si es elegible
   */
  showIfEligible() {
    const store = useAdsStore.getState();
    const hasShownThisSession = store.hasShownInterstitialThisSession;

    console.log('🔍 Checking if Interstitial Ad is eligible:', {
      isInitialized: this.isInitialized,
      hasInterstitial: !!this.interstitial,
      isLoaded: this.isLoaded,
      hasShownThisSession
    });

    if (!this.isInitialized || !this.interstitial) {
      console.log('⚠️ Interstitial Ad Service not initialized');
      return;
    }

    if (hasShownThisSession) {
      console.log('⏭️ Interstitial Ad already shown this session, skipping');
      return;
    }

    if (!this.isLoaded) {
      console.log('⏳ Interstitial Ad not loaded yet, skipping');
      return;
    }

    console.log('🎬 Showing Interstitial Ad NOW');
    this.interstitial.show();
  }

  /**
   * Recarga el ad (llamar después de reset de sesión)
   */
  reloadAd() {
    if (!this.isInitialized || !this.interstitial) {
      console.log('⚠️ Cannot reload - Service not initialized');
      return;
    }

    if (this.isLoaded) {
      console.log('⚠️ Ad already loaded, skipping reload');
      return;
    }

    console.log('🔄 Reloading Interstitial Ad');
    this.interstitial.load();
  }
}

// Exportar una ÚNICA instancia (Singleton)
export const interstitialAdService = new InterstitialAdService();
