# 🌍 Guía de Implementación de Internacionalización (i18n) - FastNote

**Fecha**: Octubre 2025
**Idiomas Soportados**: 🇺🇸 Inglés (English) | 🇪🇸 Español (Spanish)
**Status**: ✅ Infraestructura Completa - En Integración

---

## ✅ LO QUE YA ESTÁ IMPLEMENTADO

### 1. Dependencias Instaladas
```json
{
  "i18n-js": "^4.5.1",
  "expo-localization": "^17.0.7"
}
```

### 2. Archivos de Traducción Creados

#### 📁 [i18n/en.json](i18n/en.json) - Inglés (Completo)
Contiene TODAS las traducciones en inglés para:
- Navegación y tabs
- Notas y editor
- Checklists
- Carpetas (Folders)
- Recordatorios
- Compartir
- Grabación de audio
- Cámara/OCR
- Menús
- Alertas
- Callouts educativos
- Acciones rápidas
- Formatos de texto
- Notificaciones
- Sidebar
- Timestamps

#### 📁 [i18n/es.json](i18n/es.json) - Español (Completo)
Traducciones completas en español de todos los textos.

**TOTAL: ~150 strings traducidos** en ambos idiomas.

---

### 3. Servicio de i18n ([utils/i18n.ts](utils/i18n.ts))

**Características:**
- ✅ Detección automática del idioma del dispositivo
- ✅ Fallback a inglés si idioma no soportado
- ✅ Funciones helper: `t()`, `changeLanguage()`, `getCurrentLanguage()`
- ✅ Logs de debug para verificar idioma detectado

**Uso Básico:**
```typescript
import { t } from '../utils/i18n';

// Texto simple
<Text>{t('notes.title')}</Text> // → "Notes" o "Notas"

// Con parámetros
<Text>{t('notes.charactersCount', { count: 125 })}</Text> // → "125 characters" o "125 caracteres"
```

---

### 4. Componentes Ya Actualizados

#### ✅ [app/index.tsx](app/index.tsx)
**Traducciones aplicadas:**
- Títulos de notas: "Nueva Nota" / "New Note"
- Títulos de notas de voz: "Nota Rápida" / "Quick Note"
- Modal de grabación: "Recording...", "Transcribing...", "Cancel", "Stop"

#### ✅ [components/layout/MainScreen.tsx](components/layout/MainScreen.tsx)
**Traducciones aplicadas:**
- Header title: "Notes" / "Notas"

---

## 🔧 ARCHIVOS PENDIENTES DE TRADUCIR

A continuación, la lista completa de archivos que necesitan integrar las traducciones.
**Todos los strings ya están en los archivos JSON**, solo necesitas reemplazarlos.

### PRIORIDAD ALTA (Pantallas Principales)

#### 1. [app/note-detail.tsx](app/note-detail.tsx)
**Cantidad estimada**: ~40 strings

**Ejemplos de textos a reemplazar:**
```typescript
// ANTES:
<Text>Edit Title</Text>
<Text>Tap to edit</Text>
Alert.alert('Note Locked', 'This note is locked. Unlock it first to edit.');

// DESPUÉS:
<Text>{t('noteDetail.editTitle')}</Text>
<Text>{t('noteDetail.tapToEdit')}</Text>
Alert.alert(t('alerts.noteLocked'), t('alerts.noteLockedMessage'));
```

**Textos específicos:**
- Placeholders: "Title", "Start writing..."
- Botones: "Save", "Cancel", "Done", "Back"
- Colores: "Default", "Yellow", "Cream", "Peach", etc.
- Formatos: "Heading 1", "Bold", "Highlight"
- Alertas: "Delete Note", "Note Locked", "Empty Title"

---

#### 2. [app/search.tsx](app/search.tsx)
**Cantidad estimada**: ~5 strings

**Textos:**
```typescript
// Placeholder del buscador
<TextInput placeholder="Search notes..." />
// CAMBIAR A:
<TextInput placeholder={t('notes.searchPlaceholder')} />

// Estado vacío
<Text>No results found</Text>
// Agregar al JSON: "search.noResults": "No results found" / "Sin resultados"
```

---

#### 3. [app/folders.tsx](app/folders.tsx)
**Cantidad estimada**: ~10 strings

**Textos:**
- "Folders", "All Notes"
- "New Folder", "Create Folder"
- "Folder Name", "Enter folder name..."
- Alertas de eliminación de carpetas

