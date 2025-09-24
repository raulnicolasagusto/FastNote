import { Alert } from 'react-native';
import { Note } from '../types';

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    // In Expo Go, we'll just return false to indicate no notifications
    // but won't crash the app
    console.log('Notification permissions not available in Expo Go');
    return false;
  }

  static async scheduleNoteReminder(note: Note, reminderDate: Date): Promise<string | null> {
    // Generate a fake ID for storage purposes
    const fakeId = `reminder_${note.id}_${Date.now()}`;

    console.log(`Recordatorio guardado para ${reminderDate.toLocaleString()}: ${note.title}`);

    // Show confirmation that reminder was saved
    Alert.alert(
      'Recordatorio guardado',
      `Se ha programado un recordatorio para ${reminderDate.toLocaleDateString()} a las ${reminderDate.toLocaleTimeString().substring(0, 5)}.\n\nLas notificaciones funcionarán cuando la app esté compilada para producción.`,
      [{ text: 'Entendido' }]
    );

    return fakeId;
  }

  static async cancelNotification(notificationId: string): Promise<void> {
    console.log('Recordatorio cancelado:', notificationId);
    // No need to do anything since we're not using real notifications in Expo Go
  }

  static async getAllScheduledNotifications(): Promise<any[]> {
    // Return empty array since we can't get real notifications in Expo Go
    return [];
  }

  static async initializeNotifications(): Promise<void> {
    console.log('Sistema de recordatorios iniciado (modo Expo Go - sin notificaciones)');
    // No initialization needed for Expo Go mode
  }

  // Mock event listeners that don't do anything but don't crash
  static addNotificationResponseListener(
    listener: (response: any) => void
  ): any {
    console.log('Notification response listener initialized (mock for Expo Go)');
    return { remove: () => console.log('Mock notification listener removed') };
  }

  static addNotificationReceivedListener(
    listener: (notification: any) => void
  ): any {
    console.log('Notification received listener initialized (mock for Expo Go)');
    return { remove: () => console.log('Mock notification listener removed') };
  }
}