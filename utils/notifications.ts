import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { Note } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Helper function to strip HTML tags and convert to plain text
function stripHtmlTags(html: string): string {
  if (!html) return '';

  return html
    // Replace block elements with line breaks
    .replace(/<\/?(h[1-6]|p|div|br)[^>]*>/gi, '\n')
    // Remove all other HTML tags
    .replace(/<[^>]*>/g, '')
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Remove multiple consecutive line breaks
    .replace(/\n\s*\n/g, '\n')
    // Trim whitespace from start and end
    .replace(/^\s+|\s+$/g, '')
    // Remove leading spaces from lines
    .replace(/\n\s+/g, '\n');
}

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Se necesitan permisos de notificaciones para recibir recordatorios.',
          [{ text: 'Entendido' }]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  static async scheduleNoteReminder(note: Note, reminderDate: Date): Promise<string | null> {
    // Test alert to verify build version
    Alert.alert('DEBUG', 'BUILD ACTUALIZADO - Función scheduleNoteReminder ejecutándose');

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Recordatorio guardado',
          'El recordatorio se guardó pero no recibirás notificaciones sin permisos.',
          [{ text: 'Entendido' }]
        );
        return `reminder_${note.id}_${Date.now()}`;
      }

      // Create notification content - strip HTML tags first
      const plainTextContent = stripHtmlTags(note.content);
      const bodyLines = plainTextContent.split('\n').filter(line => line.trim());
      const bodyPreview = bodyLines.slice(0, 2).join('\n');
      const displayBody = bodyPreview.length > 0 ? `${note.title}\n\n${bodyPreview}` : note.title;

      // Debug: Check timing before scheduling
      const now = new Date();
      const timeUntilReminder = reminderDate.getTime() - now.getTime();
      const minutesUntil = Math.round(timeUntilReminder / (1000 * 60));
      
      console.log('⏰ NOTIFICATION TIMING DEBUG:');
      console.log('  Current time:', now.toISOString());
      console.log('  Reminder time:', reminderDate.toISOString());
      console.log('  Minutes until reminder:', minutesUntil);
      console.log('  Is in future?', timeUntilReminder > 0);

      // Schedule the notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📝 Recordatorio de Nota',
          body: displayBody,
          data: {
            noteId: note.id,
            noteTitle: note.title,
            action: 'reminder',
          },
          categoryIdentifier: 'reminder',
          sound: true,
        },
        trigger: {
          type: 'date',
          date: reminderDate,
        } as any,
      });

      Alert.alert(
        '✅ Recordatorio programado',
        `Recibirás una notificación el ${reminderDate.toLocaleDateString()} a las ${reminderDate.toLocaleTimeString().substring(0, 5)}.\n\nDebug: En ${minutesUntil} minutos`,
        [{ text: 'Perfecto' }]
      );

      console.log('✅ Notification scheduled:', notificationId, 'for:', reminderDate);
      
      // Debug: Verificar notificaciones programadas
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('📋 All scheduled notifications:', scheduledNotifications.length);
      scheduledNotifications.forEach((notif, index) => {
        console.log(`  ${index + 1}. ID: ${notif.identifier}, Trigger:`, notif.trigger);
      });
      
      return notificationId;

    } catch (error) {
      console.error('❌ Error scheduling notification:', error);
      Alert.alert(
        'Error',
        'No se pudo programar la notificación. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
      return null;
    }
  }

  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      if (notificationId.startsWith('reminder_')) {
        console.log('⚠️ Mock notification, no need to cancel');
        return;
      }

      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('✅ Notification cancelled:', notificationId);
    } catch (error) {
      console.error('❌ Error canceling notification:', error);
    }
  }

  static async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('❌ Error getting scheduled notifications:', error);
      return [];
    }
  }

  static async setupNotificationCategories(): Promise<void> {
    try {
      await Notifications.setNotificationCategoryAsync('reminder', [
        {
          identifier: 'dismiss',
          buttonTitle: 'Descartar',
          options: {
            isDestructive: false,
            isAuthenticationRequired: false,
          },
        },
        {
          identifier: 'open',
          buttonTitle: 'Abrir Nota',
          options: {
            isDestructive: false,
            isAuthenticationRequired: false,
            opensAppToForeground: true,
          },
        },
      ]);
      console.log('✅ Notification categories configured');
    } catch (error) {
      console.error('❌ Error setting up notification categories:', error);
    }
  }

  static async initializeNotifications(): Promise<void> {
    try {
      await this.requestPermissions();
      await this.setupNotificationCategories();
      console.log('🔔 Real notifications initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing notifications:', error);
    }
  }

  static addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  static addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Clear all presented notifications (those already shown to user)
  static async clearAllPresentedNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      console.log('🧹 All presented notifications cleared');
    } catch (error) {
      console.error('❌ Error clearing presented notifications:', error);
    }
  }

  // Clear specific notification by identifier
  static async clearNotificationById(identifier: string): Promise<void> {
    try {
      await Notifications.dismissNotificationAsync(identifier);
      console.log('🧹 Notification cleared:', identifier);
    } catch (error) {
      console.error('❌ Error clearing notification:', identifier, error);
    }
  }
}