# 📊 Nuevo Modelo de Revenue - FastNote

**Última actualización:** Octubre 2025
**Crédito disponible Deepgram:** $200 USD

---

## 🎯 NUEVA ESTRUCTURA DE TIERS

### 🆓 Tier Gratuito (Con publicidad)
- **5 transcripciones/día** (máx 6 min cada una)
- **Uso máximo:** 30 minutos/día = 900 minutos/mes
- Con publicidad (banners AdMob)

### 💎 Tier Premium Mensual ($2.00 USD/mes)
- **10 transcripciones/día** (máx 12 min cada una)
- **Uso máximo:** 120 minutos/día = 3,600 minutos/mes
- Sin publicidad

### 🚀 Tier Premium Anual ($22.00 USD/año = $1.83/mes)
- **20 transcripciones/día** (máx 9 min cada una)
- **Uso máximo:** 180 minutos/día = 5,400 minutos/mes
- Sin publicidad
- **Ahorro:** $2/mes × 12 = $24/año → Pagas $22/año (**8.3% descuento**)

---

## 💰 DATOS BASE PARA CÁLCULOS

### APIs y Servicios:
- **Deepgram Nova-2 API:** $0.0043 USD por minuto
- **Crédito disponible:** $200 USD
- **AdMob CPM (Conservador):** $0.40 por 1000 impresiones
- **AdMob CTR promedio:** 2.5%

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

**Costo API Deepgram:**
- Límite: 30 min/día × 30 días = 900 min/mes
- Uso promedio real: ~60% del límite = 540 min/mes
- Cálculo: 540 min × $0.0043 = **$2.322 USD/mes**

**Ingresos Publicidad (CPM $0.40):**
- 540 impresiones/mes = 0.54 × 1000
- Cálculo: 0.54 × $0.40 = **$0.216 USD/mes**

**Balance Final:**
- Costo API: -$2.322
- Ingreso Ads: +$0.216
- **Costo neto: -$2.106 USD/mes por usuario** ❌ Déficit

**Notas:**
- Ads cubren solo el 9.3% del costo de API
- Necesitas conversión a premium para sostenibilidad

---

### 💎 Tier Premium Mensual ($2.00/mes)

**Ingresos Brutos:** $2.00

**Comisiones:**
- Google Play Store (15%): -$0.30
- RevenueCat (1%, si aplica): -$0.02
- **Ingreso neto después de comisiones:** $1.68

**Costo API Deepgram:**
- Límite: 120 min/día × 30 días = 3,600 min/mes
- Uso promedio: ~50% del límite = 1,800 min/mes
- Cálculo: 1,800 min × $0.0043 = **-$7.74 USD**

**Profit Final:**
- Ingreso neto: $1.68
- Costo API: -$7.74
- **Profit: -$6.06 USD/mes por usuario** ❌ **PÉRDIDA**
- **Margen: -303%** ❌

---

### 🚀 Tier Premium Anual ($22.00/año)

**Ingresos Brutos:** $22.00/año = $1.833/mes

**Comisiones:**
- Google Play Store (15%): -$3.30/año = -$0.275/mes
- RevenueCat (1%, si aplica): -$0.22/año = -$0.018/mes
- **Ingreso neto después de comisiones:** $18.48/año = **$1.54/mes**

**Costo API Deepgram:**
- Límite: 180 min/día × 30 días = 5,400 min/mes
- Uso promedio: ~60% del límite = 3,240 min/mes
- Cálculo: 3,240 min × $0.0043 = **-$13.932 USD/mes**

**Profit Final:**
- Ingreso neto: $1.54/mes
- Costo API: -$13.932/mes
- **Profit: -$12.39 USD/mes por usuario** ❌ **PÉRDIDA GRANDE**
- **Margen: -804%** ❌

---

## 📊 ESCENARIOS CON DIFERENTES BASES DE USUARIOS

