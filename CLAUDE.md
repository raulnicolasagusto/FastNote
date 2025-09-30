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

### EAS Build
- `eas build --platform android --profile development` - Build para desarrollo
- `eas build --platform android --profile preview` - Build preview
- `eas build --platform android --profile production` - Build producción

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
- **openai**: 5.23.1 (Transcripción con Whisper)

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
  - "Nueva lista de...", "Lista de compras", "Shopping list"
  - "Agregar a la lista" para añadir items a checklist existente
  - Parseo inteligente con separadores: comas, puntos, "y", "and"
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

### 5. Notas de Voz (Whisper API)
- **Grabación de audio** con expo-av (HIGH_QUALITY)
- **Transcripción automática** con OpenAI Whisper API (modelo whisper-1)
- **Detección inteligente**:
  - Listas vs texto normal
  - Comandos de recordatorio
  - Comandos de "agregar a lista existente"
- Creación automática de notas con timestamp: "Nota Rápida DD/MM/YY HH:MM"
- Quick Action para iniciar grabación desde home screen
- Modal de grabación con indicador visual y botones Cancel/Stop

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
- Detección en [index.tsx](app/index.tsx) mediante `useLocalSearchParams()`

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
└── theme/
    └── useThemeStore.ts   # Estado de tema (light/dark)

utils/
├── notifications.ts              # Servicio notificaciones (wrapper)
├── notifications.production.ts   # Implementación para production build
├── notifications.expo-go.ts      # Mock para Expo Go
├── voiceReminderAnalyzer.ts      # IA análisis comandos voz (OpenAI)
├── storage.ts                    # AsyncStorage utilities + generateId()
├── shareTextUtils.ts             # Compartir texto con expo-sharing
├── shareImageUtils.ts            # Captura + compartir imagen
├── useCalloutRotation.ts         # Hook callouts rotativos
└── useNotificationHandlers.ts    # Hook manejo notificaciones

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

### 1. OpenAI Whisper API
- **Endpoint**: `https://api.openai.com/v1/audio/transcriptions`
- **Modelo**: `whisper-1`
- **Formato**: `multipart/form-data` con audio m4a
- **Variable**: `EXPO_PUBLIC_OPENAI_API_KEY` (**REQUERIDO**)
- **Uso**: Transcripción de notas de voz en [note-detail.tsx](app/note-detail.tsx:687) e [index.tsx](app/index.tsx:224)

### 2. OpenAI Chat Completions (para análisis de recordatorios)
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Modelo**: `gpt-4o-mini` (rápido y económico)
- **Formato**: JSON con system prompt + user message
- **Variable**: `EXPO_PUBLIC_OPENAI_API_KEY` (la misma)
- **Uso**: Análisis inteligente de comandos de recordatorio en [voiceReminderAnalyzer.ts](utils/voiceReminderAnalyzer.ts)
  - Detecta fechas relativas ("hoy", "mañana", "en 2 horas")
  - Extrae hora y minutos
  - Limpia texto (quita comandos de recordatorio)
  - Retorna: `hasReminder`, `reminderTime`, `cleanText`, `originalReminderPhrase`

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
# OpenAI API (REQUERIDO para notas de voz y recordatorios inteligentes)
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-...tu-clave-aqui...

# OCR.space (OPCIONAL - usa clave gratuita "helloworld" por defecto)
# EXPO_PUBLIC_OCR_API_KEY=tu-clave-personalizada
```

**IMPORTANTE**:
- Sin `EXPO_PUBLIC_OPENAI_API_KEY` las funciones de voz y recordatorios inteligentes no funcionarán
- OCR funciona sin API key adicional (usa "helloworld" gratis)

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
OpenAI Whisper API → texto transcrito
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
- Integración completa con OpenAI Whisper API (transcripción)
- Integración con GPT-4o-mini (análisis de comandos)
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

**Última actualización**: 30/09/2025
**Mantenedor**: Claude Code Assistant
**Revisión**: Completa basada en lectura de codebase
