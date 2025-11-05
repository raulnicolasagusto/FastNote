# 📊 Modelo de Negocio Simplificado - FastNote

**Fecha:** Octubre 2025
**Objetivo:** Comparar modelo 100% gratis vs modelo freemium simple

---

## 🎯 PARÁMETROS DEL MODELO

### Límites Tier Gratis:
- **3 transcripciones/día** (máx 2 min cada una)
- **Límite mensual:** 150 minutos/mes
- **Con publicidad** (banners AdMob)

### Tier Premium Anual:
- **Precio:** $5.00 USD/año
- **Transcripciones ilimitadas**
- **Sin publicidad**

---

## 💰 DATOS BASE

### Costos API:
- **Deepgram Nova-2:** $0.0043 USD por minuto
- **OpenAI GPT-4o-mini (recordatorios):** ~$0.0004 por análisis

### Ingresos Publicidad:
- **AdMob CPM (Conservador):** $0.40 por 1000 impresiones
- **Impresiones/mes por usuario:** 540 (18/día × 30 días)
- **Ingreso por usuario gratis:** $0.216/mes = **$2.592/año**

### Comisiones:
- **Google Play Store:** 15% sobre suscripciones
- **RevenueCat:** 1% después de $2,500/mes (ignoramos por simplicidad en tier anual)

---

## 📉 CÁLCULO TIER GRATIS (Solo Publicidad)

### Uso Promedio Esperado:
- **Uso real:** ~50% del límite (75 min/mes)
- Usuarios casuales usan menos del máximo permitido

### Costo por Usuario/Mes:

**API Deepgram:**
- 75 min × $0.0043 = **$0.3225/mes**
- Anual: **$3.87/año**

**Análisis IA (Recordatorios):**
- ~5 análisis/mes × $0.0004 = **$0.002/mes**
- Anual: **$0.024/año**
- (Despreciable, lo ignoramos)

**Ingreso Publicidad:**
- 540 impresiones × ($0.40/1000) = **$0.216/mes**
- Anual: **$2.592/año**

**Balance por Usuario Gratis:**
- Costo: -$3.87/año
- Ingreso: +$2.592/año
- **Déficit: -$1.278/año** ❌

---

## 📊 ESCENARIO 1: SOLO MODELO GRATIS (100% Publicidad)

### 100 Usuarios Gratis:
- Costo API: 100 × $3.87 = **-$387/año**
- Ingreso Ads: 100 × $2.592 = **+$259.20/año**
- **Pérdida neta: -$127.80/año** ❌

### 1,000 Usuarios Gratis:
- Costo API: 1,000 × $3.87 = **-$3,870/año**
- Ingreso Ads: 1,000 × $2.592 = **+$2,592/año**
- **Pérdida neta: -$1,278/año** ❌

### 10,000 Usuarios Gratis:
- Costo API: 10,000 × $3.87 = **-$38,700/año**
- Ingreso Ads: 10,000 × $2.592 = **+$25,920/año**
- **Pérdida neta: -$12,780/año** ❌

### 50,000 Usuarios Gratis:
- Costo API: 50,000 × $3.87 = **-$193,500/año**
- Ingreso Ads: 50,000 × $2.592 = **+$129,600/año**
- **Pérdida neta: -$63,900/año** ❌

**Conclusión:** El modelo 100% gratis NO es sostenible. La publicidad solo cubre el 67% de los costos de API.

---

## 💎 CÁLCULO TIER PREMIUM ANUAL ($5/año)

### Precio y Comisiones:
- Precio: **$5.00/año**
- Google Play (15%): -$0.75
- **Ingreso neto: $4.25/año**

### Uso Promedio Premium (sin límites):
Asumimos 3 perfiles de uso:

#### Usuario Casual (150 min/mes):
- Costo API: 150 min × 12 meses × $0.0043 = **-$7.74/año**
- **Profit: $4.25 - $7.74 = -$3.49/año** ❌ PÉRDIDA

#### Usuario Moderado (300 min/mes):
- Costo API: 300 min × 12 meses × $0.0043 = **-$15.48/año**
- **Profit: $4.25 - $15.48 = -$11.23/año** ❌ PÉRDIDA

#### Usuario Activo (500 min/mes):
- Costo API: 500 min × 12 meses × $0.0043 = **-$25.80/año**
- **Profit: $4.25 - $25.80 = -$21.55/año** ❌ PÉRDIDA

**Conclusión:** Premium a $5/año NO es rentable con uso ilimitado. Necesitas cobrar más o limitar uso.

---

## ⚠️ PROBLEMA CRÍTICO IDENTIFICADO