### ⚠️ ALERTA: TODOS LOS ESCENARIOS SON NEGATIVOS CON ESTA ESTRUCTURA

---

### Escenario 1: 100 Usuarios Totales

**Distribución estimada:**
- 85 usuarios gratis (85%)
- 12 usuarios Premium Mensual (12%)
- 3 usuarios Premium Anual (3%)
- **Tasa conversión total:** 15%

**Cálculo Mensual:**

| Tier | Usuarios | Costo API/Usuario | Ingreso Neto/Usuario | Profit/Usuario | Total Profit |
|------|----------|-------------------|----------------------|----------------|--------------|
| Gratis | 85 | -$2.322 | +$0.216 | -$2.106 | **-$179.01** |
| Premium Mensual | 12 | -$7.74 | +$1.68 | -$6.06 | **-$72.72** |
| Premium Anual | 3 | -$13.932 | +$1.54 | -$12.39 | **-$37.17** |

**TOTAL MENSUAL: -$288.90** ❌ PÉRDIDA
**Revenue Mensual:** $26.50
**Costos API Mensual:** $315.40

**Consumo de Crédito Deepgram ($200):**
- Consumo mensual: $315.40
- **Tiempo para agotar $200:** 18.9 días (~0.63 meses)

---

### Escenario 2: 1,000 Usuarios Totales

**Distribución estimada:**
- 850 usuarios gratis (85%)
- 120 usuarios Premium Mensual (12%)
- 30 usuarios Premium Anual (3%)
- **Tasa conversión total:** 15%

**Cálculo Mensual:**

| Tier | Usuarios | Costo API/Usuario | Ingreso Neto/Usuario | Profit/Usuario | Total Profit |
|------|----------|-------------------|----------------------|----------------|--------------|
| Gratis | 850 | -$2.322 | +$0.216 | -$2.106 | **-$1,790.10** |
| Premium Mensual | 120 | -$7.74 | +$1.68 | -$6.06 | **-$727.20** |
| Premium Anual | 30 | -$13.932 | +$1.54 | -$12.39 | **-$371.70** |

**TOTAL MENSUAL: -$2,889.00** ❌ PÉRDIDA GRANDE
**Revenue Mensual:** $265.00
**Costos API Mensual:** $3,154.00

**Consumo de Crédito Deepgram ($200):**
- Consumo mensual: $3,154.00
- **Tiempo para agotar $200:** 1.9 días (~0.063 meses)

---

### Escenario 3: 10,000 Usuarios Totales

**Distribución estimada:**
- 8,500 usuarios gratis (85%)
- 1,200 usuarios Premium Mensual (12%)
- 300 usuarios Premium Anual (3%)
- **Tasa conversión total:** 15%

**Cálculo Mensual:**

| Tier | Usuarios | Costo API/Usuario | Ingreso Neto/Usuario | Profit/Usuario | Total Profit |
|------|----------|-------------------|----------------------|----------------|--------------|
| Gratis | 8,500 | -$2.322 | +$0.216 | -$2.106 | **-$17,901.00** |
| Premium Mensual | 1,200 | -$7.74 | +$1.68 | -$6.06 | **-$7,272.00** |
| Premium Anual | 300 | -$13.932 | +$1.54 | -$12.39 | **-$3,717.00** |

**TOTAL MENSUAL: -$28,890.00** ❌ PÉRDIDA ENORME
**Revenue Mensual:** $2,650.00
**Costos API Mensual:** $31,540.00
**RevenueCat:** GRATIS (bajo umbral de $2,500/mes)

**Consumo de Crédito Deepgram ($200):**
- Consumo mensual: $31,540.00
- **Tiempo para agotar $200:** 0.19 días (~4.6 horas) ⚠️

---

### Escenario 4: 50,000 Usuarios Totales

