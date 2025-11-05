# FastNote - Claude Development Notes

## Información del Proyecto

**Nombre**: FastNote
**Versión**: 1.0.0
**Plataforma**: React Native con Expo (v54)
**Package**: com.raulnicolasagusto.fastnote
**Owner**: raulnicolasagusto
**EAS Project ID**: 752b2e0a-6270-4cbe-bea5-fb35b8de1d1f

## Comandos Útiles

### Desarrollo
- `npm start` - Iniciar el servidor de desarrollo Expo
- `npm run android` - Ejecutar en Android
- `npm run ios` - Ejecutar en iOS
- `npm run web` - Ejecutar en Web
- `npm run lint` - Ejecutar ESLint para verificar el código
- `npm run format` - Formatear código con ESLint y Prettier
- `npm run prebuild` - Generar carpetas nativas (android/ios)

### EAS Build y Deploy a Play Store (PROCESO OFICIAL)

**IMPORTANTE: Este es el proceso correcto que SIEMPRE se debe seguir**

#### Para Testers Internos (Internal Testing Track):
```bash
# Paso 1: Crear build de producción
eas build --platform android --profile production

# Paso 2: Esperar a que termine el build (10-15 minutos)

# Paso 3: Subir a Play Store Internal Testing
eas submit --platform android --latest
# Cuando pregunte el track, seleccionar: internal
```

#### Para Producción (Production Track):
```bash
# Paso 1: Crear build de producción
eas build --platform android --profile production

# Paso 2: Subir a Play Store Production
eas submit --platform android --latest
# Cuando pregunte el track, seleccionar: production
```

#### Notas Importantes:
- ✅ **SIEMPRE usar profile `production`** - incluso para testers internos
- ✅ El `versionCode` se incrementa **automáticamente** gracias a `autoIncrement: true` en eas.json
- ✅ **NO modificar manualmente** el versionCode en app.json
- ✅ El track se selecciona durante `eas submit`, NO durante el build
- ✅ Los testers recibirán la actualización en 1-2 horas después del rollout
- ❌ **NO usar profile `preview`** - solo si se necesita testing rápido sin Play Store
- ❌ **NO usar profile `development`** - solo para development builds con expo-dev-client

## Stack Tecnológico

### Core
- **React**: 19.1.0
- **React Native**: 0.81.4
- **Expo SDK**: 54.0.0
- **TypeScript**: 5.9.2

### State Management & Navigation
- **Zustand**: 4.5.1 (State management con persistencia)
- **Expo Router**: 6.0.7 (File-based navigation)
- **React Navigation**: 7.0.3

### UI & Styling
- **NativeWind**: Latest (Tailwind CSS para React Native)
- **React Native Safe Area Context**: 5.6.0
- **React Native Gesture Handler**: 2.28.0
- **React Native Reanimated**: 4.1.0
- **React Native SVG**: 15.12.1

### Funcionalidades Principales
- **expo-camera**: 17.0.8 (Captura y OCR)
- **expo-av**: 16.0.7 (Audio recording)
- **expo-notifications**: 0.32.11 (Recordatorios)
- **expo-quick-actions**: 6.0.0 (App shortcuts)
- **expo-haptics**: 15.0.7 (Vibración táctil)
- **react-native-pell-rich-editor**: 1.10.0 (Editor de texto enriquecido)
- **react-native-webview**: 13.15.0 (Rich text rendering)

### Storage & Media
- **@react-native-async-storage/async-storage**: 2.2.0
- **expo-file-system**: 19.0.15
- **expo-image-picker**: 17.0.8
- **expo-media-library**: 18.2.0
- **react-native-view-shot**: 4.0.3 (Captura de pantalla)

## Características Implementadas

### 1. Sistema de Notas
- **Tipos de nota**: Text, Checklist, Mixed (text + checklist)
- **Editor de texto enriquecido** usando react-native-pell-rich-editor
  - Encabezados H1, H2, H3
  - Texto en negrita
  - Resaltado de texto (highlight amarillo)
- **Título y contenido editable** con tap para editar
- **Contador de caracteres** en tiempo real (sin espacios)
- **Colores de fondo personalizables** (8 opciones: Yellow, Cream, Peach, Pink, Lavender, Mint, Sky, Default)
- **Pin/Star** para notas importantes
- **Lock** para proteger notas
- **Timestamps**: createdAt y updatedAt
- **Keyboard Toolbar** con botones de formato accesibles durante edición

### 2. Sistema de Carpetas (Folders)
- Organización de notas en carpetas personalizadas
- Vista "All Notes" para notas sin carpeta
- Mover notas entre carpetas con modal
- Navegación desde [folders.tsx](app/folders.tsx)
- Store dedicado: [useFoldersStore.ts](store/folders/useFoldersStore.ts)

