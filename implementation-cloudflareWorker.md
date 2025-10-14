# 🔒 GUÍA DE IMPLEMENTACIÓN: CLOUDFLARE WORKERS PARA PROTEGER API KEYS

**Fecha de creación:** Octubre 2025
**Propósito:** Proteger API keys de terceros en aplicaciones React Native/Expo
**Tiempo estimado:** 15-20 minutos
**Costo:** 100% GRATIS (hasta 100,000 requests/día)

---

## 📋 ÍNDICE

1. [¿Por qué Cloudflare Workers?](#por-qué-cloudflare-workers)
2. [Pre-requisitos](#pre-requisitos)
3. [Paso 1: Crear Cuenta en Cloudflare](#paso-1-crear-cuenta-en-cloudflare)
4. [Paso 2: Instalar Wrangler CLI](#paso-2-instalar-wrangler-cli)
5. [Paso 3: Crear Proyecto Worker](#paso-3-crear-proyecto-worker)
6. [Paso 4: Configurar Código del Worker](#paso-4-configurar-código-del-worker)
7. [Paso 5: Login a Cloudflare](#paso-5-login-a-cloudflare)
8. [Paso 6: Configurar Secrets (API Keys)](#paso-6-configurar-secrets-api-keys)
9. [Paso 7: Deploy del Worker](#paso-7-deploy-del-worker)
10. [Paso 8: Actualizar Código React Native](#paso-8-actualizar-código-react-native)
11. [Paso 9: Testing](#paso-9-testing)
12. [Paso 10: Mantenimiento](#paso-10-mantenimiento)
13. [Troubleshooting](#troubleshooting)

---

## 🤔 ¿Por qué Cloudflare Workers?

### ❌ **Problema:**
- Las API keys en apps móviles (React Native, Flutter, etc.) **pueden ser extraídas** del APK/IPA
- Cualquier usuario puede descompilar la app y obtener tus keys
- Riesgo de **abuso y cargos inesperados** en tu cuenta

### ✅ **Solución:**
- **Backend proxy** que guarda las API keys de forma segura
- Las keys **NUNCA están en el código de la app**
- El usuario solo puede hacer requests a TU servidor (Worker)
- Tu servidor valida y reenvía el request a las APIs de terceros

### 🏆 **Por qué Cloudflare Workers vs otras opciones:**

| Característica | Cloudflare Workers | Firebase Functions | Vercel | AWS Lambda |
|----------------|-------------------|-------------------|--------|------------|
| **Requests gratis/mes** | 3,000,000 | 2,000,000 | ~1,000,000 | 1,000,000 |
| **Requiere tarjeta crédito** | ❌ No | ✅ Sí | ❌ No | ✅ Sí |
| **Cold starts** | ❌ No (0ms) | ✅ Sí (1-3s) | ⚠️ Mínimos | ✅ Sí |
| **Latencia global** | <50ms | ~200ms | ~100ms | Variable |
| **Facilidad setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

---

## 📦 PRE-REQUISITOS

- [ ] Node.js 16+ instalado
- [ ] npm o yarn
- [ ] Cuenta de email válida (para Cloudflare)
- [ ] API keys de terceros que quieres proteger (ej: OpenAI, Deepgram, etc.)

---

## 🚀 PASO 1: CREAR CUENTA EN CLOUDFLARE

### 1.1 Registro
1. Ve a: **https://dash.cloudflare.com/sign-up**
2. Ingresa tu email y contraseña
3. **NO requiere tarjeta de crédito**
4. Verifica tu email
5. Completa el onboarding (puedes saltar pasos opcionales)

### 1.2 Verificación
- Accede al dashboard: **https://dash.cloudflare.com/**
- Deberías ver la pantalla principal de Cloudflare

✅ **Checkpoint:** Tienes acceso al dashboard de Cloudflare

---

## 🛠️ PASO 2: INSTALAR WRANGLER CLI

Wrangler es la herramienta CLI oficial de Cloudflare para gestionar Workers.

### 2.1 Instalación global
```bash
npm install -g wrangler
```

### 2.2 Verificar instalación
```bash
wrangler --version
```

Deberías ver algo como: `wrangler 4.x.x`

✅ **Checkpoint:** Wrangler CLI instalado correctamente

---

## 📁 PASO 3: CREAR PROYECTO WORKER

### 3.1 Estructura de carpetas recomendada

**Opción A - Proyecto separado (recomendado):**
```
tu-workspace/
├── tu-app-mobile/        # Tu app React Native/Expo
└── api-proxy/            # Worker de Cloudflare (SEPARADO)
```

**Opción B - Dentro del proyecto:**
```
tu-app-mobile/
├── app/
├── components/
└── api-proxy/            # Worker de Cloudflare
```

### 3.2 Crear carpeta del proyecto
```bash
# Navega a donde quieres crear el Worker
cd /ruta/a/tu/workspace

# Crea carpeta del proxy
mkdir api-proxy
cd api-proxy

# Inicializar proyecto Node
npm init -y
```

### 3.3 Crear archivo `wrangler.toml`

Crea el archivo `wrangler.toml` en la raíz del proyecto:

```toml
name = "api-proxy"
main = "src/index.js"
compatibility_date = "2025-10-07"

[vars]
# Variables de entorno públicas (si las necesitas)

# Secrets (NO poner aquí, usar: wrangler secret put)
# DEEPGRAM_API_KEY
# OPENAI_API_KEY
# STRIPE_API_KEY
# etc...
```

**Importante:**
- `name`: Nombre de tu Worker (puedes cambiarlo)
- `main`: Ruta al archivo principal (no cambies esto)
- **NUNCA** pongas API keys en este archivo

### 3.4 Crear estructura de carpetas
```bash
mkdir src
```

✅ **Checkpoint:** Estructura de proyecto creada

---

## 💻 PASO 4: CONFIGURAR CÓDIGO DEL WORKER

### 4.1 Crear archivo `src/index.js`

Este es el código del Worker. Personalízalo según tus APIs:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers (permitir requests desde tu app)
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ============================================
    // RUTA 1: Ejemplo para API de transcripción
    // ============================================
    if (url.pathname === '/api/transcribe') {
      try {
        // Obtener el audio del request
        const audioBuffer = await request.arrayBuffer();

        // Forward a la API de terceros (ej: Deepgram)
        const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&detect_language=true', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${env.DEEPGRAM_API_KEY}`,
            'Content-Type': 'audio/m4a'
          },
          body: audioBuffer
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // ============================================
    // RUTA 2: Ejemplo para OpenAI
    // ============================================
    if (url.pathname === '/api/chat') {
      try {
        const body = await request.json();

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // ============================================
    // RUTA 3: Agrega más rutas según necesites
    // ============================================
    if (url.pathname === '/api/stripe-payment') {
      try {
        const body = await request.json();

        const response = await fetch('https://api.stripe.com/v1/payment_intents', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams(body)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // 404 para rutas no encontradas
    return new Response('Not Found', {
      status: 404,
      headers: corsHeaders
    });
  }
};
```

### 4.2 Personalizar rutas

**Para cada API que quieras proteger:**

1. Crea una ruta nueva (ej: `/api/tu-servicio`)
2. Lee el body del request
3. Haz fetch a la API de terceros con la API key desde `env.TU_SECRET`
4. Devuelve la respuesta al cliente

**Plantilla de ruta:**
```javascript
if (url.pathname === '/api/tu-servicio') {
  try {
    const body = await request.json(); // o .arrayBuffer() para binarios

    const response = await fetch('https://api-de-terceros.com/endpoint', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.TU_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
```

✅ **Checkpoint:** Código del Worker configurado

---

## 🔐 PASO 5: LOGIN A CLOUDFLARE

### 5.1 Autenticación
```bash
cd /ruta/a/api-proxy
wrangler login
```

### 5.2 Autorización
- Se abrirá tu navegador
- Haz click en **"Allow"** / **"Permitir"**
- Vuelve a la terminal
- Deberías ver: `✨ Successfully logged in`

**Solución de problemas:**
- Si el navegador no se abre, copia la URL de la terminal y pégala manualmente
- Si ya habías hecho login antes, puede que no te pida autorizar de nuevo

✅ **Checkpoint:** Autenticado con Cloudflare

---

## 🔑 PASO 6: CONFIGURAR SECRETS (API KEYS)

**IMPORTANTE:** Los secrets son variables de entorno encriptadas que solo existen en Cloudflare. **NUNCA** se guardan en tu código.

### 6.1 Subir cada API key como secret

**Para cada API key que quieras proteger:**

```bash
wrangler secret put NOMBRE_DEL_SECRET
```

**Ejemplo con Deepgram:**
```bash
wrangler secret put DEEPGRAM_API_KEY
```

Cuando te pregunte:
```
? Enter a secret value: ***
```

Pega tu API key (ej: `XXX...XXX`) y presiona **Enter**

### 6.2 Secrets comunes

**OpenAI:**
```bash
wrangler secret put OPENAI_API_KEY
# Pega: sk-proj-XXX...XXX
```

**Stripe:**
```bash
wrangler secret put STRIPE_SECRET_KEY
# Pega: sk_live_XXX...XXX
```

**Firebase:**
```bash
wrangler secret put FIREBASE_API_KEY
# Pega: AIzaXXX...XXX
```

### 6.3 Verificar secrets
```bash
wrangler secret list
```

Deberías ver la lista de secrets configurados (sin mostrar los valores)

**Notas:**
- Si el Worker aún no existe, te preguntará si quieres crearlo → Responde `Y` (Yes)
- Puedes sobrescribir un secret ejecutando el mismo comando de nuevo
- Para eliminar: `wrangler secret delete NOMBRE_SECRET`

✅ **Checkpoint:** Secrets configurados correctamente

---

## 🚀 PASO 7: DEPLOY DEL WORKER

### 7.1 Deploy inicial
```bash
wrangler deploy
```

### 7.2 Configurar subdominio workers.dev

La primera vez te pedirá que elijas un subdominio:

```
? What would you like your workers.dev subdomain to be?
```

**Sugerencias:**
- Tu nombre: `juanperez`
- Nombre de tu app: `miapp`
- Nombre de empresa: `tuempresa`

**Resultado:** `https://TU-SUBDOMINIO.workers.dev`

### 7.3 Confirmar deploy exitoso

Deberías ver algo como:
```
✨ Deployed api-proxy triggers (3.21 sec)
  https://api-proxy.TU-SUBDOMINIO.workers.dev
Current Version ID: abc123...
```

**¡GUARDA ESA URL!** La necesitarás para actualizar tu app.

### 7.4 Probar el Worker

**Prueba rápida con curl:**
```bash
curl https://api-proxy.TU-SUBDOMINIO.workers.dev/api/transcribe
```

Si devuelve `Not Found` o un error específico, está funcionando (solo falta configurar el request correcto)

✅ **Checkpoint:** Worker desplegado exitosamente

---

## 📱 PASO 8: ACTUALIZAR CÓDIGO REACT NATIVE

### 8.1 Identificar dónde están las llamadas a APIs

Busca en tu código donde llamas a las APIs de terceros:

**Ejemplo ANTES (con API key expuesta):**
```javascript
const response = await fetch('https://api.deepgram.com/v1/listen', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY}`,
    'Content-Type': 'audio/m4a',
  },
  body: audioBuffer,
});
```

**Ejemplo DESPUÉS (usando Worker):**
```javascript
const response = await fetch('https://api-proxy.TU-SUBDOMINIO.workers.dev/api/transcribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'audio/m4a',
  },
  body: audioBuffer,
});
```

### 8.2 Patrón de cambio

**Patrón ANTES:**
```javascript
fetch('https://api-terceros.com/endpoint', {
  headers: {
    'Authorization': `Bearer ${API_KEY_EXPUESTA}`,
    // ...
  },
  // ...
})
```

**Patrón DESPUÉS:**
```javascript
fetch('https://api-proxy.TU-SUBDOMINIO.workers.dev/api/tu-ruta', {
  // SIN Authorization header (el Worker lo agrega)
  // ...
})
```

### 8.3 Cambios por tipo de API

#### **OpenAI / APIs con JSON:**
```javascript
// ANTES
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ model: 'gpt-4', messages: [...] }),
});

// DESPUÉS
const response = await fetch('https://api-proxy.TU-SUBDOMINIO.workers.dev/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ model: 'gpt-4', messages: [...] }),
});
```

#### **Deepgram / APIs con audio binario:**
```javascript
// ANTES
const response = await fetch('https://api.deepgram.com/v1/listen', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
    'Content-Type': 'audio/m4a',
  },
  body: audioBuffer,
});

// DESPUÉS
const response = await fetch('https://api-proxy.TU-SUBDOMINIO.workers.dev/api/transcribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'audio/m4a',
  },
  body: audioBuffer,
});
```

### 8.4 Eliminar referencias a API keys

**Archivos a limpiar:**

1. **`.env` o `.env.local`:**
   ```bash
   # ANTES
   EXPO_PUBLIC_DEEPGRAM_API_KEY=XXX...XXX
   EXPO_PUBLIC_OPENAI_API_KEY=XXX...XXX

   # DESPUÉS (eliminar estas líneas)
   ```

2. **Validaciones de API key:**
   ```javascript
   // ANTES
   if (!process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY) {
     throw new Error('API key missing');
   }

   // DESPUÉS (eliminar este bloque)
   ```

3. **EAS Secrets (si usas Expo):**
   ```bash
   # Eliminar secrets que ya no se usan
   eas secret:delete --name EXPO_PUBLIC_DEEPGRAM_API_KEY
   eas secret:delete --name EXPO_PUBLIC_OPENAI_API_KEY
   ```

✅ **Checkpoint:** Código actualizado para usar Worker

---

## 🧪 PASO 9: TESTING

### 9.1 Testing local (opcional)

Puedes probar el Worker localmente antes de hacer un build de la app:

```bash
# En la carpeta del Worker
wrangler dev
```

Esto inicia el Worker en: `http://localhost:8787`

**Probar con curl:**
```bash
curl -X POST http://localhost:8787/api/transcribe \
  -H "Content-Type: audio/m4a" \
  --data-binary @test-audio.m4a
```

### 9.2 Testing en la app

**Para React Native / Expo:**

1. **Hacer nuevo build:**
   ```bash
   # Expo
   eas build --platform android --profile development

   # React Native
   npx react-native run-android
   ```

2. **Probar funcionalidad:**
   - Ejecutar la app
   - Usar la función que llama a la API (ej: transcripción de voz)
   - Verificar en los logs que funcione

3. **Verificar en Cloudflare Dashboard:**
   - Ve a: https://dash.cloudflare.com
   - Selecciona tu Worker
   - Ve a la pestaña "Metrics"
   - Deberías ver requests registrados

### 9.3 Debugging

**Ver logs del Worker:**
```bash
wrangler tail
```

Esto muestra en tiempo real los logs de tu Worker (console.log, errores, etc.)

**Agregar logs al Worker:**
```javascript
console.log('🔍 Request received:', url.pathname);
console.log('📤 Forwarding to API...');
console.log('✅ Response:', data);
```

✅ **Checkpoint:** Worker funcionando correctamente

---

## 🔧 PASO 10: MANTENIMIENTO

### 10.1 Actualizar código del Worker

Cuando necesites cambiar el código:

1. Edita `src/index.js`
2. Deploy de nuevo:
   ```bash
   wrangler deploy
   ```

**No hace falta reinstalar la app**, los cambios son inmediatos.

### 10.2 Rotar API keys

Si necesitas cambiar una API key:

```bash
wrangler secret put NOMBRE_SECRET
# Pega la nueva key
```

El cambio es **inmediato**, no hace falta redeploy.

### 10.3 Ver métricas de uso

**Dashboard de Cloudflare:**
- https://dash.cloudflare.com
- Selecciona tu Worker
- Pestaña "Metrics"

**Métricas disponibles:**
- Requests por día/hora
- Errores
- Latencia promedio
- CPU time usado

### 10.4 Monitoreo de costos

**Free tier de Cloudflare Workers:**
- ✅ 100,000 requests/día
- ✅ 10ms CPU time por request
- ✅ Sin límite de ancho de banda

**Si excedes:**
- Workers Paid: $5 USD por 10 millones de requests adicionales
- Muy económico comparado con otras plataformas

### 10.5 Backups del código

**Opción 1 - Git:**
```bash
cd api-proxy
git init
git add .
git commit -m "Initial worker setup"
git remote add origin https://github.com/tu-usuario/api-proxy.git
git push -u origin main
```

**Opción 2 - Descargar desde Cloudflare:**
```bash
wrangler download
```

✅ **Checkpoint:** Worker en producción con mantenimiento configurado

---

## 🚨 TROUBLESHOOTING

### Problema 1: "Worker not found" al hacer deploy

**Síntoma:**
```
Error: Worker "api-proxy" not found
```

**Solución:**
```bash
# Verificar que estás en la carpeta correcta
pwd

# Verificar wrangler.toml existe
ls wrangler.toml

# Login de nuevo
wrangler login

# Deploy de nuevo
wrangler deploy
```

---

### Problema 2: "CORS error" en la app

**Síntoma:**
```
Access to fetch at 'https://...' has been blocked by CORS policy
```

**Solución:**
Asegúrate que el Worker tenga los headers CORS correctos:

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // O tu dominio específico
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Agregar a TODAS las responses
return new Response(JSON.stringify(data), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
});
```

---

### Problema 3: "Secret not found" al hacer request

**Síntoma:**
```
Error: env.DEEPGRAM_API_KEY is undefined
```

**Solución:**
```bash
# Verificar que el secret existe
wrangler secret list

# Si no existe, crearlo
wrangler secret put DEEPGRAM_API_KEY

# Si existe pero no funciona, redeploy
wrangler deploy
```

---

### Problema 4: Worker devuelve 500 Internal Server Error

**Solución:**
```bash
# Ver logs en tiempo real
wrangler tail

# Hacer un request y ver el error específico
```

Errores comunes:
- API key inválida o expirada
- Body malformado en el request
- Timeout de la API de terceros

---

### Problema 5: "Rate limit exceeded" en Cloudflare

**Síntoma:**
```
Error 1015: Rate limit exceeded
```

**Solución:**
- Estás excediendo el free tier (100K requests/día)
- Verifica métricas en el dashboard
- Considera upgrade a Workers Paid ($5/10M requests)
- Implementa rate limiting en el Worker

---

### Problema 6: Latencia alta en requests

**Posibles causas:**
1. API de terceros lenta (no es culpa del Worker)
2. Body muy grande (ej: audio/video pesado)
3. Cold start del Worker (raro, solo en primeros requests)

**Solución:**
```bash
# Ver latencia promedio
wrangler tail

# Optimizar código si es necesario
# Cloudflare Workers tiene <50ms de overhead usualmente
```

---

## 📊 COMPARACIÓN DE COSTOS

### Escenario: App con 1,000 usuarios activos/día

**Estimación de requests:**
- 1,000 usuarios × 5 transcripciones/día = 5,000 requests/día
- 5,000 × 30 días = **150,000 requests/mes**

| Servicio | Costo/mes | Free tier | Excede free tier? |
|----------|-----------|-----------|-------------------|
| **Cloudflare Workers** | **$0** | 3M requests/mes | ❌ No |
| Firebase Functions | $0 | 2M requests/mes | ❌ No |
| AWS Lambda | $0.20 | 1M requests/mes | ✅ Sí (+50K) |
| Vercel | $0 | ~1M requests/mes | ✅ Sí (+50K) |

**Winner:** 🏆 Cloudflare Workers (más margen en free tier)

---

## 📚 RECURSOS ADICIONALES

### Documentación oficial:
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
- Ejemplos: https://developers.cloudflare.com/workers/examples/

### Comunidad:
- Discord de Cloudflare: https://discord.gg/cloudflaredev
- Stack Overflow: Tag `cloudflare-workers`

### Herramientas útiles:
- Workers Playground: https://workers.cloudflare.com/playground
- Pricing Calculator: https://workers.cloudflare.com/

---

## ✅ CHECKLIST FINAL

Antes de ir a producción, verifica:

- [ ] Worker desplegado y accesible
- [ ] Todos los secrets configurados correctamente
- [ ] App actualizada para usar URLs del Worker
- [ ] API keys eliminadas del código de la app
- [ ] `.env` limpio (sin API keys)
- [ ] EAS Secrets limpiados (si usas Expo)
- [ ] Testing completo de todas las funciones
- [ ] Logs del Worker verificados (sin errores)
- [ ] Métricas de Cloudflare revisadas
- [ ] Backups del código del Worker (Git)

---

## 🎓 LECCIONES APRENDIDAS (FastNote)

### ✅ Lo que funcionó bien:
1. **Setup rápido** - Menos de 20 minutos total
2. **CERO cold starts** - Respuestas instantáneas
3. **Free tier generoso** - Nunca excedimos el límite con testing
4. **Debugging fácil** - `wrangler tail` es muy útil
5. **Deployment instantáneo** - Cambios en segundos

### ⚠️ Puntos a tener en cuenta:
1. **CORS importante** - No olvides los headers CORS
2. **Secrets son permanentes** - Cuidado al crear, difícil eliminar
3. **Nombre de subdominio único** - No se puede cambiar después
4. **Logs temporales** - Solo duran 24-48 horas
5. **Testing local útil** - Usa `wrangler dev` antes de deploy

### 💡 Tips finales:
- Documenta todas tus rutas en un README
- Agrega comentarios en el código del Worker
- Monitorea métricas regularmente
- Implementa rate limiting si es app pública
- Considera analytics (Cloudflare Analytics gratis)

---

**Última actualización:** Octubre 2025
**Mantenido por:** FastNote Development Team
**Licencia:** Uso libre para proyectos personales y comerciales