**Distribución estimada:**
- 42,500 usuarios gratis (85%)
- 6,000 usuarios Premium Mensual (12%)
- 1,500 usuarios Premium Anual (3%)
- **Tasa conversión total:** 15%

**Cálculo Mensual:**

| Tier | Usuarios | Costo API/Usuario | Ingreso Neto/Usuario | Profit/Usuario | Total Profit |
|------|----------|-------------------|----------------------|----------------|--------------|
| Gratis | 42,500 | -$2.322 | +$0.216 | -$2.106 | **-$89,505.00** |
| Premium Mensual | 6,000 | -$7.74 | +$1.68 | -$6.06 | **-$36,360.00** |
| Premium Anual | 1,500 | -$13.932 | +$1.54 | -$12.39 | **-$18,585.00** |

**TOTAL MENSUAL: -$144,450.00** ❌ PÉRDIDA CATASTRÓFICA
**Revenue Mensual:** $13,250.00
**Costos API Mensual:** $157,700.00
**RevenueCat (1% sobre exceso):** -$107.50/mes

**Consumo de Crédito Deepgram ($200):**
- Consumo mensual: $157,700.00
- **Tiempo para agotar $200:** 0.038 días (~55 minutos) 🚨

---

## 🚨 ANÁLISIS CRÍTICO DEL MODELO

### ❌ PROBLEMAS GRAVES

1. **Límites de transcripción DEMASIADO ALTOS:**
   - Tier gratis: 900 min/mes es EXCESIVO (vs 90 min en modelo anterior)
   - Premium mensual: 3,600 min/mes es INSOSTENIBLE
   - Premium anual: 5,400 min/mes es CATASTRÓFICO

2. **Precios DEMASIADO BAJOS:**
   - $2/mes no cubre ni el 22% del costo de API promedio
   - $1.83/mes (anual) es aún peor
   - Necesitas ~$10-15/mes mínimo para ser sostenible

3. **Modelo económico ROTO:**
   - Cada usuario premium PIERDE dinero
   - Más usuarios = MÁS pérdidas (no hay economía de escala)
   - Los $200 de crédito Deepgram se agotan en HORAS con 10K+ usuarios

4. **Tier gratis con publicidad NO funciona:**
   - Ads generan $0.216/mes
   - Costo API promedio: $2.322/mes
   - **Déficit de $2.106/mes por usuario gratis**

---

## 💡 COMPARACIÓN CON MODELO ANTERIOR (VIABLE)

### Modelo Anterior (del archivo calculos-revenue.md):

| Tier | Límite | Precio | Profit/Usuario | Margen |
|------|--------|--------|----------------|--------|
| Gratis | 90 min/mes | Ads | +$0.0225 | ✅ Positivo |
| Premium Basic | 180 min/mes | $3/mes | +$2.133 | ✅ 71% |
| Premium Pro | 500 min/mes | $5/mes | +$2.05 | ✅ 49% |

### Modelo Nuevo (PROPUESTO - INVIABLE):

| Tier | Límite | Precio | Profit/Usuario | Margen |
|------|--------|--------|----------------|--------|
| Gratis | 900 min/mes | Ads | -$2.106 | ❌ Negativo |
| Premium Mensual | 3,600 min/mes | $2/mes | -$6.06 | ❌ -303% |
| Premium Anual | 5,400 min/mes | $1.83/mes | -$12.39 | ❌ -804% |

---

## 🎯 RECOMENDACIONES URGENTES

### ❌ NO IMPLEMENTAR ESTE MODELO

Este modelo es **financieramente inviable** y llevaría a la quiebra del proyecto. Los $200 de crédito Deepgram se agotarían en cuestión de días u horas.

### ✅ ALTERNATIVAS VIABLES

#### Opción A: Ajustar límites dramáticamente

**Tier Gratis (Con Ads):**
- **MÁXIMO 60 min/mes** (2 min/día promedio)
- 3 audios/día × 1 min máx
- Profit: ~$0 (break-even con ads)

