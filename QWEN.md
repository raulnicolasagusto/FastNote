# FastNote Project Context

## Project Overview
**Name**: FastNote
**Version**: 1.0.0
**Platform**: React Native with Expo (v54)
**Package**: com.raulnicolasagusto.fastnote
**Owner**: raulnicolasagusto
**EAS Project ID**: 752b2e0a-6270-4cbe-bea5-fb35b8de1d1f

## Core Technologies
- React Native 0.81.4
- Expo SDK 54.0.0
- TypeScript 5.9.2
- Zustand 4.5.1 for state management
- Expo Router 6.0.7 for navigation
- NativeWind for Tailwind CSS styling

## Key Features
1. **AI Voice Transcription** - Using Deepgram API via Cloudflare Worker
2. **Smart Reminders** - GPT-4o-mini analyzes voice commands to extract reminder instructions
3. **OCR** - Text extraction from images using OCR.space API
4. **Rich Text Editing** - Headings, bold, highlight formatting
5. **Checklist Management** - Togglable items with completion tracking
6. **Audio Recording** - In-app audio recording with playback
7. **Folder Organization** - Custom folders to organize notes
8. **Advanced Search** - Across titles, content, and checklist items
9. **Multi-language Support** - English, Spanish, Portuguese
10. **Home Screen Widgets** - Android widget support

## Critical Architecture Components

### State Management (Zustand)
- `useNotesStore.ts` - Main note management
- `useFoldersStore.ts` - Folder organization
- `useThemeStore.ts` - Theme management (light/dark)
- `useAdsStore.ts` - Interstitial ad tracking

### Key Services
- `audioTranscriptionService.ts` - Voice-to-text via Deepgram
- `voiceReminderAnalyzer.ts` - AI reminder detection
- `StorageService.ts` - AsyncStorage persistence
- `NotificationService.ts` - Local reminders

### Project Structure
```
app/ - Expo Router screens
components/ - Reusable UI components
store/ - Zustand state stores
utils/ - Business logic and helpers
types/ - TypeScript definitions
constants/ - Theme and design constants
i18n/ - Translation files
```

## Important Development Rules
1. **No localhost servers** - Never run npm start without explicit permission
2. **API Keys Protection** - Deepgram uses Cloudflare Worker, OpenAI requires EXPO_PUBLIC_OPENAI_API_KEY
3. **Internationalization** - All UI strings must use `t('key')` function, not hardcoded
4. **Type Safety** - Full TypeScript compliance required
5. **State Persistence** - Auto-save on every change using AsyncStorage

## EAS Build Process
- Use `eas build --platform android --profile production` for production builds
- Use `eas submit --platform android --latest` to submit to Play Store
- Always use production profile even for internal testing

## Main Dependencies
- expo-av: For audio recording
- expo-camera: For OCR functionality  
- expo-notifications: For reminders
- expo-quick-actions: For home screen shortcuts
- react-native-pell-rich-editor: For rich text editing
- react-native-google-mobile-ads: For monetization

## API Endpoints
- Cloudflare Worker: `https://fastnote-api-proxy.fastvoiceapp.workers.dev/api/transcribe`
- OpenAI: `https://api.openai.com/v1/chat/completions`
- OCR.space: `https://api.ocr.space/parse/image`

## Environment Variables
- `EXPO_PUBLIC_OPENAI_API_KEY` - Required for voice reminder analysis
- `EXPO_PUBLIC_DEEPGRAM_API_KEY` - Optional fallback (Cloudflare Worker preferred)
- `EXPO_PUBLIC_OCR_API_KEY` - Optional (uses "helloworld" by default)

This context file provides essential information about the FastNote project for ongoing development and support.