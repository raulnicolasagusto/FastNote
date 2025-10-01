# 📊 Cálculos de Revenue - FastNote

**Última actualización:** Octubre 2025

---

## 🎯 ESTRUCTURA DE TIERS

### 🆓 Tier Gratuito
- **3 transcripciones/día** (máx 1 min cada una)
- Con publicidad (banners AdMob)
- **Uso máximo:** 90 minutos/mes

### 💎 Tier Premium Basic ($3.00 USD/mes)
- **6 transcripciones/día** (máx 1 min cada una)
- Sin publicidad
- **Uso máximo:** 180 minutos/mes

### 🚀 Tier Premium Pro ($5.00 USD/mes)
- **Transcripciones ilimitadas**
- **Límite:** 500 minutos/mes total
- Sin publicidad

---

## 💰 DATOS BASE PARA CÁLCULOS

### APIs y Servicios:
- **OpenAI Whisper API:** $0.006 USD por minuto
- **AdMob CPM (Conservador):** $0.40 por 1000 impresiones
- **AdMob CTR promedio:** 2.5% (apps productivity)

### Comisiones:
- **Google Play Store:** 15% (primeros $1M/año en revenue)
- **RevenueCat:**
  - Gratis hasta $2,500/mes en revenue
  - 1% después de ese umbral

### Estimación de Impresiones (Usuario Gratis):
- Abren app: 10 veces/día (banner home)
- Abren notas: 8 veces/día (banner note-detail)
- **Total:** ~18 impresiones/día
- **Mensual:** 540 impresiones/mes

---

## 📉 COSTOS Y MÁRGENES POR TIER

### 🆓 Tier Gratuito (Por Usuario/Mes)

**Costo API Whisper:**
- Uso promedio real: ~50% del límite (45 min/mes)
- Cálculo: 45 min × $0.006 = **$0.27 USD/mes**

**Ingresos Publicidad (Escenario Conservador CPM $0.40):**
- 540 impresiones/mes = 0.54 × 1000
- Cálculo: 0.54 × $0.40 = **$0.216 USD/mes**

**Balance Final:**
- Costo API: -$0.27
- Ingreso Ads: +$0.216
- **Costo neto: -$0.054 USD/mes por usuario** ✅ Déficit mínimo

**Notas:**
- Ads cubren 80% del costo de API
- Déficit muy bajo, sostenible para adquisición de usuarios

---

### 💎 Tier Premium Basic ($3.00/mes por usuario)

**Ingresos Brutos:** $3.00

**Comisiones:**
- Google Play Store (15%): -$0.45
- RevenueCat (1%, si aplica): -$0.03
- **Ingreso neto después de comisiones:** $2.52

**Costo API Whisper:**
- Uso promedio: ~50% del límite (90 min/mes)
- Cálculo: 90 min × $0.006 = **-$0.54 USD**

**Profit Final:**
- Ingreso neto: $2.52
- Costo API: -$0.54
- **Profit: $1.98 USD/mes por usuario** ✅
- **Margen de ganancia: 66%**

---

### 🚀 Tier Premium Pro ($5.00/mes por usuario)

**Ingresos Brutos:** $5.00

**Comisiones:**
- Google Play Store (15%): -$0.75
- RevenueCat (1%, si aplica): -$0.05
- **Ingreso neto después de comisiones:** $4.20

**Costo API Whisper (3 escenarios según uso):**

#### Usuario Moderado (200 min/mes):
- Costo: 200 × $0.006 = -$1.20
- **Profit: $3.00 USD/mes** (71% margen) ✅

#### Usuario Activo (400 min/mes):
- Costo: 400 × $0.006 = -$2.40
- **Profit: $1.80 USD/mes** (43% margen) ✅

#### Usuario Intensivo (500 min/mes - límite máximo):
- Costo: 500 × $0.006 = -$3.00
- **Profit: $1.20 USD/mes** (29% margen) ✅

**Protección:** El límite de 500 min/mes garantiza margen mínimo de 29%, imposible perder dinero.

---

## 📊 ESCENARIOS REALES DE NEGOCIO

### Escenario 1: Base Inicial - 1,000 Usuarios Totales

**Distribución estimada:**
- 900 usuarios gratis (90%)
- 70 usuarios Premium Basic (7%)
- 30 usuarios Premium Pro (3%)
- **Tasa conversión total:** 10%

**Cálculo Mensual:**

| Tier | Usuarios | Profit/Usuario | Total |
|------|----------|----------------|-------|
| Gratis | 900 | -$0.054 | -$48.60 |
| Premium Basic | 70 | $1.98 | +$138.60 |
| Premium Pro | 30 | $2.40* | +$72.00 |

**TOTAL MENSUAL: +$162.00** ✅ RENTABLE
**Revenue Anual:** $1,944
**RevenueCat:** GRATIS (bajo el umbral de $2,500/mes)

*Asumiendo uso promedio de 300 min/mes

---

### Escenario 2: Crecimiento Medio - 5,000 Usuarios Totales

