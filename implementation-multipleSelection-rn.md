# Implementación de Selección Múltiple en React Native

Este documento explica cómo implementar un sistema de selección múltiple para eliminar o realizar acciones en varios elementos a la vez, similar a la funcionalidad de apps como Gmail, Photos, etc.

## 📋 Tabla de Contenidos

1. [Resumen de la Funcionalidad](#resumen)
2. [Arquitectura General](#arquitectura)
3. [Implementación Paso a Paso](#implementación)
4. [Código de Referencia](#código)
5. [Problemas Comunes y Soluciones](#problemas)

---

## Resumen

### ¿Qué hace esta funcionalidad?

- **Long press** en un elemento activa el modo de selección múltiple
- Aparecen **círculos de selección** en todos los elementos
- **Tap normal** en otros elementos los selecciona/deselecciona
- **Bottom menu** muestra contador y acciones disponibles
- Permite **scroll** y navegación mientras se mantiene la selección
- Acciones en masa: Pin, Mover, Ocultar, Eliminar

### Flujo de Usuario

```
1. Usuario hace LONG PRESS en Item A
   → Modo multi-select activado
   → Item A seleccionado
   → Círculos aparecen en TODOS los items
   → Bottom menu aparece (sin bloquear pantalla)

2. Usuario hace TAP en Item B
   → Item B se agrega a la selección
   → Contador actualiza: "2 items seleccionados"

3. Usuario hace TAP en Item B nuevamente
   → Item B se deselecciona
   → Contador actualiza: "1 item seleccionado"

4. Usuario hace TAP en Item A (último seleccionado)
   → Sale del modo multi-select
   → Círculos desaparecen
   → Bottom menu se cierra

5. Usuario presiona botón de acción (Eliminar, Mover, etc.)
   → Acción se ejecuta en TODOS los items seleccionados
   → Sale del modo multi-select
```

---

## Arquitectura

### Componentes Principales

```
MainScreen (Contenedor)
├── ItemGrid (Lista de elementos)
│   └── ItemCard (Elemento individual)
│       ├── Círculo de selección (visible solo en modo multi-select)
│       └── Contenido del item
└── BottomMenu (Menú de acciones)
    ├── Modo Normal: Modal con backdrop (bloquea pantalla)
    └── Modo Multi-Select: View fijo (permite interacción)
```

### Estado Necesario

```typescript
// En el componente contenedor (MainScreen)
const [selectedItems, setSelectedItems] = useState<Item[]>([]); // Array de items seleccionados
const [isMultiSelectMode, setIsMultiSelectMode] = useState(false); // Flag de modo activo
const [showBottomMenu, setShowBottomMenu] = useState(false); // Visibilidad del menú
```

---

## Implementación

### Paso 1: Configurar el Estado en el Contenedor Principal

**Archivo: `MainScreen.tsx` (o tu componente contenedor)**

```typescript
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

export const MainScreen = () => {
  // Estado para selección múltiple
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [showBottomMenu, setShowBottomMenu] = useState(false);

  // ... resto del código
};
```

### Paso 2: Crear Handlers para Long Press y Selection

**Archivo: `MainScreen.tsx`**

```typescript
// Handler para long press (activa modo multi-select)
const handleItemLongPress = (item: Item) => {
  console.log('👆 Long press on:', item.title);

  // Vibración táctil
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  // Activar modo multi-select con el primer item
  setIsMultiSelectMode(true);
  setSelectedItems([item]);
  setShowBottomMenu(true);
};

// Handler para tap (seleccionar/deseleccionar)
const handleItemSelect = (item: Item) => {
  console.log('✅ Tap on:', item.title);

  // Verificar si ya está seleccionado
  const isAlreadySelected = selectedItems.some(i => i.id === item.id);

  if (isAlreadySelected) {
    // Deseleccionar
    const newSelection = selectedItems.filter(i => i.id !== item.id);
    setSelectedItems(newSelection);

    // Si no quedan items, salir del modo
    if (newSelection.length === 0) {
      setIsMultiSelectMode(false);
      setShowBottomMenu(false);
    }
  } else {
    // Seleccionar
    setSelectedItems([...selectedItems, item]);
  }
};

// Handler para cerrar menú y limpiar selección
const handleCloseBottomMenu = () => {
  setShowBottomMenu(false);
  setSelectedItems([]);
  setIsMultiSelectMode(false);
};
```

### Paso 3: Crear Handlers para Acciones en Masa

**Archivo: `MainScreen.tsx`**

```typescript
// Pin/Anclar múltiples items
const handlePin = () => {
  selectedItems.forEach(item => {
    togglePinItem(item.id);
  });
  console.log(`📌 Pinned ${selectedItems.length} items`);
  // El menú se cierra automáticamente desde BottomMenu
};

// Eliminar múltiples items
const handleDelete = () => {
  console.log(`🗑️ Delete ${selectedItems.length} items`);
  setShowDeleteConfirmModal(true);
  // NO cerrar el menú aquí - el modal lo necesita
};

const confirmDelete = () => {
  selectedItems.forEach(item => {
    deleteItem(item.id);
  });
  setShowDeleteConfirmModal(false);
  setShowBottomMenu(false);
  setSelectedItems([]);
  setIsMultiSelectMode(false);
};

// Mover a carpeta
const handleMoveTo = () => {
  console.log(`📁 Move ${selectedItems.length} items`);
  setShowMoveFolderModal(true);
  // NO cerrar el menú aquí - el modal lo necesita
};

const handleSelectFolder = (folderId: string) => {
  selectedItems.forEach(item => {
    moveItemToFolder(item.id, folderId);
  });
  setShowMoveFolderModal(false);
  setShowBottomMenu(false);
  setSelectedItems([]);
  setIsMultiSelectMode(false);
};
```

### Paso 4: Actualizar el Grid/Lista de Items

**Archivo: `ItemGrid.tsx`**

```typescript
interface ItemGridProps {
  items: Item[];
  onItemPress: (item: Item) => void;
  onItemLongPress?: (item: Item) => void;
  selectedItemIds?: string[]; // IDs de items seleccionados
  isMultiSelectMode?: boolean; // Flag de modo activo
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  onItemPress,
  onItemLongPress,
  selectedItemIds = [],
  isMultiSelectMode = false
}) => {
  const renderItem = ({ item }: { item: Item }) => {
    const isSelected = selectedItemIds.includes(item.id);

    return (
      <ItemCard
        item={item}
        onPress={() => onItemPress(item)}
        onLongPress={onItemLongPress ? () => onItemLongPress(item) : undefined}
        isSelected={isSelected}
        isMultiSelectMode={isMultiSelectMode}
      />
    );
  };

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
    />
  );
};
```

### Paso 5: Actualizar el Card Individual

**Archivo: `ItemCard.tsx`**

```typescript
interface ItemCardProps {
  item: Item;
  onPress: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  isMultiSelectMode?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onPress,
  onLongPress,
  isSelected,
  isMultiSelectMode
}) => {
  const { colors } = useThemeStore();

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={styles.card}>

      {/* Header con círculo de selección */}
      <View style={styles.header}>
        {/* Círculo de selección - solo visible en modo multi-select */}
        {isMultiSelectMode && (
          <View style={[
            styles.selectCircle,
            { borderColor: colors.accent.blue },
            isSelected && { backgroundColor: colors.accent.blue }
          ]}>
            {isSelected && (
              <MaterialIcons name="check" size={14} color="#FFFFFF" />
            )}
          </View>
        )}

        <Text style={styles.title}>{item.title}</Text>
      </View>

      {/* Resto del contenido */}
      <Text style={styles.content}>{item.content}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    fontSize: 14,
    color: '#666',
  },
});
```

### Paso 6: Crear el Bottom Menu con Dos Modos

**Archivo: `BottomMenu.tsx`**

```typescript
interface BottomMenuProps {
  visible: boolean;
  items: Item[];
  onClose: () => void;
  onPin: () => void;
  onMoveTo: () => void;
  onDelete: () => void;
  isMultiSelectMode?: boolean; // ← CRÍTICO: Flag desde el parent
}

export default function BottomMenu({
  visible,
  items,
  onClose,
  onPin,
  onMoveTo,
  onDelete,
  isMultiSelectMode = false,
}: BottomMenuProps) {
  const { colors } = useThemeStore();
  const insets = useSafeAreaInsets();

  const isMultiSelect = items.length > 1;

  const menuButtons = [
    { id: 'pin', icon: 'star', label: 'Anclar', action: onPin },
    { id: 'move', icon: 'folder', label: 'Mover', action: onMoveTo },
    { id: 'delete', icon: 'delete', label: 'Eliminar', action: onDelete },
  ];

  if (items.length === 0) return null;

  // ==========================================
  // MODO MULTI-SELECT: Sin Modal (permite interacción)
  // ==========================================
  if (isMultiSelectMode && visible) {
    return (
      <View
        style={[
          styles.multiSelectContainer,
          {
            backgroundColor: colors.cardBackground,
            paddingBottom: insets.bottom + 16,
          },
        ]}>

        {/* Contador */}
        <Text style={styles.title}>
          {items.length} items seleccionados
        </Text>

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          {menuButtons.map((button) => (
            <TouchableOpacity
              key={button.id}
              style={styles.menuButton}
              onPress={() => {
                button.action();
                // Solo cerrar para acciones inmediatas (pin, hide)
                // NO cerrar para acciones que abren modals (move, delete)
                if (button.id !== 'move' && button.id !== 'delete') {
                  onClose();
                }
              }}>
              <MaterialIcons name={button.icon as any} size={24} />
              <Text>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // ==========================================
  // MODO NORMAL: Con Modal (bloquea pantalla)
  // ==========================================
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <View style={styles.menuContainer}>
          <Text style={styles.title}>{items[0]?.title}</Text>

          <View style={styles.buttonsContainer}>
            {menuButtons.map((button) => (
              <TouchableOpacity
                key={button.id}
                onPress={() => {
                  button.action();
                  if (button.id !== 'move' && button.id !== 'delete') {
                    onClose();
                  }
                }}>
                <MaterialIcons name={button.icon as any} size={24} />
                <Text>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Modo multi-select: posición fija sin modal
  multiSelectContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  // Modo normal: con modal y backdrop
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },

  // Comunes
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  menuButton: {
    alignItems: 'center',
    padding: 8,
  },
});
```

### Paso 7: Integrar Todo en MainScreen

**Archivo: `MainScreen.tsx`**

```typescript
return (
  <SafeAreaView style={styles.container}>
    <Header title="Items" />

    <View style={styles.content}>
      <ItemGrid
        items={filteredItems}
        // Cambiar handler según modo
        onItemPress={isMultiSelectMode ? handleItemSelect : handleItemView}
        onItemLongPress={handleItemLongPress}
        selectedItemIds={selectedItems.map(i => i.id)}
        isMultiSelectMode={isMultiSelectMode}
      />
    </View>

    {/* Bottom Menu */}
    <BottomMenu
      visible={showBottomMenu}
      items={selectedItems}
      onClose={handleCloseBottomMenu}
      onPin={handlePin}
      onMoveTo={handleMoveTo}
      onDelete={handleDelete}
      isMultiSelectMode={isMultiSelectMode} // ← IMPORTANTE
    />

    {/* Modal de confirmación de eliminación */}
    {showDeleteConfirmModal && (
      <Modal transparent visible={showDeleteConfirmModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>
            <Text>
              {selectedItems.length === 1
                ? `¿Eliminar "${selectedItems[0]?.title}"?`
                : `¿Eliminar ${selectedItems.length} items?`
              }
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setShowDeleteConfirmModal(false)} />
              <Button title="Eliminar" onPress={confirmDelete} />
            </View>
          </View>
        </View>
      </Modal>
    )}

    {/* Modal de mover a carpeta */}
    <MoveFolderModal
      visible={showMoveFolderModal}
      onClose={() => setShowMoveFolderModal(false)}
      onSelectFolder={handleSelectFolder}
    />
  </SafeAreaView>
);
```

---

## Código de Referencia

### Resumen de Props y Handlers

```typescript
// MainScreen
interface MainScreenState {
  selectedItems: Item[];           // Array de items seleccionados
  isMultiSelectMode: boolean;      // Flag de modo activo
  showBottomMenu: boolean;         // Visibilidad del menú
}

interface MainScreenHandlers {
  handleItemLongPress: (item: Item) => void;  // Activa modo
  handleItemSelect: (item: Item) => void;     // Selecciona/deselecciona
  handleCloseBottomMenu: () => void;          // Limpia todo
  handlePin: () => void;                      // Acción en masa
  handleDelete: () => void;                   // Acción en masa
  handleMoveTo: () => void;                   // Acción en masa
}

// ItemGrid
interface ItemGridProps {
  items: Item[];
  onItemPress: (item: Item) => void;
  onItemLongPress?: (item: Item) => void;
  selectedItemIds?: string[];
  isMultiSelectMode?: boolean;
}

// ItemCard
interface ItemCardProps {
  item: Item;
  onPress: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  isMultiSelectMode?: boolean;
}

// BottomMenu
interface BottomMenuProps {
  visible: boolean;
  items: Item[];
  onClose: () => void;
  onPin: () => void;
  onMoveTo: () => void;
  onDelete: () => void;
  isMultiSelectMode?: boolean; // ← CRÍTICO para evitar Modal en multi-select
}
```

---

## Problemas Comunes y Soluciones

### Problema 1: El backdrop bloquea la pantalla en modo multi-select

**Síntoma:** No puedes hacer scroll ni tocar otros items después del long press.

**Causa:** El `BottomMenu` usa `<Modal>` que siempre bloquea la pantalla.

**Solución:** Renderizar el menu de dos formas diferentes:
- **Modo multi-select:** `<View>` con `position: absolute` (NO usar Modal)
- **Modo normal:** `<Modal>` con backdrop

```typescript
if (isMultiSelectMode && visible) {
  return <View style={styles.multiSelectContainer}>...</View>;
}
return <Modal>...</Modal>;
```

### Problema 2: Las acciones "Mover" y "Eliminar" no funcionan

**Síntoma:** El modal se abre pero no tiene items seleccionados.

**Causa:** El `BottomMenu` cierra el menú inmediatamente después de ejecutar la acción, limpiando `selectedItems` antes de que el modal se abra.

**Solución:** NO cerrar el menú para acciones que abren modals:

```typescript
onPress={() => {
  button.action();
  // Solo cerrar para acciones inmediatas
  if (button.id !== 'move' && button.id !== 'delete') {
    onClose();
  }
}}
```

### Problema 3: El círculo de selección no aparece

**Síntoma:** No se ve el indicador visual de selección.

**Causa:** No estás pasando `isMultiSelectMode` al `ItemCard`.

**Solución:** Verificar el flujo completo de props:

```typescript
MainScreen
  → isMultiSelectMode={true}
    → ItemGrid
      → isMultiSelectMode={true}
        → ItemCard
          → isMultiSelectMode={true}
            → {isMultiSelectMode && <View>Círculo</View>}
```

### Problema 4: Al deseleccionar el último item no sale del modo

**Síntoma:** El modo multi-select queda activo sin items seleccionados.

**Causa:** No estás verificando si `selectedItems.length === 0` después de deseleccionar.

**Solución:**

```typescript
const handleItemSelect = (item: Item) => {
  const newSelection = isSelected
    ? selectedItems.filter(i => i.id !== item.id)
    : [...selectedItems, item];

  setSelectedItems(newSelection);

  // Salir del modo si no quedan items
  if (newSelection.length === 0) {
    setIsMultiSelectMode(false);
    setShowBottomMenu(false);
  }
};
```

### Problema 5: El app crashea con "Cannot read property 'map' of undefined"

**Síntoma:** Error al renderizar el menu.

**Causa:** Las variables que usan `items.map()` están definidas DESPUÉS del early return.

**Solución:** Definir todas las variables ANTES de cualquier early return:

```typescript
export default function BottomMenu({ items, ... }) {
  // 1. Definir variables primero
  const menuButtons = [...];
  const allPinned = items.every(...);

  // 2. Luego los early returns
  if (items.length === 0) return null;
  if (isMultiSelectMode) return <View>...</View>;
  return <Modal>...</Modal>;
}
```

---

## Checklist de Implementación

### Estado y Handlers (MainScreen)
- [ ] `selectedItems: Item[]`
- [ ] `isMultiSelectMode: boolean`
- [ ] `showBottomMenu: boolean`
- [ ] `handleItemLongPress(item)` - Activa modo
- [ ] `handleItemSelect(item)` - Selecciona/deselecciona
- [ ] `handleCloseBottomMenu()` - Limpia todo
- [ ] `handlePin()` - Acción en masa
- [ ] `handleDelete()` - Acción en masa
- [ ] `handleMoveTo()` - Acción en masa

### Componente Grid
- [ ] Prop `selectedItemIds: string[]`
- [ ] Prop `isMultiSelectMode: boolean`
- [ ] Pasar `isSelected` a cada card
- [ ] Cambiar `onPress` según modo

### Componente Card
- [ ] Prop `isSelected: boolean`
- [ ] Prop `isMultiSelectMode: boolean`
- [ ] Círculo de selección condicional
- [ ] Checkmark cuando `isSelected`

### Bottom Menu
- [ ] Prop `isMultiSelectMode: boolean` ← CRÍTICO
- [ ] Modo multi-select: `<View>` sin Modal
- [ ] Modo normal: `<Modal>` con backdrop
- [ ] NO cerrar para acciones con modals
- [ ] Contador de items seleccionados

### Vibración y Feedback
- [ ] `expo-haptics` instalado
- [ ] Vibración en long press
- [ ] Efecto visual "sink" opcional

---

## Dependencias Necesarias

```json
{
  "dependencies": {
    "expo-haptics": "~15.0.7",
    "@expo/vector-icons": "^15.0.2"
  }
}
```

---

## Testing Checklist

- [ ] Long press activa modo multi-select
- [ ] Aparecen círculos en todos los items
- [ ] Tap selecciona/deselecciona items
- [ ] Contador actualiza correctamente
- [ ] Scroll funciona durante selección
- [ ] Deseleccionar último item sale del modo
- [ ] Pin/Anclar funciona con múltiples items
- [ ] Eliminar funciona con múltiples items
- [ ] Mover funciona con múltiples items
- [ ] Modal de confirmación muestra conteo correcto
- [ ] Backdrop NO bloquea en modo multi-select
- [ ] Backdrop SÍ bloquea en modo normal (single item)

---

## Mejoras Opcionales

### 1. Seleccionar Todo
```typescript
const handleSelectAll = () => {
  setSelectedItems(allItems);
};
```

### 2. Animaciones
```typescript
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

{isMultiSelectMode && (
  <Animated.View entering={FadeIn} exiting={FadeOut}>
    <SelectCircle />
  </Animated.View>
)}
```

### 3. Gestures de Arrastre
```typescript
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const longPress = Gesture.LongPress()
  .minDuration(500)
  .onStart(() => handleItemLongPress(item));
```

### 4. Atajos de Teclado (Web/Desktop)
```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isMultiSelectMode) {
      handleCloseBottomMenu();
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [isMultiSelectMode]);
```

---

## Conclusión

Esta implementación proporciona una experiencia de usuario fluida y profesional para la selección múltiple de elementos. Los puntos clave son:

1. **Dos modos de renderizado** para el BottomMenu (con/sin Modal)
2. **Estado compartido** entre componentes mediante props
3. **Indicadores visuales claros** (círculos de selección)
4. **No bloquear la interacción** en modo multi-select
5. **Manejo cuidadoso** de cuándo cerrar el menú

Con esta guía, puedes implementar esta funcionalidad en cualquier proyecto React Native con listas o grids de elementos.

---

**Última actualización:** 30/09/2025
**Autor:** Claude Code Assistant
**Proyecto de referencia:** FastNote
