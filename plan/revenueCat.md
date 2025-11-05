# RevenueCat: Guía Completa de Implementación y Costos

## 📋 Tabla de Contenidos
1. [¿Qué es RevenueCat?](#qué-es-revenuecat)
2. [Ventajas y Desventajas](#ventajas-y-desventajas)
3. [Costos Detallados](#costos-detallados-2025)
4. [Implementación Paso a Paso](#implementación-paso-a-paso)
5. [Código Completo](#código-de-implementación)
6. [Comparación con react-native-iap](#comparación-react-native-iap-vs-revenuecat)
7. [Recomendaciones](#recomendación-final)

---

## 🎯 ¿Qué es RevenueCat?

**RevenueCat** es un servicio completo de backend para manejar suscripciones e in-app purchases en aplicaciones móviles. Elimina la necesidad de crear tu propio servidor para validar recibos y gestionar el estado de las suscripciones.

### Características Principales:
- 🔐 **Validación de recibos server-side** (segura y robusta)
- 📊 **Dashboard con analytics** en tiempo real
- 🔄 **Sincronización cross-platform** (iOS ↔ Android)
- 🎯 **A/B testing** de precios y ofertas
- 📈 **Métricas avanzadas** (MRR, churn, LTV)
- 🔌 **Integraciones** con herramientas de analytics

---

## ✅ Ventajas y Desventajas

### Ventajas:

#### 1. **Sin Backend Propio**
- No necesitas crear servidor ni API
- RevenueCat valida recibos automáticamente
- Todo seguro en la nube

#### 2. **Dashboard Completo**
- Ingresos en tiempo real
- Analytics de suscripciones activas
- Tasa de conversión
- Churn rate (cancelaciones)
- MRR (Monthly Recurring Revenue)
- Gráficos y reportes automáticos

#### 3. **Seguridad Robusta**
- Validación server-side imposible de hackear
- Protección contra fraude
- Recibos verificados por RevenueCat

#### 4. **Features Avanzadas**
- A/B testing de precios
- Ofertas promocionales
- Precios dinámicos
- Win-back campaigns
- Integraciones: Mixpanel, Amplitude, Firebase, etc.

#### 5. **Restauración Automática**
- Sincronización entre dispositivos
- Cross-platform (compra en Android → funciona en iOS)
- Cambio de dispositivo sin problemas

#### 6. **SDK Limpio y Simple**
- Menos código que react-native-iap
- API más intuitiva
- Menos bugs y edge cases
- Mejor documentación

#### 7. **Soporte**
- Email support incluido
- Documentación completa
- Ejemplos de código
- Comunidad activa

### Desventajas:

#### 1. **Costo Adicional**
- 1% de ingresos después de $2,500/mes
- Aunque el tier gratis es generoso

#### 2. **Dependencia de Terceros**
- Si RevenueCat tiene problemas, tu app se ve afectada
- Vendor lock-in (difícil migrar después)

#### 3. **Menos Control**
- No puedes customizar la lógica de validación
- Dependes de su infraestructura

#### 4. **Latencia Extra**
- Una request HTTP adicional a RevenueCat
- Aunque es mínima (< 100ms)

---

## 💰 Costos Detallados (2025)

### **Tier Gratis (Starter)**

✅ **GRATIS hasta $2,500 USD/mes** de ingresos (MTR - Monthly Tracked Revenue)

**Incluye:**
- ✅ Usuarios ilimitados
- ✅ Transacciones ilimitadas
- ✅ Todas las features (dashboard, analytics, integraciones)
- ✅ Validación de recibos server-side
- ✅ Restauración de compras
- ✅ Soporte por email
- ✅ Sincronización cross-platform

**Ejemplo**:
- 250 suscripciones anuales × $9.99/año = $2,497.50/mes
- **Resultado: GRATIS** ✅

### **Tier Pagado (Growth)**

Cuando superas $2,500/mes en ingresos:

💵 **1% de tus ingresos mensuales** (MTR)
- No hay cuota fija mensual
- Solo pagas en meses donde superes el umbral
- Todas las features siguen incluidas

**Tabla de Costos**:

| Tus Ingresos/Mes | RevenueCat Cobra | % Real | Tu Recibes Neto* |
|------------------|------------------|--------|------------------|
| $2,500 | $0 (gratis) | 0% | $2,500 |
| $3,000 | $30 | 1% | $2,970 |
| $5,000 | $50 | 1% | $4,950 |
| $10,000 | $100 | 1% | $9,900 |
| $25,000 | $250 | 1% | $24,750 |
| $50,000 | $500 | 1% | $49,500 |
| $100,000 | $1,000 | 1% | $99,000 |

*Sin contar comisión de Google Play (15%)

### **Cálculo Real Completo**

Si vendes suscripción anual a **$9.99**:

1. **Usuario paga**: $9.99
2. **Google Play se queda** (15%): $1.50
3. **Tu recibes de Google**: $8.49
4. **RevenueCat cobra** (si superas $2,500/mes): $0.08 (1% de $8.49)
5. **Tu ganancia neta final**: $8.41

**Resumen**: De cada $9.99, te quedas con **$8.41** (84.2%)

### **Comparación de Comisiones**:

| Servicio | Comisión | Sobre qué monto |
|----------|----------|-----------------|
| Google Play | 15% | Precio de venta |
| Apple App Store | 15% (año 2+) o 30% (año 1) | Precio de venta |
| RevenueCat | 1% | Ingresos después de comisiones |
| **Total Android** | **15.85%** | De $9.99 → Recibes $8.41 |
| **Total iOS (año 2+)** | **15.85%** | De $9.99 → Recibes $8.41 |
| **Total iOS (año 1)** | **30.7%** | De $9.99 → Recibes $6.92 |

### **Enterprise Plan**

Para apps con +$100K/mes en ingresos:
- Precio customizado (negociable)
- Features enterprise avanzadas
- Account manager dedicado
- SLA garantizado
- Onboarding personalizado

**Contacto**: sales@revenuecat.com

---

## 📦 Implementación Paso a Paso

### Paso 1: Crear Cuenta en RevenueCat

1. Ir a [revenuecat.com](https://www.revenuecat.com)
2. Click en **"Get Started Free"**
3. Sign up con email (no piden tarjeta de crédito hasta superar $2,500/mes)
4. Confirmar email
5. Crear proyecto nuevo: **"FastNote"**

### Paso 2: Configurar Aplicación Android

1. En RevenueCat Dashboard → **Apps**
2. Click **"Add New"** → **Android**
3. Configurar:
   - **App Name**: FastNote
   - **Package Name**: `com.raulnicolasagusto.fastnote`
   - **Play Store App ID**: (opcional, buscar en Play Store)

### Paso 3: Conectar con Google Play

Para que RevenueCat valide recibos de Google Play:

1. Ir a Google Play Console
2. **Setup > API Access**
3. Click **"Create new service account"**
4. Seguir pasos para crear service account
5. Descargar archivo JSON de credentials
6. Subir JSON a RevenueCat Dashboard

**Documentación**: https://www.revenuecat.com/docs/creating-play-service-credentials

### Paso 4: Crear Entitlements (Permisos)

Entitlements = Qué le das al usuario premium

1. RevenueCat Dashboard → **Entitlements**
2. Click **"New Entitlement"**
3. Configurar:
   - **Identifier**: `premium`
   - **Name**: "FastNote Premium"
   - **Description**: "Acceso completo sin anuncios y transcripciones ilimitadas"

### Paso 5: Crear Producto/Offering

1. Dashboard → **Products**
2. Click **"Add Product"**
3. Configurar:
   - **Product ID**: `fastnote_premium_yearly` (debe coincidir con Google Play Console)
   - **Type**: Subscription
   - **Entitlement**: `premium` (el que creamos antes)

4. Dashboard → **Offerings**
5. Click **"New Offering"**
6. Configurar:
   - **Identifier**: `default`
   - **Name**: "Default Offering"
   - Agregar **Package**:
     - **Identifier**: `annual`
     - **Product**: `fastnote_premium_yearly`
     - **Duration**: 1 year

### Paso 6: Obtener API Keys

1. Dashboard → **Settings > API Keys**
2. Copiar:
   - **Public API Key** (para Android): `rcb_xxxxxxxxxxxxxxx`
   - **Public API Key** (para iOS): `appl_xxxxxxxxxxxxxxx`

⚠️ **Guarda estas keys en lugar seguro**

---

## 💻 Código de Implementación

### Paso 1: Instalar SDK

```bash
npx expo install react-native-purchases
```

**Versión recomendada**: `^8.0.0` (compatible con Expo SDK 54+)

Verificar en `package.json`:
```json
{
  "dependencies": {
    "react-native-purchases": "^8.0.0"
  }
}
```

### Paso 2: Agregar Config Plugin

Editar `app.json`:

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      "expo-build-properties",
      "react-native-google-mobile-ads",
      [
        "react-native-purchases",
        {
          "apiKey": "rcb_xxxxxxxxxxxxxxx"
        }
      ]
    ]
  }
}
```

⚠️ **Reemplaza** `rcb_xxxxxxxxxxxxxxx` con tu API Key de Android

### Paso 3: Crear Utility de Purchases

Crear archivo `utils/purchases.ts`:

```typescript
// utils/purchases.ts
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

// API Keys de RevenueCat
const ANDROID_API_KEY = 'rcb_xxxxxxxxxxxxxxx';
const IOS_API_KEY = 'appl_xxxxxxxxxxxxxxx';

// Entitlement identifier (debe coincidir con RevenueCat Dashboard)
const PREMIUM_ENTITLEMENT = 'premium';

/**
 * Inicializar RevenueCat SDK
 * Llamar una sola vez al iniciar la app
 */
export const initializePurchases = async (): Promise<void> => {
  try {
    const apiKey = Platform.OS === 'ios' ? IOS_API_KEY : ANDROID_API_KEY;

    await Purchases.configure({ apiKey });

    console.log('✅ RevenueCat initialized');

    // Opcional: Identificar usuario si tienes un sistema de auth
    // await Purchases.logIn('user-id-123');
  } catch (error) {
    console.error('❌ Error initializing RevenueCat:', error);
  }
};

/**
 * Verificar si el usuario tiene suscripción activa
 * @returns true si es Premium, false si no
 */
export const checkPremiumStatus = async (): Promise<boolean> => {
  try {
    const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();

    // Verificar si tiene el entitlement "premium" activo
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;

    console.log('🔍 Premium status:', isPremium);

    return isPremium;
  } catch (error) {
    console.error('❌ Error checking premium status:', error);
    return false;
  }
};

/**
 * Obtener información detallada del usuario
 * Incluye: suscripciones activas, fecha de expiración, etc.
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('❌ Error getting customer info:', error);
    return null;
  }
};

/**
 * Obtener offerings disponibles (productos para comprar)
 */
export const getOfferings = async (): Promise<PurchasesPackage | null> => {
  try {
    const offerings = await Purchases.getOfferings();

    if (!offerings.current) {
      console.warn('⚠️ No offerings available');
      return null;
    }

    // Obtener el package "annual" del offering "default"
    const annualPackage = offerings.current.annual;

    if (!annualPackage) {
      console.warn('⚠️ No annual package found');
      return null;
    }

    console.log('📦 Annual package:', {
      id: annualPackage.identifier,
      price: annualPackage.product.priceString,
      product: annualPackage.product.identifier,
    });

    return annualPackage;
  } catch (error) {
    console.error('❌ Error getting offerings:', error);
    return null;
  }
};

/**
 * Comprar suscripción premium
 * @returns true si la compra fue exitosa, false si falló
 */
export const purchasePremium = async (): Promise<boolean> => {
  try {
    const annualPackage = await getOfferings();

    if (!annualPackage) {
      console.error('❌ No package available for purchase');
      return false;
    }

    console.log('💳 Purchasing package:', annualPackage.identifier);

    const { customerInfo } = await Purchases.purchasePackage(annualPackage);

    // Verificar que la compra otorgó el entitlement premium
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;

    if (isPremium) {
      console.log('✅ Purchase successful! User is now Premium');
      return true;
    } else {
      console.warn('⚠️ Purchase completed but premium not granted');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Purchase failed:', error);

    // Manejar errores específicos
    if (error.userCancelled) {
      console.log('ℹ️ User cancelled the purchase');
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('🌐 Network error during purchase');
    }

    return false;
  }
};

/**
 * Restaurar compras previas
 * Útil si el usuario reinstala la app o cambia de dispositivo
 * @returns true si se restauraron compras, false si no
 */
export const restorePurchases = async (): Promise<boolean> => {
  try {
    console.log('🔄 Restoring purchases...');

    const customerInfo = await Purchases.restorePurchases();

    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;

    if (isPremium) {
      console.log('✅ Purchases restored! User is Premium');
      return true;
    } else {
      console.log('ℹ️ No active purchases found');
      return false;
    }
  } catch (error) {
    console.error('❌ Error restoring purchases:', error);
    return false;
  }
};

/**
 * Obtener fecha de expiración de la suscripción
 * @returns Date o null si no hay suscripción activa
 */
export const getSubscriptionExpiryDate = async (): Promise<Date | null> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const premiumEntitlement = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT];

    if (!premiumEntitlement) {
      return null;
    }

    // expirationDate puede ser null si es lifetime purchase
    const expiryDate = premiumEntitlement.expirationDate;

    return expiryDate ? new Date(expiryDate) : null;
  } catch (error) {
    console.error('❌ Error getting expiry date:', error);
    return null;
  }
};

/**
 * Verificar si la suscripción está en periodo de prueba
 */
export const isInTrialPeriod = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const premiumEntitlement = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT];

    return premiumEntitlement?.periodType === 'TRIAL';
  } catch (error) {
    console.error('❌ Error checking trial status:', error);
    return false;
  }
};

