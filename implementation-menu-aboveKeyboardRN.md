# Implementación de Menú Flotante Sobre Teclado en React Native

## 📋 Resumen

Guía completa para crear un menú/toolbar que aparezca automáticamente encima del teclado cuando el usuario está editando texto, similar al comportamiento de WhatsApp, Xiaomi Notes o Telegram.

## 🎯 Objetivo

Crear un componente que:
- ✅ Aparezca solo cuando el teclado esté visible
- ✅ Se posicione automáticamente encima del teclado
- ✅ Se anime suavemente al aparecer/desaparecer el teclado  
- ✅ Funcione igual en Android e iOS
- ✅ No sea cubierto por el teclado
- ✅ Integre botones de herramientas temáticos

## 🛠️ Implementación Técnica

### Componente KeyboardToolbar

```tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface KeyboardToolbarProps {
  visible?: boolean;
  onFormatPress?: () => void;
  onAudioPress?: () => void;
  onDrawPress?: () => void;
  onImagePress?: () => void;
}

const KeyboardToolbar: React.FC<KeyboardToolbarProps> = ({
  visible = false,
  onFormatPress,
  onAudioPress,
  onDrawPress,
  onImagePress,
}) => {
  const [keyboardHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      console.log('🎹 Keyboard showing, height:', e.endCoordinates.height);
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height, // altura exacta del teclado
        duration: 250,
        useNativeDriver: false, // IMPORTANTE: false para animar marginBottom
      }).start();
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      console.log('🎹 Keyboard hiding');
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, [keyboardHeight]);

  // Solo renderizar si visible
  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          marginBottom: keyboardHeight, // 👈 CLAVE: marginBottom empuja hacia arriba
        },
      ]}
    >
      <View style={styles.toolbar}>
        {/* Botones de herramientas */}
        <TouchableOpacity
          style={styles.toolButton}
          onPress={onFormatPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="format-bold" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolButton}
          onPress={onAudioPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="mic" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolButton}
          onPress={onDrawPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="brush" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolButton}
          onPress={onImagePress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="image" size={20} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

export default KeyboardToolbar;
```

### Integración en Pantalla Principal

```tsx
import KeyboardToolbar from '../components/ui/KeyboardToolbar';

const NoteEditScreen = () => {
  const [showKeyboardToolbar, setShowKeyboardToolbar] = useState(false);

  const handleStartContentEdit = () => {
    setEditingElement('content');
    setShowKeyboardToolbar(true); // 👈 Activar toolbar
  };

  const handleCancelEdit = () => {
    setEditingElement(null);
    setShowKeyboardToolbar(false); // 👈 Desactivar toolbar
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Contenido principal */}
      <TextInput
        onFocus={handleStartContentEdit}
        onBlur={handleCancelEdit}
        // ... otros props
      />
      
      {/* Toolbar flotante */}
      <KeyboardToolbar
        visible={showKeyboardToolbar}
        onFormatPress={() => console.log('Format pressed')}
        onAudioPress={() => console.log('Audio pressed')}
        onDrawPress={() => console.log('Draw pressed')}
        onImagePress={() => console.log('Image pressed')}
      />
    </View>
  );
};
```

## 🔑 Conceptos Clave

### 1. **marginBottom Animado** (Solución Recomendada)
```tsx
marginBottom: keyboardHeight // Se empuja hacia arriba automáticamente
```

**¿Por qué funciona?**
- React Native automáticamente ajusta el layout cuando cambia el margin
- El componente se "empuja" hacia arriba cuando el teclado aparece
- No requiere cálculos complejos de posición
- Funciona igual en iOS y Android

### 2. **Eventos del Teclado Unificados**
```tsx
// Usar los mismos eventos para ambas plataformas
Keyboard.addListener('keyboardDidShow', callback);
Keyboard.addListener('keyboardDidHide', callback);
```

**Anteriormente se usaba:**
```tsx
// ❌ Problemático: eventos diferentes por plataforma
Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
```

### 3. **useNativeDriver: false**
```tsx
Animated.timing(keyboardHeight, {
  toValue: height,
  duration: 250,
  useNativeDriver: false, // 👈 CRUCIAL para marginBottom
}).start();
```

**Importante:** `marginBottom` no puede usar el native driver.

### 4. **Control de Visibilidad**
```tsx
if (!visible) {
  return null; // No renderizar si no es necesario
}
```

## 🚨 Errores Comunes y Soluciones

### ❌ Error 1: Usar position: absolute
```tsx
// ❌ NO USAR - Problemático en Android
style={{ 
  position: 'absolute',
  bottom: keyboardHeight 
}}
```

