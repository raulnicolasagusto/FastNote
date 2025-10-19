import { Platform, Alert, Linking } from 'react-native';
import { Note } from '../types';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WidgetPinModule from '../modules/WidgetPinModule';

/**
 * Widget Service
 *
 * Handles all widget-related functionality for Android home screen widgets
 *
 * NOW WITH DIRECT WIDGET PINNING! 🎉
 * Uses native requestPinAppWidget API (Android 8.0+) to add widgets directly
 * to the home screen with just 1 tap + user confirmation.
 */

const PENDING_WIDGET_NOTE_KEY = '@fastnote_pending_widget_note';

export const WidgetService = {
  /**
   * Check if widgets are supported on this platform
   */
  isWidgetSupported: (): boolean => {
    return Platform.OS === 'android';
  },

  /**
   * Store pending widget note data for configuration
   */
  storePendingWidgetNote: async (note: Note): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        PENDING_WIDGET_NOTE_KEY,
        JSON.stringify({ noteId: note.id })
      );
      console.log('📝 Stored pending widget note:', note.id);
    } catch (error) {
      console.error('Error storing pending widget note:', error);
    }
  },

  /**
   * Get and clear pending widget note data
   */
  getPendingWidgetNote: async (): Promise<string | null> => {
    try {
      const data = await AsyncStorage.getItem(PENDING_WIDGET_NOTE_KEY);
      if (data) {
        await AsyncStorage.removeItem(PENDING_WIDGET_NOTE_KEY);
        const parsed = JSON.parse(data);
        console.log('📱 Retrieved pending widget note:', parsed.noteId);
        return parsed.noteId;
      }
      return null;
    } catch (error) {
      console.error('Error getting pending widget note:', error);
      return null;
    }
  },

  /**
   * Add a note to home screen as a widget
   *
   * Uses requestPinAppWidget API for direct placement (Android 8.0+)
   * Falls back to manual instructions on older Android versions
   */
  addNoteToHomeScreen: async (note: Note): Promise<void> => {
    if (!WidgetService.isWidgetSupported()) {
      Alert.alert(
        i18n.t('alerts.errorTitle'),
        'Widgets are only supported on Android'
      );
      return;
    }

    try {
      // Store the note ID - the widget will auto-configure with this
      await WidgetService.storePendingWidgetNote(note);

      // Check if requestPinAppWidget is supported (Android 8.0+)
      const isSupported = await WidgetPinModule.isRequestPinAppWidgetSupported();

      if (isSupported) {
        // 🎉 DIRECT WIDGET PINNING (like Google Keep!)
        console.log('🎯 Requesting pin widget for note:', note.id);

        const success = await WidgetPinModule.requestPinWidget('NoteWidget');

        if (success) {
          console.log('✅ Widget pin request sent successfully!');
          // Android will show system dialog to confirm
          // User just needs to tap "Add" to place widget
        } else {
          console.warn('⚠️ Widget pin request failed');
          // Fallback to manual instructions
          WidgetService.showManualInstructions();
        }
      } else {
        // Fallback for Android < 8.0
        console.log('📱 Android version < 8.0, showing manual instructions');
        WidgetService.showManualInstructions();
      }
    } catch (error) {
      console.error('❌ Error requesting pin widget:', error);
      // Fallback to manual instructions on error
      WidgetService.showManualInstructions();
    }
  },

  /**
   * Show manual instructions for adding widget
   * (Fallback for older Android or if requestPinAppWidget fails)
   */
  showManualInstructions: (): void => {
    Alert.alert(
      i18n.t('widgets.readyTitle'),
      i18n.t('widgets.readyMessage'),
      [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        {
          text: i18n.t('widgets.openWidgets'),
          onPress: () => {
            console.log('✅ Note ready for manual widget placement');
          }
        }
      ]
    );
  },

  /**
   * Update all widgets displaying this note
   */
  updateNoteWidget: async (note: Note): Promise<void> => {
    if (!WidgetService.isWidgetSupported()) {
      return;
    }

    try {
      // Correct usage: provide callback function
      await rawRequestWidgetUpdate({
        widgetName: 'NoteWidget',
        renderWidget: (widget) => widget,
        widgetNotExist: 'DO_NOTHING',
        widgetData: {
          noteId: note.id,
        },
      });
    } catch (error) {
      console.error('Error updating widget:', error);
    }
  },
};