/**
 * Obtener precio formateado del producto anual
 * @returns string con el precio (ej: "$9.99") o null
 */
export const getAnnualPrice = async (): Promise<string | null> => {
  try {
    const annualPackage = await getOfferings();
    return annualPackage?.product.priceString || null;
  } catch (error) {
    console.error('❌ Error getting price:', error);
    return null;
  }
};
```

### Paso 4: Inicializar en _layout.tsx

Editar `app/_layout.tsx`:

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import mobileAds from 'react-native-google-mobile-ads';
import { initializePurchases } from '../utils/purchases';

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    // Inicializar AdMob SDK
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('🎯 AdMob SDK initialized:', adapterStatuses);
      })
      .catch(error => {
        console.error('❌ AdMob SDK initialization failed:', error);
      });

    // Inicializar RevenueCat SDK
    initializePurchases();

    // ... resto de tu código (Quick Actions, etc)
  }, []);

  return (
    // ... tu layout
  );
}
```

### Paso 5: Crear Pantalla de Premium

Crear archivo `app/premium.tsx`:

```typescript
// app/premium.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  checkPremiumStatus,
  purchasePremium,
  restorePurchases,
  getAnnualPrice,
  getSubscriptionExpiryDate,
} from '../utils/purchases';
import { useThemeStore } from '../store/theme/useThemeStore';
import { SPACING, TYPOGRAPHY } from '../constants/theme';

export default function PremiumScreen() {
  const { colors, isDarkMode } = useThemeStore();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [price, setPrice] = useState<string>('$9.99');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    setLoading(true);
    try {
      const [status, annualPrice, expiry] = await Promise.all([
        checkPremiumStatus(),
        getAnnualPrice(),
        getSubscriptionExpiryDate(),
      ]);

      setIsPremium(status);
      if (annualPrice) setPrice(annualPrice);
      setExpiryDate(expiry);
    } catch (error) {
      console.error('Error loading premium status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const success = await purchasePremium();

      if (success) {
        setIsPremium(true);
        Alert.alert(
          '🎉 ¡Bienvenido a Premium!',
          'Ahora disfrutas de FastNote sin límites:\n\n✅ Sin anuncios\n✅ Transcripciones ilimitadas',
          [{ text: 'Genial', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          'Error en la Compra',
          'No se pudo completar la compra. Por favor intenta de nuevo.'
        );
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    try {
      const success = await restorePurchases();

      if (success) {
        setIsPremium(true);
        Alert.alert(
          '✅ Compra Restaurada',
          'Tu suscripción ha sido restaurada exitosamente',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          'No se Encontraron Compras',
          'No hay suscripciones activas asociadas a esta cuenta'
        );
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'No se pudieron restaurar las compras');
    } finally {
      setPurchasing(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.blue} />
        </View>
      </SafeAreaView>
    );
  }

  if (isPremium) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <Stack.Screen options={{ headerShown: false }} />

        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Premium</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Premium Active Content */}
        <View style={styles.content}>
          <View style={styles.premiumActiveContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accent.green + '20' }]}>
              <MaterialIcons name="check-circle" size={80} color={colors.accent.green} />
            </View>

            <Text style={[styles.premiumTitle, { color: colors.textPrimary }]}>
              🎉 Eres Premium
            </Text>

            <Text style={[styles.premiumSubtitle, { color: colors.textSecondary }]}>
              Disfrutando de FastNote sin límites
            </Text>

            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <MaterialIcons name="check" size={24} color={colors.accent.green} />
                <Text style={[styles.benefitText, { color: colors.textPrimary }]}>
                  Sin anuncios
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <MaterialIcons name="check" size={24} color={colors.accent.green} />
                <Text style={[styles.benefitText, { color: colors.textPrimary }]}>
                  Transcripciones ilimitadas
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <MaterialIcons name="check" size={24} color={colors.accent.green} />
                <Text style={[styles.benefitText, { color: colors.textPrimary }]}>
                  Soporte prioritario
                </Text>
              </View>
            </View>

            {expiryDate && (
              <Text style={[styles.expiryText, { color: colors.textSecondary }]}>
                Válido hasta: {expiryDate.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Premium</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>
            FastNote Premium
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Desbloquea todo el potencial de FastNote
          </Text>
        </View>

        {/* Benefits */}
        <View style={[styles.benefitsCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: colors.accent.blue + '20' }]}>
              <MaterialIcons name="block" size={28} color={colors.accent.blue} />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={[styles.benefitTitle, { color: colors.textPrimary }]}>
                Sin Anuncios
              </Text>
              <Text style={[styles.benefitDescription, { color: colors.textSecondary }]}>
                Experiencia sin interrupciones
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: colors.accent.purple + '20' }]}>
              <MaterialIcons name="mic" size={28} color={colors.accent.purple} />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={[styles.benefitTitle, { color: colors.textPrimary }]}>
                Transcripciones Ilimitadas
              </Text>
              <Text style={[styles.benefitDescription, { color: colors.textSecondary }]}>
                Convierte voz a texto sin límites
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: colors.accent.green + '20' }]}>
              <MaterialIcons name="support-agent" size={28} color={colors.accent.green} />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={[styles.benefitTitle, { color: colors.textPrimary }]}>
                Soporte Prioritario
              </Text>
              <Text style={[styles.benefitDescription, { color: colors.textSecondary }]}>
                Respuesta rápida a tus consultas
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingSection}>
          <Text style={[styles.priceAmount, { color: colors.textPrimary }]}>
            {price}/año
          </Text>
          <Text style={[styles.priceNote, { color: colors.textSecondary }]}>
            Cancela cuando quieras
          </Text>
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          style={[
            styles.purchaseButton,
            { backgroundColor: colors.accent.blue },
            purchasing && styles.purchaseButtonDisabled,
          ]}
          onPress={handlePurchase}
          disabled={purchasing}>
          {purchasing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.purchaseButtonText}>Obtener Premium</Text>
          )}
        </TouchableOpacity>

        {/* Restore Button */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={purchasing}>
          <Text style={[styles.restoreButtonText, { color: colors.accent.blue }]}>
            Restaurar Compras
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
          Al comprar, aceptas los términos y condiciones.{'\n'}
          La suscripción se renueva automáticamente.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  topSection: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.bodySize,
    textAlign: 'center',
  },
  benefitsCard: {
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  benefitIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: TYPOGRAPHY.bodySize + 2,
    fontWeight: '600',
    marginBottom: SPACING.xs / 2,
  },
  benefitDescription: {
    fontSize: TYPOGRAPHY.dateSize,
  },
  pricingSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  priceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  priceNote: {
    fontSize: TYPOGRAPHY.dateSize,
  },
  purchaseButton: {
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.bodySize + 2,
    fontWeight: 'bold',
  },
  restoreButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  restoreButtonText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
  termsText: {
    fontSize: TYPOGRAPHY.dateSize,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.dateSize * 1.5,
    marginBottom: SPACING.xl,
  },
  premiumActiveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  premiumTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  premiumSubtitle: {
    fontSize: TYPOGRAPHY.bodySize,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  benefitsList: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  benefitText: {
    fontSize: TYPOGRAPHY.bodySize + 2,
    marginLeft: SPACING.md,
  },
  expiryText: {
    fontSize: TYPOGRAPHY.dateSize,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
});
```

