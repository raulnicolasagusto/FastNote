# 📝 **Guía Rápida: Implementar Compartir como Texto**

## **🎯 Objetivo**
Compartir el contenido de una nota como **texto directo** (no como archivo) usando el sistema nativo de compartir de Android/iOS.

## **📋 Pasos de Implementación**

### **1. Imports Necesarios**
```typescript
import { Alert, Share } from 'react-native';
import { Note } from '../types'; // Tu tipo de nota
```

### **2. Función de Formateo de Texto**
```typescript
export const formatNoteAsText = (note: Note): string => {
  let textContent = '';
  
  // Título con subrayado
  if (note.title && note.title.trim()) {
    textContent += `${note.title.trim()}\n`;
    textContent += '='.repeat(note.title.length) + '\n\n';
  }
  
  // Contenido de texto
  if (note.content && note.content.trim()) {
    textContent += `${note.content.trim()}\n\n`;
  }
  
  // Items de checklist
  if (note.checklistItems && note.checklistItems.length > 0) {
    textContent += 'Lista:\n';
    note.checklistItems.forEach((item) => {
      const checkbox = item.completed ? '✅' : '☐';
      textContent += `${checkbox} ${item.text}\n`;
    });
    textContent += '\n';
  }
  
  // Metadatos (fecha, app)
  const dateStr = new Date(note.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  textContent += `---\nCreado: ${dateStr}\nCreated with [TuApp]`;
  
  return textContent.trim();
};
```

### **3. Función Principal de Compartir**
```typescript
export const shareNoteAsText = async (note: Note): Promise<void> => {
  try {
    console.log('🔄 Starting text share for:', note.title);

    // Formatear contenido
    const textContent = formatNoteAsText(note);
    
    // Compartir usando Share nativo
    const result = await Share.share({
      message: textContent,  // 👈 CLAVE: texto directo, NO archivo
      title: note.title,
    });

    // Opcional: manejar resultado
    if (result.action === Share.sharedAction) {
      console.log('✅ Shared successfully');
    } else if (result.action === Share.dismissedAction) {
      console.log('📝 Share dismissed');
    }

  } catch (error) {
    console.error('❌ Error sharing:', error);
    Alert.alert('Error', 'Failed to share note. Try again.');
  }
};
```

### **4. Integrar en UI**
```typescript
// En tu componente de nota
import { shareNoteAsText } from '../utils/shareTextUtils';

const handleShareAsText = async () => {
  if (!note) return;
  await shareNoteAsText(note);
};

// En el JSX
<TouchableOpacity onPress={handleShareAsText}>
  <MaterialIcons name="text-fields" size={24} />
  <Text>Share as Text</Text>
</TouchableOpacity>
```

## **⚠️ Errores Comunes a Evitar**

### **❌ NO hacer esto:**
```typescript
// ❌ NO crear archivos temporales
const fileUri = `${FileSystem.cacheDirectory}${filename}`;
await FileSystem.writeAsStringAsync(fileUri, textContent);
await Sharing.shareAsync(fileUri); // Esto comparte como archivo

// ❌ NO usar expo-sharing para texto
import * as Sharing from 'expo-sharing';
await Sharing.shareAsync(textContent); // Error: espera URL de archivo
```

### **✅ SÍ hacer esto:**
```typescript
// ✅ Usar Share nativo de React Native
import { Share } from 'react-native';
await Share.share({ message: textContent }); // Texto directo
```

## **🔧 Dependencias Necesarias**

```json
// package.json - NO necesitas dependencias extra
// Share viene incluido en React Native por defecto
```

## **📱 Comportamiento por Plataforma**

- **Android**: Abre menú nativo, texto se pega directo en apps
- **iOS**: Abre Activity View Controller, texto disponible para todas las apps
- **WhatsApp**: Pega texto en chat (no como archivo adjunto)
- **Email**: Pega texto en cuerpo del mensaje
- **SMS**: Pega texto en mensaje

## **🎨 Formato de Salida Ejemplo**
```
Mi Nota Importante
==================

Este es el contenido de mi nota con información importante.

Lista:
✅ Tarea completada
☐ Tarea pendiente
☐ Otra tarea por hacer

---
Creado: 28 de septiembre de 2025, 23:45
Created with FastVoiceNote
```

