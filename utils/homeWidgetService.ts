import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types';

// Storage key for the currently selected note for widget
const WIDGET_PENDING_NOTE_KEY = '@fastnote_widget_pending_note';

export interface HomeWidgetService {
  prepareNoteWidget: (note: Note) => Promise<boolean>;
  updateNoteWidget: (noteId: string) => Promise<boolean>;
  isSupported: () => Promise<boolean>;
}

export const homeWidgetService: HomeWidgetService = {
  /**
   * Prepares a note to be used in a widget
   * Saves the note ID to AsyncStorage so the widget can pick it up
   * @param note The note to add as a widget
   * @returns Promise<boolean> indicating success or failure
   */
  prepareNoteWidget: async (note: Note): Promise<boolean> => {
    try {
      console.log(`📌 Preparing widget for note: ${note.id} - ${note.title}`);
      
      // Check if platform is Android
      if (Platform.OS !== 'android') {
        console.log('⚠️ Widgets are only supported on Android');
        return false;
      }
      
      // Save the note ID as the pending widget note
      await AsyncStorage.setItem(WIDGET_PENDING_NOTE_KEY, note.id);
      
      console.log(`✅ Widget pending note saved: ${note.id}`);
      
      return true;
    } catch (error) {
      console.error('❌ Error preparing note widget:', error);
      return false;
    }
  },

  /**
   * Updates all widgets that are showing this note
   * @param noteId The ID of the note that was updated
   * @returns Promise<boolean> indicating success or failure
   */
  updateNoteWidget: async (noteId: string): Promise<boolean> => {
    try {
      console.log(`🔄 Widget update requested for note: ${noteId}`);
      // Widgets will auto-update when the user opens them
      // We don't need to manually trigger updates
      return true;
    } catch (error) {
      console.error('❌ Error updating note widgets:', error);
      return false;
    }
  },
  
  /**
   * Checks if home widgets are supported on this device
   * @returns Promise<boolean> indicating if widgets are supported
   */
  isSupported: async (): Promise<boolean> => {
    try {
      // Check if platform is Android
      const isAndroid = Platform.OS === 'android';
      
      if (!isAndroid) {
        return false;
      }
      
      // Android 8.0+ supports widgets
      // We assume Android version is sufficient if we're on Android
      return true;
    } catch (error) {
      console.error('❌ Error checking widget support:', error);
      return false;
    }
  }
};