---

### PRIORIDAD MEDIA (Componentes UI)

#### 4. [components/ui/ShareMenu.tsx](components/ui/ShareMenu.tsx)
**Textos:**
- "Share", "Share as Text", "Share as Image", "Share as Markdown"
- Ya están en: `share.*`

#### 5. [components/ui/MoveFolderModal.tsx](components/ui/MoveFolderModal.tsx)
**Textos:**
- "Move to Folder", "Select a folder"
- Ya están en: `folders.*`

#### 6. [components/ui/ReminderPicker.tsx](components/ui/ReminderPicker.tsx)
**Textos:**
- "Set Reminder", "Remove Reminder"
- "Today", "Tomorrow", "In X days"
- Ya están en: `reminders.*`

#### 7. [components/ui/BottomMenu.tsx](components/ui/BottomMenu.tsx)
**Textos:**
- "Pin", "Lock", "Archive", "Delete", "Share", "Move to Folder"
- Ya están en: `menu.*`

#### 8. [components/ui/Callout.tsx](components/ui/Callout.tsx)
**Textos:**
- Todos los tips educativos
- Ya están en: `callouts.*`

#### 9. [components/ui/Sidebar.tsx](components/ui/Sidebar.tsx)
**Textos:**
- "Dark Mode", "Light Mode", "Settings", "About FastNote", "Version X"
- Ya están en: `sidebar.*`

#### 10. [components/ui/AudioRecorder.tsx](components/ui/AudioRecorder.tsx)
**Textos:**
- "Recording...", "Stop", "Cancel"
- Ya están en: `recording.*`

#### 11. [components/ui/ImagePickerModal.tsx](components/ui/ImagePickerModal.tsx)
**Textos:**
- "Capture Text", "Take Photo", "Choose from Gallery"
- Ya están en: `camera.*`

---

### PRIORIDAD BAJA (Layout y Grids)

#### 12. [components/layout/TabBar.tsx](components/layout/TabBar.tsx)
**Textos:**
- "All", "Personal", "Work", "Ideas"
- Ya están en: `tabs.*`

**Implementación:**
```typescript
import { t } from '../../utils/i18n';

const categories = [
  { id: 'all', name: t('tabs.all') },
  { id: 'personal', name: t('tabs.personal') },
  { id: 'work', name: t('tabs.work') },
  { id: 'ideas', name: t('tabs.ideas') },
];
```

#### 13. [components/notes/NotesGrid.tsx](components/notes/NotesGrid.tsx)
**Textos:**
- "No notes yet", "Tap + to create your first note"
- Ya están en: `notes.emptyState`, `notes.emptyStateDesc`

---

## 📝 CÓMO INTEGRAR TRADUCCIONES (PASO A PASO)

### Paso 1: Importar la función `t`
```typescript
import { t } from '../utils/i18n'; // Ajustar path según ubicación
```

### Paso 2: Buscar textos hardcodeados
```typescript
// Buscar patrones como:
<Text>"Texto hardcodeado"</Text>
placeholder="Texto hardcodeado"
Alert.alert('Título', 'Mensaje');
title: "Título"
```

### Paso 3: Reemplazar con traducciones
```typescript
// ANTES:
<Text>Delete Note</Text>

// DESPUÉS:
<Text>{t('alerts.deleteNoteTitle')}</Text>
```

### Paso 4: Textos con variables
```typescript
// Para textos con interpolación:
<Text>{t('notes.charactersCount', { count: charCount })}</Text>
<Text>{t('timestamps.daysAgo', { count: 5 })}</Text>
```

### Paso 5: Verificar que funcione
1. Cambia el idioma de tu dispositivo a Español
2. Cierra y abre la app
3. Verifica que el texto aparece en español

---

## 🔍 MAPA COMPLETO DE TRADUCCIONES

### Common (Comunes)
```
common.cancel → "Cancel" / "Cancelar"
common.save → "Save" / "Guardar"
common.delete → "Delete" / "Eliminar"
common.edit → "Edit" / "Editar"
common.done → "Done" / "Listo"
common.back → "Back" / "Volver"
```

