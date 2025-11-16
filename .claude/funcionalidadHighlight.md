# Implementación del Resaltado (Highlight) en FastNote

## Descripción General
El sistema de resaltado en FastNote permite a los usuarios resaltar texto en las notas para enfocar la atención en información importante. Esta funcionalidad se divide en dos partes principales: la edición (cuando se aplica el resaltado) y la visualización (cuando se muestra el texto resaltado).

## Componentes Clave

### 1. Aplicación del Resaltado (Edición)
- **Archivo**: `app/note-detail.tsx`
- **Función**: `handleHighlightPress()`
- **Comportamiento**:
  - Alterna el estado del botón de resaltado (`activeFormats.highlight`)
  - En modo activo: aplica resaltado usando `document.execCommand("hiliteColor", false, color)`
  - En modo inactivo: remueve el resaltado usando `document.execCommand("backColor", false, "inherit")`
  - Selecciona el color basado en el tema actual (amarillo para modo claro, #D97706 para modo oscuro)

### 2. Visualización del Resaltado (Lectura)
- **Archivo**: `app/note-detail.tsx`
- **Función**: `renderRichContent()`
- **Comportamiento**:
  - Parsea el HTML generado por el editor rico
  - Detecta los spans que contienen estilos de resaltado
  - Renderiza los elementos resaltados con el color de fondo apropiado

## Detalles Técnicos

### Aplicación del Resaltado
```javascript
const handleHighlightPress = () => {
  if (activeFormats.highlight) {
    // Desactivar resaltado
    richTextRef.current?.commandDOM(`
      document.execCommand("backColor", false, "inherit");
    `);
  } else {
    // Activar resaltado - usar color basado en el tema
    const highlightColor = isDarkMode ? "#D97706" : "yellow";
    richTextRef.current?.commandDOM(`
      document.execCommand("hiliteColor", false, "${highlightColor}");
    `);
  }
  setActiveFormats(prev => ({ ...prev, highlight: !prev.highlight }));
};
```

### Visualización del Resaltado
El sistema de visualización utiliza una expresión regular precisa para detectar elementos resaltados:

```javascript
// Expresión regular para encontrar spans con estilos de resaltado
const regex = /<span[^>]*background[^>]*>(.*?)<\/span>/gs;
```

Cuando se encuentra un span resaltado:
1. El texto antes y después del span se procesa por separado
2. El contenido dentro del span se envuelve en un componente `<Text>` con el estilo de fondo apropiado
3. Se mantiene la compatibilidad con la funcionalidad de búsqueda

### Manejo del Tema
La implementación respeta el modo claro/oscuro:
- **Modo claro**: Utiliza fondo `yellow` para el resaltado
- **Modo oscuro**: Utiliza fondo `#D97706` (naranja-ámbar) para mejor contraste

## Integración con Otras Funcionalidades

### Compatibilidad con Búsqueda
El sistema de visualización del resaltado es compatible con la funcionalidad de búsqueda. Cuando se está en modo búsqueda, el texto resaltado puede aparecer junto con texto que coincide con la búsqueda, ambos resaltados visualmente.

### Compatibilidad con Otros Formatos
La implementación no interfiere con otros formatos de texto como:
- Negrita (`<b>` o `<strong>`)
- Itálica (`<i>` o `<em>`)
- Encabezados (`<h1>`, `<h2>`, etc.)
- Texto tachado (`<s>`)

## Problemas Comunes y Soluciones

### Texto Tachado en Lugar de Resaltado
**Problema**: El texto resaltado aparece tachado en lugar de resaltado.
**Causa**: Implementaciones anteriores usaban `backColor` con ciertos comandos que podían interferir con otros estilos de texto.
**Solución**: Uso de `hiliteColor` y expresiones regulares más precisas para evitar conflictos.

### No Se Muestra el Resaltado en Vista de Lectura
**Problema**: El resaltado se aplica correctamente en edición pero no se visualiza en la vista de lectura.
**Causa**: Parser inadecuado que no detecta correctamente los spans de resaltado.
**Solución**: Implementación de un parser específico que busca patrones de resaltado usando la expresión regular `/<span[^>]*background[^>]*>(.*?)<\/span>/gs`.

## Ventajas del Enfoque Actual

1. **Separación de Concerns**: La lógica de edición y visualización están claramente separadas
2. **Compatibilidad con Temas**: Selecciona colores apropiados basados en el tema actual
3. **Integración con Búsqueda**: Funciona correctamente junto con la funcionalidad de búsqueda
4. **Rendimiento**: Uso de expresiones regulares eficientes para procesamiento de texto
5. **Mantenibilidad**: Código modular y bien estructurado

## Consideraciones Técnicas

- El resaltado se almacena como HTML con spans con estilos de fondo
- La implementación utiliza el editor rico `react-native-pell-rich-editor`
- El sistema de visualización no requiere modificar la estructura de datos de las notas
- La funcionalidad es completamente accesible y se integra con las herramientas de accesibilidad de React Native

## Flujo de Datos

1. El usuario presiona el botón de resaltado en la barra de herramientas
2. Se ejecuta `document.execCommand("hiliteColor", ...)` en el editor rico
3. El editor actualiza el contenido HTML
4. Al guardar la nota, el HTML con el resaltado se persiste
5. Al visualizar la nota, `renderRichContent()` detecta los spans de resaltado
6. Los spans se renderizan con el color de fondo apropiado basado en el tema