**✅ Solución:** Usar marginBottom
```tsx
// ✅ USAR - Funciona en ambas plataformas
style={{ 
  marginBottom: keyboardHeight 
}}
```

### ❌ Error 2: Eventos específicos por plataforma
```tsx
// ❌ Complica el código innecesariamente
Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
```

**✅ Solución:** Usar keyboardDidShow para ambos
```tsx
// ✅ Simplifica y funciona igual de bien
Keyboard.addListener('keyboardDidShow', callback)
```

### ❌ Error 3: Usar useNativeDriver: true
```tsx
// ❌ Error: marginBottom no soporta native driver
useNativeDriver: true
```

**✅ Solución:**
```tsx
// ✅ Obligatorio para propiedades de layout
useNativeDriver: false
```

## 📱 Alternativas de Implementación

### Opción 1: KeyboardAvoidingView (Limitada)
```tsx
<KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
  <TextInput />
  <View style={styles.toolbar}>
    {/* Botones */}
  </View>
</KeyboardAvoidingView>
```

**Problemas:**
- No siempre queda pegado al teclado en Android
- Comportamiento inconsistente
- Menos control sobre la animación

### Opción 2: marginBottom Animado (Recomendada) ⭐
```tsx
// La implementación mostrada arriba
marginBottom: keyboardHeight
```

**Ventajas:**
- Funciona perfectamente en ambas plataformas
- Control total sobre la animación
- Comportamiento predecible
- Usado por apps profesionales

### Opción 3: Librerías Externas
```bash
npm install react-native-keyboard-accessory-view
```

**Consideraciones:**
- Dependencia adicional
- Menos control sobre el comportamiento
- Puede tener conflictos con otras librerías

## 🎨 Personalización del Diseño

### Tema Dinámico
```tsx
const { colors } = useThemeStore();

style={{
  backgroundColor: colors.cardBackground,
  borderTopColor: colors.textSecondary + '20',
}}
```

### Botones Temáticos (Estilo Xiaomi Notes)
```tsx
// Formato - Color primario
<MaterialIcons name="format-bold" color={colors.textPrimary} />

// Audio - Color rojo
<MaterialIcons name="mic" color={colors.accent.red} />

// Dibujo - Color azul  
<MaterialIcons name="brush" color={colors.accent.blue} />

// Imagen - Color verde
<MaterialIcons name="image" color={colors.accent.green} />
```

### Sombras y Elevación
```tsx
elevation: 10, // Android
shadowColor: '#000', // iOS
shadowOffset: { width: 0, height: -2 },
shadowOpacity: 0.1,
shadowRadius: 4,
```

## 🔧 Debugging y Testing

### Console Logs Útiles
```tsx
console.log('🎹 Keyboard showing, height:', e.endCoordinates.height);
console.log('🎯 Toolbar visible:', visible);
```

### Verificaciones en Desarrollo
1. **Verificar altura del teclado**: Debe imprimir valores > 0
2. **Verificar animación**: El toolbar debe moverse suavemente
3. **Verificar visibilidad**: Solo debe aparecer cuando `visible={true}`
4. **Verificar posición**: Debe quedar pegado encima del teclado

## 📋 Checklist de Implementación

- [ ] Crear componente KeyboardToolbar
- [ ] Configurar eventos keyboardDidShow/keyboardDidHide
- [ ] Implementar animación con marginBottom
- [ ] Configurar useNativeDriver: false
- [ ] Agregar control de visibilidad
- [ ] Integrar en pantalla principal
- [ ] Configurar botones de herramientas
- [ ] Aplicar tema y estilos
- [ ] Probar en dispositivo/simulador
- [ ] Verificar funcionamiento en Android e iOS

## 🏆 Resultado Final

- **Menú flotante profesional** como WhatsApp o Xiaomi Notes
- **Animación suave** al aparecer/desaparecer
- **Posicionamiento perfecto** encima del teclado
- **Compatible con iOS y Android**
- **Código limpio y mantenible**
- **Control total sobre el comportamiento**

## 📚 Referencias

- [React Native Keyboard API](https://reactnative.dev/docs/keyboard)
- [React Native Animated API](https://reactnative.dev/docs/animated)
- [MaterialIcons para Expo](https://icons.expo.fyi/)

---

**Fecha:** 28 de Septiembre, 2025  
**Proyecto:** FastNote - React Native App  
**Implementación exitosa:** ✅ KeyboardToolbar funcionando perfectamente