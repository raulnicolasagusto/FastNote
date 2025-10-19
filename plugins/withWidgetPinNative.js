const { withAppBuildGradle, withMainActivity } = require('@expo/config-plugins');

/**
 * Expo Config Plugin for Widget Pinning
 *
 * Adds native Android code to support requestPinAppWidget API
 * for direct widget placement (Android 8+)
 */

const withWidgetPinNative = (config) => {
  // Add MainActivity code for widget pinning
  config = withMainActivity(config, async (config) => {
    const { modResults } = config;
    let contents = modResults.contents;

    // Check if already added
    if (contents.includes('requestPinWidget')) {
      return config;
    }

    // Add imports at the top
    const importStatement = `
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Build;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;
`;

    // Find package declaration and add imports after it
    contents = contents.replace(
      /(package\s+[^;]+;)/,
      `$1${importStatement}`
    );

    // Add method to MainActivity class
    const methodCode = `

  /**
   * Request to pin a widget to the home screen
   * Android 8.0 (API 26) and higher only
   */
  @ReactMethod
  public void requestPinWidget(String widgetName, Promise promise) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(this);

      // Get the component name for the widget provider
      ComponentName myProvider = new ComponentName(this,
        "com.raulnicolasagusto.fastnote.widget.NoteWidget");

      if (appWidgetManager.isRequestPinAppWidgetSupported()) {
        try {
          boolean success = appWidgetManager.requestPinAppWidget(myProvider, null, null);
          promise.resolve(success);
        } catch (Exception e) {
          promise.reject("PIN_WIDGET_ERROR", e.getMessage());
        }
      } else {
        promise.reject("NOT_SUPPORTED", "Launcher does not support pinning widgets");
      }
    } else {
      promise.reject("API_TOO_OLD", "Android 8.0 or higher required");
    }
  }
`;

    // Insert method before the last closing brace
    const lastBraceIndex = contents.lastIndexOf('}');
    contents = contents.substring(0, lastBraceIndex) + methodCode + contents.substring(lastBraceIndex);

    modResults.contents = contents;
    return config;
  });

  return config;
};

module.exports = withWidgetPinNative;