### 3. Checklist Avanzado
- Creación y edición de items
- Toggle de completado con checkbox visual
- Auto-capitalización de items
- Detección automática desde voz:

  **🇪🇸 Comandos en Español:**
  - `"Nueva lista"` → Crea checklist genérico
  - `"Lista nueva"` → Crea checklist genérico
  - `"Lista de [nombre]"` → Ejemplo: "Lista de supermercado, leche, pan, huevos" → Título: "Supermercado DD/MM/YY HH:MM"
  - `"Lista del [nombre]"` → Ejemplo: "Lista del gimnasio, pesas, cardio, yoga"
  - `"Lista para [nombre]"` → Ejemplo: "Lista para el viaje, pasaporte, ropa, cámara"
  - `"Lista de compras"` → Checklist específico
  - `"Lista de supermercado"` → Checklist específico
  - `"Lista de tareas"` → Checklist específico
  - `"Checklist"` → Crea checklist genérico
  - `"Check list"` → Crea checklist genérico

  **🇬🇧 Comandos en Inglés:**
  - `"New checklist for [name]"` → Ejemplo: "New checklist for groceries, milk, bread, eggs" → Título: "Groceries MM/DD/YY HH:MM"
  - `"New [name] list"` → Ejemplo: "New shopping list, apples, oranges, bananas" → Título: "Shopping MM/DD/YY HH:MM"
  - `"New list"` → Crea checklist genérico
  - `"Shopping list"` → Checklist específico
  - `"Grocery list"` → Checklist específico
  - `"To do list"` → Checklist específico
  - `"Task list"` → Checklist específico
  - `"New shopping list"` → Checklist específico
  - `"New grocery list"` → Checklist específico
  - `"New todo list"` → Checklist específico
  - `"New task list"` → Checklist específico

  **🇧🇷 Comandos en Portugués:**
  - `"Nova lista"` → Crea checklist genérico
  - `"Lista nova"` → Crea checklist genérico
  - `"Lista do [nome]"` → Ejemplo: "Lista do mercado, arroz, feijão, carne"
  - `"Lista da [nome]"` → Ejemplo: "Lista da farmácia, remédio, curativo"
  - `"Lista para [nome]"` → Ejemplo: "Lista para estudar, matemática, português"
  - `"Nova lista de [nome]"` → Ejemplo: "Nova lista de compras, leite, pão"
  - `"Lista de compras"` → Checklist específico
  - `"Lista de supermercado"` → Checklist específico
  - `"Lista do supermercado"` → Checklist específico
  - `"Lista de tarefas"` → Checklist específico

  **Separadores Inteligentes:**
  - Comas (`,`), puntos (`.`), punto y coma (`;`)
  - Conjunciones: `"y"`, `"and"`, `"e"` (portugués)

  **Ejemplos de uso completo:**
  - 🇪🇸 "Lista de compras, leche, pan, huevos y manteca" → Items: leche, pan, huevos, manteca
  - 🇬🇧 "New checklist for work, send email, call client and finish report" → Título: "Work", Items: send email, call client, finish report
  - 🇧🇷 "Lista do supermercado, arroz, feijão, carne e legumes" → Título: "Supermercado", Items: arroz, feijão, carne, legumes

  - "Agregar a la lista" para añadir items a checklist existente
  - Parseo inteligente con separadores múltiples
- Modo mixto: texto + checklist en la misma nota
- Ordenamiento por estado y fecha

### 4. Recordatorios Inteligentes con IA
- **Análisis de voz por IA** ([voiceReminderAnalyzer.ts](utils/voiceReminderAnalyzer.ts))
- Detección de comandos como:
  - "Recordar a las 15:30 de hoy"
  - "Avisar mañana a las 9:00"
  - "Agregar recordatorio para las 16:00"
- **Limpieza automática** del texto (remueve comandos de recordatorio)
- **Programación de notificaciones** con expo-notifications
- Indicador visual de recordatorios en las notas (ícono + tiempo)
- Formato relativo: "Hoy 15:30", "Mañana 9:00", "En 3 días 10:00"
- Funciona tanto en nota existente como al crear nota por voz

### 5. Notas de Voz (Deepgram API)
- **Grabación de audio** con expo-av (HIGH_QUALITY)
- **Transcripción automática** con Deepgram API (modelo nova-2)
  - Protección de API keys mediante Cloudflare Worker
  - Detección automática de idioma
  - Puntuación y formato inteligente (smart_format)
- **Detección inteligente**:
  - Listas vs texto normal
  - Comandos de recordatorio (con GPT-4o-mini)
  - Comandos de "agregar a lista existente"
- Creación automática de notas con timestamp: "Nota Rápida DD/MM/YY HH:MM"
- Quick Action para iniciar grabación desde home screen
- Modal de grabación con indicador visual y botones Cancel/Stop
- Servicio: [audioTranscriptionService.ts](utils/audioTranscriptionService.ts)

### 6. OCR (Reconocimiento de Texto)
- **OCR.space API** (gratis 25,000 requests/mes)
- Captura desde cámara o galería
- Procesamiento en base64 con expo-file-system
- Idioma: Español (configurable a 'spa')
- Inserción automática en nota actual
- API Key gratuita: "helloworld"

### 7. Sistema de Dibujo y Multimedia
- **Drawing Canvas** ([DrawingCanvas.tsx](components/ui/DrawingCanvas.tsx))
  - Dibujo libre con el dedo
  - Guardado como imagen base64
  - Integrado en KeyboardToolbar
- **Audio Recording** en notas ([AudioRecorder.tsx](components/ui/AudioRecorder.tsx))
  - Grabación y almacenamiento como URI
  - Reproductor integrado ([AudioPlayer.tsx](components/ui/AudioPlayer.tsx))
  - Detección automática de archivos de audio (.mp3, .wav, .m4a, .aac, .ogg)
- **Image Picker** desde galería o cámara ([ImagePickerModal.tsx](components/ui/ImagePickerModal.tsx))
- **Content Blocks**: Sistema nuevo de bloques intercalados texto/imagen/audio
  - LEGACY: `images[]` array
  - NEW: `contentBlocks[]` con type 'text' | 'image'

### 8. Sistema de Temas
- **Tema claro y oscuro** dinámico
- Persistencia de preferencia con Zustand + AsyncStorage
- StatusBar adaptativo según tema (style="light"/"dark")
- Store: [useThemeStore.ts](store/theme/useThemeStore.ts)
- Constantes: [theme.ts](constants/theme.ts)
  - `LIGHT_COLORS`: Fondo #E5E9ED (gris-azul suave), Cards #FFFFFF
  - `DARK_COLORS`: Fondo #1A1A1A, Cards #2D2D2D
  - Colores de acento: orange #FF6B35, blue #4A90E2, green #27AE60, purple #9B59B6, red #E74C3C
- Toggle en Sidebar

