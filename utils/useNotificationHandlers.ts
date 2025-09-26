import { useEffect } from 'react';
import { NotificationService } from './notifications';
import { Note } from '../types';

interface NotificationHandlerProps {
  onNotePress: (note: Note) => void;
}

export const useNotificationHandlers = ({ onNotePress }: NotificationHandlerProps) => {
  useEffect(() => {
    let responseListener: any;
    let receivedListener: any;

    const setupListeners = async () => {
      // Listen for notification responses (when user interacts with notification)
      responseListener = NotificationService.addNotificationResponseListener(
        async (response: any) => {
          const { notification } = response;
          const data = notification?.request?.content?.data || {};
          const { noteId, action } = data as { noteId: string; action: string; };
          
          // Skip processing if this is not one of our app's notifications
          if (!data || Object.keys(data).length === 0) {
            return;
          }
          
          console.log('🔔 DEEP LINK DEBUG - Notification response received:', response);
          console.log('🔔 DEEP LINK DEBUG - Extracted data:', { noteId, action, fullData: data });
          console.log('🔔 DEEP LINK DEBUG - Action identifier from response:', response?.actionIdentifier);

          // Handle both the notification tap and the "Abrir Nota" button
          const shouldOpenNote = (action === 'reminder' && noteId) || 
                                (response?.actionIdentifier === 'open' && noteId);

          if (shouldOpenNote) {
            const interactionType = response?.actionIdentifier === 'open' ? 'Abrir Nota button' : 'notification tap';
            console.log('🔔 DEEP LINK DEBUG - Opening note via:', interactionType, 'noteId:', noteId);
            try {
              // Import useNotesStore dynamically to avoid circular dependencies
              const { useNotesStore } = await import('../store/notes/useNotesStore');
              const { notes } = useNotesStore.getState();
              const note = notes.find(n => n.id === noteId);

              console.log('🔔 DEEP LINK DEBUG - Note found:', note ? note.title : 'NOT FOUND');

              if (note && !note.isArchived) {
                console.log('🔔 DEEP LINK DEBUG - Calling onNotePress with note:', note.title);
                onNotePress(note);
              } else {
                console.warn('🔔 DEEP LINK DEBUG - Note not found or archived:', noteId);
              }
            } catch (error) {
              console.error('🔔 DEEP LINK DEBUG - Error opening note from notification:', error);
            }
          } else {
            // Only log if it's not the default expo action (to reduce noise)
            if (response?.actionIdentifier !== 'expo.modules.notifications.actions.DEFAULT') {
              console.log('🔔 DEEP LINK DEBUG - Not a valid interaction:', { 
                action, 
                noteId, 
                actionIdentifier: response?.actionIdentifier,
                shouldOpen: shouldOpenNote 
              });
            }
          }
        }
      );

      // Listen for notifications received while app is in foreground
      receivedListener = NotificationService.addNotificationReceivedListener(
        (notification: any) => {
          console.log('Notification received in foreground:', notification);
          // Could show in-app notification here if needed
        }
      );
    };

    setupListeners();

    return () => {
      if (responseListener?.remove) {
        responseListener.remove();
      }
      if (receivedListener?.remove) {
        receivedListener.remove();
      }
    };
  }, [onNotePress]);
};