import { Platform } from 'react-native';
import { Note } from '../types';
import { NoteWidget } from '../widgets/NoteWidget';
import { requestWidgetUpdate } from 'react-native-android-widget';

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
      
      // Update the widget with the specific note
      await requestWidgetUpdate({
        widgetName,
        renderWidget: () => <NoteWidget note={note} size={widgetName.includes('Small') ? 'small' : widgetName.includes('Large') ? 'large' : 'medium'} />,
        widgetNotFound: () => {
          console.log('Widget not on home screen yet');
        },
      });
      
      console.log(`✅ Widget updated with note: ${note.title}`);
      return true;
    } catch (error) {
      console.error('❌ Error updating widget:', error);
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
