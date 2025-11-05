# 🔍 DIAGNÓSTICO DE WIDGET - FastNote

## ✅ CHECKLIST PRE-BUILD

### 1. **Archivos Críticos**
- [x] `widgets/widgetTaskHandler.tsx` - Handler actualizado
- [x] `widgets/NoteWidget.tsx` - Componente del widget
- [x] `utils/homeWidgetService.ts` - Servicio simplificado
- [x] `app/note-detail.tsx` - Modal de tamaño removido
- [x] `index.js` - Handler registrado correctamente

### 2. **Configuración**
- [x] `app.json` - 3 widgets configurados
- [x] `package.json` - main: "index.js"
- [x] Deep linking scheme: "fastnote"

### 3. **Storage Keys**
- `@fastnote_widget_pending_note` - ID de nota pendiente
- `@fastnote_widget_instances` - Mapping widgetId → noteId
- `@fastnote_notes` - Todas las notas

---

## 🎯 FLUJO CORRECTO (Código Actual)

```
1. Usuario en nota → "Add to Home Screen"
   ↓
2. homeWidgetService.prepareNoteWidget(note)
   ↓
3. AsyncStorage.setItem('@fastnote_widget_pending_note', noteId)
   ↓
4. Modal de instrucciones → Usuario entiende
   ↓
5. Usuario va a Home → Widgets → Arrastra FastNote
   ↓
6. Android llama: widgetTaskHandler({ widgetAction: 'WIDGET_ADDED', widgetId: 123 })
   ↓
7. Handler lee: pendingNoteId = AsyncStorage.getItem('@fastnote_widget_pending_note')
   ↓
8. Handler guarda: instances[123] = pendingNoteId
   ↓
9. Handler carga: note = getNoteById(pendingNoteId)
   ↓
10. Handler renderiza: props.renderWidget(<NoteWidget note={note} />)
    ↓
11. ✅ Widget muestra la nota correcta
```

---

## ⚠️ POR QUÉ DICE "Note not found"

### **Causa #1: Build Viejo** (MÁS PROBABLE)
El APK instalado tiene el código ANTERIOR que:
- Buscaba config por `widgetName`
- No usaba `widgetId`
- No leía `@fastnote_widget_pending_note`

**Solución**: Hacer nuevo build con código actualizado

### **Causa #2: AsyncStorage no persistió**
La nota se guardó pero se perdió antes de agregar widget.

**Solución**: Verificar con logs en el nuevo build

### **Causa #3: Timing Issue**
El widget se agregó ANTES de presionar "Add to Home Screen".

**Solución**: Seguir el orden correcto

---

## 🧪 CÓMO PROBAR EL NUEVO BUILD

### **Paso 1: Instalar el nuevo APK**
1. Espera a que EAS termine el build (~10-15 min)
2. Descarga e instala el nuevo APK
3. **Desinstala primero** el APK viejo si es posible

### **Paso 2: Limpiar datos de widgets viejos**
1. Abre la app
2. **IMPORTANTE**: Si tienes widgets viejos en el home, ¡BÓRRALOS!
3. Los widgets viejos tienen el código antiguo

### **Paso 3: Probar flujo completo**
1. Abre la app → Crea/abre una nota
2. Presiona "⋮" → "Add to Home Screen"
3. Lee instrucciones → "Entendido"
4. Sal de la app
5. Home → Mantén presionado → Widgets
6. Busca "FastNote"
7. Arrastra CUALQUIER tamaño (Small/Medium/Large)
8. **Debería mostrar la nota correcta** ✅

### **Paso 4: Verificar logs (Opcional)**
```bash
# Ver logs mientras agregas widget
adb logcat | grep -i "widget\|fastnote"
```

Busca estos mensajes:
- `🎨 Widget Task: WIDGET_ADDED for ID: XXX`
- `📱 New widget added!`
- `📌 Using pending note: YYY`
- `✅ Rendering widget for note: [título]`

---

## 🔍 DEBUGGING SI SIGUE FALLANDO

### **Si dice "Tap to configure":**
- La nota NO se guardó como pendiente
- Verifica que presionaste "Add to Home Screen" ANTES de arrastrar widget

### **Si dice "Note not found":**
- La nota se guardó pero no se encuentra en storage
- Posible problema con el ID de la nota

### **Si muestra nota incorrecta:**
- El mapeo widgetId → noteId está mal
- Verifica que cada widget tenga su propio ID único

---

## ✅ CÓDIGO CRÍTICO A VERIFICAR

### **widgetTaskHandler.tsx línea 75-86:**
```typescript
const pendingNoteId = await getPendingNoteId();

if (pendingNoteId) {
  console.log(`📌 Using pending note: ${pendingNoteId}`);
  await saveWidgetInstance(widgetId, pendingNoteId);
  
  const pendingNote = await getNoteById(pendingNoteId);
  if (pendingNote) {
    console.log(`✅ Rendering widget for note: ${pendingNote.title}`);
    props.renderWidget(<NoteWidget note={pendingNote} size="medium" />);
  }
}
```

Este código:
1. ✅ Lee la nota pendiente
2. ✅ Guarda el mapping widgetId → noteId
3. ✅ Carga la nota completa
4. ✅ Renderiza el widget

---

## 📦 COMANDO PARA NUEVO BUILD

```bash
# Build para testing
eas build --platform android --profile development

# Espera 10-15 minutos
# Descarga e instala el APK
# Prueba de nuevo
```

---

## 🎉 DESPUÉS DEL NUEVO BUILD

Todo debería funcionar porque:
- ✅ Código corregido
- ✅ Flujo simplificado
- ✅ AsyncStorage por widgetId individual
- ✅ Sin modal de tamaño duplicado
- ✅ Instrucciones claras

---

**Última actualización**: 04/11/2025 23:57 UTC
**Status**: ⏳ Esperando nuevo build para confirmar funcionamiento
**Próximo paso**: Hacer build con `eas build --platform android --profile development`
