import { useState, useEffect } from 'react';
import { getCurrentLanguage, onLanguageChange } from './i18n';

/**
 * Hook para forzar re-render cuando cambia el idioma
 *
 * Uso:
 * ```tsx
 * function MyComponent() {
 *   useLanguage(); // Fuerza re-render en cambio de idioma
 *   return <Text>{t('myKey')}</Text>;
 * }
 * ```
 */
export const useLanguage = (): void => {
  const [, setLanguage] = useState(getCurrentLanguage());

  useEffect(() => {
    const unsubscribe = onLanguageChange(() => {
      setLanguage(getCurrentLanguage());
    });

    return unsubscribe;
  }, []);
};
