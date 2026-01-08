# 📝 FastNote

> **Aplicación móvil de notas inteligente con transcripción de voz, OCR, checklists y recordatorios por IA**

FastNote es una aplicación de notas multiplataforma desarrollada con React Native y Expo que combina funcionalidades clásicas de gestión de notas con características avanzadas de inteligencia artificial, incluyendo transcripción de voz, reconocimiento óptico de caracteres (OCR), análisis inteligente de recordatorios y widgets de pantalla de inicio.

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Características Principales

### 📱 Gestión de Notas
- **Editor de texto enriquecido** con formato HTML (encabezados H1/H2/H3, negrita, resaltado)
- **Tres tipos de notas**: Texto, Checklist, o Mixto (texto + checklist)
- **Colores personalizables**: 8 opciones de fondo (Amarillo, Crema, Durazno, Rosa, Lavanda, Menta, Cielo, Predeterminado)
- **Organización por carpetas** y categorías
- **Pin/Star** para notas importantes
- **Bloqueo de notas** para proteger contenido sensible
- **Timestamps automáticos** de creación y última modificación

### 🎤 Notas de Voz con IA
- **Transcripción automática** con Deepgram API (modelo Nova-2)
- **Detección automática de idioma** (Español, Inglés, Portugués)
- **Creación inteligente de checklists** desde comandos de voz:
  - 🇪🇸 "Lista de compras, leche, pan, huevos"
  - 🇬🇧 "New shopping list, milk, bread, eggs"
  - 🇧🇷 "Lista do supermercado, arroz, feijão, carne"
- **Protección de API keys** mediante Cloudflare Worker
- **Quick Action** para grabación rápida desde la pantalla de inicio

### 🔔 Recordatorios Inteligentes
- **Análisis por IA** de comandos de voz usando GPT-4o-mini
- **Detección de fechas relativas**: "hoy a las 3pm", "mañana a las 9", "en 2 horas"
- **Programación automática** de notificaciones locales
- **Limpieza de texto**: Elimina automáticamente comandos de recordatorio del contenido
- **Formato visual**: Indicador con tiempo relativo ("Hoy 15:30", "Mañana 9:00")

### ✅ Checklists Avanzados
- **Toggle visual** de completado con checkboxes
- **Auto-capitalización** de items
- **Modo mixto**: Combina texto libre con checklist en la misma nota
- **Parseo inteligente** con múltiples separadores (comas, puntos, conjunciones)
- **Ordenamiento automático** por estado (pendientes primero)

### 📷 OCR y Multimedia
- **Reconocimiento de texto** desde imágenes con OCR.space API
- **Captura desde cámara** o galería de fotos
- **Canvas de dibujo** integrado con el dedo
- **Grabación de audio** con reproductor incorporado
- **Sistema de bloques de contenido** para intercalar texto, imágenes y audio

### 🔍 Búsqueda Avanzada
- **Búsqueda en tiempo real** por título, contenido y items de checklist
- **Detección inteligente de fechas** en múltiples formatos (DD/MM, MM/DD, YYYY/MM/DD)
- **Ordenamiento por relevancia**: Coincidencias en título > Fecha > Última modificación

### 🌐 Internacionalización
- **Soporte multiidioma**: Inglés 🇺🇸 y Español 🇪🇸
- **Detección automática** del idioma del dispositivo
- **+150 strings traducidos** en cada idioma
- **Fallback a inglés** si el idioma no está soportado

### 📲 Widgets de Android
- **Tres tamaños disponibles**: Pequeño (2x2), Mediano (4x2), Grande (4x4)
- **Vista previa de notas** en la pantalla de inicio
- **Deep linking**: Click en widget abre la nota directamente
- **Actualización automática** al editar notas
- **Soporte de colores** y checklists

### 🎨 Temas y Personalización
- **Modo claro/oscuro** con transición suave
- **Persistencia de preferencias** usando Zustand + AsyncStorage
- **StatusBar adaptativo** según tema activo
- **Vibración táctil** (haptic feedback) en interacciones

### 📤 Compartir y Exportar
- **Compartir como texto** (formato estructurado)
- **Compartir como imagen** (captura visual de la nota)
- **Markdown export** (próximamente)
- **Exportar a contactos** (próximamente)