**Distribución estimada:**
- 4,400 usuarios gratis (88%)
- 400 usuarios Premium Basic (8%)
- 200 usuarios Premium Pro (4%)
- **Tasa conversión total:** 12%

**Cálculo Mensual:**

| Tier | Usuarios | Profit/Usuario | Total |
|------|----------|----------------|-------|
| Gratis | 4,400 | -$0.054 | -$237.60 |
| Premium Basic | 400 | $1.98 | +$792.00 |
| Premium Pro | 200 | $2.40 | +$480.00 |

**TOTAL MENSUAL: +$1,034.40** ✅ MUY RENTABLE
**Revenue Mensual:** $2,200
**Revenue Anual:** $26,400
**RevenueCat:** GRATIS (justo bajo el umbral de $2,500/mes)

---

### Escenario 3: Escala Grande - 10,000 Usuarios Totales

**Distribución estimada:**
- 8,700 usuarios gratis (87%)
- 900 usuarios Premium Basic (9%)
- 400 usuarios Premium Pro (4%)
- **Tasa conversión total:** 13%

**Cálculo Mensual:**

| Tier | Usuarios | Profit/Usuario | Total |
|------|----------|----------------|-------|
| Gratis | 8,700 | -$0.054 | -$469.80 |
| Premium Basic | 900 | $1.98 | +$1,782.00 |
| Premium Pro | 400 | $2.40 | +$960.00 |

**TOTAL MENSUAL: +$2,272.20** ✅ EXCELENTE

**Revenue Mensual:** $4,700
**Revenue Anual:** $56,400
**RevenueCat (1% sobre $2,500/mes):** -$47/mes = -$564/año
**Profit Neto Anual:** $27,266 - $564 = **$26,702**

---

## 📈 PROYECCIONES DE CRECIMIENTO

### Año 1 - Lanzamiento y Validación
- **Mes 1-3:** 500 usuarios
  - Revenue: ~$80/mes
  - Objetivo: Validar conversión

- **Mes 4-6:** 2,000 usuarios
  - Revenue: $400-600/mes
  - Objetivo: Optimizar onboarding

- **Mes 7-12:** 5,000 usuarios
  - Revenue: ~$1,000/mes
  - Objetivo: Escalar marketing

**Revenue Anual Año 1:** $6,000 - $8,000

---

### Año 2 - Consolidación
- **Usuarios:** 10,000 - 15,000
- **Revenue Mensual:** $2,000 - $3,500
- **Revenue Anual:** $24,000 - $42,000
- **Objetivo:** Mejorar retención y LTV

---

### Año 3 - Escala
- **Usuarios:** 25,000+
- **Revenue Mensual:** $5,500+
- **Revenue Anual:** $66,000+
- **Objetivo:** Expansión internacional

---

## 🎯 COMPARACIÓN: ESTRUCTURA ANTERIOR vs NUEVA

### ❌ Estructura Anterior (1 tier premium a $4.99):
- Solo una opción de upgrade
- Precio alto para usuario casual latinoamericano
- Conversión esperada: 5-8%
- Break-even más alto

### ✅ Estructura Nueva (2 tiers: $3 y $5):
- **Dos opciones de upgrade** = más flexibilidad
- **Tier $3:** Precio psicológico perfecto ("menos que un café")
- **Tier $5:** Para power users
- **Mayor tasa de conversión esperada:** 10-15% total
- Límites más agresivos en tier gratis incentivan upgrade
- Costo tier gratis casi neutro gracias a ads

---

## 💡 VENTAJAS CLAVE DE ESTA ESTRUCTURA

### ✅ Tier Gratuito (3 audios/día × 1 min):
- **Costo casi neutro** (-$0.054/mes por usuario)
- Suficiente para que usuarios prueben la app
- Lo suficientemente limitado para incentivar upgrade
- **Ads cubren 80% del costo de API**
- Excelente para adquisición de usuarios

### ✅ Premium Basic ($3/mes):
- **Precio psicológico excelente** para mercado latinoamericano
- **Margen de profit: 66%**
- Perfecto para usuarios casuales que usan la app regularmente
- Doble de transcripciones vs tier gratis
- **ESTA ES LA JOYA** - Mayor tasa de conversión esperada

### ✅ Premium Pro ($5/mes):
- **Precio competitivo** vs otras apps de notas premium
- **Márgenes saludables:** 29-71% dependiendo del uso
- Límite de 500 min/mes protege de usuarios abusivos
- 500 min = 8.3 horas/mes (más que suficiente para 99% de usuarios)
- Para power users y usuarios empresariales

---

## 🚨 RIESGOS Y PROTECCIONES

### Riesgo: Usuario Premium Pro abusa del sistema

**Escenario extremo:** Usuario usa 500 min/mes constantemente
- Tu ingreso neto: $4.20
- Tu costo API: -$3.00 (500 min × $0.006)
- **Profit: $1.20** ✅ Todavía positivo