### 9. Búsqueda Avanzada
- **Búsqueda en tiempo real** por:
  - Título
  - Contenido (incluyendo HTML)
  - Items de checklist
  - Fechas (múltiples formatos: DD/MM, MM/DD, YYYY/MM/DD, DD/MM/YYYY, DD/MM/YY)
- **Ordenamiento por relevancia**: Título > Fecha > UpdatedAt
- Screen: [search.tsx](app/search.tsx)
- Selector en store: `useSearchNotes(query)` en [useNotesStore.ts](store/notes/useNotesStore.ts)

### 10. Compartir y Exportar
- **Compartir como texto** (título + contenido + checklist formateado)
- **Compartir como imagen** (captura con react-native-view-shot)
- Menú de compartir: [ShareMenu.tsx](components/ui/ShareMenu.tsx)
- Utilities:
  - [shareTextUtils.ts](utils/shareTextUtils.ts)
  - [shareImageUtils.ts](utils/shareImageUtils.ts)
- Componente especial para renderizar imagen compartible: [ShareableNoteImage.tsx](components/ShareableNoteImage.tsx)

### 11. Efectos Visuales e Interacción
- **Vibración táctil** (haptic feedback) con expo-haptics al mantener presionada una nota
- **Efecto visual "sink"** cuando nota está seleccionada
- **Bottom Menu** contextual ([BottomMenu.tsx](components/ui/BottomMenu.tsx)) para acciones múltiples:
  - Mover a carpeta
  - Recordatorio
  - Compartir
  - Archivar
  - Eliminar
- **Callouts educativos** rotativos ([Callout.tsx](components/ui/Callout.tsx))
  - Sistema de tips que rota cada vez que abres una nota
  - Hook: [useCalloutRotation.ts](utils/useCalloutRotation.ts)

### 12. Quick Actions (App Shortcuts)
- Acceso rápido a "Nueva nota de voz" desde home screen (3D Touch / Long press)
- Configurado en [app.json](app.json) líneas 31-44
- Iconos personalizados para Android e iOS
- Shortcut ID: `voice_note`
- **Detección Dual (Cold + Warm Start)**:
  - **Cold Start**: `QuickActions.initial` en [index.tsx](app/index.tsx) líneas 58-72
    - Se lee una sola vez al iniciar la app desde cero
    - Delay de 500ms para esperar inicialización completa de stores
    - Se consume automáticamente después de la primera lectura
  - **Warm Start**: `useLocalSearchParams()` en [index.tsx](app/index.tsx) líneas 686-701
    - Detecta parámetro `voiceNote=true` cuando app está en background
    - Delay de 100ms (más rápido, app ya inicializada)
  - **Prevención de duplicados**: `useRef` para evitar procesar la misma acción dos veces
- **Listener en _layout.tsx**: Maneja navegación con parámetros (líneas 54-59)

### 13. Sistema de Publicidad (AdMob)
- **Banner Ads** (implementados previamente):
  - Home screen y note-detail screen
  - CPM estimado: ~$0.40
  - Componente: `<BannerAd>` de react-native-google-mobile-ads
- **Interstitial Ads** (implementado - Octubre 2025) ✅:
  - Pantalla completa con cierre después de ~5 segundos
  - **Frecuencia**: 1 vez por sesión de app
  - **Trigger**: Al volver de nota → home (primera vez)
  - **CPM estimado**: $2-4 USD (5-10x más que banners)
  - **Store**: [useAdsStore.ts](store/ads/useAdsStore.ts) - Tracking de sesión
  - **Servicio**: [interstitialAdService.ts](utils/interstitialAdService.ts) - Singleton service
  - **Configuración**: Ver [INTERSTITIAL_ADS_SETUP.md](INTERSTITIAL_ADS_SETUP.md)
  - **Reset de sesión**: Automático al abrir app en [index.tsx](app/index.tsx)
  - **Integración**: [note-detail.tsx](app/note-detail.tsx) función `handleBack()`
- **Impacto en Revenue**:
  - Con 1,000 usuarios activos/día: +$90/mes adicionales
  - Incremento estimado: +650% vs solo banners


### 15. Internacionalización (i18n) - Octubre 2025 ✅
- **Librerías**: `i18n-js` + `expo-localization`
- **Idiomas Soportados**:
  - 🇺🇸 **Inglés (English)** - Idioma por defecto
  - 🇪🇸 **Español (Spanish)**
- **Características**:
  - Detección automática del idioma del dispositivo
  - Fallback a inglés si idioma no soportado
  - +150 strings traducidos en cada idioma
  - Soporte para interpolación de variables (`{{count}}`)
- **Archivos de Traducción**:
  - [i18n/en.json](i18n/en.json) - Traducciones en inglés
  - [i18n/es.json](i18n/es.json) - Traducciones en español
  - [i18n/app-metadata/](i18n/app-metadata/) - Metadatos de app (nombre localizado)
- **Servicio**: [utils/i18n.ts](utils/i18n.ts)
  - `t(key, params?)` - Función de traducción
  - `changeLanguage(locale)` - Cambiar idioma manualmente
  - `getCurrentLanguage()` - Obtener idioma actual
  - `getAvailableLanguages()` - Listar idiomas disponibles
- **Configuración**: [app.json](app.json) líneas 58-61 (locales config)
- **Documentación**: Ver [I18N_IMPLEMENTATION_GUIDE.md](I18N_IMPLEMENTATION_GUIDE.md)
- **Status**: 🟡 Infraestructura completa, integración en progreso
- **Componentes Ya Traducidos**:
  - [app/index.tsx](app/index.tsx) - Modal de grabación, títulos de notas
  - [components/layout/MainScreen.tsx](components/layout/MainScreen.tsx) - Header title
- **Pendientes de Traducir**: Ver guía de implementación (12 componentes)

