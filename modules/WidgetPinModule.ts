// Native module bridge for Android requestPinAppWidget
import { NativeModules, Platform } from 'react-native';

const { WidgetPinModule } = NativeModules;

interface WidgetPinInterface {
  /**
   * Checks if the launcher supports pinning widgets programmatically
   * @returns Promise<boolean>
   */
  isRequestPinAppWidgetSupported(): Promise<boolean>;

  /**
   * Requests to pin a widget to the launcher
   * @param widgetName The name of the widget to pin
   * @returns Promise<boolean> - true if request was sent (doesn't mean it was approved)
   */
  requestPinWidget(widgetName: string): Promise<boolean>;
}

export default (Platform.OS === 'android' && WidgetPinModule
  ? (WidgetPinModule as WidgetPinInterface)
  : {
      isRequestPinAppWidgetSupported: async () => false,
      requestPinWidget: async () => false,
    }) as WidgetPinInterface;
