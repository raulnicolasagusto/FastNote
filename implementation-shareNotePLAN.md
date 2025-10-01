## Plan: Implementar "Compartir Nota con Alguien" - Enfoque Híbrido

### Opción Recomendada: QR Code + Firebase (Híbrido)

**Fase 1: QR Code Sharing (Simple, Offline)**
1. Instalar dependencias:
   - `react-native-qrcode-svg` - Generar QR codes
   - `expo-camera` - Escanear QR codes (ya instalado)
2. Crear componente `QRShareModal.tsx`:
   - Serializar nota a JSON
   - Comprimir con base64
   - Generar QR code
   - Mostrar al usuario
3. Crear componente `QRScanModal.tsx`:
   - Escanear QR con expo-camera
   - Decodificar JSON
   - Crear copia de la nota
4. Configurar deep linking en `app.json`
5. Limitación: Solo notas de texto/checklist (sin imágenes grandes)

**Fase 2: Firebase Link Sharing (Completo, Requiere Internet)**
1. Setup Firebase:
   - Configurar proyecto Firebase
   - Instalar `firebase` package
   - Configurar Firestore + Anonymous Auth
2. Crear servicio `shareService.ts`:
   - Función `uploadNoteToFirebase()` → retorna enlace
   - Función `downloadNoteFromFirebase(shareId)` → retorna nota
   - Auto-expiración a 24h
3. Crear componente `LinkShareModal.tsx`:
   - Subir nota a Firebase
   - Generar deep link: `fastnote://share/abc123`
   - Mostrar opciones de compartir (WhatsApp, Email, etc.)
4. Handler de deep links para recibir notas

**Fase 3: UI/UX**
1. Modificar `handleShareWithSomeone()` en `note-detail.tsx`
2. Crear modal de selección:
   - Botón "QR Code" (offline, solo texto)
   - Botón "Enlace" (online, todo tipo)
3. Agregar indicadores visuales de limitaciones

**Resultado:**
- ✅ Compartir localmente sin internet (QR)
- ✅ Compartir remotamente con todo el contenido (Firebase)
- ✅ Sin sistema de auth complejo
- ✅ Privacidad: enlaces expirables

**Tiempo estimado:** 4-6 horas de desarrollo
**Costo:** Gratis (Firebase free tier es suficiente)