### 16. Widgets de Android (Home Screen Widgets) - Noviembre 2025 ✅
- **Funcionalidad**: "Colocar en pantalla de inicio"
- **Tamaños disponibles**: 
  - Pequeño (2x2): Solo título
  - Mediano (4x2): Título + preview
  - Grande (4x4): Contenido completo
- **Librería**: `react-native-android-widget`
- **Características**:
  - Modal de selección de tamaño con iconos
  - Modal de instrucciones paso a paso
  - Preparación automática del widget
  - Deep linking: click en widget abre la nota
  - Actualización automática al editar nota
  - Soporte para colores de fondo personalizados
  - Soporte para checklists
  - Traducciones completas (EN/ES)
- **Flujo UX**:
  1. Usuario presiona "⋮" → "Colocar en pantalla de inicio"
  2. Selecciona tamaño (Pequeño/Mediano/Grande)
  3. Sistema prepara widget (guarda config en AsyncStorage)
  4. Modal muestra instrucciones visuales
  5. Usuario arrastra widget manualmente desde menú de widgets
  6. Widget muestra la nota correctamente
- **Archivos principales**:
  - `widgets/NoteWidget.tsx` - Componente visual del widget
  - `widgets/widgetTaskHandler.tsx` - Lógica de eventos
  - `widgets/widgetConfig.ts` - Configuración
  - `utils/homeWidgetService.ts` - Servicio de gestión
  - `components/WidgetInstructionsModal.tsx` - Modal instructivo
- **Configuración**: `app.json` (plugin `react-native-android-widget`)
- **Limitaciones**:
  - Solo Android 8.0+
  - Usuario debe arrastrar widget manualmente (restricción de seguridad de Android)
  - Actualización solo cuando app está abierta o cada 30 min
- **Documentación**: `WIDGET_IMPLEMENTATION_PLAN.md`

## Arquitectura del Código

### Estructura de Carpetas
```
app/
├── index.tsx              # Home screen (lista de notas + FAB)
├── note-detail.tsx        # Editor/visualizador de nota (2400+ líneas)
├── new-note.tsx           # DEPRECADO (se crea directo en index)
├── search.tsx             # Búsqueda avanzada
├── folders.tsx            # Gestión de carpetas
└── _layout.tsx            # Layout principal con Expo Router Stack

components/
├── layout/
│   ├── Header.tsx         # Header reutilizable con acciones
│   ├── MainScreen.tsx     # Pantalla principal con NotesGrid
│   └── TabBar.tsx         # Barra de tabs/categorías
├── notes/
│   ├── NoteCard.tsx       # Card de nota individual (título, preview, fecha)
│   └── NotesGrid.tsx      # Grid 2 columnas con filtrado
└── ui/
    ├── AudioPlayer.tsx        # Reproductor con play/pause/progress
    ├── AudioRecorder.tsx      # Modal grabación con timer
    ├── BottomMenu.tsx         # Menú contextual acciones múltiples
    ├── Callout.tsx            # Tips educativos animados
    ├── DrawingCanvas.tsx      # Canvas dibujo con gestos
    ├── FloatingActionButton.tsx # FAB principal (+)
    ├── ImagePickerModal.tsx   # Modal cámara/galería
    ├── KeyboardToolbar.tsx    # Toolbar edición (Format/Audio/Draw/Image)
    ├── MoveFolderModal.tsx    # Modal mover a carpeta
    ├── ReminderPicker.tsx     # DateTimePicker para recordatorios
    ├── ShareMenu.tsx          # Menú compartir (Text/Image/Markdown)
    └── Sidebar.tsx            # Menú lateral (Theme/About)

store/
├── notes/
│   └── useNotesStore.ts   # Estado principal de notas (CRUD + filtros)
├── folders/
│   └── useFoldersStore.ts # Estado de carpetas
├── theme/
│   └── useThemeStore.ts   # Estado de tema (light/dark)
└── ads/
    └── useAdsStore.ts     # Estado de tracking de Interstitial Ads

utils/
├── notifications.ts              # Servicio notificaciones (wrapper)
├── notifications.production.ts   # Implementación para production build
├── notifications.expo-go.ts      # Mock para Expo Go
├── audioTranscriptionService.ts  # Transcripción con Deepgram API (via Cloudflare Worker)
├── voiceReminderAnalyzer.ts      # IA análisis comandos voz (GPT-4o-mini)
├── storage.ts                    # AsyncStorage utilities + generateId()
├── shareTextUtils.ts             # Compartir texto con expo-sharing
├── shareImageUtils.ts            # Captura + compartir imagen
├── useCalloutRotation.ts         # Hook callouts rotativos
├── useNotificationHandlers.ts    # Hook manejo notificaciones
├── interstitialAdService.ts      # Servicio Singleton Interstitial Ads
├── homeWidgetService.ts          # Servicio de gestión de widgets
└── i18n.ts                       # Servicio de internacionalización (i18n-js + expo-localization)

widgets/
├── NoteWidget.tsx                # Componente React del widget (3 tamaños)
├── widgetTaskHandler.tsx         # Lógica de eventos y actualización de widgets
├── widgetConfig.ts               # Configuración de tamaños, colores y helpers
└── index.ts                      # Barrel exports

types/
└── index.ts               # Definiciones TypeScript centralizadas

constants/
└── theme.ts               # LIGHT_COLORS, DARK_COLORS, SPACING, TYPOGRAPHY, SHADOWS, DEFAULT_CATEGORIES, NOTE_BACKGROUND_COLORS
```

### State Management (Zustand)

