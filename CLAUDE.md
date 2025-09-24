# FastNote - Claude Development Notes

## Comandos Útiles

### Desarrollo
- `npm start` - Iniciar el servidor de desarrollo Expo
- `npm run lint` - Ejecutar ESLint para verificar el código
- `npm run typecheck` - Ejecutar verificación de tipos con TypeScript

### Testing
- `npm test` - Ejecutar tests (si están configurados)

## Características Principales

### Funcionalidades Implementadas
1. **Sistema de Temas**: Cambio dinámico entre tema claro y oscuro
2. **OCR con Cámara**: Reconocimiento de texto usando OCR.space API
3. **Notas de Voz**: Grabación y transcripción con OpenAI Whisper API
4. **Búsqueda**: Búsqueda en tiempo real por título, contenido, fechas y items de checklist
5. **Checklist**: Creación y gestión de listas de tareas
6. **Categorías**: Sistema de categorización con colores
7. **Persistencia**: Almacenamiento local con AsyncStorage

### APIs Utilizadas
- **OCR.space**: Para reconocimiento óptico de caracteres (25,000 requests gratis/mes)
- **OpenAI Whisper**: Para transcripción de audio a texto

### Arquitectura
- **State Management**: Zustand con persistencia AsyncStorage
- **Navigation**: Expo Router
- **Componentes**: React Native con TypeScript
- **Temas**: Sistema dinámico con LIGHT_COLORS y DARK_COLORS

## Notas Técnicas

### Compatibilidad
- Compatible con Expo managed workflow
- No utiliza módulos nativos que requieren compilación custom
- Todas las dependencias son compatibles con React Native y Expo

### Estructura del Proyecto
```
app/              # Pantallas principales (Expo Router)
components/       # Componentes reutilizables
store/           # Estados globales (Zustand)
constants/       # Constantes y temas
types/           # Definiciones TypeScript
utils/           # Utilidades y servicios
```

### Variables de Entorno
- `EXPO_PUBLIC_OPENAI_API_KEY`: Clave API de OpenAI para Whisper
- `EXPO_PUBLIC_HUGGING_FACE_API_KEY`: (Opcional) Para futuras implementaciones

## REGLAS CRÍTICAS DE DESARROLLO

### ❌ NO HACER CÓDIGO BASURA
- **NUNCA cambiar patrones que ya funcionan sin una razón técnica sólida**
- **NUNCA hacer cambios masivos innecesarios que generen más problemas**
- **SIEMPRE pensar antes de cambiar: ¿Por qué no arreglar COLORS para que funcione en vez de cambiar toda la base de código?**
- **NUNCA desperdiciar tokens haciendo refactoring innecesario**

### ❌ NO LEVANTAR SERVIDORES LOCALHOST
- **NUNCA ejecutar npm start u otros comandos que levanten servidores**
- **El usuario ha sido explícito sobre esto múltiples veces**

### ✅ RAZONAMIENTO EFICIENTE
- **Antes de hacer cambios masivos, considerar si hay una solución más simple**
- **En lugar de migrar de COLORS a colors, podría haberse arreglado COLORS directamente**
- **Priorizar soluciones que no rompan código existente**

## Correcciones Recientes

### Sistema de Temas (Implementado - PERO MAL EJECUTADO)
- Migración INNECESARIA de `COLORS` estático a sistema dinámico
- Cambios masivos que tomaron demasiado tiempo y recursos
- StatusBar adaptativo según el tema
- Persistencia del tema seleccionado
- **LECCIÓN: Debió haberse arreglado COLORS directamente en vez de cambiar todo**

### OCR Implementation
- Removido Tesseract.js (incompatible con React Native)
- Implementado OCR.space API (compatible con Expo)
- Conversión de imágenes a base64 con Expo FileSystem v54

### Notas de Voz
- Integración completa con OpenAI Whisper API
- Detección automática de listas vs texto normal
- Creación automática de checklists desde comandos de voz