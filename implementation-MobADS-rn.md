# Implementación de Google AdMob en React Native con Expo

## Resumen
Esta guía explica paso a paso cómo integrar Google AdMob en una aplicación React Native usando Expo (managed workflow). Incluye configuración completa, inicialización del SDK y display de banners de prueba y producción.

---

## Requisitos Previos

### 1. Cuenta de Google AdMob
**IMPORTANTE**: Antes de comenzar, el usuario DEBE:
1. Crear una cuenta en [Google AdMob](https://apps.admob.com)
2. Crear una aplicación en AdMob (Android y/o iOS)
3. Obtener el **App ID** (formato: `ca-app-pub-xxxxxxxx~xxxxxxxx`)
   - Se encuentra en: Apps > Tu App > App settings > App ID
4. (Opcional) Crear unidades de anuncios personalizadas para obtener Unit IDs específicos

### 2. Tecnologías del Proyecto
- **React Native**: 0.81.4+
- **Expo SDK**: 54.0.0+
- **Expo Router**: Para navegación
- **TypeScript**: Recomendado pero opcional
- **EAS Build**: Para compilar la app (no funciona con Expo Go)

---

## Paso 1: Instalación de Dependencias

### Comando de Instalación
```bash
npx expo install react-native-google-mobile-ads
```

Este comando instala:
- `react-native-google-mobile-ads` (versión compatible con tu Expo SDK)
- Config plugin de Expo para AdMob

**Verificación**: Revisa que en `package.json` aparezca:
```json
{
  "dependencies": {
    "react-native-google-mobile-ads": "^15.8.0"
  }
}
```

---

## Paso 2: Configuración en app.json

### 2.1 Agregar Plugin de AdMob

Edita el archivo `app.json` y agrega el plugin de AdMob en la sección `plugins`:

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      "expo-build-properties",
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-1467750216848197~2756187783",
          "iosAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx"
        }
      ]
    ]
  }
}
```

**IMPORTANTE**:
- Reemplaza `androidAppId` con el App ID de tu app de Android obtenido en AdMob
- Reemplaza `iosAppId` con el App ID de tu app de iOS (si aplica)
- Si solo compilas para Android, puedes dejar el iOS con el placeholder `ca-app-pub-xxxxxxxx~xxxxxxxx`
- **La estructura del array es CRÍTICA**: `[nombre_plugin, configuración]`

### 2.2 Estructura Correcta vs Incorrecta

❌ **INCORRECTO** (causará crash):
```json
"plugins": [
  "react-native-google-mobile-ads",
  {
    "androidAppId": "ca-app-pub-xxx"
  }
]
```

✅ **CORRECTO**:
```json
"plugins": [
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-xxx"
    }
  ]
]
```

### 2.3 Configuraciones Opcionales

Si necesitas tracking de iOS o configuraciones avanzadas:

```json
[
  "react-native-google-mobile-ads",
  {
    "androidAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx",
    "iosAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx",
    "userTrackingUsageDescription": "This identifier will be used to deliver personalized ads to you."
  }
]
```

---

## Paso 3: Inicialización del SDK

### 3.1 ¿Dónde Inicializar?

El SDK de AdMob debe inicializarse **una sola vez** al arrancar la app, ANTES de mostrar anuncios.

**Ubicación recomendada**: En el archivo de layout principal (`app/_layout.tsx` si usas Expo Router, o `App.tsx` si usas estructura clásica)

### 3.2 Código de Inicialización

Edita `app/_layout.tsx` (o tu archivo de layout principal):

```typescript
import { useEffect } from 'react';
import mobileAds from 'react-native-google-mobile-ads';

export default function Layout() {
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

    // ... resto de tu código de useEffect
  }, []);

  return (
    // ... tu JSX
  );
}
```

**Explicación**:
- `mobileAds()` obtiene la instancia del SDK
- `.initialize()` inicializa el SDK (retorna una Promise)
- `adapterStatuses` contiene información sobre adaptadores de mediación inicializados
- Los logs ayudan a debuggear si hay problemas

### 3.3 Consideraciones Importantes

⚠️ **ADVERTENCIA**:
- NO inicialices el SDK múltiples veces
- NO cargues anuncios antes de que `.initialize()` se complete
- Para usuarios de Europa (GDPR), debes obtener consentimiento ANTES de inicializar

---

## Paso 4: Implementar Banner Publicitario

### 4.1 Test IDs vs Production IDs

**CRÍTICO PARA TU CUENTA**: Durante desarrollo, SIEMPRE usa Test IDs.

#### ¿Por qué?
- Si haces click en tus propios anuncios reales, Google puede **banear tu cuenta**
- Los Test IDs muestran anuncios de prueba que puedes clickear sin riesgo
- Solo usa Production IDs cuando publiques la app en la tienda

#### Test IDs Disponibles:
```typescript
import { TestIds } from 'react-native-google-mobile-ads';