### Notes (Notas)
```
notes.title → "Notes" / "Notas"
notes.newNote → "New Note" / "Nueva Nota"
notes.voiceNote → "Voice Note" / "Nota de Voz"
notes.quickNote → "Quick Note" / "Nota Rápida"
notes.emptyState → "No notes yet" / "No hay notas aún"
notes.searchPlaceholder → "Search notes..." / "Buscar notas..."
notes.charactersCount → "{{count}} characters" / "{{count}} caracteres"
```

### Note Detail (Detalle de Nota)
```
noteDetail.titlePlaceholder → "Title" / "Título"
noteDetail.contentPlaceholder → "Start writing..." / "Comienza a escribir..."
noteDetail.tapToEdit → "Tap to edit" / "Toca para editar"
noteDetail.addImage → "Add Image" / "Agregar Imagen"
noteDetail.backgroundColor → "Background Color" / "Color de Fondo"
```

### Checklist (Lista de Tareas)
```
checklist.title → "Checklist" / "Lista de Tareas"
checklist.newItem → "New item" / "Nuevo elemento"
checklist.addItem → "Add item" / "Agregar elemento"
checklist.completed → "Completed" / "Completado"
```

### Folders (Carpetas)
```
folders.title → "Folders" / "Carpetas"
folders.allNotes → "All Notes" / "Todas las Notas"
folders.newFolder → "New Folder" / "Nueva Carpeta"
folders.moveToFolder → "Move to Folder" / "Mover a Carpeta"
```

### Reminders (Recordatorios)
```
reminders.title → "Reminder" / "Recordatorio"
reminders.setReminder → "Set Reminder" / "Establecer Recordatorio"
reminders.today → "Today" / "Hoy"
reminders.tomorrow → "Tomorrow" / "Mañana"
```

### Share (Compartir)
```
share.title → "Share" / "Compartir"
share.shareAsText → "Share as Text" / "Compartir como Texto"
share.shareAsImage → "Share as Image" / "Compartir como Imagen"
```

### Recording (Grabación)
```
recording.recording → "Recording..." / "Grabando..."
recording.stop → "Stop" / "Detener"
recording.transcribing → "Transcribing..." / "Transcribiendo..."
```

### Camera (Cámara)
```
camera.title → "Capture Text" / "Capturar Texto"
camera.takePhoto → "Take Photo" / "Tomar Foto"
camera.chooseFromGallery → "Choose from Gallery" / "Elegir de la Galería"
```

### Menu (Menú)
```
menu.pin → "Pin" / "Fijar"
menu.lock → "Lock" / "Bloquear"
menu.archive → "Archive" / "Archivar"
menu.delete → "Delete" / "Eliminar"
menu.share → "Share" / "Compartir"
```

### Alerts (Alertas)
```
alerts.deleteNoteTitle → "Delete Note" / "Eliminar Nota"
alerts.deleteNoteMessage → "Are you sure..." / "¿Estás seguro..."
alerts.noteLocked → "Note Locked" / "Nota Bloqueada"
alerts.noteLockedMessage → "This note is locked..." / "Esta nota está bloqueada..."
```

### Callouts (Consejos)
```
callouts.pinNotes → "Pin important notes..." / "Fija notas importantes..."
callouts.voiceNotes → "Use voice notes..." / "Usa notas de voz..."
callouts.reminders → "Set reminders..." / "Establece recordatorios..."
```

---

## 🌐 CONFIGURACIÓN PLAY STORE (Google Play Console)

Para que usuarios vean la app en su idioma **ANTES** de descargar:

### 1. Configurar app.json (Ya documentado, pendiente)

### 2. Crear Store Listings Localizados

