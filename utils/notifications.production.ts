// Este archivo contiene la implementación REAL de notificaciones
// Para usar en production builds. Renombrar este archivo a 'notifications.ts'
// cuando hagas el build final y instalar 'expo-notifications'

import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { Note } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
          'Se necesitan permisos de notificaciones para recibir recordatorios.'
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
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Recordatorio guardado',
          'El recordatorio se guardó pero no recibirás notificaciones sin permisos.'
        );
        return `reminder_${note.id}_${Date.now()}`;
      }

      // Create notification content
      const bodyLines = note.content.split('\n').filter(line => line.trim());
      const bodyPreview = bodyLines.slice(0, 2).join('\n');
      const displayBody = bodyPreview || 'Abrir nota para ver contenido';

      // Schedule the notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Recordatorio de Nota',
          body: displayBody,
          data: {
            noteId: note.id,
            noteTitle: note.title,
            action: 'reminder',
          },
          categoryIdentifier: 'reminder',
        },
        trigger: {
          date: reminderDate,
        },
      });

      Alert.alert(
        'Recordatorio programado',
        `Recibirás una notificación el ${reminderDate.toLocaleDateString()} a las ${reminderDate.toLocaleTimeString().substring(0, 5)}.`
      );

      console.log('Real notification scheduled:', notificationId);
      return notificationId;

    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'No se pudo programar la notificación. Inténtalo de nuevo.');
      return null;
    }
  }

  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      if (notificationId.startsWith('reminder_')) {
        console.log('Mock notification, no need to cancel');
        return;
      }

      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Real notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  static async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
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
    } catch (error) {
      console.error('Error setting up notification categories:', error);
    }
  }

  static async initializeNotifications(): Promise<void> {
    try {
      await this.requestPermissions();
      await this.setupNotificationCategories();
      console.log('Real notifications initialized successfully');
    } catch (error) {
      console.error('Error initializing notifications:', error);
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
}

/*
INSTRUCCIONES PARA ACTIVAR NOTIFICACIONES REALES:

1. Instalar dependencia:
   npm install expo-notifications

2. Renombrar archivos:
   mv notifications.ts notifications.expo-go.ts
   mv notifications.production.ts notifications.ts

3. Configurar app.json:
   {
     "expo": {
       "plugins": [
         [
           "expo-notifications",
           {
             "icon": "./assets/notification-icon.png",
             "color": "#ffffff"
           }
         ]
       ]
     }
   }

4. Hacer build:
   npx expo prebuild
   eas build --platform android

*/