### Paso 6: Ocultar Anuncios si es Premium

Editar `components/layout/MainScreen.tsx`:

```typescript
// components/layout/MainScreen.tsx
import { useEffect, useState } from 'react';
import { checkPremiumStatus } from '../../utils/purchases';

export const MainScreen = ({ ... }) => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Verificar estado Premium al cargar
    checkPremiumStatus().then(setIsPremium);
  }, []);

  return (
    <SafeAreaView>
      {/* Tu contenido */}

      {/* Solo mostrar banner si NO es premium */}
      {!isPremium && (
        <View style={styles.bannerContainer}>
          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
```

Hacer lo mismo en `app/note-detail.tsx`.

### Paso 7: Limitar Transcripciones para Usuarios Free

Crear helper para contar transcripciones:

```typescript
// utils/transcriptionLimit.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSCRIPTION_COUNT_KEY = '@fastnote_transcription_count';
const MAX_FREE_TRANSCRIPTIONS = 10;

export const getTranscriptionCount = async (): Promise<number> => {
  try {
    const count = await AsyncStorage.getItem(TRANSCRIPTION_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error('Error getting transcription count:', error);
    return 0;
  }
};

export const incrementTranscriptionCount = async (): Promise<number> => {
  try {
    const currentCount = await getTranscriptionCount();
    const newCount = currentCount + 1;
    await AsyncStorage.setItem(TRANSCRIPTION_COUNT_KEY, newCount.toString());
    return newCount;
  } catch (error) {
    console.error('Error incrementing transcription count:', error);
    return currentCount;
  }
};

export const resetTranscriptionCount = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(TRANSCRIPTION_COUNT_KEY, '0');
  } catch (error) {
    console.error('Error resetting transcription count:', error);
  }
};

export const canTranscribe = async (isPremium: boolean): Promise<boolean> => {
  if (isPremium) return true;

  const count = await getTranscriptionCount();
  return count < MAX_FREE_TRANSCRIPTIONS;
};

export const getRemainingTranscriptions = async (isPremium: boolean): Promise<number | null> => {
  if (isPremium) return null; // Ilimitado

  const count = await getTranscriptionCount();
  return Math.max(0, MAX_FREE_TRANSCRIPTIONS - count);
};
```

