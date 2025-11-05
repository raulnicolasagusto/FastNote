React Native Android Widget
React Native Android Widget is an open source library for building android widgets using React Native - without touching the native side.

Get started building by installing React Native Android Widget or by following the Tutorial to learn the main concepts.

Getting Started
Get started by installing the library.

npm
yarn
npm install --save react-native-android-widget
React Native version support
React Native Version	react-native-android-widget version
0.76.0+	0.15.0+
< 0.76.0	0.14.2

Widget Design
This library provides a few primitives that we can use to create widgets.

FlexWidget
OverlapWidget
ListWidget
TextWidget
ImageWidget
IconWidget
SvgWidget
You can read more about them and their props in their respective pages.

Hooks
Widgets must not use any hooks. They must be functions that return some of the primitives.

We can create custom components, but at the end they must use only the primitives, not View, Text, or any other React Native component.

We can also use conditions, for/map, standard jsx. They cannot be async.

We'll start with a Basic widget that says "Hello".

HelloWidget.tsx
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function HelloWidget() {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
      }}
    >
      <TextWidget
        text="Hello"
        style={{
          fontSize: 32,
          fontFamily: 'Inter',
          color: '#000000',
        }}
      />
    </FlexWidget>
  );
}
Widget Preview
Designing a widget can be cumbersome if you have to add the widget to a homescreen everytime you make a change.

react-native-android-widget exports a WidgetPreview component that can be used to preview a widget in any screen in our React Native application.

HelloWidgetPreviewScreen.tsx
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';

import { HelloWidget } from './HelloWidget';

