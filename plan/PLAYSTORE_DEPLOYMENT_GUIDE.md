# 🚀 GUÍA COMPLETA: SUBIR FASTNOTE A GOOGLE PLAY STORE

**Fecha:** Octubre 2025
**Versión de la App:** 1.0.0
**Tipo de Release:** Prueba Cerrada (Closed Testing) para Testers
**Tiempo Estimado:** 30-45 minutos

---

## 📋 ÍNDICE

1. [Pre-requisitos](#pre-requisitos)
2. [Preparación de Assets](#preparación-de-assets)
3. [Configuración Final del Proyecto](#configuración-final-del-proyecto)
4. [Build de Producción con EAS](#build-de-producción-con-eas)
5. [Crear Cuenta de Google Play Console](#crear-cuenta-de-google-play-console)
6. [Configurar la App en Play Console](#configurar-la-app-en-play-console)
7. [Subir el AAB](#subir-el-aab)
8. [Configurar Prueba Cerrada](#configurar-prueba-cerrada)
9. [Invitar Testers](#invitar-testers)
10. [Troubleshooting](#troubleshooting)

---

## ✅ PRE-REQUISITOS

### 1. Cuenta de Google Play Console
- [ ] Cuenta de Google activa
- [ ] **$25 USD** para registro único (tarjeta de crédito/débito)
- [ ] Cuenta verificada (puede tardar hasta 48 horas)

### 2. Herramientas Instaladas
- [ ] **Node.js** 16+ instalado
- [ ] **EAS CLI** instalado: `npm install -g eas-cli`
- [ ] **Expo account** activa (raulnicolasagusto)

### 3. Estado del Proyecto
- [ ] Código actualizado en última versión
- [ ] APIs protegidas con Cloudflare Workers ✅
- [ ] Pruebas locales completadas
- [ ] Sin errores de TypeScript

---

## 🎨 PREPARACIÓN DE ASSETS

### 1. Ícono de la App (REQUIRED)

**Estado actual:** ✅ Ya tienes `/assets/icon.png`

**Verificar:**
- Tamaño: **1024x1024 px**
- Formato: PNG (sin transparencia para Android)
- Fondo: Color sólido (actualmente blanco)

Si necesitas actualizar:
```bash
# Reemplaza el archivo en:
assets/icon.png
```

### 2. Feature Graphic (REQUIRED para Play Store)

**¿Qué es?** Banner horizontal que aparece en la parte superior de tu página en Play Store.

**Especificaciones:**
- Tamaño: **1024 x 500 px**
- Formato: PNG o JPEG
- Contenido: Logo + texto descriptivo

**Crear con Canva (recomendado):**
1. Ve a: https://www.canva.com
2. Busca "Google Play Feature Graphic" (plantilla predefinida)
3. Agrega:
   - Logo de FastNote
   - Texto: "FastNote - Notas Inteligentes con IA"
   - Colores de tu branding
4. Descargar como PNG

**Guardar en:** `assets/play-store/feature-graphic.png`

### 3. Screenshots (REQUIRED - Mínimo 2)

**Especificaciones:**
- Tamaño recomendado: **1080 x 1920 px** (9:16 portrait)
- Formato: PNG o JPEG
- Cantidad: Mínimo 2, máximo 8

**¿Qué capturar?**
1. **Pantalla principal** con lista de notas
2. **Editor de nota** con rich text
3. **Nota de voz** (modal de grabación)
4. **OCR en acción** (captura de texto desde imagen)
5. **Checklist** con items completados
6. **Recordatorios** programados

**Cómo tomarlos:**
1. Ejecuta la app en tu dispositivo Android
2. Toma screenshots con **Vol Down + Power**
3. O usa emulador Android Studio (más control)

**Opcional - Mejorar screenshots:**
- Usa **MockUPhone** (https://mockuphone.com) para agregar marco de dispositivo
- Usa **Canva** para agregar textos descriptivos

**Guardar en:** `assets/play-store/screenshots/`

### 4. Descripción de la App

**Short Description (80 caracteres max):**
```
Notas inteligentes con IA: voz a texto, OCR, recordatorios y más
```

**Full Description (4000 caracteres max):**
```
📝 FastNote - Tu Asistente de Notas con Inteligencia Artificial

FastNote es la aplicación de notas definitiva que combina simplicidad con tecnología de IA para capturar tus ideas de forma rápida y eficiente.

✨ CARACTERÍSTICAS PRINCIPALES:

🎤 NOTAS DE VOZ CON IA
• Transcripción automática usando Whisper de OpenAI
• Detección inteligente de listas vs texto normal
• Recordatorios por comandos de voz
• Ejemplo: "Lista de compras: leche, pan. Recuérdame mañana a las 9am"

📸 OCR - RECONOCIMIENTO DE TEXTO
• Extrae texto de imágenes con IA
• Captura desde cámara o galería
• Transcripción directa a la nota
• Perfecto para documentos, pizarras, recetas

✅ LISTAS Y CHECKLISTS
• Crea listas por voz o texto
• Marca items completados con un toque
• Agrega items con comandos de voz
• Modo mixto: texto + checklist en una nota

⏰ RECORDATORIOS INTELIGENTES
• Programa recordatorios por voz
• Detección automática de fecha/hora
• Notificaciones exactas y confiables
• Ejemplo: "Avisar hoy a las 3pm"

🎨 EDITOR DE TEXTO ENRIQUECIDO
• Encabezados H1, H2, H3
• Texto en negrita
• Resaltado de texto
• Colores de fondo personalizables

🎙️ GRABACIÓN Y TRANSCRIPCIÓN DE AUDIO
• Graba reuniones largas
• Transcribe con IA directamente en la nota
• Reproductor integrado
• Audio adjunto a cada nota

📁 ORGANIZACIÓN AVANZADA
• Carpetas personalizadas
• Notas fijadas (pinned)
• Notas bloqueadas para privacidad
• Búsqueda potente por contenido y fecha

🌙 TEMAS CLARO Y OSCURO
• Modo oscuro para tus ojos
• Cambio automático
• Colores personalizados por nota

🌍 MULTIIDIOMA
• Español, Inglés, Portugués
• Detección automática del idioma del dispositivo
• Traducciones completas

📤 COMPARTIR Y EXPORTAR
• Comparte como texto o imagen
• Exporta notas completas
• Compatible con todas las apps

🔒 PRIVACIDAD Y SEGURIDAD
• Tus datos permanecen en tu dispositivo
• Sin registro requerido
• API keys protegidas con Cloudflare Workers
• Notas bloqueadas con protección adicional

💡 CASOS DE USO:

• Estudiantes: Notas de clase, transcribe pizarrones con OCR
• Profesionales: Reuniones, listas de tareas, recordatorios importantes
• Hogar: Listas de compras, recetas, ideas rápidas
• Creativos: Captura ideas al instante por voz

🚀 TECNOLOGÍA DE PUNTA:

• IA de OpenAI (Whisper + GPT-4)
• Deepgram para transcripción rápida
• OCR.space para reconocimiento de texto
• React Native + Expo para rendimiento nativo

📲 DESCARGA FASTNOTE AHORA Y TRANSFORMA TU FORMA DE TOMAR NOTAS

¿Preguntas o sugerencias? Contáctanos en support@fastnote.app
```

**Privacy Policy URL (REQUIRED):**
Si no tienes, genera una en: https://www.privacypolicygenerator.info

Por ahora puedes usar placeholder:
```
https://raulnicolasagusto.github.io/fastnote-privacy-policy
```

### 5. Checklist de Assets Completo

Antes de continuar, asegúrate de tener:
- [ ] Icon.png (1024x1024) ✅
- [ ] Feature Graphic (1024x500)
- [ ] Mínimo 2 screenshots (1080x1920)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Privacy Policy URL

---

## ⚙️ CONFIGURACIÓN FINAL DEL PROYECTO

### 1. Verificar `app.json`

Tu configuración actual está correcta ✅. Verificar estos campos:

```json
{
  "expo": {
    "name": "FastNote",
    "version": "1.0.0",
    "android": {
      "package": "com.raulnicolasagusto.fastnote",
      "versionCode": 1,  // Se auto-incrementa con EAS
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.POST_NOTIFICATIONS",
        "android.permission.SCHEDULE_EXACT_ALARM",
        "android.permission.USE_EXACT_ALARM",
        "android.permission.WAKE_LOCK",
        "android.permission.VIBRATE"
      ]
    }
  }
}
```

**Si necesitas ajustar algo:**
- `version`: Versión semántica (1.0.0 está bien para primer release)
- `versionCode`: Se incrementa automáticamente con `autoIncrement: true` en eas.json ✅

### 2. Verificar `eas.json`

Tu configuración actual:

```json
{
  "build": {
    "production": {
      "autoIncrement": true  // ✅ Auto-incrementa versionCode
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Perfecto!** No necesitas cambiar nada.

### 3. Verificar Variables de Entorno

**IMPORTANTE:** Las API keys ya están protegidas en Cloudflare Workers ✅

**Verificar que NO existen en el código:**
```bash
# Buscar referencias a API keys (no debería encontrar nada en código público)
grep -r "EXPO_PUBLIC_OPENAI_API_KEY" app/ components/ --exclude-dir=node_modules
grep -r "EXPO_PUBLIC_DEEPGRAM_API_KEY" app/ components/ --exclude-dir=node_modules
```

Si encuentras alguna, elimínala antes del build.

### 4. Limpiar Proyecto

```bash
# Limpiar cachés
npx expo start -c

# Eliminar carpetas de build previas (si existen)
rm -rf android/
rm -rf ios/

# Limpiar node_modules (opcional pero recomendado)
rm -rf node_modules/
npm install
```

---

## 🏗️ BUILD DE PRODUCCIÓN CON EAS

### 1. Login a EAS

```bash
eas login
# Usar cuenta: raulnicolasagusto
```

### 2. Configurar Build Profile (opcional)

Si quieres un profile específico para Play Store, edita `eas.json`:

```json
{
  "build": {
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "aab"  // Android App Bundle (recomendado por Google)
      }
    }
  }
}
```

### 3. Iniciar Build de Producción

```bash
eas build --platform android --profile production
```

**¿Qué hace este comando?**
1. Sube tu código a servidores de EAS
2. Compila la app en formato AAB (Android App Bundle)
3. Firma automáticamente con keystore de EAS
4. Te devuelve un link para descargar el AAB

**Tiempo estimado:** 10-20 minutos

### 4. Esperar a que Complete

Verás algo como:
```
✔ Build complete!
  https://expo.dev/accounts/raulnicolasagusto/projects/fastnote/builds/abc123...
```

**Descargar el AAB:**
1. Abre el link en tu navegador
2. Haz clic en "Download" para obtener el archivo `.aab`
3. Guarda como: `FastNote-v1.0.0.aab`

### 5. Verificar el Build (opcional)

```bash
# Si tienes bundletool instalado, puedes inspeccionar el AAB
java -jar bundletool.jar validate --bundle=FastNote-v1.0.0.aab
```

---

## 🎯 CREAR CUENTA DE GOOGLE PLAY CONSOLE

### 1. Registro Inicial

1. Ve a: **https://play.google.com/console/signup**
2. Inicia sesión con tu cuenta de Google
3. Acepta términos y condiciones
4. **Paga $25 USD** (registro único de por vida)
5. Completa información de desarrollador:
   - Nombre: Raúl Nicolás Agusto (o tu nombre/empresa)
   - Email de contacto
   - Sitio web (opcional): Puedes omitir o usar GitHub
   - Dirección física (requerida)

### 2. Verificación de Cuenta

Google puede tomar **hasta 48 horas** para verificar tu cuenta. Recibirás un email cuando esté lista.

---

## 📱 CONFIGURAR LA APP EN PLAY CONSOLE

### 1. Crear Nueva Aplicación

1. Entra a: **https://play.google.com/console**
2. Haz clic en **"Crear aplicación"**
3. Completa el formulario:
   - **Nombre de la app:** FastNote
   - **Idioma predeterminado:** Español (España)
   - **Tipo de app:** Aplicación
   - **Gratis o de pago:** Gratis
   - **Declaraciones:**
     - ✅ Declaro que esta aplicación cumple con las Políticas del Programa para Desarrolladores
     - ✅ Declaro que esta aplicación cumple con las leyes de exportación de EE.UU.

4. Haz clic en **"Crear aplicación"**

### 2. Configurar Ficha de Play Store

**Ir a:** Panel de control > Presencia en Play Store > Ficha de Play Store principal

#### a) Detalles de la App

- **Nombre de la app:** FastNote
- **Descripción breve:** (80 caracteres)
  ```
  Notas inteligentes con IA: voz a texto, OCR, recordatorios y más
  ```
- **Descripción completa:** (Pegar la descripción larga de arriba)

#### b) Recursos Gráficos

**Subir:**
1. **Ícono de la app** (512x512 px):
   - Exporta `assets/icon.png` a 512x512 si es necesario

2. **Gráfico destacado** (1024x500 px):
   - Sube `assets/play-store/feature-graphic.png`

3. **Screenshots de teléfono** (mínimo 2):
   - Sube tus screenshots de `assets/play-store/screenshots/`

#### c) Categorización

- **Categoría:** Productividad
- **Tags (opcional):** notas, IA, productividad, voz a texto, OCR

#### d) Información de Contacto

- **Correo electrónico:** tu-email@example.com
- **Sitio web (opcional):** https://github.com/raulnicolasagusto
- **Teléfono (opcional):** Dejar vacío

#### e) Política de Privacidad

- **URL:** https://raulnicolasagusto.github.io/fastnote-privacy-policy
  (O la URL que hayas generado)

**Guardar cambios**

### 3. Configurar Clasificación de Contenido

**Ir a:** Panel de control > Configuración de la app > Clasificación de contenido

1. Haz clic en **"Iniciar cuestionario"**
2. **Categoría de la app:** Utilidad, Productividad u Organización
3. **Responde el cuestionario:**
   - ¿La app contiene violencia? **No**
   - ¿La app contiene contenido sexual? **No**
   - ¿La app contiene lenguaje inapropiado? **No**
   - ¿La app permite comunicación entre usuarios? **No**
   - ¿La app comparte ubicación del usuario? **No**
4. **Enviar cuestionario**

### 4. Configurar Público Objetivo

**Ir a:** Panel de control > Configuración de la app > Público objetivo y contenido

1. **Público objetivo:**
   - ✅ Mayores de 13 años
   - ❌ Diseñada específicamente para niños

2. **Guardar**

### 5. Configurar Acceso a la App (solo si tienes login)

**Ir a:** Panel de control > Configuración de la app > Acceso a la app

- Selecciona: **"Toda o parte de la funcionalidad de mi app está disponible sin iniciar sesión ni registrarse"**
- FastNote no requiere login ✅

### 6. Completar Declaración sobre Anuncios

**Ir a:** Panel de control > Configuración de la app > Anuncios

- **¿Tu app contiene anuncios?** ✅ Sí (tienes AdMob integrado)
- Marca: Google AdMob

**Guardar**

### 7. Configurar Seguridad de Datos

**Ir a:** Panel de control > Configuración de la app > Seguridad de datos

**Datos recopilados:**
1. ¿Recopilas datos del usuario? **No** (FastNote no envía datos a servidor)

**Datos compartidos:**
1. ¿Compartes datos con terceros? **Sí** (AdMob recopila datos de analytics)
   - Selecciona: Identificadores de dispositivo (para anuncios)
   - Propósito: Análisis y publicidad

**Guardar y enviar**

---

## 📤 SUBIR EL AAB

### 1. Crear Track de Prueba Cerrada

**Ir a:** Panel de control > Versiones > Prueba cerrada

1. Haz clic en **"Crear versión nueva"**
2. **Seleccionar track:** Prueba interna (Internal testing)
   - **Internal testing:** Hasta 100 testers, sin revisión de Google (más rápido)
   - **Closed testing:** Testers ilimitados, con revisión de Google (1-2 días)

**Recomendación:** Empieza con **Internal testing** para probar rápido.

### 2. Subir el AAB

1. Arrastra o sube el archivo `FastNote-v1.0.0.aab`
2. Espera a que se procese (1-2 minutos)
3. Google validará automáticamente el bundle

### 3. Agregar Nombre de la Versión

- **Nombre de la versión:** 1.0.0 (Beta)
- **Notas de la versión (opcional):**
  ```
  Versión inicial de FastNote para pruebas internas:

  ✨ Nuevas funciones:
  • Notas de voz con IA (Whisper)
  • OCR para extraer texto de imágenes
  • Recordatorios inteligentes
  • Listas y checklists
  • Grabación y transcripción de audio
  • Editor de texto enriquecido
  • Carpetas y organización
  • Temas claro y oscuro
  • Multiidioma (ES, EN, PT)

  🔧 Características técnicas:
  • AdMob integrado
  • API keys protegidas con Cloudflare Workers
  • Rendimiento optimizado
  ```

### 4. Guardar y Revisar

1. Haz clic en **"Guardar"**
2. Revisa que todo esté completo
3. Haz clic en **"Revisar versión"**

### 5. Iniciar Lanzamiento

1. Revisa el resumen final
2. Haz clic en **"Iniciar lanzamiento a prueba interna"**
3. Confirma

**Estado:** Tu app ahora estará en "Procesando" durante 1-5 minutos.

---

## 👥 INVITAR TESTERS

### 1. Crear Lista de Testers

**Ir a:** Panel de control > Versiones > Prueba interna > Pestaña "Testers"

1. Haz clic en **"Crear lista de correos electrónicos"**
2. **Nombre de la lista:** FastNote Beta Testers
3. **Agregar emails:**
   ```
   tester1@gmail.com
   tester2@gmail.com
   tester3@gmail.com
   ...
   ```
4. **Guardar**

### 2. Compartir Link de Opt-In

Después de crear la lista, Google te dará un **link de opt-in**:

```
https://play.google.com/apps/internaltest/xxxxxxxxxxxxxxxxx
```

**Envía este link a tus testers con estas instrucciones:**

```
¡Hola!

Te invito a probar FastNote, mi nueva app de notas con IA 🚀

Para unirte a las pruebas:

1. Abre este link en tu dispositivo Android:
   https://play.google.com/apps/internaltest/xxxxxxxxxxxxxxxxx

2. Haz clic en "Become a Tester" / "Unirse a las pruebas"

3. Acepta los términos

4. Haz clic en "Download it on Google Play" / "Descargar en Google Play"

5. Instala la app normalmente desde Play Store

⚠️ IMPORTANTE:
• Usa el mismo email de Google con el que te registré
• La app aparecerá como "Internal test" en Play Store
• Puedes dejar feedback directamente desde Play Store

¿Preguntas? Responde a este email.

¡Gracias por probar FastNote! 🙏
```

### 3. Verificar Instalaciones

**Ir a:** Panel de control > Versiones > Prueba interna > Estadísticas

Verás:
- Testers activos
- Instalaciones
- Errores reportados

---

## 🔍 TROUBLESHOOTING

### Problema 1: "Build failed" en EAS

**Síntomas:**
```
❌ Build failed
Error: ...
```

**Soluciones:**
1. Lee el log completo del error
2. Errores comunes:
   - **TypeScript errors:** Arregla errores con `npm run lint`
   - **Missing dependencies:** Ejecuta `npm install`
   - **Incorrect config:** Revisa `app.json` y `eas.json`

3. Intenta de nuevo:
   ```bash
   eas build --platform android --profile production --clear-cache
   ```

---

### Problema 2: "AAB is not valid" en Play Console

**Síntomas:**
Google rechaza tu AAB al subirlo.

**Soluciones:**
1. Verifica que descargaste el archivo completo
2. No edites el AAB manualmente
3. Usa solo AAB generado por EAS
4. Si el error persiste, regenera el build

---

### Problema 3: Testers no pueden instalar la app

**Síntomas:**
Testers reportan que no ven la app en Play Store.

**Soluciones:**
1. **Verifica que el lanzamiento esté completo:**
   - Status debe ser "Available" no "Processing"

2. **Verifica que el tester aceptó la invitación:**
   - Debe hacer clic en "Become a Tester" primero

3. **Verifica el email:**
   - El tester debe usar el mismo email de Google con el que fue invitado

4. **Espera 10-15 minutos:**
   - A veces Play Store tarda en actualizar

---

### Problema 4: AdMob no muestra anuncios

**Síntomas:**
Los banners e interstitials no se muestran en la app.

**Soluciones:**
1. **En pruebas internas, usa Test IDs:**
   - Los anuncios reales solo se activan en producción

2. **Verifica configuración de AdMob:**
   - App ID correcto en `app.json`
   - Unidades de anuncios creadas en dashboard de AdMob

3. **Espera 24-48 horas:**
   - AdMob puede tardar en activarse después del primer release

---

### Problema 5: Permisos no funcionan

**Síntomas:**
Cámara, micrófono o notificaciones no funcionan.

**Soluciones:**
1. **Verifica `app.json`:**
   - Todos los permisos deben estar declarados

2. **Reinstala la app:**
   - A veces los permisos no se actualizan con updates

3. **Verifica en Configuración:**
   - Android > Configuración > Apps > FastNote > Permisos
   - Otorga manualmente los permisos

---

## 📊 CHECKLIST FINAL

Antes de compartir con testers:

- [ ] App compilada exitosamente con EAS
- [ ] AAB subido a Play Console
- [ ] Ficha de Play Store completa (descripción, imágenes, screenshots)
- [ ] Clasificación de contenido completada
- [ ] Seguridad de datos configurada
- [ ] Track de prueba interna creado
- [ ] Lanzamiento iniciado (Status: Available)
- [ ] Lista de testers creada
- [ ] Link de opt-in compartido con testers
- [ ] Primera instalación exitosa verificada

---

## 📈 PRÓXIMOS PASOS DESPUÉS DE TESTING

### Fase 1: Testing Interno (1-2 semanas)
- Recibir feedback de testers
- Arreglar bugs críticos
- Iterar con nuevas versiones (incrementa versionCode)

### Fase 2: Closed Testing / Open Testing (2-4 semanas)
- Expandir a más testers
- Ajustar descripciones y screenshots según feedback
- Medir métricas de retención y crashes

### Fase 3: Preparar para Producción
- Integrar **RevenueCat** para suscripciones
- Finalizar política de privacidad
- Preparar estrategia de marketing
- Crear assets promocionales adicionales

### Fase 4: Producción (Launch oficial)
- Mover de "Prueba cerrada" a "Producción"
- Publicar en múltiples países
- Activar campañas de marketing
- Monitorear reviews y ratings

---

## 🆘 RECURSOS Y SOPORTE

### Documentación Oficial
- **Google Play Console:** https://support.google.com/googleplay/android-developer
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **Expo Submit:** https://docs.expo.dev/submit/introduction/

### Comunidades de Ayuda
- **Expo Discord:** https://chat.expo.dev
- **Stack Overflow:** Tag `expo` o `react-native`
- **Reddit:** r/reactnative

### Contacto
Si tienes problemas específicos con FastNote:
- Email: tu-email@example.com
- GitHub Issues: https://github.com/raulnicolasagusto/fastnote/issues

---

**¡Buena suerte con el lanzamiento! 🚀**

**Última actualización:** Octubre 2025
**Mantenido por:** FastNote Development Team
