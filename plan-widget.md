🧩 Implementación de un Widget Android en React Native + Expo (para app de Notas)
🎯 Objetivo

Agregar un widget de Android simple a una app de notas creada con React Native y Expo, que muestre las últimas notas y abra la app al tocarlo.

🧱 Requisitos previos

Proyecto Expo con EAS Build (no Expo Go).

Build tipo APK, no AAB (para instalar en teléfono).

Acceso a configuración nativa (usando config plugins o “bare workflow”).

Node.js y Android SDK correctamente configurados.

📦 Librería usada

Librería: react-native-android-widget
Repositorio: https://github.com/sAleksovski/react-native-android-widget

Documentación: https://saleksovski.github.io/react-native-android-widget/docs

Compatibilidad: React Native ≥ 0.76.0 (Expo SDK 51+ o similar)

🚀 Pasos para implementar el widget
1️⃣ Instalar la librería

npm install react-native-android-widget
o
yarn add react-native-android-widget

2️⃣ Configurar el plugin en app.json o app.config.js

Agregá el plugin dentro de la sección "plugins" de Expo:

{
"expo": {
"name": "NotasApp",
"slug": "notas-app",
"plugins": [
[
"react-native-android-widget",
{
"widgets": [
{
"name": "NotesWidget",
"label": "Mis Notas",
"minWidth": "110dp",
"minHeight": "110dp",
"updatePeriodMillis": 1800000,
"initialLayout": {
"key": "latestNotes",
"default": ["No hay notas todavía"]
}
}
]
}
]
]
}
}

Esto define un widget básico llamado NotesWidget.

3️⃣ Registrar el manejador del widget en el código

Crea un archivo, por ejemplo src/widgetHandler.ts:

import { registerWidgetTaskHandler } from "react-native-android-widget";
import AsyncStorage from "@react-native-async-storage/async-storage";

registerWidgetTaskHandler(async () => {
const stored = await AsyncStorage.getItem("notes");
const notes = stored ? JSON.parse(stored) : [];
const latest = notes.slice(0, 3).map((n: any) => n.title);

return {
key: "latestNotes",
value: latest.length ? latest : ["Sin notas aún"]
};
});

Este handler se ejecuta cuando el sistema necesita actualizar el widget.

4️⃣ Configuración nativa Android (automática o manual)

Verificar o crear manualmente si el plugin no lo hizo:

android/app/src/main/res/xml/notes_widget_info.xml

android/app/src/main/res/layout/notes_widget_layout.xml

<receiver> correspondiente en AndroidManifest.xml

Ejemplo mínimo de manifest:

<receiver android:name="com.notasapp.NotesWidgetProvider" android:exported="false">
<intent-filter>
<action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
</intent-filter>
<meta-data android:name="android.appwidget.provider" android:resource="@xml/notes_widget_info" />
</receiver>

5️⃣ Lógica en la app para actualizar el widget

Cuando el usuario crea o edita notas, actualizá el widget desde el código:

import { updateWidget } from "react-native-android-widget";

const refreshWidget = async () => {
await updateWidget("NotesWidget");
};

Llamá a refreshWidget() cada vez que se guarde una nota nueva.

6️⃣ Generar APK con EAS Build

Para probarlo en tu teléfono físico, asegurate de generar un APK (no AAB).
Usá el perfil “developer” o creá uno específico para widgets:

{
"build": {
"developer": {
"developmentClient": true,
"distribution": "internal",
"android": {
"buildType": "apk"
}
}
}
}

Y ejecutá:
eas build --platform android --profile developer --clear-cache

7️⃣ Probar el widget

Instalá el APK en tu dispositivo Android.

Dejá presionada la pantalla principal y elegí “Widgets”.

Buscá “Mis Notas” (o el nombre que configuraste).

Agregalo al home.

Si tenés notas guardadas, deberían aparecer.

Si no hay notas, mostrará el texto por defecto “Sin notas aún”.

🧠 Consejos extra

Si necesitás actualizar el widget desde la app, podés hacerlo con updateWidget("NotesWidget").

Si querés manejar eventos al tocar el widget, agregá una intent que abra la app con data específica.

Si usás TypeScript, asegurate de tener tipos configurados para react-native-android-widget.

En caso de errores, corré expo prebuild --clean antes del build para forzar regeneración de archivos nativos.

Para producción, cambiá el perfil de build a uno con buildType app-bundle.

✅ Resultado esperado

Un widget Android completamente funcional para tu app de notas, creado con React Native + Expo (EAS Build), usando la librería react-native-android-widget. El widget se actualiza automáticamente mostrando las últimas notas guardadas y permite interacción básica con la app principal.

VER LA DOCUMENTACION USANDO EL MCP DE CONTEXT7 PARA LA WEB: https://saleksovski.github.io/react-native-android-widget/docs