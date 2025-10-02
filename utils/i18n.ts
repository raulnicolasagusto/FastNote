import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import en from '../i18n/en.json';
import es from '../i18n/es.json';

/**
 * Servicio de Internacionalización (i18n)
 *
 * Soporta:
 * - 🇺🇸 English (en)
 * - 🇪🇸 Español (es)
 *
 * Detección automática del idioma del dispositivo.
 * Fallback a inglés si el idioma no está disponible.
 */

// Event listener para cambios de idioma
type LanguageChangeListener = () => void;
const languageChangeListeners: Set<LanguageChangeListener> = new Set();

// Crear instancia de i18n
const i18n = new I18n({
  en,
  es,
});

// Configurar locale basado en el dispositivo
const deviceLocales = getLocales();
const deviceLanguage = deviceLocales[0]?.languageCode ?? 'en';

// Mapear códigos de idioma a locales soportados
const supportedLocales = ['en', 'es'];
const locale = supportedLocales.includes(deviceLanguage) ? deviceLanguage : 'en';

i18n.locale = locale;

// Habilitar fallback a inglés si falta una traducción
i18n.enableFallback = true;

// Configurar locale por defecto
i18n.defaultLocale = 'en';

console.log('🌍 i18n initialized:', {
  deviceLanguage,
  selectedLocale: i18n.locale,
  availableLocales: supportedLocales,
});

/**
 * Función de traducción (shorthand)
 * @param key - Clave de traducción (ej: 'notes.newNote')
 * @param params - Parámetros para interpolación (ej: { count: 5 })
 * @returns Texto traducido
 */
export const t = (key: string, params?: Record<string, any>): string => {
  return i18n.t(key, params);
};

/**
 * Cambiar idioma manualmente
 * @param newLocale - Código de idioma ('en' | 'es')
 */
export const changeLanguage = (newLocale: 'en' | 'es'): Promise<void> => {
  return new Promise((resolve) => {
    if (supportedLocales.includes(newLocale)) {
      i18n.locale = newLocale;
      console.log('🌍 Language changed to:', newLocale);

      // Notificar a todos los listeners
      languageChangeListeners.forEach(listener => listener());

      // Pequeño delay para asegurar que el cambio se propaga
      setTimeout(() => {
        resolve();
      }, 100);
    } else {
      console.warn('⚠️ Locale not supported:', newLocale);
      resolve();
    }
  });
};

/**
 * Suscribirse a cambios de idioma
 * @param listener - Función que se ejecutará cuando cambie el idioma
 * @returns Función para desuscribirse
 */
export const onLanguageChange = (listener: LanguageChangeListener): (() => void) => {
  languageChangeListeners.add(listener);
  return () => {
    languageChangeListeners.delete(listener);
  };
};

/**
 * Obtener idioma actual
 * @returns Código de idioma actual
 */
export const getCurrentLanguage = (): string => {
  return i18n.locale;
};

/**
 * Obtener todos los idiomas disponibles
 * @returns Array de códigos de idioma
 */
export const getAvailableLanguages = (): Array<{ code: string; name: string; flag: string }> => {
  return [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];
};

export default i18n;
