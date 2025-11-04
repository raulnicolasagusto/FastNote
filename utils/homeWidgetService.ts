import { Note } from '../types/note';
import { 
  addWidget, 
  updateWidget, 
  isSupported,
  WidgetSize
} from 'react-native-home-widget';

// Interface for home widget functionality
export interface HomeWidgetService {
  addNoteAsWidget: (note: Note, size: 'small' | 'medium' | 'large') => Promise<boolean>;
  updateWidget: (note: Note) => Promise<boolean>;
  isSupported: () => Promise<boolean>;
}

// Mapping of our sizes to the library's WidgetSize
const sizeMap: Record<'small' | 'medium' | 'large', WidgetSize> = {
  'small': WidgetSize.Small,
  'medium': WidgetSize.Medium, 
  'large': WidgetSize.Large
};

// Implementation for home widget service
export const homeWidgetService: HomeWidgetService = {
  /**
   * Adds a note as a home screen widget with specified size
   * @param note The note to add as a widget
   * @param size The size of the widget (small, medium, large)
   * @returns Promise<boolean> indicating success or failure
   */
  addNoteAsWidget: async (note: Note, size: 'small' | 'medium' | 'large'): Promise<boolean> => {
    try {
      // Check if widgets are supported on this platform
      const supported = await isSupported();
      if (!supported) {
        console.log('Widgets are not supported on this device');
        return false;
      }
      
      // Prepare data to be passed to the widget
      const widgetData = {
        noteId: note.id,
        title: note.title || 'Untitled Note',
        content: note.content || '',
        lastModified: note.lastModified || new Date().toISOString(),
        color: note.color || '#ffffff', // Include note color for styling
      };
      
      // Add the widget using the library
      const result = await addWidget({
        widgetName: 'NoteWidget',
        data: widgetData,
        size: sizeMap[size]
      });
      
      console.log(`Widget added successfully: ${result}`);
      return result; // Returns true if successful
    } catch (error) {
      console.error('Error adding note as widget:', error);
      return false;
    }
  },

  /**
   * Updates an existing home screen widget with new note data
   * @param note The updated note to display in the widget
   * @returns Promise<boolean> indicating success or failure
   */
  updateWidget: async (note: Note): Promise<boolean> => {
    try {
      // Prepare updated data to be passed to the widget
      const widgetData = {
        noteId: note.id,
        title: note.title || 'Untitled Note',
        content: note.content || '',
        lastModified: note.lastModified || new Date().toISOString(),
        color: note.color || '#ffffff', // Include note color for styling
      };
      
      // Update the widget using the library
      const result = await updateWidget({
        widgetName: 'NoteWidget',
        data: widgetData
      });
      
      console.log(`Widget updated successfully: ${result}`);
      return result; // Returns true if successful
    } catch (error) {
      console.error('Error updating widget:', error);
      return false;
    }
  },
  
  /**
   * Checks if home widgets are supported on this device
   * @returns Promise<boolean> indicating if widgets are supported
   */
  isSupported: async (): Promise<boolean> => {
    try {
      return await isSupported();
    } catch (error) {
      console.error('Error checking widget support:', error);
      return false;
    }
  }
};