export function HelloWidgetPreviewScreen() {
  return (
    <View style={styles.container}>
      <WidgetPreview
        renderWidget={() => <HelloWidget />}
        width={320}
        height={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
Register task handler
We designed and previewed our widget. Now we need to register a task handler that will handle the logic of adding/updating a widget to the home screen, as well as handle widget clicks.

Create task handler function
First, create a task handler function, containing:

widget-task-handler.tsx
import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { HelloWidget } from './HelloWidget';

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  Hello: HelloWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_UPDATE':
      // Not needed for now
      break;

    case 'WIDGET_RESIZED':
      // Not needed for now
      break;

    case 'WIDGET_DELETED':
      // Not needed for now
      break;

    case 'WIDGET_CLICK':
      // Not needed for now
      break;

    default:
      break;
  }
}

We use nameToWidget to map from the name to the component defining the widget (useful if we have multiple widgets). There are other ways to achieve this.

Register widget task handler
In the main index.js (or index.ts, index.tsx) file for our app, when we register the main component, register the widget task handler.

index.ts
import { AppRegistry } from 'react-native';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { name as appName } from './app.json';
import App from './App';
import { widgetTaskHandler } from './widget-task-handler';

AppRegistry.registerComponent(appName, () => App);
registerWidgetTaskHandler(widgetTaskHandler);

Register widget task handler (Expo)
If we are using Expo, there is no index.js (or index.ts, index.tsx), but we can create it.

First, update package.json main field to point to index.ts (or .js) instead of node_modules/expo/AppEntry.js

package.json
{
  "name": "my-expo-app",
  "main": "index.ts",
  ...
}

Create the file, using node_modules/expo/AppEntry.js as a template. Then import widgetTaskHandler and register it.

index.ts
import { registerRootComponent } from 'expo';
import { registerWidgetTaskHandler } from 'react-native-android-widget';

import App from './App';
import { widgetTaskHandler } from './widget-task-handler';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
registerWidgetTaskHandler(widgetTaskHandler);

Next steps
We designed our widget, saw the preview, and registered a handler that will handle adding it to the home screen.

We still need to tell the application that there is a widget called Hello.

Continue with:

Register widget if you are using React Native bare
Register widget in Expo if you are using Expo

Register widget in Expo
If we are using Expo for our app, we might not have access to the native android directory, so we cannot create/update the required files.

Expo provides Config Plugins that can be used to configure the native android project.

react-native-android-widget exports a config plugin.

Create widget preview image
When the android launcher shows the widget select popup, we can show a screenshot of our widget to give the user an idea what the widget looks like.

Take a screenshot of the widget, and place it inside assets/widget-preview/hello.png

assets/widget-preview/hello.png
Hello Widget Preview

Add custom fonts used in widgets
If we need custom fonts for our widgets, we can add them in the assets directory

For example, assets/fonts/Inter.ttf

Use config plugin in app.(json|config.js|config.ts)
In this example we are using app.config.ts but the changes are similar for all configuration types.

app.config.ts
import type { ConfigContext, ExpoConfig } from 'expo/config';
import type { WithAndroidWidgetsParams } from 'react-native-android-widget';

const widgetConfig: WithAndroidWidgetsParams = {
  // Paths to all custom fonts used in all widgets
  fonts: ['./assets/fonts/Inter.ttf'],
  widgets: [
    {
      name: 'Hello', // This name will be the **name** with which we will reference our widget.
      label: 'My Hello Widget', // Label shown in the widget picker
      minWidth: '320dp',
      minHeight: '120dp',
      // This means the widget's default size is 5x2 cells, as specified by the targetCellWidth and targetCellHeight attributes.
      // Or 320×120dp, as specified by minWidth and minHeight for devices running Android 11 or lower.
      // If defined, targetCellWidth,targetCellHeight attributes are used instead of minWidth or minHeight.
      targetCellWidth: 5,
      targetCellHeight: 2,
      description: 'This is my first widget', // Description shown in the widget picker
      previewImage: './assets/widget-preview/hello.png', // Path to widget preview image

      // How often, in milliseconds, that this AppWidget wants to be updated.
      // The task handler will be called with widgetAction = 'UPDATE_WIDGET'.
      // Default is 0 (no automatic updates)
      // Minimum is 1800000 (30 minutes == 30 * 60 * 1000).
      updatePeriodMillis: 1800000,
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'My Expo App Name',
  plugins: [['react-native-android-widget', widgetConfig]],
});


note
By default the widget Java class will be put inside <app-package-name>.widget

If for any reason (for example you already have an app that is not using react-native-android-widget and want to replace existing widgets with react-native-android-widgets, but you already have providers in a different package), you can customize the widget java class package with packageName property for the widget

Build Dev Client
Build an Expo Dev Client that will include react-native-android-widget and the new widget

Make Widget configurable (Optional)
In order to make some of the widgets configurable, we need to create a widget configuration activity.

Note
WIDGET_ADDED event will be fired as soon as the widget is added on the home screen, regardless of whether it is configurable or not. We will need to have a fallback configuration.

If the configuration is cancelled when adding the widget, WIDGET_DELETED will be fired.

Add a widget configuration activity class
Java
Kotlin
android/app/src/main/java/com/yourapppackage/WidgetConfigurationActivity.java
package com.yourapppackage;

import com.reactnativeandroidwidget.RNWidgetConfigurationActivity;

public class WidgetConfigurationActivity extends RNWidgetConfigurationActivity {
}

Update the widget provider xml file for the widget
In the widget provider we created, add configure and widgetFeatures properties.

android/app/src/main/res/xml/widgetprovider_hello.xml
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="320dp"
    android:minHeight="120dp"

    android:targetCellWidth="5"
    android:targetCellHeight="2"

    android:updatePeriodMillis="0"

    android:initialLayout="@layout/rn_widget"

    android:previewImage="@drawable/hello_preview"
    android:description="@string/widget_hello_description"

    android:resizeMode="none"


    android:configure="com.yourapppackage.WidgetConfigurationActivity"
    android:widgetFeatures="reconfigurable"


    android:widgetCategory="home_screen">
</appwidget-provider>

android:configure should reference the configuration activity we created
android:widgetFeatures can be reconfigurable or reconfigurable|configuration_optional
reconfigurable means that the widget will be configurable and the configuration activity will open as soon as the widget is added to the home screen. Its configuration can also be changed later by long-pressing the widget.
reconfigurable|configuration_optional means that the widget configuration can only be changed by long-pressing the widget, and the configuration activity will not open when the widget is added
Add widget configuration activity in AndroidManifest.xml
Finally, we need to add the widget configuration activity in AndroidManifest.xml

In AndroidManifest.xml, add a activity

android/app/src/main/AndroidManifest.xml
<manifest ...>
  ...
  <application
      android:name=".MainApplication"
      ...>

      <activity
          android:name=".MainActivity"
          ...>
      </activity>

      <activity android:name=".WidgetConfigurationActivity"
          android:exported="true">
          <intent-filter>
              <action android:name="android.appwidget.action.APPWIDGET_CONFIGURE"/>
          </intent-filter>
      </activity>
  </application>
</manifest>

For the activity

android:name myst be .WidgetConfigurationActivity (same as the Java class extending RNWidgetConfigurationActivity)
Make Widget configurable in Expo using config plugin
If using Expo, the configuration is much simpler. We will only need to set the widgetFeatures property in the config plugin to reconfigurable or reconfigurable|configuration_optional.

app.config.ts
import type { ConfigContext, ExpoConfig } from 'expo/config';
import type { WithAndroidWidgetsParams } from 'react-native-android-widget';

const widgetConfig: WithAndroidWidgetsParams = {
  widgets: [
    {
      name: 'Hello',
      label: 'My Hello Widget',
      minWidth: '320dp',
      minHeight: '120dp',
      targetCellWidth: 5,
      targetCellHeight: 2,
      description: 'This is my first widget',
      previewImage: './assets/widget-preview/hello.png',
      updatePeriodMillis: 1800000,

      // This
      widgetFeatures: 'reconfigurable',
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'My Expo App Name',
  plugins: [['react-native-android-widget', widgetConfig]],
});

Create the Widget Configuration Screen
For the UI of the Widget Configuration Screen in both bare React Native and Expo, see the registerWidgetConfigurationScreen

API
WidgetPreview
react-native-android-widget exports a WidgetPreview component that can be used to preview a widget in any screen in our React Native application.

Usage
HelloWidgetPreviewScreen.tsx
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';

import { HelloWidget } from './HelloWidget';

export function HelloWidgetPreviewScreen() {
  return (
    <View style={styles.container}>
      <WidgetPreview
        renderWidget={() => <HelloWidget />}
        width={320}
        height={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Types
Check the types in the Public API documentation

Interface: WidgetPreviewProps
Properties
renderWidget
• renderWidget: (props: { width: number ; height: number }) => Element

Callback function that will be called by WidgetPreview to generate the widget UI.

Type declaration
▸ (props): Element

Callback function that will be called by WidgetPreview to generate the widget UI.

Parameters
Name	Type
props	Object
props.width	number
props.height	number
Returns
Element

height
• height: number

The height of the widget

width
• width: number

The width of the widget

onClick
• Optional onClick: (props: OnClick) => void

Callback function that will be called when clicked on a clickable area of the widget.

Type declaration
▸ (props): void

Callback function that will be called when clicked on a clickable area of the widget.

Parameters
Name	Type
props	OnClick
Returns
void

showBorder
• Optional showBorder: boolean

Whether to show a border around the widget. Usefull for widgets that do not use the whole space.

highlightClickableAreas
• Optional highlightClickableAreas: boolean

Whether to add a highlight to the clickable areas

Previous

registerWidgetTaskHandler
react-native-android-widget exports a registerWidgetTaskHandler function that can be used to register a task handler that can handle widget click events, widget resize events, widget added events...

Usage
First, create a task handler function, containing:

widget-task-handler.tsx
import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { HelloWidget } from './HelloWidget';

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  Hello: HelloWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_UPDATE':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_RESIZED':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_DELETED':
      // Handle widget deleted (remove widget data if you stored it somewhere)
      break;

    case 'WIDGET_CLICK':
      if (props.clickAction === 'play') {
        props.renderWidget(<Widget status="playing" />);
      } else {
        props.renderWidget(<Widget status="stopped" />);
      }
      break;

    default:
      break;
  }
}

We use nameToWidget to map from the name to the component defining the widget (useful if we have multiple widgets). There are other ways to achieve this.

This file is also where you can execute regular JS code, include asynchronous operations, such as fetching data from API:

widget-task-handler.tsx
// ...
case 'WIDGET_CLICK':
  if (props.clickAction === 'refresh') {
    const data = await fetch('https://example.com/api').then((response) => response.json());
    props.renderWidget(<Widget title={data.title} />);
  }
  break;

Register widget task handler
In the main index.js (or index.ts, index.tsx) file for our app, when we register the main component, register the widget task handler.

index.ts
import { AppRegistry } from 'react-native';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { name as appName } from './app.json';
import App from './App';
import { widgetTaskHandler } from './widget-task-handler';

AppRegistry.registerComponent(appName, () => App);
registerWidgetTaskHandler(widgetTaskHandler);

Register widget task handler (Expo)
If we are using Expo, there is no index.js (or index.ts, index.tsx), but we can create it.

First, update package.json main field to point to index.ts (or .js) instead of node_modules/expo/AppEntry.js

package.json
{
  "name": "my-expo-app",
  "main": "index.ts",
  ...
}

Create the file, using node_modules/expo/AppEntry.js as a template. Then import widgetTaskHandler and register it.

index.ts
import { registerRootComponent } from 'expo';
import { registerWidgetTaskHandler } from 'react-native-android-widget';

import App from './App';
import { widgetTaskHandler } from './widget-task-handler';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
registerWidgetTaskHandler(widgetTaskHandler);

Types
Check the types in the Public API documentation

The widget task handler will be called with some properties, described with WidgetTaskHandlerProps

requestWidgetUpdate
react-native-android-widget exports a requestWidgetUpdate function that can be used to request a widget update while the application is open (or with some background task).

Since the user can add the same widget multiple times, with different sizes, requestWidgetUpdate will cycle all widgets and allow us to redraw them.

Usage
Lets assume we have a CounterWidget widget that shows a single number, which it gets as a prop.

If the user has added a CounterWidget to the home screen, then when the CounterWidgetScreen is opened we can update the number shown on the widget on the home screen using requestWidgetUpdate.

If the user has added the CounterWidget multiple times, renderWidget will be called multiple times, once for each widget.

If the user has not added the CounterWidget on the Android home screen, the optional callback widgetNotFound will be called.

Example
CounterScreen.tsx
import * as React from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';

import { CounterWidget } from './CounterWidget';

export function CounterScreen() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    requestWidgetUpdate({
      widgetName: 'Counter',
      renderWidget: () => <CounterWidget count={count} />,
      widgetNotFound: () => {
        // Called if no widget is present on the home screen
      }
    });
  }, [count]);

  return (
    <View style={styles.container}>
      <Text>{count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
      <Button title="Decrement" onPress={() => setCount(count - 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Demo
Check the full code in the Counter Screen

Types
Check the types in the Public API documentation

The requestWidgetUpdate function should be called with the properties described with RequestWidgetUpdateProps

requestWidgetUpdateById
react-native-android-widget exports a requestWidgetUpdateById function that can be used to request a widget update while the application is open (or with some background task) for a single widget with known id.

This is an alternative to requestWidgetUpdate and should be used in special cases when the widget id is known, and you don't want to update the other widgets with the same name.

Usage
Lets assume we have a CounterWidget widget that shows a single number, which it gets as a prop.

If the user has added the CounterWidget multiple times, requestWidgetUpdateById will update only one widget which corresponds with the given widgetId.

If a widget with the given widgetId does not exist, the optional callback widgetNotFound will be called.

Example
CounterScreen.tsx
import * as React from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { requestWidgetUpdateById } from 'react-native-android-widget';

import { CounterWidget } from './CounterWidget';

export function CounterScreen() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    requestWidgetUpdateById({
      widgetName: 'Counter',
      widgetId: 1,
      renderWidget: () => <CounterWidget count={count} />,
      widgetNotFound: () => {
        // Called if no widget is present on the home screen
      },
    });
  }, [count]);

  return (
    <View style={styles.container}>
      <Text>{count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
      <Button title="Decrement" onPress={() => setCount(count - 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Types
Check the types in the Public API documentation

The requestWidgetUpdate function should be called with the properties described with RequestWidgetUpdateByIdProps

registerWidgetConfigurationScreen
react-native-android-widget exports a registerWidgetConfigurationScreen function that can be used to register a widget configuration screen. When a configurable widget is added on the home screen, or reconfigured once on the home screen, the registered configuration screen will be opened.

The user can cancel the configuration (by calling setResult('cancel')). If the widget was just added it will be removed from the home screen, otherwise just the conifuguration will be canceled and the widget will remain as is.

If the user changes some configuration and wants to add the widget, we will need to:

Call renderWidget to update the widget with the new configuration
Call setResult('ok') to indicate that the configuration is done and the screen can be closed
Multiple configurable widgets
If we have multiple configurable widgets, they will share the same configuration screen, but we can check which widget is configured by the widgetInfo prop and show different UI depending on the widget.

Usage
First, create a widget configuration component, containing:

WidgetConfigurationScreen.tsx
import React from 'react';
import type { WidgetConfigurationScreenProps } from 'react-native-android-widget';
import { ConfigurableWidget } from './ConfigurableWidget';

export function WidgetConfigurationScreen({
  widgetInfo,
  setResult,
  renderWidget,
}: WidgetConfigurationScreenProps) {
  // Here we can define the UI for configuring the widget
}

Register the widget configuration screen
In the main index.js (or index.ts, index.tsx) file for our app, when we register the main component, register the widget configuration screen.

index.ts
import { AppRegistry } from 'react-native';
import {
  registerWidgetConfigurationScreen,
  registerWidgetTaskHandler,
} from 'react-native-android-widget';
import { name as appName } from './app.json';
import App from './App';
import { widgetTaskHandler } from './widget-task-handler';
import { WidgetConfigurationScreen } from './WidgetConfigurationScreen';

AppRegistry.registerComponent(appName, () => App);
registerWidgetTaskHandler(widgetTaskHandler);
registerWidgetConfigurationScreen(WidgetConfigurationScreen);

Register widget task handler (Expo)
If we are using Expo, there is no index.js (or index.ts, index.tsx), but we can create it.

First, update package.json main field to point to index.ts (or .js) instead of node_modules/expo/AppEntry.js

package.json
{
  "name": "my-expo-app",
  "main": "index.ts",
  ...
}

Create the file, using node_modules/expo/AppEntry.js as a template. Then import widgetTaskHandler and register it.

index.ts
import { registerRootComponent } from 'expo';
import {
  registerWidgetConfigurationScreen,
  registerWidgetTaskHandler,
} from 'react-native-android-widget';

import App from './App';
import { widgetTaskHandler } from './widget-task-handler';
import { WidgetConfigurationScreen } from './WidgetConfigurationScreen';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
registerWidgetTaskHandler(widgetTaskHandler);
registerWidgetConfigurationScreen(WidgetConfigurationScreen);

Types
Check the types in the Public API documentation

The widget configuration screen has some properties, described with WidgetConfigurationScreenProps

FlexWidget
Widget container that lays out child widgets using flexbox.

Usage
import { FlexWidget } from 'react-native-android-widget';

export function MyWidget() {
  return (
    <FlexWidget
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      ...
    </FlexWidget>
  );
}

Props
Check the props in the Public API documentation

Edit this page

OverlapWidget
Widget container that lays out child widgets one on top of the other.

The child widgets can be positioned using margins.

Usage
import { OverlapWidget, FlexWidget } from 'react-native-android-widget';

export function MyWidget() {
  return (
    <OverlapWidget>
      <FlexWidget style={{ marginTop: 10, marginLeft: 10 }}>...</FlexWidget>
      <FlexWidget style={{ marginTop: 20, marginLeft: 10 }}>...</FlexWidget>
    </OverlapWidget>
  );
}

Props
Check the props in the Public API documentation

TextWidget
Widget for displaying text.

Usage
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function MyWidget() {
  return (
    <FlexWidget>
      <TextWidget
        text="Hello"
        style={{
          fontSize: 32,
          fontFamily: 'Inter',
          color: '#000000',
        }}
      />
    </FlexWidget>
  );
}

Fonts
Text widget supports custom fonts, but we must provide the font file.

Bare React Native
To use a custom font in bare React Native app we must copy the font file(s) to android/app/src/main/assets/fonts. The fontFamily style prop will match the file by name.

For example, android/app/src/main/assets/fonts/Inter.ttf

Expo
To use a custom font in an Expo app, we can add them in the assets directory.

For example, assets/fonts/Inter.ttf

Then, when using the config plugin we must provide a list of all the custom fonts we need.

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'My Expo App Name',
  plugins: [
    ['react-native-android-widget', {
      fonts: ['./assets/fonts/Inter.ttf'],
      widgets: [...],
    }]
  ],
});

Example
Check the example widget

Props
Check the props in the Public API documentation