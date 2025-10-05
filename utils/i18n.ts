import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { useEffect, useState } from 'react';
import en from '../i18n/en.json';
import es from '../i18n/es.json';
import pt from '../i18n/pt.json';

/**
 * Servicio de Internacionalización (i18n)
 *
 * Soporta:
 * - 🇺🇸 English (en)
 * - 🇪🇸 Español (es)
 * - 🇧🇷 Português (pt)
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
  pt,
});

// Mapear códigos de idioma a locales soportados
const supportedLocales = ['en', 'es', 'pt'];

// Inicializar en inglés por defecto (se sincronizará con el store después)
i18n.locale = 'en';

// Habilitar fallback a inglés si falta una traducción
i18n.enableFallback = true;

// Configurar locale por defecto
i18n.defaultLocale = 'en';

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
 * @param newLocale - Código de idioma ('en' | 'es' | 'pt')
 */
export const changeLanguage = (newLocale: 'en' | 'es' | 'pt'): Promise<void> => {
  return new Promise((resolve) => {
    if (supportedLocales.includes(newLocale)) {
      i18n.locale = newLocale;

      // Notificar a todos los listeners
      languageChangeListeners.forEach(listener => listener());

      // Pequeño delay para asegurar que el cambio se propaga
      setTimeout(() => {
        resolve();
      }, 100);
    } else {
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
export const getAvailableLanguages = (): Array<{ code: string; name: string; abbreviation: string }> => {
  return [
    { code: 'en', name: 'English', abbreviation: 'En' },
    { code: 'es', name: 'Español', abbreviation: 'Es' },
    { code: 'pt', name: 'Português', abbreviation: 'Pt' },
  ];
};

/**
 * Hook de React para forzar re-render cuando cambia el idioma
 * Útil para componentes que usan traducciones dinámicas
 */
export const useLanguage = (): string => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);

  useEffect(() => {
    const unsubscribe = onLanguageChange(() => {
      setCurrentLanguage(i18n.locale);
    });

    return unsubscribe;
  }, []);

  return currentLanguage;
};

export default i18n;