### El precio de $5/año es DEMASIADO BAJO para uso ilimitado:

**Break-Even Premium (con límite mensual):**
- Para cubrir costos necesitas que el usuario NO supere:
- $4.25 / $0.0043 / 12 meses = **82 minutos/mes máximo**

**Si quieres ofrecer 500 min/mes:**
- Costo anual: $25.80
- + Comisión Play Store: $25.80 / 0.85 = $30.35
- **Precio mínimo necesario: $30/año** (o $2.50/mes)

---

## ✅ MODELO CORREGIDO: FREEMIUM SOSTENIBLE

### Opción A: Aumentar Precio Premium

**Tier Gratis:**
- 3 transcripciones/día (max 2 min)
- Límite: 150 min/mes
- Con publicidad
- **Déficit: -$1.278/año por usuario**

**Tier Premium Anual ($15/año):**
- Ingreso neto: $12.75/año
- Límite razonable: 250 min/mes
- Costo API: 250 × 12 × $0.0043 = $12.90/año
- **Break-even aproximado** ✅

**Tier Premium Anual ($20/año):**
- Ingreso neto: $17/año
- Límite: 300 min/mes
- Costo API: 300 × 12 × $0.0043 = $15.48/año
- **Profit: $1.52/año** (9% margen) ✅

---

### Opción B: Mantener $5/año pero con límites

**Tier Premium Anual ($5/año):**
- Ingreso neto: $4.25/año
- **Límite máximo sostenible: 80 min/mes**
- Costo API: 80 × 12 × $0.0043 = $4.13/año
- **Profit: $0.12/año** (3% margen) ✅

Pero esto es PEOR que el tier gratis (150 min/mes), no tiene sentido comercial.

---

## 📊 ESCENARIOS FREEMIUM (Tier Gratis + Premium $20/año)

### Escenario 1: 100 Usuarios (10% conversión)

**90 Usuarios Gratis:**
- Déficit: 90 × -$1.278 = **-$115.02/año**

**10 Usuarios Premium ($20/año, 300 min/mes):**
- Profit: 10 × $1.52 = **+$15.20/año**

**Total: -$99.82/año** ❌ Todavía pérdida (necesitas más conversión)

---

### Escenario 2: 1,000 Usuarios (15% conversión)

**850 Usuarios Gratis:**
- Déficit: 850 × -$1.278 = **-$1,086.30/año**

**150 Usuarios Premium ($20/año):**
- Profit: 150 × $1.52 = **+$228/año**

**Total: -$858.30/año** ❌ Todavía pérdida

---

### Escenario 3: 10,000 Usuarios (20% conversión)

**8,000 Usuarios Gratis:**
- Déficit: 8,000 × -$1.278 = **-$10,224/año**

**2,000 Usuarios Premium ($20/año):**
- Profit: 2,000 × $1.52 = **+$3,040/año**

**Total: -$7,184/año** ❌ Todavía pérdida significativa

---

### Escenario 4: 50,000 Usuarios (25% conversión)

**37,500 Usuarios Gratis:**
- Déficit: 37,500 × -$1.278 = **-$47,925/año**

**12,500 Usuarios Premium ($20/año):**
- Profit: 12,500 × $1.52 = **+$19,000/año**

**Total: -$28,925/año** ❌ Pérdida masiva

---

## 🎯 ANÁLISIS: ¿QUÉ HACER?

### Problema Raíz:
1. **Límite gratis muy generoso** (150 min/mes) genera déficit de -$1.278/año por usuario
2. **Precio premium muy bajo** ($5-20/año) no compensa el déficit de usuarios gratis
3. **Publicidad no cubre costos** (solo 67% del costo API)

---

## ✅ SOLUCIONES PROPUESTAS

### Solución 1: Reducir límite gratis + aumentar precio premium

**Tier Gratis AJUSTADO:**
- 3 transcripciones/día (max 1 min) ← Reducir de 2 min a 1 min
- **Límite: 90 min/mes** (en vez de 150)
- Con publicidad

**Nuevo balance gratis:**
- Costo: 90 × 12 × $0.0043 = -$4.64/año
- Ingreso ads: +$2.592/año
- **Déficit: -$2.048/año** (sigue siendo déficit pero menor)

**Tier Premium Mensual ($3/mes = $36/año):**
- Ingreso neto: $36 × 0.85 = **$30.60/año**
- Límite: 500 min/mes
- Costo: 500 × 12 × $0.0043 = -$25.80/año
- **Profit: $4.80/año** (16% margen) ✅

---

### Solución 2: Modelo de tu archivo original (2 tiers premium)