Usar en tu código de transcripción:

```typescript
// Donde haces transcripciones (ej: note-detail.tsx o index.tsx)
import { checkPremiumStatus } from '../utils/purchases';
import { canTranscribe, incrementTranscriptionCount, getRemainingTranscriptions } from '../utils/transcriptionLimit';
import { router } from 'expo-router';

const handleTranscribe = async () => {
  const isPremium = await checkPremiumStatus();

  // Verificar si puede transcribir
  const canDo = await canTranscribe(isPremium);

  if (!canDo) {
    const remaining = await getRemainingTranscriptions(isPremium);

    Alert.alert(
      'Límite Alcanzado',
      `Has usado tus ${MAX_FREE_TRANSCRIPTIONS} transcripciones gratuitas.\n\n¡Actualiza a Premium para transcripciones ilimitadas!`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ver Premium',
          onPress: () => router.push('/premium'),
        },
      ]
    );
    return;
  }

  // Hacer transcripción
  const transcribedText = await transcribeAudio();

  // Incrementar contador si no es premium
  if (!isPremium) {
    const count = await incrementTranscriptionCount();
    const remaining = await getRemainingTranscriptions(isPremium);

    console.log(`📊 Transcriptions used: ${count}/${MAX_FREE_TRANSCRIPTIONS}`);

    // Mostrar alerta si quedan pocas
    if (remaining !== null && remaining <= 2) {
      Alert.alert(
        'Quedan Pocas Transcripciones',
        `Te quedan ${remaining} transcripciones gratuitas.\n\nActualiza a Premium para ilimitadas.`,
        [
          { text: 'OK' },
          { text: 'Ver Premium', onPress: () => router.push('/premium') },
        ]
      );
    }
  }

  // Continuar con el flujo normal...
};
```

