# 📱 GUÍA PASO A PASO: CREAR APP EN GOOGLE PLAY CONSOLE (2025)

**Fuente:** Documentación oficial de Google Play Console + Guías verificadas 2025
**Actualizado:** Octubre 2025
**Tiempo estimado:** 2-3 horas (+ 24-48h para verificación de cuenta)

---

## ⚠️ REQUISITOS PREVIOS IMPORTANTES (2025)

### 🚨 NUEVAS REGLAS DE GOOGLE (Desde Nov 2023)

Si creas una **cuenta personal** después del 13 de noviembre de 2023, **DEBES cumplir**:

1. **Prueba cerrada obligatoria:**
   - Mínimo **20 testers** (Google cambió de 12 a 20 en 2024)
   - Durante **14 días continuos**

2. **Verificación de identidad:**
   - Documento de identidad gubernamental (DNI, Pasaporte)
   - Proceso de verificación automático

3. **Verificación en 2 pasos:**
   - Configurar 2FA en tu cuenta de Google

4. **Dispositivo Android físico:**
   - Necesitas un dispositivo real para verificar
   - Debes usar la app móvil de Play Console

### ✅ Checklist Pre-Registro

Antes de empezar, asegúrate de tener:

- [ ] Cuenta de Google activa (Gmail)
- [ ] **$25 USD** para pago único (tarjeta de crédito/débito internacional)
- [ ] Documento de identidad válido (para verificación)
- [ ] Dispositivo Android físico (para verificación)
- [ ] Número de teléfono para 2FA
- [ ] Email de contacto para la app
- [ ] **AAB file listo** (FastNote-v1.0.0.aab)
- [ ] **Assets preparados:**
  - Feature Graphic (1024x500)
  - Mínimo 2 screenshots (1080x1920)
  - Privacy Policy URL

---

## 📋 PARTE 1: CREAR CUENTA DE DESARROLLADOR

### Paso 1.1: Acceder a Play Console

1. **Abre tu navegador** (Chrome recomendado)
2. Ve a: **https://play.google.com/console/signup**
3. **Inicia sesión** con tu cuenta de Google
   - Usa una cuenta de Gmail dedicada para desarrollo (recomendado)
   - O usa tu cuenta personal

### Paso 1.2: Tipo de Cuenta

Google te preguntará:

```
┌─────────────────────────────────────┐
│ ¿Qué tipo de cuenta quieres crear? │
├─────────────────────────────────────┤
│ ⚪ Personal                          │
│ ⚪ Organización                      │
└─────────────────────────────────────┘
```

**Para FastNote, selecciona:**
- ✅ **Personal** (si eres desarrollador individual)
- ✅ **Organización** (si tienes una empresa registrada)

**Recomendación:** Si eres solo tú, selecciona **Personal**.

### Paso 1.3: Aceptar Términos

Lee y acepta:

1. **Developer Distribution Agreement**
   - ✅ "He leído y acepto el Acuerdo de Distribución para Desarrolladores de Google Play"

2. **Leyes de Exportación de EE.UU.**
   - ✅ "Confirmo que cumplo con las leyes de exportación de EE.UU."

**⚠️ IMPORTANTE:** Lee estos documentos, son legalmente vinculantes.

### Paso 1.4: Pago de Registro

```
┌────────────────────────────────────┐
│  Tarifa de Registro                │
├────────────────────────────────────┤
│  Pago único: $25 USD               │
│                                    │
│  [ Agregar método de pago ]        │
└────────────────────────────────────┘
```

1. Haz clic en **"Agregar método de pago"**
2. Ingresa información de tu tarjeta:
   - Número de tarjeta
   - Fecha de vencimiento
   - CVV/CVC
   - Dirección de facturación
3. Haz clic en **"Pagar $25 USD"**

**💡 Nota:** Este pago es **único y para siempre**. Puedes publicar ilimitadas apps con esta cuenta.

### Paso 1.5: Información del Desarrollador

Completa tu perfil:

```
┌────────────────────────────────────────────┐
│ Nombre público del desarrollador:          │
│ [_________________________________]        │
│                                            │
│ Email de contacto:                         │
│ [_________________________________]        │
│                                            │
│ Sitio web (opcional):                      │
│ [_________________________________]        │
│                                            │
│ Dirección física (requerida):              │
│ País:        [_______________]             │
│ Calle:       [_______________]             │
│ Ciudad:      [_______________]             │
│ Código postal: [___________]               │
└────────────────────────────────────────────┘
```