TestIds.BANNER              // Banner publicitario
TestIds.INTERSTITIAL        // Anuncio intersticial (pantalla completa)
TestIds.REWARDED            // Anuncio con recompensa
TestIds.APP_OPEN            // Anuncio de apertura de app
TestIds.REWARDED_INTERSTITIAL // Intersticial con recompensa
```

### 4.2 Implementación del Banner

Elige dónde mostrar el banner (ejemplo: pantalla principal):

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Tu contenido aquí */}

      {/* Banner de AdMob */}
      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
});
```

### 4.3 Explicación de Parámetros

#### `unitId`
- **Desarrollo**: `TestIds.BANNER`
- **Producción**: Tu Ad Unit ID real (ej: `ca-app-pub-xxxxx/yyyyy`)

#### `size` (Tamaños de Banner)
Opciones disponibles:
```typescript
BannerAdSize.BANNER              // 320x50
BannerAdSize.LARGE_BANNER        // 320x100
BannerAdSize.MEDIUM_RECTANGLE    // 300x250
BannerAdSize.FULL_BANNER         // 468x60
BannerAdSize.LEADERBOARD         // 728x90
BannerAdSize.ANCHORED_ADAPTIVE_BANNER  // Adaptativo (recomendado)
```

**Recomendación**: Usa `ANCHORED_ADAPTIVE_BANNER` para que se adapte al ancho de la pantalla.

#### `requestOptions`
```typescript
{
  requestNonPersonalizedAdsOnly: false,  // true = anuncios no personalizados
  keywords: ['game', 'puzzle'],          // Palabras clave para targeting
  contentUrl: 'https://example.com',     // URL de contenido
  networkExtras: {}                       // Extras de red de mediación
}
```

### 4.4 Posicionamiento del Banner

Opciones comunes:

**Opción 1: Banner en la parte inferior (posición relativa)**
```typescript
<View style={{ flex: 1 }}>
  <ScrollView style={{ flex: 1 }}>
    {/* Contenido */}
  </ScrollView>

  <View style={styles.bannerContainer}>
    <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  </View>
</View>
```

**Opción 2: Banner fijo en el fondo (posición absoluta)**
```typescript
<View style={{ flex: 1 }}>
  {/* Contenido */}

  <View style={styles.bannerFixed}>
    <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  </View>
</View>

// Estilos
const styles = StyleSheet.create({
  bannerFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
```

**Opción 3: Banner en la parte superior**
```typescript
<View style={{ flex: 1 }}>
  <View style={styles.bannerContainer}>
    <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  </View>

  <ScrollView style={{ flex: 1 }}>
    {/* Contenido */}
  </ScrollView>
</View>
```

### 4.5 Manejo de Eventos

Para detectar cuando el banner carga, falla, o recibe clicks:

```typescript
<BannerAd
  unitId={TestIds.BANNER}
  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  onAdLoaded={() => {
    console.log('✅ Banner loaded');
  }}
  onAdFailedToLoad={(error) => {
    console.error('❌ Banner failed to load:', error);
  }}
  onAdOpened={() => {
    console.log('👆 Banner clicked/opened');
  }}
  onAdClosed={() => {
    console.log('🚪 Banner closed');
  }}
/>
```

---

## Paso 5: Build y Testing

### 5.1 ¿Por qué no funciona en Expo Go?

⚠️ **react-native-google-mobile-ads NO funciona en Expo Go** porque:
- Contiene código nativo personalizado
- Requiere config plugin que modifica archivos nativos
- Expo Go no puede cargar plugins nativos personalizados

### 5.2 Crear Development Build

**Opción 1: Build en la nube con EAS**
```bash
# Instalar EAS CLI (si no lo tienes)
npm install -g eas-cli

# Login en tu cuenta de Expo
eas login

# Configurar el proyecto (primera vez)
eas build:configure

# Crear build de desarrollo para Android
eas build --platform android --profile development

# O crear build local (más rápido)
eas build --platform android --profile development --local
```