## **⚡ Resumen Ultra Rápido**

1. **Import**: `import { Share } from 'react-native';`
2. **Formatear**: Crear string con título + contenido + checklist + metadatos
3. **Compartir**: `Share.share({ message: textoFormateado })`
4. **Resultado**: Texto directo en cualquier app (WhatsApp, Gmail, etc.)

**🚀 Listo en 5 minutos, funciona perfectamente, sin archivos temporales, sin dependencias extra.**

---

## **🔍 Detalles Técnicos Adicionales**

### **Estructura del Archivo de Utilidades**
```typescript
// utils/shareTextUtils.ts
import { Alert, Share } from 'react-native';
import { Note } from '../types';

export const formatNoteAsText = (note: Note): string => {
  // Implementación completa arriba...
};

export const shareNoteAsText = async (note: Note): Promise<void> => {
  // Implementación completa arriba...
};

export const isTextSharingSupported = (): boolean => {
  return true; // Share es nativo, siempre disponible
};

export default {
  formatNoteAsText,
  shareNoteAsText,
  isTextSharingSupported,
};
```

### **Personalización del Formato**
```typescript
// Personalizar emojis y formato según tu app
const checkbox = item.completed ? '✅' : '☐'; // Puedes cambiar por otros emojis
const separator = '='.repeat(note.title.length); // Puedes usar '-' o '*'
const footer = `Created with ${APP_NAME}`; // Variable de tu app
```

### **Manejo de Errores Robusto**
```typescript
export const shareNoteAsText = async (note: Note): Promise<void> => {
  try {
    // Validar que la nota existe
    if (!note || !note.title) {
      throw new Error('Invalid note data');
    }

    const textContent = formatNoteAsText(note);
    
    // Validar que hay contenido para compartir
    if (!textContent.trim()) {
      Alert.alert('Empty Note', 'This note has no content to share.');
      return;
    }

    const result = await Share.share({
      message: textContent,
      title: note.title,
    });

    // Log para debugging
    console.log('Share result:', result);

  } catch (error) {
    console.error('Share error:', error);
    
    // Mensaje específico según el error
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred while sharing';
      
    Alert.alert('Share Failed', errorMessage);
  }
};
```

### **Integración con Menús de Compartir**
```typescript
// Ejemplo de integración en un menú de opciones
const ShareMenu = ({ note, onClose }) => {
  const shareOptions = [
    {
      title: 'Share as Text',
      icon: 'text-fields',
      action: () => shareNoteAsText(note),
    },
    {
      title: 'Share as Image', 
      icon: 'image',
      action: () => shareNoteAsImage(note),
    }
  ];

  return (
    <Modal visible={visible} onClose={onClose}>
      {shareOptions.map((option) => (
        <TouchableOpacity key={option.title} onPress={option.action}>
          <MaterialIcons name={option.icon} size={24} />
          <Text>{option.title}</Text>
        </TouchableOpacity>
      ))}
    </Modal>
  );
};
```

## **🧪 Testing**

### **Casos de Prueba Recomendados**
1. **Nota solo con título**: Debe compartir título + metadatos
2. **Nota solo con texto**: Debe compartir texto + metadatos  
3. **Nota solo con checklist**: Debe compartir lista + metadatos
4. **Nota mixta**: Debe compartir título + texto + lista + metadatos
5. **Nota vacía**: Debe mostrar alerta "Empty Note"
6. **Caracteres especiales**: Debe manejar emojis, acentos, símbolos

### **Verificación Manual**
- Probar en WhatsApp: ¿Se pega como texto o archivo?
- Probar en Gmail: ¿Aparece en el cuerpo del email?
- Probar en SMS: ¿Se copia correctamente?
- Cancelar diálogo: ¿No hay errores?

## **📚 Recursos Adicionales**

- [React Native Share API](https://reactnative.dev/docs/share)
- [Expo Sharing vs React Native Share](https://docs.expo.dev/versions/latest/sdk/sharing/)
- [Platform-specific behaviors](https://reactnative.dev/docs/share#share)

---
**💡 Tip Final**: Siempre usa `Share.share()` de React Native para texto directo, reserva `expo-sharing` solo para archivos.