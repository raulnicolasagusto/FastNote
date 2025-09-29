# Implementación de Canvas de Dibujo en React Native

## Resumen
Implementación funcional de canvas de dibujo usando **react-native-svg** y **react-native-view-shot** para crear, capturar y guardar dibujos como imágenes PNG en una aplicación React Native.

## Dependencias Necesarias

```bash
npx expo install react-native-svg react-native-view-shot
```

**Librerías utilizadas:**
- `react-native-svg`: Para renderizado de SVG y paths de dibujo
- `react-native-view-shot`: Para capturar el canvas SVG como imagen PNG
- `@expo/vector-icons/MaterialIcons`: Para iconos de la interfaz

## Estructura de Archivos

```
components/
  ui/
    DrawingCanvas.tsx          # Componente principal del canvas
    KeyboardToolbar.tsx        # Toolbar con botón de dibujar
app/
  note-detail.tsx             # Pantalla principal con integración
```

## 1. Componente DrawingCanvas

**Archivo:** `components/ui/DrawingCanvas.tsx`

### Características principales:
- Canvas SVG con PanResponder para gestos táctiles
- Selector de colores predefinidos
- Control de tamaño de pincel (3 tamaños)
- Botones de limpiar y guardar
- Captura automática como PNG usando ViewShot

### Código base:

```tsx
import React, { useRef, useState } from 'react';
import { View, PanResponder, Dimensions, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import { MaterialIcons } from '@expo/vector-icons';

const COLORS = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
const BRUSH_SIZES = [2, 6, 12];

interface DrawingCanvasProps {
  onClose: () => void;
  onSaveDrawing: (imageUri: string) => void;
}

export default function DrawingCanvas({ onClose, onSaveDrawing }: DrawingCanvasProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedBrushSize, setSelectedBrushSize] = useState(6);
  const svgRef = useRef<View>(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      const newPath = `M${locationX},${locationY}`;
      setCurrentPath(newPath);
    },
    
    onPanResponderMove: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      setCurrentPath(prev => `${prev} L${locationX},${locationY}`);
    },
    
    onPanResponderRelease: () => {
      if (currentPath) {
        setPaths(prev => [...prev, currentPath]);
        setCurrentPath('');
      }
    },
  });

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
  };

  const saveDrawing = async () => {
    try {
      const uri = await captureRef(svgRef, {
        format: 'png',
        quality: 0.9,
      });
      onSaveDrawing(uri);
      onClose();
    } catch (error) {
      console.error('Error capturing drawing:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header con controles */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity onPress={clearCanvas}>
            <MaterialIcons name="clear" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={saveDrawing}>
            <MaterialIcons name="check" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Selectores de color y tamaño */}
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setSelectedColor(color)}
              style={{
                width: 32,
                height: 32,
                backgroundColor: color,
                borderRadius: 16,
                borderWidth: selectedColor === color ? 3 : 1,
                borderColor: selectedColor === color ? '#007AFF' : '#DDD',
              }}
            />
          ))}
        </View>
        
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {BRUSH_SIZES.map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => setSelectedBrushSize(size)}
              style={{
                padding: 8,
                backgroundColor: selectedBrushSize === size ? '#007AFF' : '#F0F0F0',
                borderRadius: 8,
              }}
            >
              <Text style={{
                color: selectedBrushSize === size ? 'white' : '#666',
                fontSize: 12,
              }}>
                {size}px
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Canvas SVG */}
      <View
        ref={svgRef}
        style={{ flex: 1, backgroundColor: 'white', margin: 16, borderRadius: 8 }}
        {...panResponder.panHandlers}
      >
        <Svg width="100%" height="100%">
          {paths.map((path, index) => (
            <Path
              key={index}
              d={path}
              stroke={selectedColor}
              strokeWidth={selectedBrushSize}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentPath && (
            <Path
              d={currentPath}
              stroke={selectedColor}
              strokeWidth={selectedBrushSize}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>
    </SafeAreaView>
  );
}
```

