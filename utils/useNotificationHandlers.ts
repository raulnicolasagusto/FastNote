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
          console.log('Notification response:', response);

          const { notification } = response;
          const { noteId, action } = (notification?.request?.content?.data || {}) as {
            noteId: string;
            action: string;
          };

          if (action === 'reminder' && noteId) {
            console.log('Opening note from notification:', noteId);
            try {
              // Import useNotesStore dynamically to avoid circular dependencies
              const { useNotesStore } = await import('../store/notes/useNotesStore');
              const { notes } = useNotesStore.getState();
              const note = notes.find(n => n.id === noteId);

              if (note && !note.isArchived) {
                onNotePress(note);
              } else {
                console.warn('Note not found or archived:', noteId);
              }
            } catch (error) {
              console.error('Error opening note from notification:', error);
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