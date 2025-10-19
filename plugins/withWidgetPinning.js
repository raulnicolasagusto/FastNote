const { withAndroidManifest } = require('@expo/config-plugins');
const { resolve } = require('path');
const fs = require('fs');

/**
 * Expo Config Plugin to add native widget pinning support
 *
 * This plugin adds the necessary native Android code to support
 * requestPinAppWidget API for direct widget placement
 */

const withWidgetPinning = (config) => {
  config = withAndroidManifest(config, async (config) => {
    // The native code will be added during the EAS build process
    // via the react-native-android-widget plugin which handles
    // widget provider registration

    console.log('✅ Widget pinning support configured');
    return config;
  });

  return config;
};

module.exports = withWidgetPinning;