**Tier Premium Mensual ($3.99/mes):**
- **MÁXIMO 300 min/mes** (10 min/día promedio)
- 10 audios/día × 1 min máx
- Profit estimado: ~$1.50/mes ✅

**Tier Premium Anual ($39.99/año = $3.33/mes):**
- **MÁXIMO 600 min/mes** (20 min/día promedio)
- 20 audios/día × 1 min máx
- Profit estimado: ~$0.75/mes ✅

#### Opción B: Aumentar precios significativamente

**Tier Gratis:** Igual, 60 min/mes

**Tier Premium Mensual ($9.99/mes):**
- 600 min/mes (20 min/día)
- Profit estimado: ~$7.00/mes ✅

**Tier Premium Anual ($89.99/año = $7.50/mes):**
- 1,200 min/mes (40 min/día)
- Profit estimado: ~$2.34/mes ✅

#### Opción C: Modelo híbrido con créditos

**Tier Gratis:** 30 min/mes + Ads

**Premium Mensual ($4.99/mes):**
- 200 min/mes incluidos
- Créditos adicionales: $0.01/min
- Profit base: ~$3.13/mes ✅

**Premium Anual ($49.99/año = $4.16/mes):**
- 400 min/mes incluidos
- Créditos adicionales: $0.01/min
- Profit base: ~$2.37/mes ✅

---

## 📈 TIEMPO DE CONSUMO DE $200 CRÉDITO DEEPGRAM

### Con Modelo PROPUESTO (INVIABLE):

| Usuarios | Consumo API/Mes | Tiempo para agotar $200 |
|----------|-----------------|-------------------------|
| 100 | $315.40 | **18.9 días** |
| 1,000 | $3,154.00 | **1.9 días** |
| 10,000 | $31,540.00 | **4.6 horas** ⚠️ |
| 50,000 | $157,700.00 | **55 minutos** 🚨 |

### Con Modelo ANTERIOR (VIABLE):

| Usuarios | Consumo API/Mes | Tiempo para agotar $200 |
|----------|-----------------|-------------------------|
| 100 | $31.54 | **6.3 meses** ✅ |
| 1,000 | $315.40 | **19 días** ✅ |
| 10,000 | $968.00* | **6.2 días** ⚠️ |
| 50,000 | $4,840.00* | **1.2 días** ❌ |

*Basado en cálculos del archivo original con límites razonables

---

## ✅ CONCLUSIÓN FINAL

### Veredicto: 🚨 MODELO PROPUESTO ES INVIABLE

**Razones:**
1. ❌ Límites de transcripción 10x más altos que modelo viable
2. ❌ Precios 40-60% más bajos que punto de equilibrio
3. ❌ Pérdidas del -303% al -804% por usuario premium
4. ❌ $200 de crédito se consumen en minutos/horas con escala
5. ❌ Tier gratis genera -$2.10/usuario/mes de pérdida

**Recomendación:**
- ✅ **Mantener estructura del archivo [calculos-revenue.md](calculos-revenue.md)**
- ✅ **Límites:** Gratis 90 min/mes, Basic 180 min/mes, Pro 500 min/mes
- ✅ **Precios:** Basic $3/mes, Pro $5/mes
- ✅ **Resultado:** Márgenes positivos 49-71%, sostenible a largo plazo

**Si se implementa el modelo propuesto:**
- 💸 Con 1,000 usuarios perderías $2,889/mes
- 💸 Con 10,000 usuarios perderías $28,890/mes
- 💸 Los $200 de Deepgram se agotarían en 1-2 días con 1,000 usuarios
- 💸 Necesitarías ~$3,000/mes adicionales para subsidiar pérdidas (10K usuarios)

---

**Creado:** Octubre 2025
**Basado en:** [calculos-revenue.md](calculos-revenue.md)
**Status:** ⚠️ MODELO INVIABLE - NO IMPLEMENTAR
