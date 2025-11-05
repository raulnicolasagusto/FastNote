import { Platform } from 'react-native';
import { Note } from '../types';

// Usamos SharedPreferences de Android directamente
const { NativeModules } = require('react-native');

export interface HomeWidgetService {
  prepareNoteWidget: (note: Note) => Promise<boolean>;
  updateNoteWidget: (noteId: string) => Promise<boolean>;
  isSupported: () => Promise<boolean>;
}

export const homeWidgetService: HomeWidgetService = {
  prepareNoteWidget: async (note: Note): Promise<boolean> => {
    try {
      if (Platform.OS !== 'android') {
        return false;
      }
      
      // Guardar en SharedPreferences nativo para que widget pueda leer
      const RNSharedPreferences = NativeModules.RNSharedPreferences;
      if (RNSharedPreferences) {
        await RNSharedPreferences.setItem('widget_note_data', JSON.stringify({
          id: note.id,
          title: note.title,
          content: note.content,
          type: note.type,
          checklistItems: note.checklistItems || [],
        }));
        console.log(`📌 Nota guardada en SharedPreferences: ${note.id}`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error guardando nota:', error);
      return false;
    }
  },

  updateNoteWidget: async (noteId: string): Promise<boolean> => {
    return true;
  },

  isSupported: async (): Promise<boolean> => {
    return Platform.OS === 'android';
  },
};
