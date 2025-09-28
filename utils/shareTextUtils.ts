import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Note } from '../types';

/**
 * Format note content as plain text for sharing
 */
export const formatNoteAsText = (note: Note): string => {
  let textContent = '';
  
  // Add title
  if (note.title && note.title.trim()) {
    textContent += `${note.title.trim()}\n`;
    textContent += '='.repeat(note.title.length) + '\n\n';
  }
  
  // Add text content
  if (note.content && note.content.trim()) {
    textContent += `${note.content.trim()}\n\n`;
  }
  
  // Add checklist items
  if (note.checklistItems && note.checklistItems.length > 0) {
    textContent += 'Lista:\n';
    note.checklistItems.forEach((item, index) => {
      const checkbox = item.completed ? '✅' : '☐';
      textContent += `${checkbox} ${item.text}\n`;
    });
    textContent += '\n';
  }
  
  // Add metadata
  const dateStr = new Date(note.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  textContent += `---\nCreado: ${dateStr}\nCreated with FastVoiceNote`;
  
  return textContent.trim();
};

/**
 * Share the note as plain text
 */
export const shareNoteAsText = async (note: Note): Promise<void> => {
  try {
    console.log('🔄 Starting text share process for note:', note.title);

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Sharing Not Available',
        'Sharing is not available on this device.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Format note content as text
    const textContent = formatNoteAsText(note);
    
    // Generate filename
    const sanitizedTitle = note.title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .slice(0, 50);
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-T]/g, '');
    const filename = `FastVoiceNote_${sanitizedTitle}_${timestamp}.txt`;

    // Share the text content directly
    await Sharing.shareAsync(textContent, {
      mimeType: 'text/plain',
      dialogTitle: `Share "${note.title}"`,
    });

    console.log('📄 Text shared directly as content');

    console.log('✅ Note shared as text successfully');
  } catch (error) {
    console.error('❌ Error in shareNoteAsText:', error);
    
    let errorMessage = 'Failed to share note as text. Please try again.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
  }
};

/**
 * Check if text sharing is supported on current platform
 */
export const isTextSharingSupported = (): boolean => {
  // Text sharing is supported on all platforms
  return true;
};

export default {
  formatNoteAsText,
  shareNoteAsText,
  isTextSharingSupported,
};