**Ejemplo para FastNote:**
- **Nombre público:** Raúl Nicolás Agusto (o tu nombre/empresa)
- **Email:** tu-email@gmail.com
- **Sitio web:** https://github.com/raulnicolasagusto (opcional)
- **Dirección:** Tu dirección real (requerida)

**⚠️ Importante:** El nombre público aparecerá en Google Play Store.

### Paso 1.6: Verificación de Identidad (Solo Cuentas Personales)

Si seleccionaste "Personal", Google iniciará verificación automática:

1. **Sube documento de identidad:**
   - DNI, Pasaporte, o Licencia de conducir
   - Foto clara, todos los datos visibles

2. **Selfie de verificación:**
   - Google puede pedirte una selfie sosteniendo tu ID

3. **Espera aprobación:**
   - ⏱️ Tiempo: 24-48 horas (a veces hasta 7 días)
   - Recibirás email cuando esté lista

**Status mientras esperas:**
```
┌────────────────────────────────────────┐
│ ⏳ Verificación en progreso             │
│                                        │
│ Tu cuenta está siendo revisada.        │
│ Te notificaremos por email.            │
└────────────────────────────────────────┘
```

### Paso 1.7: Configurar Autenticación en 2 Pasos

**OBLIGATORIO desde 2023:**

1. Ve a: **https://myaccount.google.com/security**
2. Busca "Verificación en 2 pasos"
3. Haz clic en **"Activar"**
4. Sigue el asistente:
   - Opción 1: SMS a tu teléfono
   - Opción 2: App Google Authenticator
   - Opción 3: Llave de seguridad física

**Recomendación:** Usa **Google Authenticator** (más seguro).

---

## 📋 PARTE 2: CREAR NUEVA APLICACIÓN

### ⏸️ ESPERA: ¿Tu cuenta ya fue verificada?

**NO continúes** hasta que recibas el email de Google:

```
📧 Asunto: "Your Google Play Developer account is ready"
```

### Paso 2.1: Acceder al Dashboard

1. Ve a: **https://play.google.com/console**
2. Verás el **Dashboard principal**
3. En el menú izquierdo, haz clic en **"All apps"**
4. Haz clic en el botón **"Create app"** (esquina superior derecha)

```
┌────────────────────────────────────┐
│  📱 All apps                        │
├────────────────────────────────────┤
│                                    │
│  You don't have any apps yet.      │
│                                    │
│         [ Create app ]             │
└────────────────────────────────────┘
```

### Paso 2.2: Información Básica de la App

Aparecerá un formulario. Completa cada campo:

#### a) **App name** (Nombre de la app)

```
App name *
[FastNote____________________________]
                                 30/30
```

- **Máximo:** 30 caracteres
- **Ejemplo:** `FastNote`
- **Tip:** Este nombre aparece en Google Play Store

#### b) **Default language** (Idioma predeterminado)

```
Default language *
[▼ Spanish (Spain) - español (España)]
```

- **Para FastNote:** Selecciona `Spanish (Spain) - español (España)`
- **Alternativa:** `English (United States)` si prefieres inglés

**💡 Nota:** Puedes agregar más idiomas después.

#### c) **App or game** (¿App o juego?)

```
App or game *
⚪ App
⚪ Game
```

- **Para FastNote:** Selecciona **⚪ App**

#### d) **Free or paid** (¿Gratis o de pago?)

```
Free or paid *
⚪ Free
⚪ Paid
```

- **Para FastNote:** Selecciona **⚪ Free**

**⚠️ IMPORTANTE:** Una vez seleccionado "Free", **NO puedes** cambiarlo a "Paid" después. Si eliges "Paid", sí puedes cambiarlo a "Free" más adelante.

#### e) **Declarations** (Declaraciones)

Marca las casillas:

```
☐ I confirm that this app complies with the Google Play Program Policies *

☐ I confirm that this app complies with the export control and sanctions compliance requirements outlined in the US Export Laws *
```

✅ Marca ambas casillas.

