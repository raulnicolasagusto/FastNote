import React from 'react';
import { Platform, Alert } from 'react-native';
import { Note } from '../types';
import { NoteImageGenerator } from '../components/NoteImageGenerator';

/**
 * Generate filename for the note image
 */
export const generateImageFilename = (noteTitle: string): string => {
  const sanitizedTitle = noteTitle
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 50);
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-T]/g, '');
  return `FastNote_${sanitizedTitle}_${timestamp}.png`;
};

/**
 * Placeholder function for SVG to image conversion
 * This will be implemented after native build with react-native-view-shot
 */
export const svgComponentToBase64 = async (
  svgComponent: React.ReactElement,
  width: number = 768,
  height: number = 768
): Promise<string> => {
  console.log('🖼️ SVG conversion requested for:', { width, height });
  
  // This is a placeholder that simulates image generation
  // The actual implementation will use react-native-view-shot after build
  throw new Error('Image generation requires native build. Please build the app first.');
};

/**
 * Generate the note image data
 */
export const generateNoteImageData = async (note: Note): Promise<string> => {
  try {
    console.log('📝 Generating image for note:', note.title);
    
    // Create the React component for the note
    const noteComponent = React.createElement(NoteImageGenerator, { note });
    
    // Convert to base64 (placeholder for now)
    const base64Data = await svgComponentToBase64(noteComponent);
    
    return base64Data;
  } catch (error) {
    console.error('❌ Error generating note image:', error);
    throw new Error(`Failed to generate note image: ${error}`);
  }
};

/**
 * Save image data to file system
 * This is a placeholder implementation that will work after build
 */
export const saveImageToFile = async (base64Data: string, filename: string): Promise<string> => {
  console.log('💾 Saving image to file:', filename);
  
  // This is a placeholder - actual implementation after build
  throw new Error('File saving requires native build. Please build the app first.');
};

/**
 * Share the note as an image
 * Shows a user-friendly message for now, will work after build
 */
export const shareNoteAsImage = async (note: Note): Promise<void> => {
  try {
    console.log('🔄 Starting share process for note:', note.title);

    // Show info alert for now
    Alert.alert(
      '🚧 Feature Coming Soon',
      'The "Share as Image" feature requires a native build. This functionality will work after you build the app.\n\nFor now, you can:\n• Copy the note text\n• Use the share button for text sharing',
      [
        { text: 'Copy Text', onPress: () => copyNoteText(note) },
        { text: 'OK', style: 'cancel' }
      ]
    );

  } catch (error) {
    console.error('❌ Error in shareNoteAsImage:', error);
    Alert.alert(
      'Error',
      'Failed to share note. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

/**
 * Copy note text to clipboard (fallback function)
 */
const copyNoteText = (note: Note): void => {
  console.log('📋 Copying note text:', note.title);
  
  // This would copy to clipboard in a real implementation
  Alert.alert(
    'Note Content',
    `Title: ${note.title}\n\nContent:\n${note.content}`,
    [{ text: 'OK' }]
  );
};

/**
 * Check if image sharing is supported on current platform
 */
export const isImageSharingSupported = (): boolean => {
  // For now, return false until native build
  // After build, this will return true for iOS and Android
  return false;
};

export default {
  generateImageFilename,
  svgComponentToBase64,
  generateNoteImageData,
  saveImageToFile,
  shareNoteAsImage,
  isImageSharingSupported,
};