#### Notes Store ([useNotesStore.ts](store/notes/useNotesStore.ts:1))
```typescript
State:
- notes: Note[]
- categories: Category[]
- currentCategory: string | null
- currentFolder: string | null
- searchQuery: string
- isLoading: boolean

Actions:
- addNote(noteData) => noteId: string
- updateNote(id, updates)
- deleteNote(id)
- archiveNote(id)
- togglePinNote(id)
- toggleLockNote(id)
- moveNoteToFolder(noteId, folderId)
- setNoteReminder(noteId, reminderDate, notificationId)
- setCurrentCategory(categoryId)
- setCurrentFolder(folderId)
- setSearchQuery(query)
- loadNotes() => Promise<void>
- addCategory, updateCategory, deleteCategory

Selectors:
- useFilteredNotes() - Filtra por folder, category, search + ordena por pin/updatedAt
- useSearchNotes(query) - Búsqueda avanzada con relevancia + fecha parsing
```

#### Theme Store ([useThemeStore.ts](store/theme/useThemeStore.ts:1))
```typescript
State:
- isDarkMode: boolean
- colors: ColorScheme (LIGHT_COLORS | DARK_COLORS reactivo)

Actions:
- toggleTheme() - Alterna y persiste
- setTheme(isDark: boolean)
- loadTheme() - Carga de AsyncStorage al iniciar
```

#### Folders Store ([useFoldersStore.ts](store/folders/useFoldersStore.ts:1))
```typescript
State:
- folders: Folder[]

Actions:
- addFolder(name)
- updateFolder(id, updates)
- deleteFolder(id)
- loadFolders() => Promise<void>
```

#### Ads Store ([useAdsStore.ts](store/ads/useAdsStore.ts:1))
```typescript
State:
- hasShownInterstitialThisSession: boolean
- lastInterstitialShownAt: Date | null

Actions:
- markInterstitialAsShown() - Marca que se mostró el interstitial en esta sesión
- resetInterstitialSession() - Resetea el tracking al abrir la app (nueva sesión)
```

### Types ([types/index.ts](types/index.ts:1))
```typescript
interface Note {
  id: string
  title: string
  content: string             // HTML para rich text
  category: Category
  type: 'text' | 'checklist' | 'mixed'
  createdAt: Date
  updatedAt: Date
  images: string[]            // URIs (LEGACY - usar contentBlocks)
  contentBlocks?: ContentBlock[]  // NEW: Sistema bloques
  textSegments?: string[]     // LEGACY
  checklistItems?: ChecklistItem[]
  isArchived: boolean
  isPinned: boolean
  isLocked: boolean
  folderId?: string
  reminderDate?: Date
  notificationId?: string
  backgroundColor?: string    // Color custom de fondo
}

interface ContentBlock {
  type: 'text' | 'image'
  content?: string  // HTML for text blocks
  uri?: string      // URI for image/audio blocks
}

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  order: number
}

interface Category {
  id: string
  name: string
  color: string
  icon?: string
}

interface Folder {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

interface ColorScheme {
  background: string
  cardBackground: string
  textPrimary: string
  textSecondary: string
  accent: {
    orange: string
    blue: string
    green: string
    purple: string
    red: string
  }
}
```

## APIs Utilizadas

### 1. Deepgram API (Transcripción de Audio)
- **Endpoint (via Cloudflare Worker)**: `https://fastnote-api-proxy.fastvoiceapp.workers.dev/api/transcribe`
- **Endpoint directo (fallback)**: `https://api.deepgram.com/v1/listen`
- **Modelo**: `nova-2` con detección automática de idioma
- **Formato**: Binary audio (Uint8Array) con Content-Type: `audio/m4a`
- **Características**: `detect_language=true`, `punctuate=true`, `smart_format=true`
- **Variable (solo para fallback directo)**: `EXPO_PUBLIC_DEEPGRAM_API_KEY` (OPCIONAL)
- **Ventaja**: API keys protegidas en Cloudflare Worker (no expuestas en cliente)
- **Costo**: Mucho más económico que OpenAI Whisper
- **Servicio**: [audioTranscriptionService.ts](utils/audioTranscriptionService.ts)
- **Uso**: Transcripción de notas de voz en [note-detail.tsx](app/note-detail.tsx:1012) e [index.tsx](app/index.tsx)

### 2. OpenAI Chat Completions (Análisis de Recordatorios con IA)
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Modelo**: `gpt-4o-mini` (rápido y económico)
- **Formato**: JSON con system prompt + user message
- **Variable**: `EXPO_PUBLIC_OPENAI_API_KEY` (**REQUERIDO** para recordatorios inteligentes)
- **Uso**: Análisis inteligente de comandos de recordatorio en [voiceReminderAnalyzer.ts](utils/voiceReminderAnalyzer.ts)
  - Detecta fechas relativas ("hoy", "mañana", "en 2 horas")
  - Extrae hora y minutos
  - Limpia texto (quita comandos de recordatorio)
  - Retorna: `hasReminder`, `reminderTime`, `cleanText`, `originalReminderPhrase`
- **Nota**: Solo se usa para análisis de comandos, NO para transcripción de audio

### 3. OCR.space API
- **Endpoint**: `https://api.ocr.space/parse/image`
- **API Key**: `helloworld` (clave gratuita)
- **Límite**: 25,000 requests/mes
- **Formato**: Base64 image con prefix `data:image/jpeg;base64,`
- **Idioma**: `spa` (español)
- **Uso**: Extracción de texto desde imágenes en [note-detail.tsx](app/note-detail.tsx:818)

### 4. Expo Notifications
- **Tipo**: Local notifications (no push)
- **Programación**: Triggers basados en fecha/hora específica
- **Canal**: "default"
- **Permisos**: Android requiere `POST_NOTIFICATIONS`, `SCHEDULE_EXACT_ALARM`, `USE_EXACT_ALARM`
- **Configuración**: [app.json](app.json:23-28)
- **Uso**: Recordatorios de notas en [notifications.production.ts](utils/notifications.production.ts)

## Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# OpenAI API (REQUERIDO solo para recordatorios inteligentes - análisis de comandos de voz)
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-...tu-clave-aqui...