### Paso 8: Agregar Botón de Premium en el Sidebar

Editar `components/ui/Sidebar.tsx`:

```typescript
// components/ui/Sidebar.tsx
import { router } from 'expo-router';
import { checkPremiumStatus } from '../../utils/purchases';

export default function Sidebar({ ... }) {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (visible) {
      checkPremiumStatus().then(setIsPremium);
    }
  }, [visible]);

  return (
    <Modal ...>
      <View ...>
        {/* Tus botones existentes */}

        {/* Botón Premium */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onClose();
            router.push('/premium');
          }}>
          <MaterialIcons
            name={isPremium ? 'star' : 'star-border'}
            size={24}
            color={isPremium ? colors.accent.orange : colors.textPrimary}
          />
          <Text style={[styles.menuText, { color: colors.textPrimary }]}>
            {isPremium ? 'Premium Activo' : 'Obtener Premium'}
          </Text>
        </TouchableOpacity>

        {/* Resto de tu código */}
      </View>
    </Modal>
  );
}
```

---

## 🆚 Comparación: react-native-iap vs RevenueCat

| Feature | react-native-iap | RevenueCat |
|---------|------------------|------------|
| **Costo inicial** | Gratis | Gratis hasta $2.5K/mes |
| **Costo después** | Gratis siempre | 1% de ingresos |
| **Backend** | Lo creas tú (o local) | Incluido y manejado |
| **Seguridad** | Media (validación local) | Alta (server-side) |
| **Dashboard** | No | Sí, completo con analytics |
| **Analytics** | No | Sí (MRR, churn, LTV, etc) |
| **Complejidad código** | Media-Alta | Baja |
| **Restauración cross-platform** | Manual | Automática |
| **Soporte** | Comunidad (GitHub) | Email oficial |
| **Testing** | Manual con Test IDs | Sandbox incluido |
| **A/B Testing** | No | Sí |
| **Integraciones** | No | Mixpanel, Amplitude, Firebase, etc |
| **Webhooks** | No | Sí |
| **Protección contra fraude** | Baja | Alta |
| **Tiempo de implementación** | 2-3 días | 1 día |

