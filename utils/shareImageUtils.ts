import React from 'react';
import { Platform, Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
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
 * Capture a React Native component as image using react-native-view-shot
 */
export const captureComponentAsImage = async (
  componentRef: React.RefObject<any>,
  options: {
    format?: 'png' | 'jpg';
    quality?: number;
    width?: number;
    height?: number;
  } = {}
): Promise<string> => {
  try {
    console.log('🖼️ Capturing component as image...');
    
    const {
      format = 'png',
      quality = 1.0,
      width = 768,
      height = 768
    } = options;

    const uri = await captureRef(componentRef.current, {
      format,
      quality,
      width,
      height,
      result: 'tmpfile',
    });

    console.log('✅ Component captured successfully:', uri);
    return uri;
  } catch (error) {
    console.error('❌ Error capturing component:', error);
    throw new Error(`Failed to capture component: ${error}`);
  }
};

/**
 * Generate the note image data using component reference
 */
export const generateNoteImageData = async (
  componentRef: React.RefObject<any>,
  note: Note
): Promise<string> => {
  try {
    console.log('📝 Generating image for note:', note.title);

    // Wait a bit for images to load before capturing
    // This is especially important when the note has images
    const hasImages = (note.images && note.images.length > 0) ||
                     (note.contentBlocks && note.contentBlocks.some(b => b.type === 'image'));

    if (hasImages) {
      console.log('⏳ Note has images, waiting 1 second for them to load...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Capture the component as image
    const imageUri = await captureComponentAsImage(componentRef, {
      format: 'png',
      quality: 1.0,
      width: 768,
      height: 768
    });

    return imageUri;
  } catch (error) {
    console.error('❌ Error generating note image:', error);
    throw new Error(`Failed to generate note image: ${error}`);
  }
};

/**
 * Save image data to file system
 */
export const saveImageToFile = async (imageUri: string, filename: string): Promise<string> => {
  try {
    console.log('💾 Saving image to file:', filename);
    
    // For now, we'll use the temporary file directly
    // The imageUri from react-native-view-shot is already a valid file path
    const newPath = imageUri;
    
    console.log('📁 Using image path directly:', newPath);
    
    console.log('✅ Image saved successfully:', newPath);
    return newPath;
  } catch (error) {
    console.error('❌ Error saving image:', error);
    throw new Error(`Failed to save image: ${error}`);
  }
};

/**
 * Share the note as an image
 * This function needs to be called with a component reference
 */
export const shareNoteAsImage = async (
  componentRef: React.RefObject<any>,
  note: Note
): Promise<void> => {
  try {
    console.log('🔄 Starting share process for note:', note.title);

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

    // Generate the image
    const imageUri = await generateNoteImageData(componentRef, note);
    
    // Generate filename
    const filename = generateImageFilename(note.title);
    
    // Save to file (in this case, just use the temp file)
    const finalPath = await saveImageToFile(imageUri, filename);

    // Share the image
    await Sharing.shareAsync(finalPath, {
      mimeType: 'image/png',
      dialogTitle: `Share "${note.title}"`,
    });

    console.log('✅ Note shared successfully');
  } catch (error) {
    console.error('❌ Error in shareNoteAsImage:', error);
    
    let errorMessage = 'Failed to share note. Please try again.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
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
  captureComponentAsImage,
  generateNoteImageData,
  saveImageToFile,
  shareNoteAsImage,
  isImageSharingSupported,
};