# Deepgram API (OPCIONAL - solo si no usas Cloudflare Worker)
# EXPO_PUBLIC_DEEPGRAM_API_KEY=tu-clave-deepgram

# OCR.space (OPCIONAL - usa clave gratuita "helloworld" por defecto)
# EXPO_PUBLIC_OCR_API_KEY=tu-clave-personalizada
```

**IMPORTANTE**:
- **Transcripción de audio**: Funciona sin variables de entorno (usa Cloudflare Worker que protege las API keys)
- **Recordatorios inteligentes**: Requiere `EXPO_PUBLIC_OPENAI_API_KEY` para análisis de comandos con GPT-4o-mini
- **Deepgram directo**: Solo necesario si quieres usar Deepgram directamente sin Cloudflare Worker (fallback)
- **OCR**: Funciona sin API key adicional (usa "helloworld" gratis)

## Flujo de Datos Principales

### 1. Crear Nueva Nota
```
Usuario presiona FAB (+)
  ↓
index.tsx: handleNewNotePress()
  ↓
Genera título con timestamp: "Nueva Nota DD/MM/YY HH:MM"
  ↓
addNote() en useNotesStore
  ↓
StorageService.saveNotes() → AsyncStorage
  ↓
router.push('/note-detail', { noteId })
  ↓
note-detail.tsx carga nota y permite edición
```

### 2. Nota de Voz con Recordatorio
```
Usuario presiona ícono micrófono (FAB o header)
  ↓
startRecording() con expo-av
  ↓
stopRecording() → transcribeAudio()
  ↓
audioTranscriptionService.transcribeAudioFile()
  ↓
Cloudflare Worker → Deepgram API (nova-2) → texto transcrito
  ↓
extractReminderDetails(texto) con GPT-4o-mini
  ↓
Detecta comando ("recordar a las 15:30")
  ↓
createVoiceNote() o insertTranscribedText()
  ↓
detectListKeywords() → ¿Es lista?
  ↓
addNote() con reminderDate
  ↓
NotificationService.scheduleNoteReminder()
  ↓
updateNote() con notificationId
  ↓
Alert al usuario con confirmación
```

### 3. Edición de Texto Enriquecido
```
Usuario toca contenido de nota
  ↓
handleStartContentEdit()
  ↓
setEditingElement('content')
  ↓
Muestra RichEditor (react-native-pell-rich-editor)
  ↓
KeyboardToolbar visible (Format/Audio/Draw/Image)
  ↓
Usuario presiona botón formato (H1/H2/H3/Bold/Highlight)
  ↓
richTextRef.current?.sendAction(actions.heading1)
  ↓
RichEditor actualiza HTML interno
  ↓
onChange → setEditedContent(html)
  ↓
handleSaveEdit() → updateNote()
  ↓
HTML guardado en note.content
  ↓
Vista normal: renderRichContent() parsea HTML a React Native Text
```

### 4. Búsqueda
```
Usuario escribe en barra de búsqueda
  ↓
search.tsx: setSearchQuery(text)
  ↓
useSearchNotes(query) selector
  ↓
Filtra por: title, content, checklistItems, dates
  ↓
formatDateForSearch() genera múltiples formatos
  ↓
Ordena por relevancia: Title match > Date match > UpdatedAt
  ↓