**Lee antes de aceptar:**
- Google Play Program Policies: Reglas de contenido, privacidad, anuncios
- US Export Laws: Restricciones de exportación de software

### Paso 2.3: Crear la App

1. Revisa que todos los campos estén completos
2. El botón **"Create app"** debe estar activo (azul)
3. Haz clic en **"Create app"**

```
┌────────────────────────────────────┐
│                                    │
│         [ Create app ]             │
│                                    │
└────────────────────────────────────┘
```

**Resultado:**
```
✅ App created successfully!
```

Serás redirigido al **Dashboard de la app**.

---

## 📋 PARTE 3: CONFIGURAR EL DASHBOARD DE LA APP

Ahora verás el **Dashboard de tu app** con múltiples tareas por completar:

```
┌─────────────────────────────────────────────┐
│  FastNote                                   │
├─────────────────────────────────────────────┤
│  Set up your app                            │
│                                             │
│  ⚠️ 15 tasks remaining                      │
│                                             │
│  View tasks >                               │
└─────────────────────────────────────────────┘
```

### Paso 3.1: Entender las Tareas

Las tareas están organizadas en secciones:

1. **Dashboard** (Vista general)
2. **Testing** (Pruebas internas/cerradas/abiertas)
3. **Release** (Versiones en producción)
4. **Store presence** (Presencia en la tienda)
5. **Grow** (Crecimiento y marketing)
6. **Monetize** (Monetización)
7. **Policy** (Políticas y contenido de la app)

### Paso 3.2: Tareas OBLIGATORIAS

Estas **DEBES** completarlas antes de publicar:

#### 📝 **Set up > App access**

```
App access
Define if your app has restricted access or features
```

1. Haz clic en **"Start"**
2. Pregunta: *"All functionalities of my app are accessible without restrictions"*
   - ✅ Selecciona **"All or some functionality is restricted"** si tienes login
   - ✅ Selecciona **"All functionality is available without restrictions"** si NO tienes login

**Para FastNote:** Selecciona **"All functionality is available without restrictions"** (no requiere login)

3. Haz clic en **"Save"**

---

#### 📝 **Set up > Ads**

```
Ads
Declare if your app contains ads
```

1. Haz clic en **"Start"**
2. Pregunta: *"Does your app contain ads?"*
   - ✅ Sí (FastNote usa AdMob)

3. Selecciona **"Yes, my app contains ads"**
4. Haz clic en **"Save"**

**Resultado:** Tu app mostrará etiqueta "Contains ads" en Play Store.

---

#### 📝 **Policy > Content rating**

```
Content rating
Get your app rated by the International Age Rating Coalition (IARC)
```

**MUY IMPORTANTE:** Google **NO permite** apps sin clasificación de contenido.

1. Haz clic en **"Start questionnaire"**
2. **Email address:** Ingresa tu email
3. **App category:** Selecciona la categoría más apropiada

**Para FastNote:**
- Selecciona **"Utility, Productivity, Communication, or Other"**

4. **Completa el cuestionario:**

Las preguntas son del tipo:

```
Does your app depict or encourage:
- Violence? → ❌ No
- Sexual content? → ❌ No
- Profanity? → ❌ No
- Controlled substances? → ❌ No
```

**Para FastNote, responde NO a todo** (es una app de notas).

5. **Preguntas adicionales:**

```
Does your app allow users to:
- Communicate with each other? → ❌ No (FastNote no tiene chat)
- Share location? → ❌ No (FastNote no usa GPS)
- Make purchases? → ❌ No (por ahora, sin in-app purchases)
```

6. Haz clic en **"Calculate rating"**
7. Revisa las clasificaciones asignadas (PEGI, ESRB, etc.)
8. Haz clic en **"Apply rating"**

**Resultado:**
```
✅ Content rating: Everyone / PEGI 3 / E for Everyone
```

---

#### 📝 **Policy > Target audience**

```
Target audience and content
Specify your app's target age group
```

1. Haz clic en **"Start"**
2. **Target age group:**

```
Select all age groups you're targeting:
☐ Ages 5 and under
☐ Ages 6-8
☐ Ages 9-12
✅ Ages 13-17
✅ Ages 18 and over
```

