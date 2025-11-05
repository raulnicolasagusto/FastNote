# 📱 Guía Completa: Migración de Expo Go a Development Build con EAS

## 🎯 ¿Cuándo usar esta guía?

Usa esta guía cuando necesites:
- Usar dependencias nativas que no funcionan en Expo Go
- Mayor control sobre configuraciones nativas
- Preparar tu app para producción
- Personalizar aspectos nativos de tu aplicación

## 🔍 Antes vs Después

### Expo Go (Antes)
- ✅ Desarrollo rápido con `npx expo start`
- ❌ Limitado a librerías del Expo SDK
- ❌ Sin acceso a código nativo personalizado

### Development Build (Después)
- ✅ Mismo flujo de desarrollo rápido
- ✅ Acceso a CUALQUIER librería nativa
- ✅ Control total sobre configuraciones nativas
- ✅ Tu propia versión personalizada de Expo Go

## 📋 Prerrequisitos

1. **Cuenta de Expo**: [Crear cuenta gratuita](https://expo.dev/signup)
2. **Proyecto Expo existente** funcionando con Expo Go
3. **Node.js y npm** instalados
4. **Dispositivo Android** para testing (o emulador)

## 🚀 Proceso Paso a Paso

### **Paso 1: Instalar expo-dev-client**

```bash
npx expo install expo-dev-client
```

**¿Qué hace?**: Añade el cliente de desarrollo que permitirá crear tu propia versión de Expo Go.

### **Paso 2: Instalar EAS CLI**

```bash
npm install -g eas-cli
```

**¿Qué hace?**: Instala la herramienta de línea de comandos para usar EAS (Expo Application Services).

### **Paso 3: Login en Expo**

```bash
eas login
```

**¿Qué hace?**: Te autentica con tu cuenta Expo para acceder a los servicios EAS.

### **Paso 4: Inicializar Proyecto EAS**

```bash
eas init --force
```

**¿Qué hace?**:
- Crea un proyecto EAS en la nube
- Genera un `projectId` único
- Modifica tu `app.json` con la configuración EAS

**Resultado esperado**:
```
✔ Created @tu-usuario/tu-proyecto: https://expo.dev/accounts/tu-usuario/projects/tu-proyecto
√ Project successfully linked (ID: xxxxx-xxxx-xxxx) (modified app.json)
```

### **Paso 5: Configurar Android Package (IMPORTANTE)**

Antes de continuar, agrega el package de Android a tu `app.json`:

```json
{
  "expo": {
    "android": {
      "package": "com.tuusuario.tuproyecto",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

**Importante**: Reemplaza `tuusuario.tuproyecto` con tu configuración real.

### **Paso 6: Configurar EAS Build**

```bash
eas build:configure
```

**Opción recomendada**: Selecciona "All" para configurar Android e iOS.

**¿Qué hace?**:
- Crea el archivo `eas.json` con perfiles de build
- Configura perfiles: `development`, `preview`, y `production`

### **Paso 7: Crear Development Build**

```bash
eas build --platform android --profile development
```

**¿Qué pasa?**:
- Se ejecuta en la nube (EAS servers)
- Tarda ~10-15 minutos
- Te dará un link para descargar el APK

**Resultado esperado**:
```
🎉 Build completed!

Install and run it on your Android device with the link below:
https://expo.dev/artifacts/eas/xxxxx.apk
```

### **Paso 8: Instalar APK en tu Dispositivo**

1. **Descargar**: Usa el link que te dio el comando anterior
2. **Instalar**: Transfiere el APK a tu teléfono e instálalo
3. **Alternativa**: Usar EAS Dashboard: https://expo.dev

### **Paso 9: Probar la App**

```bash
npx expo start
```

**¿Qué debe pasar?**:
- El servidor detecta automáticamente tu development build
- En lugar de mostrar código QR para Expo Go, muestra tu custom build
- La app funciona exactamente igual que antes

## 📁 Archivos Creados/Modificados

### `eas.json` (Nuevo)
```json
{
  "cli": {
    "version": ">= 16.19.3",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

### `app.json` (Modificado)
Se añade:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "tu-project-id-unico"
      }
    },
    "owner": "tu-usuario-expo"
  }
}
```

### `package.json` (Modificado)
Se añade:
```json
{
  "dependencies": {
    "expo-dev-client": "~6.0.12"
  }
}
```

## 🛠️ Comandos EAS Útiles

### Builds
```bash
# Development build (para desarrollo)
eas build --platform android --profile development

# Preview build (para testing interno)
eas build --platform android --profile preview

# Production build (para app stores)
eas build --platform android --profile production

# Build para iOS
eas build --platform ios --profile development
```

### Gestión
```bash
# Ver builds realizados
eas build:list

# Ver detalles de un build específico
eas build:view [BUILD_ID]

# Cancelar un build
eas build:cancel [BUILD_ID]
```

## 🔧 Desarrollo Post-Migración

### Flujo Diario (¡Igual que antes!)
1. `npx expo start`
2. Abrir app en tu teléfono (ahora tu development build)
3. Los cambios se actualizan automáticamente

### ¿Cuándo necesitas rebuild?
Solo cuando:
- Agregues nuevas dependencias nativas
- Cambies configuraciones nativas
- Updates del Expo SDK

## ⚠️ Troubleshooting Común

### Error: "Application id is required"
**Solución**: Agregar `package` en `app.json` -> `android` -> `package`

### Build falla por prompts interactivos
**Solución**: Configurar todo en `app.json` antes del build

### App no se conecta al desarrollo server
**Solución**: Verificar que el dispositivo y computadora están en la misma red

## 📚 Documentación Oficial

### Documentación Principal
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Development Builds**: https://docs.expo.dev/develop/development-builds/introduction/
- **Migración Guide**: https://docs.expo.dev/develop/development-builds/create-a-build/

### Configuración Avanzada
- **eas.json Reference**: https://docs.expo.dev/build/eas-json/
- **Build Configuration**: https://docs.expo.dev/build-reference/build-configuration/
- **Environment Variables**: https://docs.expo.dev/build-reference/variables/

### Tutoriales Paso a Paso
- **EAS Tutorial Series**: https://docs.expo.dev/tutorial/eas/introduction/
- **Configure Development Build**: https://docs.expo.dev/tutorial/eas/configure-development-build/
- **Android Development Build**: https://docs.expo.dev/tutorial/eas/android-development-build/

## 🎉 Beneficios Obtenidos

- ✅ **Flexibilidad Total**: Cualquier librería nativa disponible
- ✅ **Mismo Workflow**: Desarrollo igual de rápido que antes
- ✅ **Control Nativo**: Configuraciones personalizadas
- ✅ **Preparación Producción**: Base sólida para app stores
- ✅ **Team Sharing**: Compartir builds internamente fácil

## 💡 Tips Pro

1. **Naming Convention**: Usa nombres descriptivos para tu package
2. **Environment Variables**: Configúralas en EAS para diferentes builds
3. **Build Profiles**: Crea profiles específicos para diferentes necesidades
4. **Expo Orbit**: Instala para gestión fácil de builds localmente
5. **Monorepo**: EAS soporta monorepos si tienes múltiples apps

---

**✨ ¡Tu proyecto está listo para usar cualquier dependencia nativa y avanzar al siguiente nivel!**