**Opción 2: Build local con prebuild**
```bash
# Generar carpetas nativas
npx expo prebuild

# Compilar para Android
npx expo run:android

# O para iOS
npx expo run:ios
```

### 5.3 Instalación del Build

1. Espera a que el build termine (5-15 minutos en la nube)
2. Descarga el APK/AAB (Android) o IPA (iOS)
3. Instala en tu dispositivo físico o emulador
4. Ejecuta `npm start` y selecciona el development build

### 5.4 Verificación

Al abrir la app, deberías ver en los logs:
```
🎯 AdMob SDK initialized: {...}
✅ Banner loaded
```

Y visualmente:
- Banner de prueba visible (con texto "Test Ad")
- NO debería interferir con la navegación del sistema
- Debería adaptarse al ancho de la pantalla

---

## Paso 6: Migración a Producción

### 6.1 Crear Ad Unit ID Real

1. Entra a [Google AdMob](https://apps.admob.com)
2. Ve a: **Apps > Tu App > Ad units**
3. Click en **Add ad unit**
4. Selecciona **Banner**
5. Configura:
   - Nombre: "Home Banner" (o el que quieras)
   - Tipo: Banner
6. Click en **Create ad unit**
7. Copia el **Ad unit ID** (formato: `ca-app-pub-xxxxx/yyyyy`)

### 6.2 Reemplazar Test IDs

**Opción A: Hardcoded (simple pero no recomendado)**
```typescript
<BannerAd
  unitId="ca-app-pub-1467750216848197/1234567890"  // Tu ID real
  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
/>
```

**Opción B: Condicional (recomendado)**
```typescript
import { TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.BANNER  // En desarrollo
  : 'ca-app-pub-1467750216848197/1234567890';  // En producción

<BannerAd
  unitId={adUnitId}
  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
/>
```

**Opción C: Variables de Entorno (más profesional)**

1. Instala `expo-constants`:
```bash
npx expo install expo-constants
```

2. Crea archivo `.env`:
```
EXPO_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-xxxxx/yyyyy
```

3. Usa en tu código:
```typescript
import Constants from 'expo-constants';
import { TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : Constants.expoConfig?.extra?.EXPO_PUBLIC_ADMOB_BANNER_ID || TestIds.BANNER;

<BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
```

### 6.3 Build de Producción

```bash
# Build para publicar en Play Store
eas build --platform android --profile production

# O para App Store
eas build --platform ios --profile production
```

### 6.4 Configurar en Google Play Console

**IMPORTANTE**: Antes de publicar, debes:

1. Ir a **Google Play Console**
2. Navegar a: **Política y programas > Contenido de la app**
3. Buscar sección: **Anuncios**
4. Seleccionar: **"Sí, mi app contiene anuncios"**
5. Responder el cuestionario sobre tipos de anuncios
6. Guardar cambios

**Si no haces esto, tu app puede ser rechazada o removida de la tienda.**

---

## Paso 7: Otros Tipos de Anuncios

### 7.1 Interstitial (Pantalla Completa)

```typescript
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

// Crear instancia del anuncio
const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: false,
});

// Cargar el anuncio
const loadInterstitial = () => {
  const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    console.log('Interstitial loaded');
    interstitial.show();
  });

  interstitial.load();

  return unsubscribe;
};

// Usar en tu componente
useEffect(() => {
  const unsubscribe = loadInterstitial();
  return unsubscribe;
}, []);
```

### 7.2 Rewarded (Con Recompensa)

```typescript
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED);

const loadRewarded = () => {
  const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
    rewarded.show();
  });

  const unsubscribeEarned = rewarded.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    reward => {
      console.log('User earned reward of ', reward);
      // Dar recompensa al usuario (ej: monedas, vidas, etc)
    },
  );

  rewarded.load();

  return () => {
    unsubscribeLoaded();
    unsubscribeEarned();
  };
};
```

### 7.3 App Open (Al Abrir la App)

```typescript
import { AppOpenAd, TestIds } from 'react-native-google-mobile-ads';

const appOpenAd = AppOpenAd.createForAdRequest(TestIds.APP_OPEN);

appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
  appOpenAd.show();
});

appOpenAd.load();
```

---

## Troubleshooting

### Problema 1: "AdMob App ID is not configured"

**Causa**: El plugin no está bien configurado en `app.json`

**Solución**:
1. Verifica que el plugin esté en formato array: `[nombre, config]`
2. Verifica que el App ID sea correcto (formato: `ca-app-pub-xxxxx~xxxxx`)
3. Haz un clean build: `eas build --clear-cache`

### Problema 2: Banner no se muestra

**Causa**: Múltiples razones posibles

**Solución**:
1. Verifica que el SDK esté inicializado (`mobileAds().initialize()`)
2. Revisa los logs para ver errores de carga
3. Verifica conexión a internet
4. Asegúrate de estar usando `TestIds` durante desarrollo
5. Espera unos segundos, los anuncios tardan en cargar

### Problema 3: "Ad failed to load: 3"

**Causa**: Error de red o configuración

**Solución**:
1. Error 3 = No fill (no hay anuncios disponibles)
2. Esto es normal con Test IDs a veces
3. Espera unos minutos y vuelve a intentar
4. En producción, asegúrate de tener Ad Units creados en AdMob

### Problema 4: Banner tapa la navegación de Android

**Causa**: Posicionamiento absoluto en el bottom sin SafeArea

**Solución**:
1. Usa posición relativa en lugar de absoluta
2. O usa `SafeAreaView` para respetar áreas del sistema:
```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1 }}>
  {/* Contenido */}
  <View style={styles.banner}>
    <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  </View>
</SafeAreaView>
```

### Problema 5: App crashea al iniciar

**Causa**: App ID no configurado o incorrecto

**Solución**:
1. Verifica `app.json` tenga el App ID correcto
2. Rebuild la app completamente:
```bash
# Limpiar cache
rm -rf node_modules
npm install

# Rebuild
eas build --platform android --profile development --clear-cache
```

---

## Mejores Prácticas

### 1. Frecuencia de Anuncios
- ❌ NO muestres anuncios cada 10 segundos
- ✅ Espera al menos 30-60 segundos entre intersticiales
- ✅ Muestra intersticiales solo en momentos naturales (fin de nivel, después de acción importante)

### 2. UX (Experiencia de Usuario)
- ❌ NO cubras contenido importante con banners
- ✅ Coloca banners al inicio o final de la pantalla
- ✅ Asegúrate de que los anuncios no bloqueen botones de navegación

### 3. Rendimiento
- ✅ Precarga intersticiales/rewarded antes de mostrarlos
- ✅ Limita la cantidad de banners simultáneos (máximo 1-2)
- ✅ Destruye anuncios que ya no se usan

### 4. Testing
- ✅ SIEMPRE usa Test IDs durante desarrollo
- ✅ Prueba en dispositivos reales, no solo emuladores
- ✅ Prueba con diferentes conexiones (WiFi, 4G, 3G)

### 5. Monetización Inteligente
- ✅ Balance entre anuncios y experiencia de usuario
- ✅ Considera ofrecer versión premium sin anuncios
- ✅ Usa rewarded ads para dar incentivos (mejor tasa de interacción)

---

## Recursos Oficiales

- **Documentación AdMob**: https://developers.google.com/admob
- **React Native Google Mobile Ads**: https://github.com/invertase/react-native-google-mobile-ads
- **Expo Config Plugin**: https://docs.expo.dev/config-plugins/introduction/
- **AdMob Policy**: https://support.google.com/admob/answer/6128543
- **GDPR Compliance**: https://developers.google.com/admob/ump/android/quick-start

---

## Checklist Final

Antes de publicar tu app, verifica:

- [ ] App ID configurado correctamente en `app.json`
- [ ] SDK inicializado en `_layout.tsx` o `App.tsx`
- [ ] Test IDs reemplazados por IDs de producción
- [ ] Ad Units creados en Google AdMob Console
- [ ] Build de producción compilado exitosamente
- [ ] "Contiene anuncios" marcado en Google Play Console
- [ ] Anuncios probados en dispositivo físico
- [ ] UX verificada (anuncios no bloquean navegación)
- [ ] Logs de errores revisados
- [ ] Políticas de AdMob cumplidas

---

## Conclusión

Esta guía cubre todo lo necesario para implementar Google AdMob en una app React Native con Expo. Siguiendo estos pasos, podrás:

1. ✅ Configurar AdMob correctamente
2. ✅ Mostrar banners sin arriesgar tu cuenta
3. ✅ Migrar a producción de forma segura
4. ✅ Resolver problemas comunes
5. ✅ Publicar tu app monetizada

**Última actualización**: Enero 2025
**Versiones testeadas**: Expo SDK 54, React Native 0.81.4, react-native-google-mobile-ads 15.8.0