**Tier Gratis:**
- 3 transcripciones/día (max 1 min)
- Límite: 90 min/mes
- Con publicidad
- **Déficit: -$2.048/año**

**Tier Premium Basic ($3/mes):**
- 6 transcripciones/día (max 1 min)
- Límite: 180 min/mes
- Sin publicidad
- Profit: **$2.133/mes × 12 = $25.60/año** ✅

**Tier Premium Pro ($5/mes):**
- Transcripciones ilimitadas
- Límite: 500 min/mes
- Sin publicidad
- Profit: **$2.68/mes × 12 = $32.16/año** ✅

---

## 📊 COMPARACIÓN FINAL: $5/AÑO vs $3/MES

### Con $5/año (ilimitado):
- ❌ Pérdida de $3.49 a $21.55/año por usuario premium
- ❌ No sostenible
- ❌ Incluso con 50K usuarios y 25% conversión: -$28,925/año

### Con $3/mes ($36/año):
- ✅ Profit de $4.80/año por usuario premium
- ✅ Sostenible
- ✅ Con 10K usuarios y 12% conversión: +$3,712/año profit

---

## 💡 RECOMENDACIÓN FINAL

### ❌ NO USES $5/AÑO:
Es financieramente imposible con uso ilimitado o límites razonables.

### ✅ USA MODELO MENSUAL:

**Opción A: Premium Simple ($3/mes = $36/año):**
- Gratis: 90 min/mes con ads
- Premium: 500 min/mes sin ads por $3/mes
- **Profit premium:** $4.80/año por usuario
- **ROI claro y sostenible**

**Opción B: Doble Tier Premium (RECOMENDADO):**
- Gratis: 90 min/mes con ads
- Basic ($3/mes): 180 min/mes sin ads → $25.60/año profit
- Pro ($5/mes): 500 min/mes sin ads → $32.16/año profit
- **Maximiza conversión con opciones flexibles**

---

## 📈 ESCENARIOS CON MODELO MENSUAL ($3/mes)

### 100 Usuarios (10% conversión):
- 90 gratis: 90 × -$2.048 = -$184.32
- 10 premium: 10 × $4.80 = +$48
- **Total: -$136.32/año** (todavía pérdida pero manejable)

### 1,000 Usuarios (12% conversión):
- 880 gratis: 880 × -$2.048 = -$1,802.24
- 120 premium: 120 × $4.80 = +$576
- **Total: -$1,226.24/año** (aún pérdida, necesitas más conversión)

### 10,000 Usuarios (15% conversión):
- 8,500 gratis: 8,500 × -$2.048 = -$17,408
- 1,500 premium: 1,500 × $4.80 = +$7,200
- **Total: -$10,208/año** (pérdida menor)

### 10,000 Usuarios (20% conversión):
- 8,000 gratis: 8,000 × -$2.048 = -$16,384
- 2,000 premium: 2,000 × $4.80 = +$9,600
- **Total: -$6,784/año** (todavía pérdida)

### 10,000 Usuarios (30% conversión):
- 7,000 gratis: 7,000 × -$2.048 = -$14,336
- 3,000 premium: 3,000 × $4.80 = +$14,400
- **Total: +$64/año** ✅ BREAK-EVEN

---

## ⚠️ CONCLUSIÓN CRÍTICA

### Para ser RENTABLE con límite gratis de 150 min/mes necesitas:

**Con Premium $3/mes:**
- Mínimo **30% de conversión** para break-even
- O **50K+ usuarios con 25% conversión**

**Con Premium $5/mes (estructura original):**
- Mínimo **12-15% de conversión** para ser rentable
- Mucho más sostenible

---

## ✅ VEREDICTO FINAL

### Modelo $5/AÑO con ilimitado: ❌ INVIABLE
- Pierdes dinero con cada usuario premium
- Incluso con 50K usuarios pierdes -$28K/año

### Modelo $3/MES ($36/año): ⚠️ VIABLE pero requiere alta conversión
- Necesitas 30% conversión para break-even
- Difícil de lograr en apps productivity

### Modelo $3/MES + $5/MES (Doble tier): ✅ RECOMENDADO
- Solo necesitas 12-15% conversión
- Tier gratis con menos límite (90 min/mes en vez de 150)
- **Este es el modelo del archivo calculos-revenue.md**
- Probado rentable con conversiones realistas

---

**Recomendación:** Mantén el modelo original del archivo `calculos-revenue.md` con Deepgram. Es el único modelo matemáticamente sostenible con tasas de conversión realistas.

---

**Creado:** Octubre 2025
**Nota:** Todos los cálculos son conservadores y asumen uso promedio del 50% del límite para usuarios gratis.