## 2. Integración en KeyboardToolbar

**Archivo:** `components/ui/KeyboardToolbar.tsx`

Agregar botón de dibujar en el toolbar:

```tsx
<TouchableOpacity
  style={styles.toolbarButton}
  onPress={onDraw}
  activeOpacity={0.7}
>
  <MaterialIcons name="draw" size={24} color="#007AFF" />
</TouchableOpacity>
```

## 3. Integración en Pantalla Principal

**Archivo:** `app/note-detail.tsx`

### Estado para modal de dibujo:

```tsx
const [showDrawingModal, setShowDrawingModal] = useState(false);
```

### Función para manejar dibujos guardados:

```tsx
const handleDrawingSaved = async (drawingDataUri: string) => {
  if (!note || !drawingDataUri) return;

  try {
    updateNote(note.id, {
      images: [...(note.images || []), drawingDataUri],
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error adding drawing to note:', error);
  }
};

const handleToolbarDraw = () => {
  setShowDrawingModal(true);
};
```

### Modal de dibujo:

```tsx
{/* Drawing Modal */}
{showDrawingModal && (
  <Modal
    animationType="slide"
    transparent={false}
    visible={showDrawingModal}
    onRequestClose={() => setShowDrawingModal(false)}
  >
    <DrawingCanvas
      onClose={() => setShowDrawingModal(false)}
      onSaveDrawing={handleDrawingSaved}
    />
  </Modal>
)}
```

### Visualización de imágenes en modo vista:

**CRÍTICO:** Modificar `renderContent()` para mostrar imágenes incluso sin texto:

```tsx
const renderContent = () => {
  if (!note) return null;

  const hasText = note.content && note.content.trim();
  const hasChecklist = note.checklistItems && note.checklistItems.length > 0;
  const hasImages = note.images && note.images.length > 0;

  // Si no hay texto ni checklist, mostrar estado vacío (pero incluir imágenes)
  if (!hasText && !hasChecklist) {
    return (
      <View>
        {hasImages && (
          <View style={styles.imagesSection}>
            {note.images.map((imageUri, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageContainer}
                onPress={() => {
                  // Lógica de selección de imagen
                }}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={styles.noteImage}
                  resizeMode="cover"
                />
                {/* Botón de eliminar si está seleccionada */}
              </TouchableOpacity>
            ))}
          </View>
        )}
        <Text style={[styles.emptyText, { color: textColors.secondary }]}>
          Start writing or add a checklist...
        </Text>
      </View>
    );
  }
  
  // Resto de la lógica para cuando hay contenido...
};
```

## 4. Estilos Necesarios

```tsx
const styles = StyleSheet.create({
  imagesSection: {
    marginVertical: 10,
  },
  imageContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  noteImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
});
```

## Puntos Clave de Éxito

1. **No usar WebView**: React Native SVG es más eficiente y nativo
2. **ViewShot para captura**: Convierte el SVG a PNG automáticamente
3. **PanResponder para gestos**: Manejo nativo de touch events
4. **Array simple para imágenes**: Usar `note.images` directamente, no sistemas complejos
5. **Renderizado condicional**: Asegurar que las imágenes se muestren con y sin texto

## Flujo de Usuario

1. Usuario presiona botón "Draw" en KeyboardToolbar
2. Se abre modal con DrawingCanvas
3. Usuario dibuja con touch gestures
4. Al presionar "Save", ViewShot captura el SVG como PNG
5. La imagen se agrega a `note.images[]`
6. Se muestra inmediatamente en la nota (con o sin texto)

## Errores Comunes Evitados

- ❌ Usar WebView (problemas de dependencias)
- ❌ Fondos grises indeseados
- ❌ No mostrar imágenes sin texto
- ❌ Sistemas complejos de blocks/contentBlocks
- ❌ Problemas de teclado sin altura mínima

Esta implementación es **simple, funcional y robusta** para canvas de dibujo en React Native.