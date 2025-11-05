import { Platform } from 'react-native';
import { Note } from '../types';
import { NoteWidget } from '../widgets/NoteWidget';
import { requestWidgetUpdate } from 'react-native-android-widget';

// Usamos SharedPreferences de Android directamente
const { NativeModules } = require('react-native');

export interface HomeWidgetService {
  prepareNoteWidget: (note: Note, widgetName: string) => Promise<boolean>;
  updateNoteWidget: (noteId: string) => Promise<boolean>;
  isSupported: () => Promise<boolean>;
}

export const homeWidgetService: HomeWidgetService = {
  prepareNoteWidget: async (note: Note, widgetName: string): Promise<boolean> => {
    try {
      if (Platform.OS !== 'android') {
        return false;
      }
      
      // Guardar la configuración del widget en SharedPreferences para que esté disponible cuando 
      // el widget se agregue a la pantalla principal
      const RNSharedPreferences = NativeModules.RNSharedPreferences;
      if (RNSharedPreferences) {
        const widgetConfig = {
          noteId: note.id,
          noteTitle: note.title,
          noteContent: note.content,
          noteType: note.type,
          checklistItems: note.checklistItems || [],
          backgroundColor: note.backgroundColor || 'default',
          size: widgetName.includes('Small') ? 'small' : widgetName.includes('Large') ? 'large' : 'medium',
        };
        
        await RNSharedPreferences.setItem(`widget_config_${widgetName}`, JSON.stringify(widgetConfig));
        console.log(`📌 Configuración guardada para widget: ${widgetName}`);
      }
      
      // Determinar el tamaño del widget basado en el nombre
      let size: 'small' | 'medium' | 'large' = 'medium';
      if (widgetName.includes('Small')) {
        size = 'small';
      } else if (widgetName.includes('Large')) {
        size = 'large';
      } else {
        size = 'medium'; // Default to medium
      }

      // Actualizar el widget usando requestWidgetUpdate
      await requestWidgetUpdate({
        widgetName,
        renderWidget: () => <NoteWidget note={note} size={size} />,
        widgetNotFound: () => {
          console.log('Widget not on home screen yet - config saved for when it gets added');
        },
      });
      
      console.log(`✅ Widget config prepared with note: ${note.title}`);
      return true;
    } catch (error) {
      console.error('❌ Error preparing widget:', error);
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