Renderiza resultados en NotesGrid
```

## Notas Técnicas

### Compatibilidad
- **Expo Managed Workflow** con desarrollo build (EAS)
- React Native 0.81.4 + Expo SDK 54
- Soporta Android e iOS nativamente
- Web experimental (limitado)

### Persistencia
- **AsyncStorage** para todo el estado persistente:
  - Notas: `@fastnote_notes`
  - Carpetas: `@fastnote_folders`
  - Categorías: `@fastnote_categories`
  - Tema: `@fastnote_theme`
- **Carga inicial**: Todos los stores llaman `loadX()` al iniciar app
- **Auto-save**: Cada acción que modifica estado guarda inmediatamente

### Rich Text Handling
- **Editor**: `react-native-pell-rich-editor` (WebView interno)
- **Formato almacenado**: HTML en `note.content`
- **Renderizado**: Parser custom en `renderRichContent()` que convierte HTML a componentes React Native Text
- **Formatos soportados**:
  - `<h1>`, `<h2>`, `<h3>` → estilos headerH1/H2/H3
  - `<b>`, `<strong>` → fontWeight bold
  - `<span style="background:yellow">` → backgroundColor amarillo

### Content Blocks vs Legacy Images
- **Sistema LEGACY**: `note.images[]` array de URIs
- **Sistema NUEVO**: `note.contentBlocks[]` con objetos `{type, content?, uri?}`
- **Migración gradual**: Código soporta ambos sistemas
- **Detección**: Si `contentBlocks` existe, usa ese; sino usa `images[]`

### Audio Detection
- Helper `isAudioUri(uri)` detecta extensiones: .mp3, .wav, .m4a, .aac, .ogg
- Mismo array que imágenes, pero renderiza AudioPlayer en vez de Image

### Fecha y Timestamps
- **Formato interno**: Date objects (JavaScript)
- **Parsing**: `formatDateForSearch()` genera múltiples formatos para búsqueda
- **Display**:
  - Notas: "Sep 30, 2025" (toLocaleDateString con 'en-US')
  - Recordatorios: "Hoy 15:30", "Mañana 9:00" (relativo en español)

## REGLAS CRÍTICAS DE DESARROLLO

### ❌ NO HACER CÓDIGO BASURA
- **NUNCA cambiar patrones que ya funcionan sin una razón técnica sólida**
- **NUNCA hacer cambios masivos innecesarios que generen más problemas**
- **SIEMPRE pensar antes de cambiar: ¿Por qué no arreglar directamente en vez de migrar todo?**
- **NUNCA desperdiciar tokens haciendo refactoring innecesario**

### ❌ NO LEVANTAR SERVIDORES LOCALHOST
- **NUNCA ejecutar npm start u otros comandos que levanten servidores sin permiso explícito**
- **El usuario ha sido explícito sobre esto múltiples veces**

### ✅ RAZONAMIENTO EFICIENTE
- **Antes de hacer cambios masivos, considerar si hay una solución más simple**
- **Priorizar soluciones que no rompan código existente**
- **Leer código existente ANTES de proponer cambios**
- **Respetar patrones establecidos en el proyecto**

## Historial de Cambios Importantes

### Sistema de Temas (Implementado - CON LECCIONES APRENDIDAS)
- Migración de `COLORS` estático a sistema dinámico con Zustand
- Cambios extensos en múltiples archivos
- StatusBar adaptativo según el tema
- Persistencia del tema seleccionado
- **LECCIÓN**: Podría haberse optimizado con menos cambios, pero funciona correctamente

### OCR Implementation
- Removido Tesseract.js (incompatible con React Native)
- Implementado OCR.space API (compatible con Expo)
- Conversión de imágenes a base64 con Expo FileSystem v54 (File API)

### Notas de Voz con IA
- **Migración de OpenAI Whisper a Deepgram API** (Octubre 2025)
  - Motivo: Reducción significativa de costos
  - Implementación con Cloudflare Worker para proteger API keys
  - Modelo nova-2 con detección automática de idioma
  - Smart formatting y puntuación automática
- Integración con GPT-4o-mini (análisis de comandos de recordatorio)
- Detección automática de listas vs texto normal
- Creación automática de checklists desde comandos de voz
- Sistema de recordatorios por voz

### Texto Enriquecido (Rich Text)
- Implementación de react-native-pell-rich-editor
- KeyboardToolbar con botones de formato
- Parser HTML custom para renderizado
- Soporte H1/H2/H3/Bold/Highlight
- **Actualmente activo y funcionando** en [note-detail.tsx](app/note-detail.tsx)

### Efectos de Interacción
- **Vibración Táctil**: Feedback háptico con expo-haptics al mantener presionada una nota
- **Efecto Visual**: La nota se "hunde" visualmente cuando está seleccionada
- **Duración**: Los efectos permanecen hasta salir del bottomMenu
- Implementado en [NoteCard.tsx](components/notes/NoteCard.tsx)

### Migración a Development Build (EAS)
**COMPLETADO - Septiembre 2024**

**Cambio de Entorno:**
- Migrado de Expo Go a Development Build usando EAS
- Permite uso de cualquier dependencia nativa
- Preparación para funcionalidades avanzadas de recordatorios

**Proceso Realizado:**
1. Instalación de `expo-dev-client`
2. Configuración de EAS CLI y login
3. Inicialización del proyecto EAS (`eas init`)
4. Configuración de build profiles (`eas build:configure`)
5. Creación de development build para Android
6. Configuración de Android package: `com.raulnicolasagusto.fastnote`

**Flujo de Desarrollo Post-Migración:**
- `npm start` funciona igual que antes, pero ahora detecta development build
- La app se ejecuta en tu development build personalizado en lugar de Expo Go
- Todas las funcionalidades existentes mantienen compatibilidad total

**Ventajas Obtenidas:**
- ✅ Acceso a librerías nativas para recordatorios avanzados
- ✅ Mayor control sobre configuraciones nativas
- ✅ Base sólida para builds de producción
- ✅ Mismo workflow de desarrollo diario
- ✅ Soporte completo para expo-notifications con triggers exactos

## Problemas Conocidos y Limitaciones

### 1. Rich Text Rendering
- El parser HTML es custom y puede tener edge cases
- Renderizado complejo (nested tags) puede no funcionar perfectamente
- Alternativa futura: usar react-native-render-html (más robusto)

### 2. Content Blocks Migration
- Sistema dual (legacy `images[]` + nuevo `contentBlocks[]`) aumenta complejidad
- Migración completa requeriría actualizar todas las notas existentes
- Por ahora ambos sistemas conviven

### 3. Notificaciones en iOS
- Requiere permisos específicos que usuario debe aprobar
- En algunos casos iOS puede retrasar notificaciones si app está cerrada
- Expo Go no soporta notificaciones exactas (requiere development build)

### 4. Performance con muchas notas
- AsyncStorage es síncrono internamente (puede bloquear en listas grandes)
- Futuro: considerar migración a SQLite o Realm para mejor performance
- Actual: funciona bien hasta ~500 notas

### 5. Audio en Android
- Algunos dispositivos Android requieren permisos especiales para audio en background
- Permisos declarados en [app.json](app.json:87-95)

## Roadmap Futuro (Sugerencias)

### Corto Plazo
- [ ] Exportar como Markdown (función stubbed en ShareMenu)
- [ ] Compartir con alguien directo (share to contacts)
- [ ] Tags/etiquetas adicionales a categorías
- [ ] Modo oscuro automático según hora del día

### Medio Plazo
- [ ] Sincronización en la nube (Firebase, Supabase)
- [ ] Colaboración en tiempo real
- [ ] Widget de home screen
- [ ] Backup/Restore automático
- [ ] Migración completa a Content Blocks

### Largo Plazo
- [ ] Desktop app (Electron)
- [ ] Web app completa
- [ ] Integración con calendario
- [ ] OCR mejorado (Google Cloud Vision, AWS Textract)
- [ ] Reconocimiento de voz offline

---

## Protocolo para Nuevas Implementaciones

Cuando el usuario solicite una **NUEVA funcionalidad o feature**, SIEMPRE seguir este checklist en orden:

### 1. ✅ Verificar Dependencias ANTES de Instalar
- **Leer [package.json](package.json)** para verificar si la dependencia ya está instalada
- **NO duplicar dependencias** - muchas veces ya existen librerías que hacen lo mismo
- **Buscar versiones actualizadas** usando MCP:
  - `mcp__Ref__ref_search_documentation` para buscar documentación oficial
  - Buscar compatibilidad con Expo SDK 54 y React Native 0.81.4
- **Verificar compatibilidad Expo** - no todas las librerías funcionan con Expo managed workflow
- Si necesitas instalar algo nuevo, **proponer primero** y esperar confirmación

### 2. ✅ Leer Archivos Relacionados
- **[types/index.ts](types/index.ts)** - Ver tipos existentes, entender estructura de datos
- **Stores relevantes** en `store/` - Ver cómo se maneja estado similar
- **Componentes similares** - Buscar patterns existentes que puedas reutilizar
- **[constants/theme.ts](constants/theme.ts)** - Para estilos y colores consistentes
- **Archivos de configuración**: `app.json`, `tsconfig.json`, `eas.json`

### 3. ✅ Buscar Documentación con MCP
- Usar `mcp__Ref__ref_search_documentation` para:
  - Documentación oficial de librerías
  - Ejemplos de implementación
  - Best practices de React Native y Expo
- Usar `mcp__Ref__ref_read_url` para leer docs específicas

### 4. ✅ Proponer Arquitectura ANTES de Codear
**NUNCA empezar a codear directamente.** Siempre proponer primero:
- ¿Qué archivos se van a modificar?
- ¿Qué archivos nuevos se van a crear?
- ¿Se necesita nuevo store de Zustand?
- ¿Se necesitan nuevos tipos en types/index.ts?
- ¿Hay que modificar app.json para permisos nativos?
- ¿Cómo se integra con código existente?

### 5. ✅ Confirmar con Usuario
- **Presentar el plan completo** al usuario
- **Esperar confirmación explícita** antes de hacer cambios
- Si el usuario dice "adelante" o "hazlo", entonces proceder
- Si hay dudas, hacer preguntas específicas

### 6. ✅ Durante Implementación
- **No romper código existente** - prioridad #1
- **Respetar patrones establecidos** (estructura de stores, componentes, estilos)
- **Usar TypeScript correctamente** - tipar todo
- **Seguir convenciones de nombres** del proyecto
- **Comentar código complejo** en español o inglés
- **Console.logs útiles** con emojis para debugging (ej: `console.log('🎯 Feature X:')`)
- **INTERNACIONALIZACIÓN (i18n)**:
  - ❌ **NUNCA hardcodear strings visibles al usuario** (ej: `<Text>Hola</Text>`)
  - ✅ **SIEMPRE usar** `t('key')` para todos los textos (ej: `<Text>{t('common.hello')}</Text>`)
  - ✅ **Agregar `useLanguage()` hook** en componentes que usen `t()` para re-render automático
  - ✅ **Agregar traducciones** en `i18n/en.json` y `i18n/es.json` para nuevas keys
  - ✅ **Usar keys descriptivas** organizadas por sección (ej: `sidebar.settings`, `notes.title`)

### 7. ✅ Testing Manual (sin levantar servidores)
- **NO ejecutar `npm start`** sin permiso explícito
- Revisar código mentalmente
- Verificar imports y exports
- Asegurar que TypeScript compile (sin ejecutar typecheck)

### 8. ✅ Actualizar Documentación
- **Actualizar [CLAUDE.md](CLAUDE.md)** si es feature significativo:
  - Agregar a "Características Implementadas"
  - Actualizar "Stack Tecnológico" si hay nuevas dependencias
  - Agregar a "APIs Utilizadas" si corresponde
  - Actualizar "Flujo de Datos" si cambia arquitectura
- Mantener la sección "Última actualización" al día

### 9. ✅ Preguntas Clave ANTES de Implementar

Antes de codear una nueva feature, responder mentalmente:

1. **¿Ya existe algo similar en el codebase?** → Reutilizar primero
2. **¿Esta dependencia ya está instalada?** → Revisar package.json
3. **¿Es compatible con Expo?** → Verificar docs oficiales
4. **¿Rompe algo existente?** → Analizar impacto
5. **¿Sigue los patterns del proyecto?** → Mantener consistencia
6. **¿Necesita permisos nativos?** → Actualizar app.json
7. **¿Necesita variables de entorno?** → Documentar en CLAUDE.md
8. **¿Los textos mostrados son traducibles?** → Usar `t('key')` en vez de hardcodear strings

### 10. ✅ Archivos Críticos a Revisar Siempre

Para cualquier implementación nueva, revisar estos archivos:

- **[package.json](package.json)** - Dependencias y scripts
- **[app.json](app.json)** - Configuración Expo, permisos, plugins
- **[types/index.ts](types/index.ts)** - Tipos TypeScript centrales
- **[constants/theme.ts](constants/theme.ts)** - Colores, spacing, tipografía
- **Stores en `store/`** - Estado global existente
- **[i18n/en.json](i18n/en.json)** y **[i18n/es.json](i18n/es.json)** - Traducciones (agregar nuevas keys aquí)
- **[utils/i18n.ts](utils/i18n.ts)** - Servicio de internacionalización
- **[CLAUDE.md](CLAUDE.md)** (este archivo) - Reglas y patterns del proyecto

## Frases Gatillo para Activar Protocolo

Cuando el usuario diga:
- "Quiero implementar..."
- "Necesito agregar..."
- "Vamos a crear..."
- "Ayúdame a hacer..."
- "Agrega una funcionalidad de..."

→ **ACTIVAR este protocolo completo** antes de escribir código.

---

**Última actualización**: 16/10/2025
**Mantenedor**: Claude Code Assistant
**Revisión**: Actualización de documentación de APIs - Deepgram reemplaza OpenAI Whisper
**Últimas features**:
- Sistema de Interstitial Ads (Octubre 2025) ✅
- Sistema de Internacionalización i18n (Octubre 2025) 🟡
- Migración a Deepgram API con Cloudflare Worker (Octubre 2025) ✅
