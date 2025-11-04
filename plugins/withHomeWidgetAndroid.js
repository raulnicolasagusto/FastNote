const {
  withAndroidManifest,
} = require('@expo/config-plugins');

/**
 * Config plugin to set up Android home widgets
 * This plugin adds necessary configurations to AndroidManifest.xml for home widgets
 */
const withHomeWidgetAndroid = (config) => {
  return withAndroidManifest(config, (config) => {
    // Add widget provider to AndroidManifest
    config.modResults = addWidgetProviderToManifest(config.modResults);
    return config;
  });
};

function addWidgetProviderToManifest(androidManifest) {
  // Find the application node
  const app = androidManifest.manifest.application?.[0];
  
  if (!app) {
    throw new Error('Could not find application in AndroidManifest.xml');
  }

  // Define the widget provider
  const widgetProvider = {
    $: {
      'android:name': '.NoteWidgetProvider',
      'android:exported': 'false',
      'android:label': 'FastNote Widget',
      'android:initialLayout': '@layout/widget_note',
      'android:resizeMode': 'horizontal|vertical',
      'android:widgetCategory': 'home_screen',
      'android:minWidth': '250dp',
      'android:minHeight': '40dp',
      'android:minResizeWidth': '250dp',
      'android:minResizeHeight': '40dp',
      'android:maxResizeWidth': '500dp',
      'android:maxResizeHeight': '120dp',
    },
    'intent-filter': [{
      $: {},
      action: [{
        $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' }
      }]
    }],
    'meta-data': [{
      $: {
        'android:name': 'android.appwidget.provider',
        'android:resource': '@xml/note_widget_info'
      }
    }]
  };

  // Add the widget provider to the application
  if (!app.receiver) {
    app.receiver = [];
  }
  app.receiver.push(widgetProvider);

  return androidManifest;
}

module.exports = withHomeWidgetAndroid;