**Para FastNote:** Selecciona solo:
- ✅ Ages 13-17
- ✅ Ages 18 and over

**⚠️ NO selecciones** "Ages 5 and under" a menos que tu app sea específicamente para niños.

3. **¿Tu app está diseñada para niños?**
   - ❌ **No, my app is not designed primarily for children**

4. Haz clic en **"Save"**

---

#### 📝 **Policy > App category**

```
App category
Select the category for your app
```

1. Haz clic en **"Start"**
2. Selecciona categoría:

**Para FastNote:**
- **Categoría principal:** `Productivity`
- **Categoría secundaria (opcional):** `Tools`

3. **Tags (opcional):**
   - Puedes agregar: `notes`, `AI`, `productivity`, `voice to text`, `OCR`

4. Haz clic en **"Save"**

---

#### 📝 **Policy > Privacy policy**

```
Privacy policy
Provide a link to your app's privacy policy
```

**OBLIGATORIO** si tu app:
- Accede a datos sensibles (cámara, micrófono, etc.) ✅ FastNote SÍ
- Maneja datos personales

1. Haz clic en **"Start"**
2. **Privacy policy URL:**

```
Privacy policy URL *
[https://raulnicolasagusto.github.io/fastnote-privacy-policy]
```

**💡 Si NO tienes Privacy Policy:**

Opción A: **Generar una gratis** (5 minutos)
- Ve a: https://www.privacypolicygenerator.info
- Completa el formulario
- Descarga HTML
- Sube a GitHub Pages o tu sitio web

Opción B: **Usar plantilla de Expo**
- Expo tiene una plantilla básica
- Personalízala con tus datos
- Súbela a un servidor público

3. Haz clic en **"Save"**

**⚠️ CRÍTICO:** La URL debe ser accesible públicamente. Google la verificará.

---

#### 📝 **Policy > Data safety**

```
Data safety
Inform users about how you collect, use, and share data
```

**NUEVA SECCIÓN (2022+):** Similar a las etiquetas de privacidad de Apple.

1. Haz clic en **"Start"**
2. **¿Recopilas datos del usuario?**

**Para FastNote:**
- ❌ **No, we don't collect any user data**

**Justificación:** FastNote guarda todo localmente en el dispositivo.

3. **¿Compartes datos con terceros?**

**IMPORTANTE:** Aunque FastNote no recopila datos, **AdMob SÍ recopila** datos.

- ✅ **Yes, we share data**

4. **Tipos de datos compartidos (por AdMob):**

Selecciona:
- ✅ **Device or other IDs** (identificadores de dispositivo)

5. **¿Para qué se usan estos datos?**
- ✅ **Advertising or marketing**
- ✅ **Analytics**

6. **¿Los datos se transfieren encriptados?**
- ✅ **Yes**

7. **¿Los usuarios pueden solicitar eliminación de datos?**
- ✅ **Yes** (Google/AdMob permite esto)

8. Haz clic en **"Save"** y luego **"Submit"**

---

#### 📝 **Policy > App content**

```
Government apps
Declare if your app is a government app
```

**Para FastNote:**
- ❌ **No, this is not a government app**

Simplemente haz clic en **"Save"**.

---

#### 📝 **Store presence > Main store listing**

```
Main store listing
Create your app's Play Store listing
```

**ESTA ES LA SECCIÓN MÁS IMPORTANTE.** Aquí defines cómo se ve tu app en Play Store.

1. Haz clic en **"Edit"**

##### a) **App name** (Título de la app)

```
App name
[FastNote____________________________]
                                 30/50
```

- **Máximo:** 50 caracteres
- Ya debería estar pre-llenado con "FastNote"

##### b) **Short description** (Descripción corta)

```
Short description *
[___________________________________________]
                                      0/80
```

**Para FastNote:**
```
Notas inteligentes con IA: voz a texto, OCR, recordatorios y más
```

(79 caracteres - perfecto)

##### c) **Full description** (Descripción completa)

```
Full description *
[________________________________________________
_________________________________________________
_________________________________________________]
                                        0/4000
```

**Usa la descripción completa** del archivo [PLAYSTORE_DEPLOYMENT_GUIDE.md](PLAYSTORE_DEPLOYMENT_GUIDE.md) sección "Full Description".