---

## 💡 Recomendación Final

### Usa **react-native-iap** si:
- ✅ Quieres **0% de comisión extra**
- ✅ Tu app es muy simple (sin analytics)
- ✅ Estás ok con seguridad media
- ✅ Quieres control total del código
- ✅ No planeas escalar mucho

### Usa **RevenueCat** si:
- ✅ Quieres **backend completo gratis** hasta $2.5K/mes
- ✅ Necesitas **seguridad robusta** (validation server-side)
- ✅ Quieres **dashboard y analytics** sin crear nada
- ✅ Planeas **escalar** a cientos/miles de usuarios
- ✅ No te importa pagar 1% después de crecer
- ✅ Valoras tu **tiempo de desarrollo**

---

## 📊 Ejemplos Reales de Costos

### Escenario 1: App Pequeña (100 usuarios premium)
**Ingresos**: 100 × $9.99/año = $999/año = $83/mes

**Con react-native-iap**:
- Google Play (15%): -$150/año
- Ganancia: $849/año ✅

**Con RevenueCat**:
- Google Play (15%): -$150/año
- RevenueCat: $0 (bajo tier gratis)
- Ganancia: $849/año ✅

**Resultado: Mismo costo**

---

### Escenario 2: App Mediana (300 usuarios premium)
**Ingresos**: 300 × $9.99/año = $2,997/año = $250/mes

