# 🎯 Configuración de Interstitial Ads - FastNote

## ✅ Implementación Completada

Se ha implementado exitosamente el sistema de **Interstitial Ads** (pantalla completa) con las siguientes características:

### 🎨 Características Implementadas:

1. **Frecuencia Controlada**:
   - Se muestra **SOLO 1 vez por sesión de app**
   - Primera vez que sales de una nota → home
   - No se vuelve a mostrar hasta cerrar/abrir la app

2. **Sistema de Tracking Persistente**:
   - Store Zustand dedicado: `store/ads/useAdsStore.ts`
   - Persistencia en AsyncStorage
   - Reset automático al abrir la app

3. **Hook Reutilizable**:
   - `utils/useInterstitialAd.ts`
   - Precarga automática del ad
   - Recarga nuevo ad después de mostrarlo
   - Lógica de elegibilidad integrada

4. **Integración en Note Detail**:
   - Al presionar botón "Back" (volver)
   - Valida que no se haya mostrado esta sesión
   - Valida que el ad esté cargado

---

## 🔧 PASOS PARA ACTIVAR (PRODUCCIÓN)

### 1. Crear Ad Unit en Google AdMob

1. Ve a **[Google AdMob Console](https://apps.admob.google.com)**
2. Inicia sesión con tu cuenta
3. Selecciona tu app **"FastNote"** (o créala si no existe)
4. Ve a **"Ad units"** en el menú lateral
5. Click en **"Add ad unit"**
6. Selecciona **"Interstitial"**
7. Configura:
   - **Ad unit name**: `FastNote Interstitial - Note Exit`
   - **Advanced settings**: (dejar por defecto)
8. Click **"Create ad unit"**
9. **Copia el Ad Unit ID** (formato: `ca-app-pub-1467750216848197/XXXXXXXXXX`)

### 2. Actualizar el Código

Abre el archivo: **`utils/useInterstitialAd.ts`**

**Busca esta línea (línea 10):**
```typescript
const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-1467750216848197/XXXXXXXXXX'; // ⚠️ CAMBIAR POR TU AD UNIT ID
```

**Reemplaza `XXXXXXXXXX`** con tu Ad Unit ID real:
```typescript
const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-1467750216848197/1234567890'; // ✅ TU AD UNIT ID AQUÍ
```

### 3. Verificar Configuración en app.json

El archivo `app.json` ya está configurado correctamente con tu Android App ID:

```json
[
  "react-native-google-mobile-ads",
  {
    "androidAppId": "ca-app-pub-1467750216848197~2756187783",
    "iosAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx"
  }
]
```

✅ **No necesitas cambiar nada aquí** (ya está correcto para Android)

⚠️ **Para iOS**: Cuando estés listo, crea un App ID de iOS en AdMob y reemplaza los `xxxxxxxx`

---

## 🧪 TESTING

### En Desarrollo (`__DEV__ = true`):

- **Automáticamente usa Test Ads** de AdMob
- **NO necesitas Ad Unit ID real**
- Los ads de prueba se muestran correctamente
- **NO generan revenue real** (solo para testing)

### Flujo de Testing:

1. Abre la app
2. Crea una nota o entra a una existente
3. Presiona el botón "Back" (volver)
4. **Primera vez**: Debe mostrarse el Interstitial Ad de prueba
5. Espera ~5 segundos → botón X aparece → cierra el ad
6. Entra a otra nota → presiona "Back"
7. **Segunda vez**: NO debe mostrarse el ad (ya se mostró esta sesión)
8. **Cierra completamente la app** (swipe de apps recientes)
9. **Abre de nuevo la app**
10. Entra a una nota → presiona "Back"
11. **Debe mostrarse el ad nuevamente** (nueva sesión)

### Logs de Debug:

Verás estos logs en consola:

```
🔄 Interstitial Ad session reset - new app session started
🎯 Interstitial Ad loaded successfully
🎬 Showing Interstitial Ad
👀 Interstitial Ad opened
✅ Interstitial Ad closed by user
⏭️ Interstitial Ad already shown this session, skipping
```

---

## 📊 IMPACTO EN REVENUE

### Estimación de Revenue Adicional:

**Asumiendo:**
- CPM Interstitial: $2-4 USD
- 1 sesión/usuario/día
- 1 Interstitial mostrado/sesión

**Revenue Adicional por Usuario/Mes:**

| Usuarios Activos | Impresiones/Mes | Revenue Mensual (CPM $3) |
|------------------|-----------------|--------------------------|
| 100 | 3,000 | $9.00 |
| 1,000 | 30,000 | $90.00 |
| 10,000 | 300,000 | $900.00 |
| 50,000 | 1,500,000 | $4,500.00 |

**Comparación con Banners:**
- Banners (CPM $0.40): $12/mes con 1,000 usuarios
- Interstitials (CPM $3.00): $90/mes con 1,000 usuarios
- **Incremento: +650% en revenue de ads**

---

## 🎨 PERSONALIZACIÓN OPCIONAL

### Ajustar Frecuencia:

Si quieres mostrar el ad **cada 2 salidas de nota** en vez de 1:

1. Edita `store/ads/useAdsStore.ts`
2. Agrega un contador:
```typescript
noteExitCount: number;
incrementExitCount: () => void;
```
3. Modifica lógica en `useInterstitialAd.ts`

### Agregar Más Puntos de Activación:

Puedes mostrar el ad también al:
- Archivar una nota
- Compartir una nota
- Crear X notas

Solo llama `showInterstitialIfEligible()` en esos eventos.

---

## 📁 ARCHIVOS MODIFICADOS/CREADOS

### Nuevos Archivos:
- ✅ `store/ads/useAdsStore.ts` - Store de tracking
- ✅ `utils/useInterstitialAd.ts` - Hook para manejo de ads
- ✅ `INTERSTITIAL_ADS_SETUP.md` - Esta guía

### Archivos Modificados:
- ✅ `app/note-detail.tsx` - Integración del ad en handleBack
- ✅ `app/index.tsx` - Reset de sesión al abrir app

---

## ⚠️ TROUBLESHOOTING

### El ad no se muestra:

1. **Verifica logs en consola**:
   - ¿Dice "Interstitial Ad loaded successfully"?
   - ¿Dice "already shown this session"?

2. **Verifica que estás en DEV mode**:
   - Los Test Ads deberían funcionar siempre
   - Si no, verifica permisos de internet

3. **Verifica que no estés en modo edición**:
   - Si estás editando la nota, handleBack llama handleCancelEdit
   - El ad solo se muestra si NO estás editando

4. **Verifica estado del store**:
   ```javascript
   console.log('Store state:', useAdsStore.getState());
   ```

### El ad se muestra múltiples veces:

1. **Verifica que resetInterstitialSession() se llama EN index.tsx**
2. **No llames showInterstitialIfEligible() en otros lugares**

---

## 🚀 DEPLOYMENT

### Build para Producción:

1. **Asegúrate de haber configurado el Ad Unit ID** (paso 2 arriba)
2. **Build con EAS**:
   ```bash
   eas build --platform android --profile production
   ```
3. Los ads **reales** se mostrarán en la versión de producción
4. **No verás revenue inmediatamente** - AdMob tarda 24-48h en reportar

### Monitoreo en AdMob:

1. Ve a **[AdMob Console](https://apps.admob.google.com)**
2. Selecciona **"Reports"**
3. Filtra por **"FastNote"**
4. Verás:
   - **Impressions** (impresiones del ad)
   - **eCPM** (revenue por 1000 impresiones)
   - **Revenue** (ganancia total)

---

## ✅ CHECKLIST FINAL

Antes de hacer build de producción:

- [ ] Ad Unit ID creado en AdMob
- [ ] Ad Unit ID configurado en `utils/useInterstitialAd.ts`
- [ ] Testeado el flujo completo (mostrar 1 vez → no mostrar → cerrar app → mostrar de nuevo)
- [ ] Verificado que logs se ven correctos
- [ ] Build de producción creado con EAS
- [ ] Subido a Google Play Console
- [ ] Monitoreado revenue en AdMob después de 48h

---

**Fecha de Implementación**: Octubre 2025
**Versión**: 1.0.0
**Status**: ✅ Listo para Producción (solo falta Ad Unit ID)
