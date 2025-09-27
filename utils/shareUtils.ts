import { Platform, Alert, Linking } from 'react-native';
import { Note } from '../types';

/**
 * Creates a formatted text version of the note for sharing
 */
export function createShareableText(note: Note): string {
  let shareText = `📝 ${note.title}\n\n${note.content}`;
  
  // Add checklist items if present
  if (note.checklistItems && note.checklistItems.length > 0) {
    shareText += '\n\n📋 Lista de tareas:\n';
    note.checklistItems.forEach(item => {
      const checkbox = item.completed ? '✅' : '☐';
      shareText += `${checkbox} ${item.text}\n`;
    });
  }
  
  shareText += '\n\n✨ Creado con FastNote';
  return shareText;
}

/**
 * Creates WhatsApp formatted text with special formatting
 */
export function createWhatsAppText(note: Note): string {
  let whatsappText = `📝 *${note.title}*\n\n${note.content}`;
  
  if (note.checklistItems && note.checklistItems.length > 0) {
    whatsappText += '\n\n📋 *Lista de tareas:*\n';
    note.checklistItems.forEach(item => {
      const checkbox = item.completed ? '✅' : '☐';
      whatsappText += `${checkbox} ${item.text}\n`;
    });
  }
  
  whatsappText += '\n\n✨ _Creado con FastNote_';
  return whatsappText;
}

/**
 * Simple sharing using deep links and system share
 */
export async function shareNote(note: Note, svgContent?: string): Promise<void> {
  try {
    const shareText = createShareableText(note);
    
    if (Platform.OS === 'web') {
      // On web, try Web Share API or copy to clipboard
      if (navigator.share) {
        await navigator.share({
          title: 'Nota de FastNote',
          text: shareText,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareText);
        Alert.alert('Copiado', 'Contenido copiado al portapapeles');
      }
    } else {
      // On mobile, encode text and use system share
      const encodedText = encodeURIComponent(shareText);
      const shareUrl = `text/plain?text=${encodedText}`;
      
      // For mobile, just show the content in an alert for now
      // This is safer than trying to open deep links that might crash
      Alert.alert(
        'Compartir nota',
        shareText,
        [
          { text: 'Cerrar', style: 'cancel' },
          { text: 'OK' }
        ]
      );
    }
  } catch (error: any) {
    console.error('Error sharing note:', error);
    // Final fallback: show content in alert
    Alert.alert(
      'Compartir nota',
      createShareableText(note),
      [
        { text: 'Cerrar', style: 'cancel' },
        { text: 'Copiar', onPress: () => copyToClipboard(createShareableText(note)) }
      ]
    );
  }
}

/**
 * Share specifically to WhatsApp using deep link
 */
export async function shareToWhatsApp(note: Note, svgContent?: string): Promise<void> {
  try {
    const whatsappText = createWhatsAppText(note);
    
    if (Platform.OS === 'web') {
      // On web, fallback to general share
      await shareNote(note, svgContent);
      return;
    }
    
    // Try WhatsApp deep link
    const encodedText = encodeURIComponent(whatsappText);
    const whatsappUrl = `whatsapp://send?text=${encodedText}`;
    
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
    } else {
      // WhatsApp not installed, show the formatted text
      Alert.alert(
        'WhatsApp no disponible',
        `WhatsApp no está instalado. Aquí está el contenido formateado para WhatsApp:\n\n${whatsappText}`,
        [{ text: 'Cerrar' }]
      );
    }
  } catch (error: any) {
    console.error('Error sharing to WhatsApp:', error);
    Alert.alert('Error', 'No se pudo abrir WhatsApp');
  }
}

/**
 * Share image data - simplified version for now
 * TODO: Implement proper file sharing once expo modules are configured
 */
export async function shareImageData(
  imageData: string, 
  note: Note
): Promise<void> {
  try {
    // For now, show a success message
    // The actual image sharing will be implemented in the next phase
    Alert.alert(
      'Imagen generada',
      `La imagen de "${note.title}" se ha generado correctamente. La funcionalidad de compartir imagen estará disponible próximamente.`,
      [
        { text: 'OK' },
        { text: 'Compartir texto', onPress: () => shareNote(note) }
      ]
    );
    
  } catch (error) {
    console.error('Error with image:', error);
    throw error;
  }
}

/**
 * Share with image - enhanced implementation
 */
export async function shareWithImage(note: Note, imageData?: string): Promise<void> {
  if (!imageData) {
    Alert.alert(
      'Imagen no lista',
      'La imagen aún se está generando. ¿Te gustaría compartir como texto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Compartir texto', onPress: () => shareNote(note) }
      ]
    );
    return;
  }

  try {
    await shareImageData(imageData, note);
  } catch (error) {
    // If image sharing fails, offer text alternative
    Alert.alert(
      'Error al compartir imagen',
      'No se pudo compartir la imagen. ¿Te gustaría compartir como texto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Compartir texto', onPress: () => shareNote(note) }
      ]
    );
  }
}

/**
 * Show share options based on what's available
 */
export function showShareOptions(note: Note, imageData?: string): void {
  const options = [
    { text: 'Cancelar', style: 'cancel' as const },
    { 
      text: 'Compartir texto', 
      onPress: () => shareNote(note) 
    },
    {
      text: 'WhatsApp',
      onPress: () => shareToWhatsApp(note)
    }
  ];

  if (imageData) {
    options.splice(2, 0, {
      text: 'Compartir imagen',
      onPress: () => shareWithImage(note, imageData)
    });
  }

  Alert.alert('Compartir nota', 'Elige cómo compartir:', options);
}

/**
 * Copy text to clipboard - safe version
 */
async function copyToClipboard(text: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      await navigator.clipboard.writeText(text);
      Alert.alert('Copiado', 'Contenido copiado al portapapeles');
    } else {
      // For mobile, just show the text in a simple alert
      Alert.alert(
        'Contenido para copiar',
        text,
        [{ text: 'Cerrar' }]
      );
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    Alert.alert('Error', 'No se pudo acceder al portapapeles');
  }
}