**Con react-native-iap**:
- Google Play (15%): -$450/año
- Ganancia: $2,547/año ✅

**Con RevenueCat**:
- Google Play (15%): -$450/año
- RevenueCat: $0 (todavía bajo tier gratis)
- Ganancia: $2,547/año ✅

**Resultado: Mismo costo** + Dashboard gratis

---

### Escenario 3: App Grande (1,000 usuarios premium)
**Ingresos**: 1,000 × $9.99/año = $9,990/año = $833/mes

**Con react-native-iap**:
- Google Play (15%): -$1,498/año
- Ganancia: $8,492/año ✅

**Con RevenueCat**:
- Google Play (15%): -$1,498/año
- RevenueCat (1%): -$85/año
- Ganancia: $8,407/año ✅

**Diferencia: -$85/año** (menos de $8/mes) por:
- Dashboard completo
- Analytics avanzados
- Backend manejado
- Seguridad robusta
- Integraciones
- A/B testing

---

## 🚀 Conclusión para FastNote

**Mi recomendación: Empieza con RevenueCat**

**Razones:**
1. **Gratis mientras creces** (hasta $2.5K/mes = 250 usuarios)
2. **Backend incluido** sin trabajo de tu parte
3. **Más seguro** que AsyncStorage
4. **Dashboard para ver ingresos** en tiempo real
5. **Fácil de implementar** (menos código)
6. **Puedes migrar después** a react-native-iap si creces mucho

Cuando superes $2,500/mes, **decides** si el 1% vale la pena o migras. Pero para empezar, RevenueCat es la mejor opción.

---

## 📚 Recursos Adicionales

- **Documentación Oficial**: https://www.revenuecat.com/docs
- **React Native Guide**: https://www.revenuecat.com/docs/getting-started/installation/reactnative
- **Pricing Page**: https://www.revenuecat.com/pricing/
- **Blog**: https://www.revenuecat.com/blog/
- **Community**: https://community.revenuecat.com/
- **GitHub**: https://github.com/RevenueCat/react-native-purchases
- **Support**: support@revenuecat.com

---

**Última actualización**: Enero 2025
**Versiones**: react-native-purchases ^8.0.0, Expo SDK 54+