**Tip:** Incluye:
- ✨ Características principales (bullet points)
- 🎯 Beneficios para el usuario
- 🔒 Información de privacidad
- 📞 Contacto para soporte

##### d) **App icon** (Ícono de la app)

```
App icon *
512 x 512 PNG (32-bit)

[📁 Upload]
```

1. Haz clic en **"Upload"**
2. Selecciona tu ícono:
   - Exporta `assets/icon.png` a 512x512 si es necesario
   - **Formato:** PNG sin transparencia
   - **Tamaño:** 512 x 512 px

##### e) **Feature Graphic**

```
Feature graphic *
1024 x 500 JPEG or PNG

[📁 Upload]
```

1. Haz clic en **"Upload"**
2. Sube el archivo que creaste en Canva:
   - `assets/play-store/feature-graphic.png`
   - **Tamaño:** 1024 x 500 px

**⚠️ OBLIGATORIO:** Sin este gráfico, NO puedes publicar.

##### f) **Phone screenshots** (Capturas de pantalla)

```
Phone screenshots *
JPEG or PNG (16:9 or 9:16)
Minimum: 2, Maximum: 8

[📁 Upload screenshots]
```

1. Haz clic en **"Upload screenshots"**
2. Sube **mínimo 2 screenshots** (recomendado 4-6):
   - `assets/play-store/screenshots/screenshot-1.png`
   - `assets/play-store/screenshots/screenshot-2.png`
   - etc.

**Tamaños aceptados:**
- **Recomendado:** 1080 x 1920 px (9:16 portrait)
- **Alternativa:** 1920 x 1080 px (16:9 landscape)

**⚠️ Google las reordena automáticamente.** Arrastra para cambiar orden.

##### g) **Contact details** (Detalles de contacto)

```
Email *
[tu-email@gmail.com___________________]

Website (optional)
[https://github.com/raulnicolasagusto__]

Phone (optional)
[________________________________________]
```

- **Email:** Tu email de contacto (visible para usuarios)
- **Website:** Opcional (GitHub, sitio personal, etc.)
- **Phone:** Opcional (generalmente déjalo vacío)

##### h) **Save changes**

Scroll hasta abajo y haz clic en **"Save"**.

```
✅ Main store listing saved
```

---

### Paso 3.3: Revisar Tareas Completadas

Ve al **Dashboard** y verifica:

```
┌─────────────────────────────────────────────┐
│  Set up your app                            │
│                                             │
│  ✅ 9 tasks completed                       │
│  ⚠️ 6 tasks remaining                       │
└─────────────────────────────────────────────┘
```

**Tareas obligatorias completadas:**
- ✅ App access
- ✅ Ads declaration
- ✅ Content rating
- ✅ Target audience
- ✅ Privacy policy
- ✅ Data safety
- ✅ Main store listing

**Tareas pendientes (opcionales para testing):**
- ⏸️ Pricing & distribution (completar antes de producción)
- ⏸️ News app declaration (solo si es app de noticias)
- ⏸️ COVID-19 contact tracing (no aplica)

---

## 📋 PARTE 4: SUBIR EL AAB (ARCHIVO DE LA APP)

### Paso 4.1: Crear Track de Prueba

1. En el menú izquierdo, ve a **"Testing" > "Internal testing"**

```
┌─────────────────────────────────────────────┐
│  Internal testing                           │
│                                             │
│  Test your app with up to 100 testers      │
│                                             │
│         [ Create new release ]              │
└─────────────────────────────────────────────┘
```

2. Haz clic en **"Create new release"**

### Paso 4.2: Subir el AAB

```
┌─────────────────────────────────────────────┐
│  App bundles                                │
│                                             │
│  [ Upload ]                                 │
│                                             │
│  Or drag and drop AAB files here            │
└─────────────────────────────────────────────┘
```

1. Haz clic en **"Upload"**
2. Selecciona tu archivo:
   - `FastNote-v1.0.0.aab` (descargado de EAS Build)

3. **Espera a que se procese** (1-3 minutos)

**Verás:**
```
✅ FastNote-v1.0.0.aab uploaded successfully
   Version code: 1
   Version name: 1.0.0
   Min SDK: 21 (Android 5.0)
   Target SDK: 34 (Android 14)
```

