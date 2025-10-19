const {
  withMainApplication,
  withGradleProperties,
} = require('@expo/config-plugins');

/**
 * Config plugin to add native WidgetPinModule to the Android app
 * This enables requestPinAppWidget functionality
 */
const withWidgetPin = (config) => {
  // Add the package to MainApplication
  config = withMainApplication(config, async (config) => {
    const { modResults } = config;
    const { contents } = modResults;

    // Check if already added
    if (contents.includes('import com.raulnicolasagusto.fastnote.WidgetPinPackage')) {
      console.log('✅ WidgetPinPackage already added to MainApplication');
      return config;
    }

    // Add import statement
    const importStatement = 'import com.raulnicolasagusto.fastnote.WidgetPinPackage';

    // Find the package imports section (after package declaration)
    const packageMatch = contents.match(/(package\s+[\w.]+\s*;?\s*\n)/);
    if (packageMatch) {
      const insertPosition = packageMatch.index + packageMatch[0].length;
      modResults.contents =
        contents.slice(0, insertPosition) +
        '\n' +
        importStatement +
        '\n' +
        contents.slice(insertPosition);
    }

    // Add package to the packages list
    const packagesListRegex = /(override\s+fun\s+getPackages\(\):\s*List<ReactPackage>\s*\{[\s\S]*?return\s+(?:listOf|mutableListOf)\([\s\S]*?)\)/;

    if (packagesListRegex.test(modResults.contents)) {
      modResults.contents = modResults.contents.replace(
        packagesListRegex,
        (match) => {
          // Don't add if already exists
          if (match.includes('WidgetPinPackage()')) {
            return match;
          }
          // Add the package before the closing parenthesis
          return match.replace(/\)(?=\s*\))/, ',\n          WidgetPinPackage())');
        }
      );
    }

    console.log('✅ WidgetPinPackage added to MainApplication');
    return config;
  });

  return config;
};

module.exports = withWidgetPin;