### 💰 Monetización con AdMob
- **Banner Ads** en pantalla principal y detalles de nota
- **Interstitial Ads** de pantalla completa (1 por sesión)
- **Configuración optimizada** para maximizar revenue sin afectar UX

## 🛠️ Stack Tecnológico

### Core Framework
- **React**: 19.1.0
- **React Native**: 0.81.4
- **Expo SDK**: 54.0.0
- **TypeScript**: 5.9.2

### Gestión de Estado y Navegación
- **Zustand**: 4.5.1 (State management con persistencia)
- **Expo Router**: 6.0.7 (Navegación basada en archivos)
- **React Navigation**: 7.0.3

### UI y Estilos
- **NativeWind**: Última versión (Tailwind CSS para React Native)
- **React Native Safe Area Context**: 5.6.0
- **React Native Gesture Handler**: 2.28.0
- **React Native Reanimated**: 4.1.0
- **React Native SVG**: 15.12.1

### Funcionalidades Clave
- **expo-camera**: 17.0.8 (Captura y OCR)
- **expo-av**: 16.0.7 (Grabación de audio)
- **expo-notifications**: 0.32.11 (Recordatorios locales)
- **expo-quick-actions**: 6.0.0 (App shortcuts)
- **expo-haptics**: 15.0.7 (Vibración táctil)
- **react-native-pell-rich-editor**: 1.10.0 (Editor de texto enriquecido)
- **react-native-webview**: 13.15.0 (Renderizado de rich text)
- **react-native-android-widget**: Widgets de pantalla de inicio

### Almacenamiento y Media
- **@react-native-async-storage/async-storage**: 2.2.0
- **expo-file-system**: 19.0.15
- **expo-image-picker**: 17.0.8
- **expo-media-library**: 18.2.0
- **react-native-view-shot**: 4.0.3 (Captura de pantalla)

### APIs Externas
- **Deepgram API**: Transcripción de audio con modelo Nova-2
- **OpenAI GPT-4o-mini**: Análisis inteligente de comandos de recordatorio
- **OCR.space API**: Reconocimiento óptico de caracteres

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Expo CLI
- Android Studio (para desarrollo en Android)
- Xcode (para desarrollo en iOS, solo en macOS)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/fastnote.git
cd fastnote
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto:

```bash
# OpenAI API (REQUERIDO para recordatorios inteligentes)
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-tu-clave-aqui

# Deepgram API (OPCIONAL - solo si no usas Cloudflare Worker)
# EXPO_PUBLIC_DEEPGRAM_API_KEY=tu-clave-deepgram

# OCR.space (OPCIONAL - usa clave gratuita "helloworld" por defecto)
# EXPO_PUBLIC_OCR_API_KEY=tu-clave-personalizada
```

**Notas sobre variables de entorno**:
- ✅ **Transcripción de audio**: Funciona sin variables (usa Cloudflare Worker)
- ✅ **Recordatorios inteligentes**: Requiere `EXPO_PUBLIC_OPENAI_API_KEY`
- ⚠️ **Deepgram directo**: Solo si prefieres no usar Cloudflare Worker
- ⚠️ **OCR**: Funciona con API key gratuita "helloworld" por defecto

4. **Generar carpetas nativas** (solo si necesitas development build)
```bash
npm run prebuild
```

## 🚀 Ejecución en Desarrollo

### Expo Go (recomendado para inicio rápido)
```bash
npm start
```
Escanea el código QR con la app Expo Go en tu dispositivo móvil.

### Development Build (para funcionalidades nativas completas)
```bash
# Android
npm run android

# iOS
npm run ios
```

### Linting y Formateo
```bash
# Verificar código
npm run lint

# Formatear código
npm run format
```

## 📱 Build de Producción con EAS

### Para Testers Internos (Internal Testing)
```bash
# Paso 1: Crear build de producción
eas build --platform android --profile production

# Paso 2: Subir a Play Store Internal Testing
eas submit --platform android --latest
# Seleccionar track: internal
```

### Para Producción (Production Track)
```bash
# Paso 1: Crear build de producción
eas build --platform android --profile production

# Paso 2: Subir a Play Store Production
eas submit --platform android --latest
# Seleccionar track: production
```