1. Ve a [Google Play Console](https://play.google.com/console)
2. Selecciona FastNote
3. Ve a **"Store presence" → "Main store listing"**
4. Click en **"Manage translations"**
5. Agrega idiomas: **English (United States)** y **Spanish (Spain/Latin America)**

### 3. Contenido a Traducir en Play Store

#### Inglés (United States):
```
App name: FastNote - Quick Notes
Short description: Capture ideas quickly with voice, text, and checklists
Full description: FastNote is your ultimate companion for quick note-taking...
```

#### Español (España/Latinoamérica):
```
App name: FastNote - Notas Rápidas
Short description: Captura ideas rápidamente con voz, texto y listas
Full description: FastNote es tu compañero definitivo para tomar notas rápidas...
```

### 4. Screenshots Localizados

**Recomendación:**
- Tomar screenshots de la app en **inglés** (cambia idioma del dispositivo a inglés)
- Tomar screenshots de la app en **español** (cambia idioma del dispositivo a español)
- Subir cada set a su idioma correspondiente en Play Console

---

## 🧪 TESTING DE IDIOMAS

### Probar Inglés:
1. Abre Settings de Android/iOS
2. Ve a Language & Input → Languages
3. Arrastra "English (United States)" al tope
4. Cierra completamente FastNote (swipe apps recientes)
5. Abre FastNote
6. Verás: "Notes", "New Note", "Recording...", etc.

### Probar Español:
1. Settings → Language & Input → Languages
2. Arrastra "Español" al tope
3. Cierra completamente FastNote
4. Abre FastNote
5. Verás: "Notas", "Nueva Nota", "Grabando...", etc.

### Logs de Verificación:
Busca en consola:
```
🌍 i18n initialized: {
  deviceLanguage: 'es',
  selectedLocale: 'es',
  availableLocales: ['en', 'es']
}
```

---

## 📦 RESUMEN DE ARCHIVOS ENTREGADOS

### ✅ Archivos Nuevos Creados:
1. **[i18n/en.json](i18n/en.json)** - Traducciones en inglés (150+ strings)
2. **[i18n/es.json](i18n/es.json)** - Traducciones en español (150+ strings)
3. **[utils/i18n.ts](utils/i18n.ts)** - Servicio de internacionalización
4. **[I18N_IMPLEMENTATION_GUIDE.md](I18N_IMPLEMENTATION_GUIDE.md)** - Esta guía

### ✅ Archivos Modificados:
1. **[package.json](package.json)** - Dependencias agregadas
2. **[app/index.tsx](app/index.tsx)** - Traducciones parciales aplicadas
3. **[components/layout/MainScreen.tsx](components/layout/MainScreen.tsx)** - Título traducido

### ⏳ Archivos Pendientes (12 archivos):
Ver sección **"ARCHIVOS PENDIENTES DE TRADUCIR"** arriba.

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

1. **Revisar traducciones en archivos JSON**
   - Lee [i18n/en.json](i18n/en.json)
   - Lee [i18n/es.json](i18n/es.json)
   - Corrige cualquier traducción que no te guste

2. **Integrar traducciones en componentes faltantes**
   - Empieza por [app/note-detail.tsx](app/note-detail.tsx) (el más importante)
   - Continúa con modals ([ShareMenu](components/ui/ShareMenu.tsx), [ReminderPicker](components/ui/ReminderPicker.tsx), etc.)
   - Finaliza con componentes pequeños ([TabBar](components/layout/TabBar.tsx), [Callout](components/ui/Callout.tsx))

3. **Probar cambio de idioma**
   - Cambia idioma del dispositivo
   - Verifica que todos los textos cambien

4. **Configurar app.json para nombre de app localizado**
   - Ver sección siguiente

5. **Preparar traducciones para Play Store**
   - Escribir descripción en inglés y español
   - Tomar screenshots en ambos idiomas

---

## ⚙️ CONFIGURACIÓN DE app.json (PENDIENTE)

Agregar configuración de locales para nombre de app:

```json
{
  "expo": {
    "locales": {
      "es": {
        "CFBundleDisplayName": "FastNote - Notas Rápidas"
      },
      "en": {
        "CFBundleDisplayName": "FastNote - Quick Notes"
      }
    }
  }
}
```

**Nota:** Esto requiere rebuild nativo con `eas build`.

---

## 🆘 TROUBLESHOOTING

### Problema: Traducciones no aparecen
**Solución:**
1. Verifica que importaste `t` correctamente
2. Revisa consola: `🌍 i18n initialized`
3. Verifica que la clave existe en el JSON: `t('notes.title')`

### Problema: Idioma no cambia al cambiar dispositivo
**Solución:**
1. Cierra completamente la app (no solo minimize)
2. Cambia idioma del dispositivo
3. Abre la app de nuevo

### Problema: Falta una traducción
**Solución:**
1. Agrega la clave a ambos archivos JSON:
   ```json
   // en.json
   "miNuevaClave": "My new text"

   // es.json
   "miNuevaClave": "Mi nuevo texto"
   ```
2. Usa: `t('categoria.miNuevaClave')`

---

**Creado:** Octubre 2025
**Mantenedor:** Claude Code Assistant
**Status:** 🟡 En Progreso - Revisar traducciones y completar integración