**Protección:** El límite de 500 min/mes es tu firewall
- **Imposible perder dinero** en tier Pro
- **Margen mínimo garantizado: 29%**
- Si usuario necesita más, puedes ofrecer tier empresarial custom

---

### Riesgo: Usuarios gratis no convierten

**Escenario pesimista:** Solo 5% de conversión
- 1,000 usuarios: 950 gratis, 50 premium
- Costo gratis: -$51.30
- Profit premium: ~$90
- **Balance: +$38.70** ✅ Aún rentable

**Protección:**
- Ads reducen costo de usuarios gratis
- Break-even muy bajo (~5% conversión)
- Siempre rentable con cualquier conversión > 3%

---

## 📊 MÉTRICAS CLAVE DE ÉXITO

### Conversión:
- **Objetivo Año 1:** 8-10% conversión total
- **Objetivo Año 2:** 10-12% conversión total
- **Objetivo Año 3:** 12-15% conversión total

### Distribución Premium Ideal:
- **60-70% en tier Basic** ($3/mes) - Mayor volumen
- **30-40% en tier Pro** ($5/mes) - Mayor margen

### Break-Even:
- **Con 0% conversión:** Pequeño déficit cubierto por ads
- **Con 5% conversión:** Rentable
- **Con 10% conversión:** Muy rentable
- **Con 15% conversión:** Excelente

### LTV (Lifetime Value) Estimado:
- **Usuario gratis:** -$0.65/año (déficit mínimo)
- **Premium Basic:** $23.76/año (asumiendo 12 meses retención)
- **Premium Pro:** $28.80/año (asumiendo 12 meses retención)

### CAC (Customer Acquisition Cost) Objetivo:
- **Usuario gratis:** $0 (orgánico + word of mouth)
- **Usuario premium:** < $10 (payback en 2-5 meses)

---

## 🌎 CONSIDERACIONES GEOGRÁFICAS

### Si audiencia es principalmente Latinoamérica:
- **CPM AdMob:** $0.15 - $0.30 (bajo)
- **Ingreso ads por usuario gratis:** $0.10 - $0.15/mes
- **Conversión a premium MÁS CRÍTICA**
- Tier de $3/mes es PERFECTO para este mercado

### Si audiencia es USA/Europa (Tier 1):
- **CPM AdMob:** $0.60 - $1.20 (alto)
- **Ingreso ads por usuario gratis:** $0.32 - $0.65/mes
- **Tier gratis puede ser RENTABLE** solo con ads
- Puedes considerar precios más altos ($4/$7)

---

## 🎯 RECOMENDACIONES FINALES

### ✅ IMPLEMENTA ESTA ESTRUCTURA:

1. **Lanzamiento con 3 tiers:** Gratis, $3/mes, $5/mes
2. **Monitorea métricas semanalmente:**
   - Tasa de conversión por tier
   - Uso promedio de minutos por tier
   - Revenue por usuario (ARPU)
   - Costo por usuario (CPU)

3. **Optimizaciones a considerar:**
   - A/B testing de precios después de 3 meses
   - Si conversión es baja: reducir límite gratis a 2 audios/día
   - Si conversión es alta: agregar tier intermedio de $2/mes

4. **Futuras expansiones:**
   - Tier empresarial custom para equipos
   - Plan anual con descuento (ahorra 20%)
   - Add-ons: comprar minutos extra

---

## 📝 NOTAS ADICIONALES

### Sobre RevenueCat:
- Gratis hasta $2,500/mes en revenue
- Alcanzarás ese umbral con ~1,300 usuarios premium
- Costo de 1% es insignificante vs beneficios (sin backend, validación server-side)

### Sobre AdMob:
- Banners tienen CPM bajo pero no molestan tanto al usuario
- Considera intersticial ads entre notas (CPM $1-5) para aumentar revenue tier gratis
- NUNCA uses rewarded ads (rompe UX de productivity app)

### Sobre Whisper API:
- $0.006/min es precio estable desde 2023
- OpenAI rara vez sube precios de APIs maduras
- Considera self-hosted Whisper si llegas a 100K+ min/mes (break-even en ese punto)

---

## ✅ CONCLUSIÓN

Esta estructura de pricing es **SIGNIFICATIVAMENTE MEJOR** que alternativas porque:

1. ✅ **Menor barrera de entrada** al premium ($3 vs $4.99)
2. ✅ **Dos opciones de upgrade** aumentan conversión total
3. ✅ **Tier gratis casi neutro** gracias a ads (adquisición sostenible)
4. ✅ **Márgenes saludables** en todos los tiers premium (29-71%)
5. ✅ **Protección contra abuso** con límites claros
6. ✅ **Escalable** desde día 1 hasta 100K+ usuarios
7. ✅ **Break-even muy bajo** (5% conversión)
8. ✅ **Rentable con cualquier conversión > 3%**

**Veredicto Final: ¡Estructura GANADORA!** 🎉

---

**Creado:** Octubre 2025
**Autor:** Análisis para FastNote
**Próxima revisión:** Después de 3 meses de lanzamiento con datos reales