### Paso 4.3: Agregar Release Notes

```
Release name (optional)
[1.0.0 (Internal Testing)_______________]

Release notes
┌────────────────────────────────────┐
│ Language: Spanish (Spain)          │
├────────────────────────────────────┤
│ [Versión inicial para pruebas___  │
│  internas.                         │
│  _________________________________]│
└────────────────────────────────────┘

[ + Add release notes in another language ]
```

**Ejemplo de Release Notes:**
```
Versión 1.0.0 - Prueba Interna

✨ Nuevas funciones:
• Notas de voz con IA (Whisper)
• OCR para extraer texto de imágenes
• Recordatorios inteligentes
• Listas y checklists
• Editor de texto enriquecido
• Temas claro y oscuro
• Multiidioma (ES, EN, PT)

Esta es una versión de prueba. Por favor reporta cualquier bug.
```

### Paso 4.4: Revisar y Lanzar

1. Scroll hasta abajo
2. Haz clic en **"Save"**
3. Revisa el resumen de la release
4. Haz clic en **"Review release"**

**Verás una pantalla de resumen:**
```
┌─────────────────────────────────────────────┐
│  Review release                             │
├─────────────────────────────────────────────┤
│  Version: 1.0.0                             │
│  Version code: 1                            │
│  Track: Internal testing                    │
│                                             │
│  ⚠️ Warnings: 0                             │
│  ❌ Errors: 0                               │
└─────────────────────────────────────────────┘
```

5. Si NO hay errores, haz clic en **"Start rollout to Internal testing"**

**Confirmación:**
```
⚠️ Are you sure you want to start the rollout?

Once you start, testers will be able to download
this version within a few hours.

[ Cancel ]  [ Start rollout ]
```

6. Haz clic en **"Start rollout"**

**Resultado:**
```
✅ Release started!

Processing... This may take a few minutes.
```

---

## 📋 PARTE 5: CONFIGURAR TESTERS

### Paso 5.1: Crear Lista de Email

1. Ve a **"Testing" > "Internal testing"**
2. Haz clic en la pestaña **"Testers"**
3. Haz clic en **"Create email list"**

```
┌─────────────────────────────────────────────┐
│  Create email list                          │
├─────────────────────────────────────────────┤
│  List name                                  │
│  [FastNote Beta Testers_____________]       │
│                                             │
│  Add email addresses (one per line)         │
│  ┌────────────────────────────────────┐    │
│  │ tester1@gmail.com                  │    │
│  │ tester2@gmail.com                  │    │
│  │ tester3@gmail.com                  │    │
│  │                                    │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

4. Haz clic en **"Save"**

### Paso 5.2: Obtener Link de Opt-In

Google generará un **link único** para que tus testers se registren:

```
┌─────────────────────────────────────────────┐
│  Opt-in URL                                 │
├─────────────────────────────────────────────┤
│  https://play.google.com/apps/internaltest/ │
│  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    │
│                                             │
│  [ Copy link ]                              │
└─────────────────────────────────────────────┘
```

**Copia este link.** Lo necesitarás para invitar a tus testers.

---

## 📋 PARTE 6: INVITAR TESTERS

### Plantilla de Email para Testers

Envía este email a tus testers:

```
Asunto: Invitación para probar FastNote (Beta)

¡Hola!

Te invito a probar FastNote, mi nueva app de notas con IA 🚀

📲 CÓMO UNIRTE:

1. Abre este link en tu dispositivo Android:
   https://play.google.com/apps/internaltest/xxxxxxxxx

2. Haz clic en "Become a Tester" / "Convertirse en evaluador"

3. Acepta los términos

4. Haz clic en "Download it on Google Play"

5. Instala la app normalmente desde Play Store

⚠️ IMPORTANTE:
• Debes usar el email de Google: tu-email@gmail.com
• La app aparecerá como "Internal test" en Play Store
• Puedes dejar feedback directamente desde Play Store
• Tienes 14 días para probar la app (requisito de Google)

📝 QUÉ PROBAR:
• Notas de voz con transcripción IA
• OCR (escaneo de texto desde imágenes)
• Recordatorios inteligentes
• Listas y checklists
• Todo lo que quieras!