**Notas importantes**:
- ✅ El `versionCode` se incrementa automáticamente
- ✅ Siempre usar profile `production` (incluso para testers)
- ✅ El track se selecciona durante `eas submit`, no durante el build

## 📂 Estructura del Proyecto

```
app/                      # Pantallas (Expo Router)
├── index.tsx            # Pantalla principal (lista de notas)
├── note-detail.tsx      # Editor/visualizador de nota
├── search.tsx           # Búsqueda avanzada
├── folders.tsx          # Gestión de carpetas
└── _layout.tsx          # Layout principal

components/              # Componentes reutilizables
├── layout/             # Componentes de estructura
├── notes/              # Componentes de notas
└── ui/                 # Componentes de UI

store/                   # Estado global (Zustand)
├── notes/              # Store de notas
├── folders/            # Store de carpetas
├── theme/              # Store de tema
└── ads/                # Store de publicidad

utils/                   # Utilidades y servicios
├── audioTranscriptionService.ts
├── voiceReminderAnalyzer.ts
├── notifications.ts
├── i18n.ts
└── storage.ts

widgets/                 # Widgets de Android
├── NoteWidget.tsx
├── widgetTaskHandler.tsx
└── widgetConfig.ts

types/                   # Definiciones TypeScript
constants/               # Constantes (tema, límites, etc.)
i18n/                   # Archivos de traducción
```

## 🔄 Flujo de Datos Principal

### Crear Nota de Voz con Recordatorio

```
1. Usuario presiona ícono micrófono
   ↓
2. Grabación de audio con expo-av
   ↓
3. Transcripción con Deepgram API (vía Cloudflare Worker)
   ↓
4. Análisis de comandos con GPT-4o-mini
   ↓
5. Detección de recordatorio ("recordar a las 3pm")
   ↓
6. Creación automática de nota
   ↓
7. Programación de notificación local
   ↓
8. Confirmación al usuario
```

### Edición de Texto Enriquecido

```
1. Usuario toca contenido de nota
   ↓
2. Muestra RichEditor (WebView)
   ↓
3. KeyboardToolbar con botones de formato
   ↓
4. Usuario aplica formato (H1/Bold/Highlight)
   ↓
5. HTML actualizado en tiempo real
   ↓
6. Guardado automático en AsyncStorage
   ↓
7. Renderizado con parser HTML custom
```

## 🌟 Casos de Uso

### 1. Lista de Compras por Voz
```
Usuario: "Lista de compras, leche, pan, huevos, manteca"
→ FastNote crea automáticamente un checklist con 4 items
```

### 2. Recordatorio Inteligente
```
Usuario: "Llamar al doctor mañana a las 10 de la mañana"
→ FastNote crea nota + programa recordatorio para mañana 10:00
```

### 3. Captura de Texto desde Imagen
```
Usuario: Toma foto de documento
→ OCR extrae el texto
→ Se inserta automáticamente en la nota actual
```

### 4. Widget de Nota Importante
```
Usuario: Coloca widget en pantalla de inicio
→ Selecciona tamaño (pequeño/mediano/grande)
→ Acceso rápido a nota desde home screen
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Si deseas contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Guías de Contribución

- **Código**: Seguir las convenciones de TypeScript y ESLint configuradas
- **Internacionalización**: Nunca hardcodear strings visibles, usar `t('key')`
- **Estilos**: Usar el sistema de temas y constantes en `constants/theme.ts`
- **Documentación**: Actualizar README.md y CLAUDE.md para cambios significativos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**Raúl Nicolás Agusto**
- Package: com.raulnicolasagusto.fastnote
- EAS Project ID: 752b2e0a-6270-4cbe-bea5-fb35b8de1d1f

## 🙏 Agradecimientos

- [Expo](https://expo.dev/) - Por el increíble framework
- [Deepgram](https://deepgram.com/) - Por la API de transcripción
- [OpenAI](https://openai.com/) - Por GPT-4o-mini
- [OCR.space](https://ocr.space/) - Por la API de OCR gratuita
- Comunidad de React Native por todas las librerías open source

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:
- 🐛 Abre un [Issue](https://github.com/tu-usuario/fastnote/issues)
- 📧 Contacta al desarrollador

---

⭐ Si este proyecto te resulta útil, ¡considera darle una estrella en GitHub!

**Última actualización**: Enero 2026
