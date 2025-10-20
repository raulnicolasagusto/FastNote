import React, { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as QuickActions from 'expo-quick-actions';
import { MainScreen } from '../components/layout/MainScreen';
import { VoiceRecordingModal } from '../components/ui/VoiceRecordingModal';
import { Note, ChecklistItem } from '../types';
import { useNotesStore } from '../store/notes/useNotesStore';
import { useThemeStore } from '../store/theme/useThemeStore';
import { useAdsStore } from '../store/ads/useAdsStore';
import { useTranscriptionLimitsStore } from '../store/transcription/useTranscriptionLimitsStore';
import { StorageService } from '../utils/storage';
import { DEFAULT_CATEGORIES } from '../constants/theme';
import { FREE_TIER_LIMITS } from '../constants/limits';
import Sidebar from '../components/ui/Sidebar';
import { extractReminderDetails } from '../utils/voiceReminderAnalyzer';
import { NotificationService } from '../utils/notifications';
import { interstitialAdService } from '../utils/interstitialAdService';
import { t, getCurrentLanguage } from '../utils/i18n';
import { useLanguage } from '../utils/useLanguage';

export default function Home() {
  useLanguage(); // Forzar re-render en cambio de idioma
  const { addNote } = useNotesStore();
  const { colors } = useThemeStore();
  const { resetInterstitialSession } = useAdsStore();
  const {
    canTranscribe,
    getRemainingTranscriptions,
    getNextResetTime,
    recordTranscription,
    checkAndResetIfNeeded,
    loadLimits,
  } = useTranscriptionLimitsStore();
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0); // Seconds elapsed
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  const { voiceNote } = useLocalSearchParams();

  // Ref to track if quick action was already processed (avoid duplicates)
  const quickActionProcessedRef = useRef(false);

  // Inicializar Interstitial Ad Service, resetear sesión y manejar Cold Start Quick Action
  useEffect(() => {
    const initializeApp = async () => {
      // Initialize services
      interstitialAdService.initialize();
      resetInterstitialSession();
      console.log('🔄 Interstitial Ad session reset - new app session started');
      interstitialAdService.reloadAd();
      await loadLimits();

      // ✅ COLD START HANDLING: Check if app was opened via Quick Action
      // QuickActions.initial is only populated on cold start and consumed once
      const initialAction = QuickActions.initial;
      console.log('🎤 COLD START CHECK - QuickActions.initial:', initialAction);

      if (initialAction?.params?.action === 'voice_note' && !quickActionProcessedRef.current) {
        console.log('🎤 COLD START DETECTED - Quick Action voice_note triggered on app launch');
        quickActionProcessedRef.current = true;

        // Wait for stores to fully initialize (longer delay for cold start)
        setTimeout(() => {
          console.log('🎤 COLD START - Starting voice recording after initialization delay');
          handleVoiceNotePress();
        }, 500); // 500ms to ensure all stores are ready
      }
    };

    initializeApp();
  }, []);

  const handleNotePress = (note: Note) => {
    console.log('🎯 NAVIGATION DEBUG - handleNotePress called with note:', note.title, note.id);
    console.log('🎯 NAVIGATION DEBUG - Current router state before navigation');
    
    try {
      // Navigate to note detail/edit screen
      router.push({
        pathname: '/note-detail',
        params: { noteId: note.id },
      });
      console.log('🎯 NAVIGATION DEBUG - router.push completed successfully for noteId:', note.id);
    } catch (error) {
      console.error('🎯 NAVIGATION ERROR - Failed to navigate:', error);
    }
  };

  const handleNewNotePress = () => {
    // Create new note directly with timestamp title
    const noteTitle = generateNewNoteTitle();

    const newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
      title: noteTitle,
      content: '',
      type: 'text',
      category: DEFAULT_CATEGORIES[0], // Default category
      checklistItems: [],
      images: [],
      isArchived: false,
      isPinned: false,
      isLocked: false,
    };

    const noteId = addNote(newNote);

    // Navigate directly to the note editor
    router.push({
      pathname: '/note-detail',
      params: { noteId },
    });
  };

  const handleVoiceNotePress = async () => {
    console.log('🎤 handleVoiceNotePress called');
    // ⚠️ CRITICAL: Check transcription limits BEFORE starting recording (costs money!)
    await checkAndResetIfNeeded();

    if (!canTranscribe()) {
      const resetTime = getNextResetTime();
      Alert.alert(
        t('recording.dailyLimitReached'),
        t('recording.dailyLimitReachedMessage', { time: resetTime }),
        [{ text: t('common.ok') }]
      );
      return;
    }

    setShowRecordingModal(true);
    await startRecording();
  };

  const handleSearchPress = () => {
    // Navigate to search screen
    router.push('/search');
  };

  const handleFoldersPress = () => {
    // Navigate to folders screen
    router.push('/folders');
  };

  const handleMenuPress = () => {
    setShowSidebar(true);
  };

  // Recording functions (copied from note-detail.tsx)
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert(t('alerts.permissionsRequired'), t('alerts.microphonePermissionRequired'));
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer to track duration (auto-stop is handled by useEffect)
      const timer = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      setRecordingTimer(timer);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert(t('alerts.errorTitle'), t('alerts.recordingStartError'));
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    // Clear timer
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      const uri = recording.getURI();
      const duration = recordingDuration;
      setIsRecording(false);

      if (uri) {
        // Record transcription usage
        await recordTranscription(duration);
        console.log(`🎤 Recorded transcription: ${duration}s`);

        await transcribeAudio(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert(t('alerts.errorTitle'), t('alerts.recordingStopError'));
    }
  };

  const cancelRecording = async () => {
    // Clear timer
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }

    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      setRecording(null);
    }
    setIsRecording(false);
    setRecordingDuration(0);
    setShowRecordingModal(false);
  };

  const detectListKeywords = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    const listKeywords = [
      // Español
      'nueva lista',
      'lista nueva',
      'lista de',
      'lista del',
      'lista para',
      'lista de compras',
      'lista de supermercado',
      'lista de tareas',
      'checklist',
      'check list',
      // Inglés
      'new checklist for',
      'new list',
      'new shopping list',
      'new grocery list',
      'new todo list',
      'new task list',
      'shopping list',
      'grocery list',
      'to do list',
      'task list',
      // Portugués
      'nova lista',
      'lista nova',
      'lista do',
      'lista da',
      'lista para',
      'lista de compras',
      'lista de supermercado',
      'lista do supermercado',
      'lista de tarefas'
    ];

    // También detectar patrones:
    // - "new [word] list"
    // - "new checklist for [word]"
    if (lowerText.match(/^new \w+ list/i) || lowerText.match(/^new checklist for/i)) {
      return true;
    }

    return listKeywords.some(keyword => lowerText.startsWith(keyword));
  };

  const extractListName = (text: string): { listName: string | null; remainingText: string } => {
    const lowerText = text.toLowerCase().trim();

    // Helper para capitalizar primera letra de cada palabra
    const capitalizeWords = (str: string): string => {
      return str.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    };

    // Detectar "new checklist for [nombre]" (inglés) - PRIMERO para tener máxima prioridad
    const newChecklistForMatch = lowerText.match(/^new checklist for ([^,\.]+)/i);
    if (newChecklistForMatch) {
      const extractedName = text.substring('new checklist for '.length, newChecklistForMatch[0].length).trim();
      const listName = capitalizeWords(extractedName);
      const remainingText = text.substring(newChecklistForMatch[0].length).trim();
      const cleanRemaining = remainingText.replace(/^[,\.]?\s*/, '');
      return { listName, remainingText: cleanRemaining };
    }

    // Detectar "new [nombre] list" (inglés) - SEGUNDO para tener prioridad
    const newListMatch = lowerText.match(/^new ([^,\.]+?) list/i);
    if (newListMatch) {
      const extractedName = text.substring('new '.length, newListMatch[0].length - ' list'.length).trim();
      const listName = capitalizeWords(extractedName);
      const remainingText = text.substring(newListMatch[0].length).trim();
      const cleanRemaining = remainingText.replace(/^[,\.]?\s*/, '');
      return { listName, remainingText: cleanRemaining };
    }

    // Detectar "lista de [nombre]"
    const listaDeMatch = lowerText.match(/^lista de ([^,\.]+)/i);
    if (listaDeMatch) {
      const extractedName = text.substring('lista de '.length, listaDeMatch[0].length).trim();
      const listName = capitalizeWords(extractedName);
      const remainingText = text.substring(listaDeMatch[0].length).trim();
      const cleanRemaining = remainingText.replace(/^[,\.]?\s*/, '');
      return { listName, remainingText: cleanRemaining };
    }

    // Detectar "lista del [nombre]"
    const listaDelMatch = lowerText.match(/^lista del ([^,\.]+)/i);
    if (listaDelMatch) {
      const extractedName = text.substring('lista del '.length, listaDelMatch[0].length).trim();
      const listName = capitalizeWords(extractedName);
      const remainingText = text.substring(listaDelMatch[0].length).trim();
      const cleanRemaining = remainingText.replace(/^[,\.]?\s*/, '');
      return { listName, remainingText: cleanRemaining };
    }

    // Detectar "lista para [nombre]"
    const listaParaMatch = lowerText.match(/^lista para ([^,\.]+)/i);
    if (listaParaMatch) {
      const extractedName = text.substring('lista para '.length, listaParaMatch[0].length).trim();
      const listName = capitalizeWords(extractedName);
      const remainingText = text.substring(listaParaMatch[0].length).trim();
      const cleanRemaining = remainingText.replace(/^[,\.]?\s*/, '');
      return { listName, remainingText: cleanRemaining };
    }

    // Detectar "lista do [nombre]" (portugués)
    const listaDoMatch = lowerText.match(/^lista do ([^,\.]+)/i);
    if (listaDoMatch) {
      const extractedName = text.substring('lista do '.length, listaDoMatch[0].length).trim();
      const listName = capitalizeWords(extractedName);
      const remainingText = text.substring(listaDoMatch[0].length).trim();
      const cleanRemaining = remainingText.replace(/^[,\.]?\s*/, '');
      return { listName, remainingText: cleanRemaining };
    }

    // Detectar "nova lista de [nombre]" (portugués)
    const novaListaDeMatch = lowerText.match(/^nova lista de ([^,\.]+)/i);
    if (novaListaDeMatch) {
      const extractedName = text.substring('nova lista de '.length, novaListaDeMatch[0].length).trim();
      const listName = capitalizeWords(extractedName);
      const remainingText = text.substring(novaListaDeMatch[0].length).trim();
      const cleanRemaining = remainingText.replace(/^[,\.]?\s*/, '');
      return { listName, remainingText: cleanRemaining };
    }

    // Detectar "lista da [nombre]" (portugués)
    const listaDaMatch = lowerText.match(/^lista da ([^,\.]+)/i);
    if (listaDaMatch) {
      const listName = text.substring('lista da '.length, listaDaMatch[0].length).trim();
      const remainingText = text.substring(listaDaMatch[0].length).trim();
      const cleanRemaining = remainingText.replace(/^[,\.]?\s*/, '');
      return { listName, remainingText: cleanRemaining };
    }

    // Detectar "nova [nombre] lista" (portugués)
    const novaListaMatch = lowerText.match(/^nova ([^,\.]+?) lista/i);
    if (novaListaMatch) {
      const listName = text.substring('nova '.length, novaListaMatch[0].length - ' lista'.length).trim();
      const remainingText = text.substring(novaListaMatch[0].length).trim();
      const cleanRemaining = remainingText.replace(/^[,\.]?\s*/, '');
      return { listName, remainingText: cleanRemaining };
    }

    return { listName: null, remainingText: text };
  };

  const parseTextToChecklistItems = (text: string): ChecklistItem[] => {
    const items: ChecklistItem[] = [];

    // Remove the list keyword from the beginning
    let cleanText = text;
    const lowerText = text.toLowerCase();

    const listKeywords = [
      // Español - específicas primero
      'lista de supermercado',
      'lista de compras',
      'lista de tareas',
      'nueva lista',
      'lista nueva',
      'lista del',
      'lista para',
      'lista de',
      'checklist',
      'check list',
      // Inglés - específicas primero
      'new checklist for',
      'shopping list',
      'to do list',
      'new list',
      // Portugués - específicas primero
      'lista do supermercado',
      'lista de supermercado',
      'lista de compras',
      'lista de tarefas',
      'nova lista',
      'lista do',
      'lista da',
      'lista para'
    ];

    // Find and remove the keyword
    for (const keyword of listKeywords) {
      if (lowerText.startsWith(keyword.toLowerCase())) {
        cleanText = text.substring(keyword.length).trim();
        break;
      }
    }

    // Split by common separators and clean up
    const separators = /[,;\.]\s+|\s+y\s+|\s+and\s+/i;
    const rawItems = cleanText.split(separators);

    rawItems.forEach((item, index) => {
      const trimmedItem = item.trim();
      if (trimmedItem) {
        const checklistItem: ChecklistItem = {
          id: StorageService.generateId(),
          text: trimmedItem,
          completed: false,
          order: index,
        };
        items.push(checklistItem);
      }
    });

    return items;
  };

  const transcribeAudio = async (audioUri: string) => {
    try {
      console.log('🎤 Reading audio file from:', audioUri);

      // Leer el archivo de audio como string de bytes
      const audioData = await FileSystem.readAsStringAsync(audioUri, {
        encoding: 'base64',
      });

      // Convertir base64 a binary
      const binaryAudio = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));

      console.log('🎤 Audio file size:', binaryAudio.length, 'bytes');

      // 🔒 USANDO CLOUDFLARE WORKER (API keys protegidas)
      const response = await fetch('https://fastnote-api-proxy.fastvoiceapp.workers.dev/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/m4a',
        },
        body: binaryAudio,
      });

      const result = await response.json();

      console.log('🎤 FULL DEEPGRAM RESPONSE:', JSON.stringify(result, null, 2));

      if (response.ok && result.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
        const transcribedText = result.results.channels[0].alternatives[0].transcript;
        const detectedLanguage = result.results?.channels?.[0]?.detected_language;
        console.log('🎤 Detected language:', detectedLanguage);
        console.log('🎤 Transcribed text:', transcribedText);
        await createVoiceNote(transcribedText);
      } else {
        // Transcription failed - show user-friendly error
        Alert.alert(t('alerts.errorTitle'), t('alerts.transcriptionError'));
      }
    } catch (error) {
      // Network or other error - show user-friendly error
      console.warn('Transcription failed:', error instanceof Error ? error.message : 'Unknown error');
      Alert.alert(t('alerts.errorTitle'), t('alerts.transcriptionError'));
    } finally {
      setRecording(null);
      setShowRecordingModal(false);
    }
  };

  // Helper para generar formato de fecha según idioma
  const formatDateByLanguage = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // USA usa MM/DD/YY, el resto usa DD/MM/YY
    const currentLang = getCurrentLanguage();
    const dateFormat = currentLang === 'en'
      ? `${month}/${day}/${year}` // MM/DD/YY para inglés (USA)
      : `${day}/${month}/${year}`; // DD/MM/YY para español y portugués

    return `${dateFormat} ${hours}:${minutes}`;
  };

  const generateVoiceNoteTitle = (): string => {
    const now = new Date();
    return `${t('notes.quickNote')} ${formatDateByLanguage(now)}`;
  };

  const generateNewNoteTitle = (): string => {
    const now = new Date();
    return `${t('notes.newNote')} ${formatDateByLanguage(now)}`;
  };

  // Helper function to clean HTML entities from content
  const cleanHtmlContent = (html: string): string => {
    return html
      .replace(/&nbsp;/g, ' ')  // Replace non-breaking spaces with regular spaces
      .replace(/&amp;/g, '&')   // Decode ampersands
      .replace(/&lt;/g, '<')    // Decode less than
      .replace(/&gt;/g, '>')    // Decode greater than
      .replace(/&quot;/g, '"')  // Decode quotes
      .replace(/&#39;/g, "'")   // Decode apostrophes
      .trim();
  };

  const createVoiceNote = async (transcribedText: string) => {
    console.log('🎤 VOICE NOTE CREATION - Starting analysis for:', transcribedText);

    try {
      // First, analyze for reminder commands
      const reminderAnalysis = await extractReminderDetails(transcribedText);
      console.log('🎤 VOICE NOTE CREATION - Reminder analysis result:', JSON.stringify(reminderAnalysis, null, 2));

      // Use the cleaned text (without reminder commands) for note content
      const noteContent = cleanHtmlContent(reminderAnalysis.cleanText);

      // Generate default title (will be overridden if it's a list with custom name)
      let noteTitle = generateVoiceNoteTitle();

      // Check if the cleaned text indicates a list
      if (detectListKeywords(noteContent)) {
        // Extract list name if exists (e.g., "Lista de Supermercado")
        const { listName, remainingText } = extractListName(noteContent);
        console.log('🎤 LIST NAME EXTRACTION - listName:', listName, '| remainingText:', remainingText);

        // Override title with list name if available
        if (listName) {
          const now = new Date();
          noteTitle = `${listName} ${formatDateByLanguage(now)}`;
        }

        // Convert to checklist using remaining text (without list name)
        const textToParse = listName ? remainingText : noteContent;
        const checklistItems = parseTextToChecklistItems(textToParse);

        if (checklistItems.length > 0) {
          // Create note with checklist
          const newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
            title: noteTitle,
            content: '',
            type: 'checklist',
            category: DEFAULT_CATEGORIES[0], // Default category
            checklistItems,
            images: [],
            isArchived: false,
            isPinned: false,
            isLocked: false,
            reminderDate: reminderAnalysis.hasReminder ? reminderAnalysis.reminderTime : undefined,
          };

          const createdNoteId = addNote(newNote);
          
          // Schedule reminder if detected
          if (reminderAnalysis.hasReminder && reminderAnalysis.reminderTime && createdNoteId) {
            console.log('🎤 VOICE NOTE CREATION - Scheduling reminder for checklist note...');
            
            // Create complete note object for notification
            const completeNote: Note = {
              ...newNote,
              id: createdNoteId,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            const notificationId = await NotificationService.scheduleNoteReminder(completeNote, reminderAnalysis.reminderTime);
            
            if (notificationId) {
              // Update note with notification ID
              // TODO: Add method to update note with notification ID
              console.log('🎤 VOICE NOTE CREATION - Reminder scheduled with ID:', notificationId);

              const formattedDate = reminderAnalysis.reminderTime.toLocaleDateString(getCurrentLanguage() === 'en' ? 'en-US' : 'es-ES');
              const formattedTime = reminderAnalysis.reminderTime.toLocaleTimeString(getCurrentLanguage() === 'en' ? 'en-US' : 'es-ES', { hour: '2-digit', minute: '2-digit' });

              Alert.alert(
                t('alerts.noteCreatedWithReminder'),
                t('alerts.noteCreatedWithReminderMessage', { date: formattedDate, time: formattedTime }),
                [{ text: t('alerts.perfect') }]
              );
            }
          }
          
          return;
        }
      }

      // Create regular text note
      const newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
        title: noteTitle,
        content: noteContent,
        type: 'text',
        category: DEFAULT_CATEGORIES[0], // Default category
        checklistItems: [],
        images: [],
        isArchived: false,
        isPinned: false,
        isLocked: false,
        reminderDate: reminderAnalysis.hasReminder ? reminderAnalysis.reminderTime : undefined,
      };

      const createdNoteId = addNote(newNote);
      
      // Schedule reminder if detected
      if (reminderAnalysis.hasReminder && reminderAnalysis.reminderTime && createdNoteId) {
        console.log('🎤 VOICE NOTE CREATION - Scheduling reminder for text note...');
        
        // Create complete note object for notification
        const completeNote: Note = {
          ...newNote,
          id: createdNoteId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        const notificationId = await NotificationService.scheduleNoteReminder(completeNote, reminderAnalysis.reminderTime);
        
        if (notificationId) {
          console.log('🎤 VOICE NOTE CREATION - Reminder scheduled with ID:', notificationId);

          const formattedDate = reminderAnalysis.reminderTime.toLocaleDateString(getCurrentLanguage() === 'en' ? 'en-US' : 'es-ES');
          const formattedTime = reminderAnalysis.reminderTime.toLocaleTimeString(getCurrentLanguage() === 'en' ? 'en-US' : 'es-ES', { hour: '2-digit', minute: '2-digit' });

          Alert.alert(
            t('alerts.noteCreatedWithReminder'),
            t('alerts.noteCreatedWithReminderMessage', { date: formattedDate, time: formattedTime }),
            [{ text: t('alerts.perfect') }]
          );
        }
      } else if (!reminderAnalysis.hasReminder) {
        console.log('🎤 VOICE NOTE CREATION - No reminder detected, just created note');
      }

    } catch (error) {
      console.error('🎤 VOICE NOTE CREATION - Error analyzing reminder:', error);

      // Fallback: create note normally without reminder analysis
      const fallbackTitle = generateVoiceNoteTitle();
      const newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
        title: fallbackTitle,
        content: cleanHtmlContent(transcribedText),
        type: 'text',
        category: DEFAULT_CATEGORIES[0],
        checklistItems: [],
        images: [],
        isArchived: false,
        isPinned: false,
        isLocked: false,
      };

      addNote(newNote);
    }
  };

  // Auto-stop recording at 60 seconds
  useEffect(() => {
    if (isRecording && recordingDuration >= FREE_TIER_LIMITS.MAX_DURATION_SECONDS) {
      console.log('🎤 Auto-stopping recording at 60 seconds');
      stopRecording();
    }
  }, [recordingDuration, isRecording]);

  // Handle Quick Action voice note trigger (WARM START - app in background)
  useEffect(() => {
    console.log('🎤 WARM START CHECK - voiceNote param:', voiceNote, '| Already processed:', quickActionProcessedRef.current);

    // Only process if not already handled by cold start logic
    if (voiceNote === 'true' && !quickActionProcessedRef.current) {
      console.log('🎤 WARM START DETECTED - Quick Action from background');
      quickActionProcessedRef.current = true;

      // Shorter delay for warm start (app already initialized)
      setTimeout(() => {
        console.log('🎤 WARM START - Starting voice recording');
        handleVoiceNotePress();
      }, 100);
    }
  }, [voiceNote]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainScreen
        onNotePress={handleNotePress}
        onNewNotePress={handleNewNotePress}
        onVoiceNotePress={handleVoiceNotePress}
        onSearchPress={handleSearchPress}
        onFoldersPress={handleFoldersPress}
        onMenuPress={handleMenuPress}
      />

      <Sidebar
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
      />

      {/* Recording Modal */}
      <VoiceRecordingModal
        visible={showRecordingModal}
        isRecording={isRecording}
        recordingDuration={recordingDuration}
        onCancel={cancelRecording}
        onStop={stopRecording}
      />
    </>
  );
}

// Styles removed - now using VoiceRecordingModal component