🐛 REPORTAR BUGS:
Responde a este email o usa "Send feedback" en Play Store.

¡Muchas gracias por tu ayuda! 🙏

Saludos,
[Tu nombre]
```

---

## ✅ CHECKLIST FINAL

Antes de invitar testers, verifica que completaste:

### Configuración de la App
- [ ] App creada en Play Console
- [ ] App access configurado
- [ ] Ads declarado (Contains ads)
- [ ] Content rating completado
- [ ] Target audience configurado (13+)
- [ ] Privacy policy URL agregada
- [ ] Data safety completado
- [ ] Main store listing completo:
  - [ ] App name
  - [ ] Short description (80 chars)
  - [ ] Full description
  - [ ] App icon (512x512)
  - [ ] Feature graphic (1024x500)
  - [ ] Mínimo 2 screenshots
  - [ ] Email de contacto

### Release y Testing
- [ ] AAB subido a Internal testing
- [ ] Release notes agregadas
- [ ] Rollout iniciado (Status: Live)
- [ ] Lista de emails de testers creada
- [ ] Opt-in URL copiada
- [ ] Email de invitación enviado a testers

### Requisitos de Google 2025
- [ ] Cuenta verificada (ID gubernamental)
- [ ] 2FA activado
- [ ] Mínimo 20 testers agregados
- [ ] Plan de testing de 14 días

---

## 📊 TIEMPOS ESTIMADOS

| Tarea | Tiempo |
|-------|--------|
| Crear cuenta de desarrollador | 15-20 min |
| Esperar verificación de Google | 24-48 horas |
| Completar configuración de app | 1-2 horas |
| Subir AAB | 5-10 min |
| Procesamiento de Google | 5-15 min |
| Configurar testers | 10-15 min |
| **TOTAL (sin esperas)** | **~2-3 horas** |

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

### Error 1: "Create app button is disabled"

**Causa:** Falta completar algún campo obligatorio.

**Solución:**
- Verifica que llenaste: App name, Language, App/Game, Free/Paid
- Marca ambas casillas de Declarations

---

### Error 2: "You must complete content rating"

**Causa:** No completaste el cuestionario de clasificación.

**Solución:**
- Ve a Policy > Content rating
- Completa el cuestionario IARC
- Haz clic en "Apply rating"

---

### Error 3: "Upload failed: Invalid AAB"

**Posibles causas:**
1. Archivo AAB corrupto
2. Versión code duplicado
3. Firma inválida

**Solución:**
- Regenera el AAB con EAS Build
- Incrementa versionCode en app.json
- Verifica que usaste `--profile production`

---

### Error 4: "Testers can't see the app"

**Causa:** No aceptaron la invitación o la release no está "Live".

**Solución:**
1. Verifica que la release esté en status **"Live"** (no "Processing")
2. Confirma que el tester hizo clic en "Become a Tester"
3. Espera 10-15 minutos para que Play Store actualice
4. El tester debe buscar "FastNote" en Play Store usando el mismo email

---

## 📞 RECURSOS ADICIONALES

### Documentación Oficial
- **Play Console Help:** https://support.google.com/googleplay/android-developer
- **Create and set up your app:** https://support.google.com/googleplay/android-developer/answer/9859152

### Herramientas Útiles
- **Privacy Policy Generator:** https://www.privacypolicygenerator.info
- **Screenshot Mockup:** https://mockuphone.com
- **Feature Graphic Template:** Canva > "Google Play Feature Graphic"

### Comunidades de Soporte
- **Expo Discord:** https://chat.expo.dev
- **Stack Overflow:** Tag `google-play-console`
- **Reddit:** r/androiddev

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE CREAR LA APP

1. **Espera a que testers instalen** (primeros días)
2. **Recopila feedback** (bugs, sugerencias)
3. **Itera y mejora** (sube nuevas versiones)
4. **Completa 14 días de testing** (requisito de Google)
5. **Prepara para producción:**
   - Integrar RevenueCat (suscripciones)
   - Finalizar assets de marketing
   - Preparar estrategia de lanzamiento
6. **Mover a producción** cuando estés listo

---

**¡Buena suerte con tu app! 🚀**

**Última actualización:** Octubre 2025
**Basado en:** Documentación oficial de Google Play Console 2025
