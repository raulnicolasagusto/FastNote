import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { useNotesStore } from '../store/notes/useNotesStore';
import { useThemeStore } from '../store/theme/useThemeStore';
import { Note, ChecklistItem } from '../types';
import { SPACING, TYPOGRAPHY, LAYOUT, DEFAULT_CATEGORIES, NOTE_BACKGROUND_COLORS } from '../constants/theme';
import { StorageService } from '../utils/storage';
import Callout from '../components/ui/Callout';
import ShareMenu from '../components/ui/ShareMenu';
import ImagePreviewModal from '../components/ImagePreviewModal';
import ShareableNoteImage from '../components/ShareableNoteImage';
import KeyboardToolbar from '../components/ui/KeyboardToolbar';
import ImagePickerModal from '../components/ui/ImagePickerModal';
import { DrawingCanvas } from '../components/ui/DrawingCanvas';
import AudioRecorder from '../components/ui/AudioRecorder';
import AudioPlayer from '../components/ui/AudioPlayer';
import { useCalloutRotation } from '../utils/useCalloutRotation';
import { extractReminderDetails } from '../utils/voiceReminderAnalyzer';
import { NotificationService } from '../utils/notifications';

/* 
  VOICE REMINDER FEATURE:
  Ejemplos de comandos de voz que ahora activan recordatorios automáticamente:
  
  ✅ "Lista de compras: azúcar, tomate, huevo. Agregar recordatorio para las 15:30 de hoy"
  ✅ "Reunión con cliente mañana. Recordar a las 9:00"
  ✅ "Llamar al doctor. Avisar hoy a las 16:00"
  ✅ "Comprar regalo para mamá. Recordatorio para mañana a las 10:00"
  
  La IA extrae automáticamente:
  - El contenido principal de la nota (sin el comando de recordatorio)
  - La fecha y hora del recordatorio
  - Programa la notificación automáticamente
*/

export default function NoteDetail() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { notes, updateNote, togglePinNote, toggleLockNote } = useNotesStore();
  const { colors, isDarkMode } = useThemeStore();
  const { currentCallout, isVisible, onCloseCallout, resetCallouts } = useCalloutRotation();
  const [note, setNote] = useState<Note | null>(null);

  // Helper function to get text colors for notes with custom backgrounds
  const getTextColors = () => {
    if (note?.backgroundColor) {
      // If note has custom background, use dark text colors for readability
      return {
        primary: '#1a1a1a',    // Dark gray for primary text
        secondary: '#666666',  // Medium gray for secondary text
      };
    }
    // Otherwise use theme colors
    return {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    };
  };

  const textColors = getTextColors();
  const [editingElement, setEditingElement] = useState<'title' | 'content' | 'checklist' | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editedChecklistItems, setEditedChecklistItems] = useState<ChecklistItem[]>([]);
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});
  const shareableImageRef = useRef<View>(null);
  const richTextRef = useRef<RichEditor>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showKeyboardToolbar, setShowKeyboardToolbar] = useState(false);
  const [isFormatMode, setIsFormatMode] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [selectedAudioIndex, setSelectedAudioIndex] = useState<number | null>(null);
  
  // Format button active states
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    h1: false,
    h2: false,
    h3: false,
    highlight: false
  });

  useEffect(() => {
    if (noteId) {
      const foundNote = notes.find((n) => n.id === noteId);
      setNote(foundNote || null);
      if (foundNote) {
        setEditedTitle(foundNote.title);
        setEditedContent(foundNote.content);
        setEditedChecklistItems(foundNote.checklistItems || []);
        // Reset callouts when opening a note
        resetCallouts();
      }
    }
    // Reset format states when loading any note (new or existing)
    setActiveFormats({
      bold: false,
      h1: false,
      h2: false,
      h3: false,
      highlight: false
    });
  }, [noteId, notes, resetCallouts]);

  // Reset format mode when toolbar is hidden
  useEffect(() => {
    if (!showKeyboardToolbar) {
      setIsFormatMode(false);
    }
  }, [showKeyboardToolbar]);



  const handleBack = () => {
    if (editingElement) {
      handleCancelEdit();
    } else {
      router.back();
    }
  };

  const handleStartTitleEdit = () => {
    if (!note) return;
    if (note.isLocked) {
      Alert.alert('Note Locked', 'This note is locked. Unlock it first to edit.');
      return;
    }
    setEditingElement('title');
  };

  const handleStartContentEdit = () => {
    if (!note) return;
    if (note.isLocked) {
      Alert.alert('Note Locked', 'This note is locked. Unlock it first to edit.');
      return;
    }
    setEditingElement('content');
    setShowKeyboardToolbar(true);
  };

  const handleStartChecklistEdit = () => {
    if (!note) return;
    if (note.isLocked) {
      Alert.alert('Note Locked', 'This note is locked. Unlock it first to edit.');
      return;
    }
    setEditingElement('checklist');
  };

  const handleSaveEdit = () => {
    if (!note) return;

    if (editedTitle.trim() === '') {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }

    // Determine note type based on content
    const hasText = editedContent.trim();
    const hasChecklist = editedChecklistItems.length > 0;
    let noteType: 'text' | 'checklist' | 'mixed' = 'text';

    if (hasText && hasChecklist) {
      noteType = 'mixed';
    } else if (hasChecklist) {
      noteType = 'checklist';
    } else {
      noteType = 'text';
    }

    const updates: Partial<Note> = {
      title: editedTitle.trim(),
      content: editedContent.trim(),
      checklistItems: editedChecklistItems,
      type: noteType,
    };

    updateNote(note.id, updates);
    setEditingElement(null);
    setShowKeyboardToolbar(false);
  };

  const handleCancelEdit = () => {
    if (!note) return;

    setEditedTitle(note.title);
    setEditedContent(note.content);
    setEditedChecklistItems(note.checklistItems || []);
    setEditingElement(null);
    setShowKeyboardToolbar(false);
  };

  const handleTogglePin = () => {
    if (!note) return;
    togglePinNote(note.id);
  };

  const handleToggleLock = () => {
    if (!note) return;
    toggleLockNote(note.id);
  };

  const handleBackgroundColorChange = (colorOption: any) => {
    if (!note) return;
    updateNote(note.id, { backgroundColor: colorOption.color });
    setShowColorPicker(false);
  };

  const addChecklistItem = (text: string = '') => {
    const newItem: ChecklistItem = {
      id: StorageService.generateId(),
      text,
      completed: false,
      order: editedChecklistItems.length,
    };
    setEditedChecklistItems([...editedChecklistItems, newItem]);

    // Focus the new item after a short delay to ensure it's rendered
    setTimeout(() => {
      const inputRef = inputRefs.current[newItem.id];
      if (inputRef) {
        inputRef.focus();
      }
    }, 100);

    return newItem;
  };

  const updateChecklistItem = (itemId: string, updates: Partial<ChecklistItem>) => {
    // Only update local state while editing, don't save to store until save button is pressed
    setEditedChecklistItems(items =>
      items.map(item => item.id === itemId ? { ...item, ...updates } : item)
    );
  };

  const toggleCheckboxCompleted = (itemId: string) => {
    if (!note) return;

    const updatedItems = note.checklistItems?.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ) || [];

    updateNote(note.id, { checklistItems: updatedItems });
  };

  const removeChecklistItem = (itemId: string) => {
    setEditedChecklistItems(items => items.filter(item => item.id !== itemId));
  };

  const handleChecklistItemSubmit = (itemId: string) => {
    const currentItem = editedChecklistItems.find(item => item.id === itemId);
    if (currentItem && currentItem.text.trim() !== '') {
      addChecklistItem();
    }
  };

  const toggleChecklistMode = () => {
    if (editedChecklistItems.length === 0) {
      addChecklistItem();
    }
    setEditingElement('checklist');
  };

  // Share functions
  const handleShareAsText = async () => {
    if (!note) return;
    
    try {
      // Import the sharing utility dynamically to avoid import issues
      const { shareNoteAsText } = await import('../utils/shareTextUtils');
      await shareNoteAsText(note);
    } catch (error) {
      console.error('Error sharing note as text:', error);
      Alert.alert(
        'Error',
        `Failed to share note as text: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleShareAsImage = async () => {
    if (!note) return;
    
    try {
      // Import the sharing utility dynamically to avoid import issues
      const { shareNoteAsImage } = await import('../utils/shareImageUtils');
      await shareNoteAsImage(shareableImageRef, note);
    } catch (error) {
      console.error('Error sharing note as image:', error);
      Alert.alert(
        'Error',
        `Failed to share note as image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleExportAsMarkdown = () => {
    console.log('Exportar como Markdown:', note?.title);
    // TODO: Implementar funcionalidad de exportar como Markdown
    Alert.alert('Exportar', 'Exportar como Markdown - Próximamente');
  };

  const handleShareWithSomeone = () => {
    console.log('Compartir con alguien:', note?.title);
    // TODO: Implementar funcionalidad de compartir con alguien
    Alert.alert('Compartir', 'Compartir con alguien - Próximamente');
  };

  // Helper function to detect if URI is audio
  const isAudioUri = (uri: string): boolean => {
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];
    return audioExtensions.some(ext => uri.toLowerCase().includes(ext));
  };

  // Keyboard Toolbar Functions
  const handleToolbarFormat = () => {
    console.log('🎨 Format toolbar pressed');
    // Toggle between normal mode and format mode
    setIsFormatMode(!isFormatMode);
  };

  // Format Mode Functions - Using RichEditor actions
  const handleH1Press = () => {
    console.log('H1 pressed');
    richTextRef.current?.sendAction(actions.heading1, 'result');
    setActiveFormats(prev => ({ ...prev, h1: !prev.h1, h2: false, h3: false }));
  };

  const handleH2Press = () => {
    console.log('H2 pressed');
    richTextRef.current?.sendAction(actions.heading2, 'result');
    setActiveFormats(prev => ({ ...prev, h2: !prev.h2, h1: false, h3: false }));
  };

  const handleH3Press = () => {
    console.log('H3 pressed');
    richTextRef.current?.sendAction(actions.heading3, 'result');
    setActiveFormats(prev => ({ ...prev, h3: !prev.h3, h1: false, h2: false }));
  };

  const handleBoldPress = () => {
    console.log('Bold pressed');
    richTextRef.current?.sendAction(actions.setBold, 'result');
    setActiveFormats(prev => ({ ...prev, bold: !prev.bold }));
  };

  const handleHighlightPress = () => {
    console.log('Highlight pressed');
    if (activeFormats.highlight) {
      // Deactivate highlight - restore default background
      richTextRef.current?.commandDOM(`
        document.execCommand("backColor", false, "inherit");
      `);
    } else {
      // Activate highlight - use different color based on theme
      // Dark mode: darker orange/amber for better contrast with black background
      // Light mode: bright yellow for traditional highlight
      const highlightColor = isDarkMode ? "#D97706" : "yellow";
      richTextRef.current?.commandDOM(`
        document.execCommand("hiliteColor", false, "${highlightColor}");
      `);
    }
    setActiveFormats(prev => ({ ...prev, highlight: !prev.highlight }));
  };

  // Rich text functions no longer needed - using RichEditor
  
  // Display rich text content - simple HTML to Text conversion
  const renderRichContent = (content: string) => {
    if (!content || !content.trim()) {
      return (
        <Text style={[styles.contentText, { color: textColors.secondary }]}>
          No content
        </Text>
      );
    }

    // If it's plain text, return as is
    if (!content.includes('<') || !content.includes('>')) {
      return (
        <Text style={[styles.contentText, { color: textColors.primary }]}>
          {content}
        </Text>
      );
    }

    // Helper to decode HTML entities
    const decodeHtmlEntities = (text: string): string => {
      return text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    };

    // Enhanced HTML parsing for rich text with proper nesting
    const parseHtmlToElements = (html: string) => {
      const elements: any[] = [];
      let key = 0;

      // Process content line by line to handle complex structures
      const processText = (text: string, baseStyle: any = [styles.contentText, { color: textColors.primary }]) => {
        // Handle inline formatting within text - detect both yellow and dark mode orange
        if (text.includes('<span') && (text.includes('background') || text.includes('yellow') || text.includes('#D97706') || text.includes('rgb(217, 119, 6)'))) {
          // More precise regex to capture ONLY the span content
          const regex = /<span[^>]*background[^>]*>(.*?)<\/span>/gs;
          const parts: any[] = [];
          let lastIndex = 0;
          let match;

          while ((match = regex.exec(text)) !== null) {
            // Add text before the span as plain string
            if (match.index > lastIndex) {
              const beforeText = decodeHtmlEntities(text.substring(lastIndex, match.index).replace(/<[^>]*>/g, ''));
              if (beforeText) {
                parts.push(beforeText);
              }
            }

            // Add highlighted text as nested Text component
            const innerText = decodeHtmlEntities(match[1].replace(/<[^>]*>/g, ''));
            // Use different highlight color based on theme
            const highlightBg = isDarkMode ? '#D97706' : 'yellow';
            parts.push(
              <Text key={`${key}-hl-${parts.length}`} style={{ backgroundColor: highlightBg }}>
                {innerText}
              </Text>
            );

            lastIndex = regex.lastIndex;
          }

          // Add remaining text after last span as plain string
          if (lastIndex < text.length) {
            const afterText = decodeHtmlEntities(text.substring(lastIndex).replace(/<[^>]*>/g, ''));
            if (afterText) {
              parts.push(afterText);
            }
          }

          // Wrap everything in ONE Text component to keep them in the same line
          return (
            <Text key={key} style={baseStyle}>
              {parts}
            </Text>
          );
        } else {
          const cleanText = text.replace(/<[^>]*>/g, '');
          return cleanText ? (
            <Text key={key} style={baseStyle}>
              {cleanText}
            </Text>
          ) : null;
        }
      };
      
      // Split by major block elements
      const blocks = html.split(/(<\/?(?:h[1-6]|div|p)[^>]*>)/);
      
      let currentBlockType: 'h1' | 'h2' | 'h3' | null = null;
      let currentContent = '';
      
      blocks.forEach(block => {
        if (block.match(/<h1[^>]*>/)) {
          currentBlockType = 'h1';
          currentContent = '';
        } else if (block.match(/<h2[^>]*>/)) {
          currentBlockType = 'h2'; 
          currentContent = '';
        } else if (block.match(/<h3[^>]*>/)) {
          currentBlockType = 'h3';
          currentContent = '';
        } else if (block.match(/<\/h[1-6]>/)) {
          // End of heading - process accumulated content
          if (currentContent.trim()) {
            const style = currentBlockType === 'h1' ? styles.headerH1 : 
                         currentBlockType === 'h2' ? styles.headerH2 : styles.headerH3;
            const processed = processText(currentContent, [style, { color: textColors.primary }]);
            if (Array.isArray(processed)) {
              elements.push(
                <Text key={key++} style={[style, { color: textColors.primary }]}>
                  {processed}
                </Text>
              );
            } else if (processed) {
              elements.push(processed);
              key++;
            }
          }
          currentBlockType = null;
          currentContent = '';
        } else if (block.match(/<\/?(?:div|p)/)) {
          // Skip div/p tags but process any accumulated content
          if (currentContent.trim()) {
            const processed = processText(currentContent);
            if (Array.isArray(processed)) {
              elements.push(...processed);
            } else if (processed) {
              elements.push(processed);
            }
            key++;
          }
          currentContent = '';
        } else if (block.trim()) {
          // Accumulate content
          currentContent += block;
        }
      });
      
      // Process any remaining content
      if (currentContent.trim()) {
        const processed = processText(currentContent);
        if (Array.isArray(processed)) {
          elements.push(...processed);
        } else if (processed) {
          elements.push(processed);
        }
      }
      
      return elements;
    };
    
    const elements = parseHtmlToElements(content);
    
    return (
      <View>
        {elements.length > 0 ? elements : (
          <Text style={[styles.contentText, { color: textColors.primary }]}>
            {content.replace(/<[^>]*>/g, '')}
          </Text>
        )}
      </View>
    );
  };

  const handleToolbarAudio = () => {
    setShowAudioRecorder(true);
  };

  const handleAudioSaved = async (audioUri: string) => {
    if (!note) return;

    try {
      // Add audio to note.images array for simplicity (like we do with drawings)
      updateNote(note.id, {
        images: [...(note.images || []), audioUri],
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error adding audio to note:', error);
    }
  };

  const handleToolbarDraw = () => {
    setShowDrawingCanvas(true);
  };

  const handleDrawingSaved = async (drawingDataUri: string) => {
    if (!note || !drawingDataUri) return;

    try {
      // Use the same logic as regular images
      updateNote(note.id, {
        images: [...(note.images || []), drawingDataUri],
        updatedAt: new Date(),
      });
      
    } catch (error) {
      console.error('Error adding drawing to note:', error);
    }
  };

  const handleToolbarImage = () => {
    setShowImagePicker(true);
  };

  const handleImageSelected = async (imageUri: string) => {
    if (!note) return;

    try {
      // Simple: always just add to images array
      updateNote(note.id, {
        images: [...(note.images || []), imageUri],
        updatedAt: new Date(),
      });
      
    } catch (error) {
      console.error('Error adding image to note:', error);
    }
  };

  const removeImageFromBlocks = (blockIndex: number) => {
    if (!note) return;

    try {
      console.log('🗑️ Removing image from blocks at index:', blockIndex);
      
      const currentBlocks = note.contentBlocks || [];
      const newBlocks = currentBlocks.filter((_, index) => index !== blockIndex);
      
      updateNote(note.id, {
        contentBlocks: newBlocks,
        updatedAt: new Date(),
      });
      
      console.log('✅ Image removed from blocks successfully');
      
    } catch (error) {
      console.error('Error removing image from blocks:', error);
      Alert.alert('Error', 'No se pudo eliminar la imagen.');
    }
  };

  const removeImageFromLegacy = (imageIndex: number) => {
    if (!note) return;

    try {
      console.log('🗑️ Removing legacy image at index:', imageIndex);
      
      const currentImages = note.images || [];
      const newImages = currentImages.filter((_, index) => index !== imageIndex);
      
      updateNote(note.id, {
        images: newImages,
        updatedAt: new Date(),
      });
      
      console.log('✅ Legacy image removed successfully');
      
    } catch (error) {
      console.error('Error removing legacy image:', error);
      Alert.alert('Error', 'No se pudo eliminar la imagen.');
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Microphone permission is required to record audio.');
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
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      const uri = recording.getURI();
      setIsRecording(false);

      if (uri) {
        await transcribeAudio(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    }
  };

  const cancelRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      setRecording(null);
    }
    setIsRecording(false);
    setShowRecordingModal(false);
  };

  const transcribeAudio = async (audioUri: string) => {
    try {
      if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
        Alert.alert('Error', 'OpenAI API key not found. Please check your configuration.');
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.text) {
        await insertTranscribedText(result.text);
      } else {
        Alert.alert('Error', 'Failed to transcribe audio. Please try again.');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      Alert.alert('Error', 'Failed to transcribe audio. Please try again.');
    } finally {
      setRecording(null);
      setShowRecordingModal(false);
    }
  };

  const detectListKeywords = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    const listKeywords = [
      'nueva lista',
      'lista nueva',
      'lista de',
      'lista del',
      'lista para',
      'lista de compras',
      'lista de supermercado',
      'shopping list',
      'to do list',
      'lista de tareas',
      'checklist',
      'check list',
      'new list'
    ];

    return listKeywords.some(keyword => lowerText.startsWith(keyword));
  };

  const detectAddToListKeywords = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    const addToListKeywords = [
      'agregar a la lista',
      'añadir a la lista',
      'agregar también',
      'añadir también',
      'agregar tambien',
      'añadir tambien',
      'add to list',
      'add also',
      'también',
      'tambien',
      'agregar'
    ];

    return addToListKeywords.some(keyword => lowerText.includes(keyword));
  };

  const parseTextToChecklistItems = (text: string): ChecklistItem[] => {
    const items: ChecklistItem[] = [];

    // Remove the list keyword from the beginning
    let cleanText = text;
    const lowerText = text.toLowerCase();

    const listKeywords = [
      'lista de supermercado',
      'lista de compras',
      'lista de tareas',
      'shopping list',
      'to do list',
      'nueva lista',
      'lista nueva',
      'lista del',
      'lista para',
      'lista de',
      'checklist',
      'check list',
      'new list'
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
          text: trimmedItem.charAt(0).toUpperCase() + trimmedItem.slice(1),
          completed: false,
          order: index,
        };
        items.push(checklistItem);
      }
    });

    return items;
  };

  const processImageForOCR = async (imageUri: string) => {
    try {
      setIsProcessingImage(true);

      // Convert image to base64 using new File API
      const file = new File(imageUri);
      const base64Image = await file.base64();

      // Use OCR.space free API (25,000 requests/month)
      const formData = new FormData();
      formData.append('base64Image', `data:image/jpeg;base64,${base64Image}`);
      formData.append('language', 'spa'); // Spanish
      formData.append('isOverlayRequired', 'false');
      formData.append('apikey', 'helloworld'); // Free API key

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.ParsedResults?.[0]?.ParsedText) {
        const detectedText = result.ParsedResults[0].ParsedText.trim();

        if (detectedText) {
          await insertTranscribedText(detectedText);
          Alert.alert('Texto Reconocido', 'Texto extraído exitosamente de la imagen!');
        } else {
          Alert.alert('Sin Texto', 'No se detectó texto en la imagen. Intenta con una imagen más clara.');
        }
      } else {
        Alert.alert('Sin Texto', 'No se detectó texto en la imagen. Intenta con una imagen más clara.');
      }

    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('Error', 'Error al procesar la imagen. Verifica tu conexión a internet.');
    } finally {
      setIsProcessingImage(false);
      setShowCameraModal(false);
    }
  };

  const takePhotoAndProcess = async () => {
    try {
      const permission = await Camera.requestCameraPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to scan text.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImageForOCR(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera Error:', error);
      Alert.alert('Error', 'Failed to access camera. Please try again.');
    }
  };

  const pickImageAndProcess = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImageForOCR(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image Picker Error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const insertTranscribedText = async (transcribedText: string) => {
    if (!note) return;

    console.log('🎤 VOICE PROCESSING - Starting analysis of transcribed text:', transcribedText);
    console.log('🎤 VOICE PROCESSING - Note context:', { noteId: note.id, title: note.title });

    // First, analyze for reminder commands using AI
    try {
      console.log('🎤 VOICE PROCESSING - Calling extractReminderDetails...');
      const reminderAnalysis = await extractReminderDetails(transcribedText);
      console.log('🎤 VOICE PROCESSING - Reminder analysis result:', JSON.stringify(reminderAnalysis, null, 2));

      // Use the cleaned text (without reminder commands) for further processing
      const textToProcess = reminderAnalysis.cleanText;

      // If a reminder was detected, schedule it
      if (reminderAnalysis.hasReminder && reminderAnalysis.reminderTime) {
        console.log('🎤 VOICE PROCESSING - Scheduling reminder for:', reminderAnalysis.reminderTime);
        
        // Schedule the notification
        const notificationId = await NotificationService.scheduleNoteReminder(note, reminderAnalysis.reminderTime);
        
        if (notificationId) {
          // Update note with reminder
          updateNote(note.id, { 
            reminderDate: reminderAnalysis.reminderTime,
            notificationId: notificationId 
          });

          // Show confirmation to user
          Alert.alert(
            '⏰ Recordatorio programado por voz',
            `Se programó un recordatorio para el ${reminderAnalysis.reminderTime.toLocaleDateString('es-ES')} a las ${reminderAnalysis.reminderTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}.\n\nFrase detectada: "${reminderAnalysis.originalReminderPhrase || 'comando de recordatorio'}"`,
            [{ text: 'Perfecto' }]
          );
        }
      }

      // Continue with normal text processing using the cleaned text
      // Check if it's a command to add to existing list
      if (detectAddToListKeywords(textToProcess)) {
        console.log('🎤 VOICE PROCESSING - Detected "add to list" command');
        
        // Parse the new items (remove the add command keywords first)
        let cleanTextForParsing = textToProcess;
        const addKeywords = ['agregar a la lista', 'añadir a la lista', 'agregar también', 'añadir también', 'agregar tambien', 'añadir tambien', 'add to list', 'add also', 'también', 'tambien', 'agregar'];
        
        for (const keyword of addKeywords) {
          cleanTextForParsing = cleanTextForParsing.toLowerCase().replace(keyword, '').trim();
        }
        
        // Remove common separators
        cleanTextForParsing = cleanTextForParsing.replace(/^[,:;-]\s*/, '');
        
        const newChecklistItems = parseTextToChecklistItems(cleanTextForParsing);
        
        if (newChecklistItems.length > 0) {
          // Add to existing checklist (or create new one if none exists)
          const existingItems = note.checklistItems || [];
          const combinedItems = [...existingItems, ...newChecklistItems];
          
          const noteType = note.content && note.content.trim() ? 'mixed' : 'checklist';
          
          const updates: Partial<Note> = {
            type: noteType,
            checklistItems: combinedItems,
            content: note.content || '',
          };

          updateNote(note.id, updates);
          setEditedChecklistItems(combinedItems);
          setEditingElement('checklist');
          return;
        }
      }
      // Regular list creation
      else if (detectListKeywords(textToProcess)) {
        console.log('🎤 VOICE PROCESSING - Detected new list creation command');
        
        // Convert to checklist
        const newChecklistItems = parseTextToChecklistItems(textToProcess);

        if (newChecklistItems.length > 0) {
          // Combine existing checklist items with new ones
          const existingItems = note.checklistItems || [];
          const combinedItems = [...existingItems, ...newChecklistItems];

        // Determine note type based on content
        const hasText = note.content && note.content.trim();
        const noteType = hasText ? 'mixed' : 'checklist';

        // Update the note with new checklist items, preserving existing content
        const updates: Partial<Note> = {
          type: noteType,
          checklistItems: combinedItems,
          // Preserve existing text content
          content: note.content || '',
        };

        updateNote(note.id, updates);
        setEditedChecklistItems(combinedItems);

        // Switch to checklist editing mode
        setEditingElement('checklist');
        return;
      }
    }

      // If not a list, insert as regular text
      const updatedContent = editedContent ? `${editedContent}\n\n${textToProcess}` : textToProcess;
      setEditedContent(updatedContent);

      // Determine note type based on content
      const hasChecklist = note.checklistItems && note.checklistItems.length > 0;
      const noteType = hasChecklist ? 'mixed' : 'text';

      // Auto-save the transcribed text, preserving existing checklist
      const updates: Partial<Note> = {
        type: noteType,
        content: updatedContent.trim(),
        // Preserve existing checklist items
        checklistItems: note.checklistItems || [],
      };
      updateNote(note.id, updates);
    } catch (error) {
      console.error('🎤 VOICE PROCESSING - Error analyzing voice for reminders:', error);
      
      // Fallback: process text normally without reminder analysis
      console.log('🎤 VOICE PROCESSING - Fallback: processing text normally');
      
      // Check if it's a command to add to existing list (fallback)
      if (detectAddToListKeywords(transcribedText)) {
        console.log('🎤 VOICE PROCESSING - Fallback: Detected "add to list" command');
        
        // Parse the new items (remove the add command keywords first)
        let cleanTextForParsing = transcribedText;
        const addKeywords = ['agregar a la lista', 'añadir a la lista', 'agregar también', 'añadir también', 'agregar tambien', 'añadir tambien', 'add to list', 'add also', 'también', 'tambien', 'agregar'];
        
        for (const keyword of addKeywords) {
          cleanTextForParsing = cleanTextForParsing.toLowerCase().replace(keyword, '').trim();
        }
        
        // Remove common separators
        cleanTextForParsing = cleanTextForParsing.replace(/^[,:;-]\s*/, '');
        
        const newChecklistItems = parseTextToChecklistItems(cleanTextForParsing);
        
        if (newChecklistItems.length > 0) {
          const existingItems = note.checklistItems || [];
          const combinedItems = [...existingItems, ...newChecklistItems];
          const hasText = note.content && note.content.trim();
          const noteType = hasText ? 'mixed' : 'checklist';

          const updates: Partial<Note> = {
            type: noteType,
            checklistItems: combinedItems,
            content: note.content || '',
          };

          updateNote(note.id, updates);
          setEditedChecklistItems(combinedItems);
          setEditingElement('checklist');
          return;
        }
      }
      // Regular list creation (fallback)
      else if (detectListKeywords(transcribedText)) {
        console.log('🎤 VOICE PROCESSING - Fallback: Detected new list creation command');
        
        // Convert to checklist (fallback)
        const newChecklistItems = parseTextToChecklistItems(transcribedText);

        if (newChecklistItems.length > 0) {
          const existingItems = note.checklistItems || [];
          const combinedItems = [...existingItems, ...newChecklistItems];
          const hasText = note.content && note.content.trim();
          const noteType = hasText ? 'mixed' : 'checklist';

          const updates: Partial<Note> = {
            type: noteType,
            checklistItems: combinedItems,
            content: note.content || '',
          };

          updateNote(note.id, updates);
          setEditedChecklistItems(combinedItems);
          setEditingElement('checklist');
          return;
        }
      }

      // If not a list, insert as regular text (fallback)
      const updatedContent = editedContent ? `${editedContent}\n\n${transcribedText}` : transcribedText;
      setEditedContent(updatedContent);

      const hasChecklist = note.checklistItems && note.checklistItems.length > 0;
      const noteType = hasChecklist ? 'mixed' : 'text';

      const updates: Partial<Note> = {
        type: noteType,
        content: updatedContent.trim(),
        checklistItems: note.checklistItems || [],
      };
      updateNote(note.id, updates);
    }
  };


  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Function to count characters excluding spaces
  const countCharacters = (text: string) => {
    return text.replace(/\s/g, '').length;
  };

  // Function to format reminder date for display
  const formatReminderDate = (date: Date | undefined) => {
    if (!date) return '';
    
    // Ensure we have a valid Date object
    const reminderDate = new Date(date);
    if (isNaN(reminderDate.getTime())) return '';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const reminderDay = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
    
    const daysDiff = Math.floor((reminderDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let dayText = '';
    if (daysDiff === 0) {
      dayText = 'Hoy';
    } else if (daysDiff === 1) {
      dayText = 'Mañana';
    } else if (daysDiff === -1) {
      dayText = 'Ayer';
    } else if (daysDiff > 1) {
      dayText = `En ${daysDiff} días`;
    } else {
      dayText = `Hace ${Math.abs(daysDiff)} días`;
    }
    
    const timeText = reminderDate.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return `${dayText} ${timeText}`;
  };

  const renderContent = () => {
    if (!note) return null;

    const hasText = note.content && note.content.trim();
    const hasChecklist = note.checklistItems && note.checklistItems.length > 0;
    const hasImages = note.images && note.images.length > 0;

    // If neither text nor checklist, show empty state (but still show images if they exist)
    if (!hasText && !hasChecklist) {
      return (
        <View>
          {hasImages && (
            <View style={styles.imagesSection}>
              {note.images.map((imageUri, index) => 
                isAudioUri(imageUri) ? (
                  // Render audio player for audio files
                  <AudioPlayer
                    key={index}
                    audioUri={imageUri}
                    onDelete={() => {
                      removeImageFromLegacy(index);
                    }}
                  />
                ) : (
                  // Render image for image files
                  <TouchableOpacity
                    key={index}
                    style={styles.imageContainer}
                    onPress={() => {
                      if (selectedImageIndex === index) {
                        setSelectedImageIndex(null);
                      } else {
                        setSelectedImageIndex(index);
                        setSelectedBlockIndex(null);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.noteImage}
                      resizeMode="contain"
                    />
                    {selectedImageIndex === index && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          removeImageFromLegacy(index);
                          setSelectedImageIndex(null);
                        }}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="delete" size={24} color="white" />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                )
              )}
            </View>
          )}
          <Text style={[styles.emptyText, { color: textColors.secondary }]}>
            Start writing or add a checklist...
          </Text>
        </View>
      );
    }

    return (
      <View>
        {/* Render blocks in view mode (contentBlocks system) */}
        {note.contentBlocks && note.contentBlocks.length > 0 && (
          note.contentBlocks.map((block, index) =>
            block.type === 'text' && block.content && block.content.trim() ? (
              <TouchableOpacity
                key={`view-block-${index}`}
                style={styles.textSection}
                onPress={handleStartContentEdit}
                activeOpacity={1}
              >
                {renderRichContent(block.content)}
              </TouchableOpacity>
            ) : block.type === 'image' && block.uri && block.uri.length > 50 && (block.uri.startsWith('data:') || block.uri.startsWith('file:')) ? (
              isAudioUri(block.uri) ? (
                // Render audio player for audio files
                <View key={`view-block-${index}`} style={styles.imageWithTextWrapper}>
                  <AudioPlayer
                    audioUri={block.uri}
                    onDelete={() => {
                      removeImageFromBlocks(index);
                    }}
                  />
                </View>
              ) : (
                // Render image for image files
                <View key={`view-block-${index}`} style={styles.imageWithTextWrapper}>
                  <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={() => {
                      if (selectedBlockIndex === index) {
                        // Deselect if already selected
                        setSelectedBlockIndex(null);
                      } else {
                        // Select this image
                        setSelectedBlockIndex(index);
                        setSelectedImageIndex(null); // Clear legacy selection
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: block.uri }}
                      style={styles.noteImage}
                      resizeMode="contain"
                    />
                    {/* Delete button - only show if selected */}
                    {selectedBlockIndex === index && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          removeImageFromBlocks(index);
                          setSelectedBlockIndex(null);
                        }}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="delete" size={24} color="white" />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                </View>
              )
            ) : null
          )
        )}

        {/* Render legacy text content if no contentBlocks */}
        {(!note.contentBlocks || note.contentBlocks.length === 0) && hasText && (
          <TouchableOpacity
            style={styles.textSection}
            onPress={handleStartContentEdit}
            activeOpacity={1}>
            {renderRichContent(note.content)}
          </TouchableOpacity>
        )}

        {/* ALWAYS render legacy images and audio - regardless of contentBlocks */}
        {note.images && note.images.length > 0 && (
          <View style={styles.imagesSection}>
            {note.images.map((imageUri, index) =>
              isAudioUri(imageUri) ? (
                // Render audio player for audio files
                <AudioPlayer
                  key={index}
                  audioUri={imageUri}
                  onDelete={() => {
                    removeImageFromLegacy(index);
                  }}
                />
              ) : (
                // Render image for image files
                <TouchableOpacity
                  key={index}
                  style={styles.imageContainer}
                  onPress={() => {
                    if (selectedImageIndex === index) {
                      // Deselect if already selected
                      setSelectedImageIndex(null);
                    } else {
                      // Select this image
                      setSelectedImageIndex(index);
                      setSelectedBlockIndex(null); // Clear block selection
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.noteImage}
                    resizeMode="contain"
                  />
                  {/* Delete button - only show if selected */}
                  {selectedImageIndex === index && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        removeImageFromLegacy(index);
                        setSelectedImageIndex(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="delete" size={24} color="white" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              )
            )}
          </View>
        )}



        {/* Text placeholder when no text but has checklist */}
        {!hasText && hasChecklist && (
          <TouchableOpacity
            style={styles.textPlaceholder}
            onPress={handleStartContentEdit}
            activeOpacity={1}>
            <Text style={[styles.placeholderText, { color: textColors.secondary }]}>Tap to add text...</Text>
          </TouchableOpacity>
        )}

        {/* Render checklist items if they exist */}
        {hasChecklist && (
          <View style={[styles.checklistSection, hasText && styles.checklistWithText, hasText && { borderTopWidth: 1, borderTopColor: textColors.secondary + '33' }]}>
            {note.checklistItems!.map((item) => (
              <View key={item.id} style={styles.checklistItem}>
                <TouchableOpacity
                  style={styles.checkboxDisplay}
                  onPress={() => toggleCheckboxCompleted(item.id)}
                  activeOpacity={0.7}>
                  <MaterialIcons
                    name={item.completed ? "check-box" : "check-box-outline-blank"}
                    size={24}
                    color={item.completed ? colors.accent.green : textColors.secondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.checklistTextContainer}
                  onPress={handleStartChecklistEdit}
                  activeOpacity={1}>
                  <Text style={[styles.checklistText, { color: textColors.primary }, item.completed && styles.completedText]}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (!note) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar
          style="dark"
          backgroundColor={colors.background}
          translucent={false}
        />
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Note not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialIcons
            name={editingElement ? "close" : "arrow-back"}
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {/* Background color picker */}
          <TouchableOpacity
            onPress={() => setShowColorPicker(true)}
            style={styles.actionIcon}
            disabled={note.isLocked && !editingElement}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons
              name="palette"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          {/* Star/Pin icon */}
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={handleTogglePin}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons
              name={note.isPinned ? "star" : "star-border"}
              size={24}
              color={note.isPinned ? colors.accent.orange : colors.textPrimary}
            />
          </TouchableOpacity>

          {/* Camera icon - only show when not editing */}
          {!editingElement && !note.isLocked && (
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={() => setShowCameraModal(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons
                name="camera-alt"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          )}

          {/* Microphone icon - only show when not editing */}
          {!editingElement && !note.isLocked && (
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={() => {
                setShowRecordingModal(true);
                startRecording();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons
                name="mic"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          )}

          {/* Lock icon */}
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={handleToggleLock}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons
              name={note.isLocked ? "lock" : "lock-open"}
              size={24}
              color={note.isLocked ? colors.accent.red : colors.textPrimary}
            />
          </TouchableOpacity>


          {/* Checklist icon - only show when not editing checklist */}
          {!editingElement && (
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={toggleChecklistMode}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons
                name="checklist"
                size={24}
                color={note.checklistItems && note.checklistItems.length > 0 ? colors.accent.blue : colors.textSecondary}
              />
            </TouchableOpacity>
          )}

          {/* Share icon - only show when not editing */}
          {!editingElement && (
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={() => setShowShareMenu(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons
                name="share"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          )}

          {/* Save icon - only show when editing */}
          {editingElement && (
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={handleSaveEdit}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons
                name="check"
                size={24}
                color={colors.accent.green}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Keyboard Toolbar */}
      <KeyboardToolbar
        visible={showKeyboardToolbar}
        isFormatMode={isFormatMode}
        onFormatPress={handleToolbarFormat}
        onAudioPress={handleToolbarAudio}
        onDrawPress={handleToolbarDraw}
        onImagePress={handleToolbarImage}
        // Format mode handlers
        onH1Press={handleH1Press}
        onH2Press={handleH2Press}
        onH3Press={handleH3Press}
        onBoldPress={handleBoldPress}
        onHighlightPress={handleHighlightPress}
        // Active states for visual feedback
        activeFormats={activeFormats}
      />

      {/* Callouts */}
      {currentCallout && (
        <Callout
          visible={isVisible}
          message={currentCallout.message}
          iconName={currentCallout.iconName}
          keywords={currentCallout.keywords}
          onClose={onCloseCallout}
        />
      )}

      {/* Content */}
      <ScrollView 
        style={[styles.content, { backgroundColor: note.backgroundColor || colors.background }]} 
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={() => {
          // Deselect any selected images when touching outside
          setSelectedImageIndex(null);
          setSelectedBlockIndex(null);
        }}>
          <View style={{ flex: 1 }}>
            {/* Date, reminder and character count */}
            <View style={styles.dateContainer}>
          <View style={styles.dateInfoRow}>
            <Text style={[styles.date, { color: textColors.secondary }]}>{formatDate(note.createdAt)}</Text>
            
            {/* Reminder indicator */}
            {note.reminderDate && formatReminderDate(note.reminderDate) && (
              <View style={styles.reminderContainer}>
                <MaterialIcons name="schedule" size={14} color={colors.accent.orange} />
                <Text style={[styles.reminderText, { color: colors.accent.orange }]}>
                  {formatReminderDate(note.reminderDate)}
                </Text>
              </View>
            )}
            
            {/* Character counter - updates in real time */}
            <View style={styles.characterCountContainer}>
              <MaterialIcons name="text-fields" size={14} color={textColors.secondary} />
              <Text style={[styles.characterCount, { color: textColors.secondary }]}>
                {editingElement === 'content' 
                  ? countCharacters(editedContent + (editedChecklistItems?.map(item => item.text).join('') || ''))
                  : editingElement === 'checklist'
                  ? countCharacters((note.content || '') + (editedChecklistItems?.map(item => item.text).join('') || ''))
                  : countCharacters(note.content + (note.checklistItems?.map(item => item.text).join('') || ''))
                } chars
              </Text>
            </View>
          </View>
          
          {!editingElement && !note.isLocked && (
            <Text style={[styles.editHint, { color: textColors.secondary }]}>Tap to edit</Text>
          )}
        </View>

        {/* Title */}
        {editingElement === 'title' ? (
          <TextInput
            style={[styles.titleInput, { color: textColors.primary, backgroundColor: note.backgroundColor || colors.background, borderColor: textColors.primary }]}
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Note title..."
            placeholderTextColor={textColors.secondary}
            multiline
            maxLength={100}
            autoFocus
          />
        ) : (
          <TouchableOpacity
            onPress={handleStartTitleEdit}
            activeOpacity={1}>
            <Text style={[styles.title, { color: textColors.primary }]}>
              {note.title}
            </Text>
          </TouchableOpacity>
        )}

        {/* Content */}
        {editingElement === 'content' ? (
          <View>
            <RichEditor
              ref={richTextRef}
              style={{
                minHeight: 50,
                maxHeight: 300,
              }}
              initialContentHTML={editedContent}
              onChange={setEditedContent}
              placeholder="Start writing..."
              editorStyle={{
                backgroundColor: 'transparent',
                color: textColors.primary
              }}
            />
            
            {/* Show images and audio during editing - RESTORED */}
            {note.images && note.images.length > 0 && (
              <View style={styles.imagesSection}>
                {note.images.map((imageUri, index) => 
                  isAudioUri(imageUri) ? (
                    // Render audio player for audio files
                    <AudioPlayer
                      key={index}
                      audioUri={imageUri}
                      onDelete={() => {
                        removeImageFromLegacy(index);
                      }}
                    />
                  ) : (
                    // Render image for image files
                    <TouchableOpacity
                      key={index}
                      style={styles.imageContainer}
                      onPress={() => {
                        console.log('🖼️ Image tapped in edit mode:', index);
                        if (selectedImageIndex === index) {
                          // Deselect if already selected
                          setSelectedImageIndex(null);
                        } else {
                          // Select this image
                          setSelectedImageIndex(index);
                          setSelectedBlockIndex(null); // Clear block selection
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.noteImage}
                        resizeMode="contain"
                      />
                      {/* Delete button - only show if selected */}
                      {selectedImageIndex === index && (
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            removeImageFromLegacy(index);
                            setSelectedImageIndex(null);
                          }}
                          activeOpacity={0.7}
                        >
                          <MaterialIcons name="delete" size={24} color="white" />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  )
                )}
              </View>
            )}
          </View>
        ) : editingElement === 'checklist' ? (
          <View style={styles.checklistContainer}>
            {editedChecklistItems.map((item, index) => (
              <View key={item.id} style={styles.checklistEditItem}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => updateChecklistItem(item.id, { completed: !item.completed })}>
                  <MaterialIcons
                    name={item.completed ? "check-box" : "check-box-outline-blank"}
                    size={24}
                    color={item.completed ? colors.accent.green : colors.textSecondary}
                  />
                </TouchableOpacity>
                <TextInput
                  ref={(ref) => {
                    inputRefs.current[item.id] = ref;
                  }}
                  style={[
                    styles.checklistInput,
                    item.completed && styles.completedChecklistInput,
                  ]}
                  value={item.text}
                  onChangeText={(text) => {
                    const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
                    updateChecklistItem(item.id, { text: capitalizedText });
                  }}
                  placeholder="Add item..."
                  placeholderTextColor={colors.textSecondary}
                  onSubmitEditing={() => handleChecklistItemSubmit(item.id)}
                  returnKeyType="next"
                  autoFocus={index === editedChecklistItems.length - 1 && !item.text}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  style={styles.deleteItemButton}
                  onPress={() => removeChecklistItem(item.id)}>
                  <MaterialIcons name="close" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={() => addChecklistItem()}>
              <MaterialIcons name="add" size={20} color={colors.accent.blue} />
              <Text style={styles.addItemText}>Add item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleStartContentEdit}
            activeOpacity={1}>
            <View style={styles.contentContainer}>
              {renderContent()}
            </View>
          </TouchableOpacity>
        )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      {/* Camera Modal */}
      {showCameraModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.recordingModal, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.recordingIndicator}>
              <MaterialIcons
                name="camera-alt"
                size={48}
                color={isProcessingImage ? colors.accent.orange : colors.textPrimary}
              />
              <Text style={[styles.recordingText, { color: colors.textPrimary }]}>
                {isProcessingImage ? 'Processing Image...' : 'Scan Text from Image'}
              </Text>
            </View>

            <View style={styles.recordingActions}>
              <TouchableOpacity
                style={[styles.recordingButton, styles.cancelButton, { backgroundColor: colors.textSecondary }]}
                onPress={() => setShowCameraModal(false)}
                disabled={isProcessingImage}>
                <MaterialIcons name="close" size={16} color={colors.cardBackground} />
                <Text style={[styles.buttonText, { color: colors.cardBackground }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.recordingButton, styles.confirmButton, { backgroundColor: colors.accent.green }]}
                onPress={takePhotoAndProcess}
                disabled={isProcessingImage}>
                <MaterialIcons name="camera-alt" size={16} color={colors.cardBackground} />
                <Text style={[styles.buttonText, { color: colors.cardBackground }]}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.recordingButton, { backgroundColor: colors.accent.purple }]}
                onPress={pickImageAndProcess}
                disabled={isProcessingImage}>
                <MaterialIcons name="photo" size={16} color={colors.cardBackground} />
                <Text style={[styles.buttonText, { color: colors.cardBackground }]}>Choose Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Color Picker Modal */}
      {showColorPicker && (
        <View style={styles.modalOverlay}>
          <View style={[styles.colorModal, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Choose Background Color</Text>
            <View style={styles.colorGrid}>
              {NOTE_BACKGROUND_COLORS.map((colorOption) => (
                <TouchableOpacity
                  key={colorOption.id}
                  style={[
                    styles.colorOption,
                    { backgroundColor: colorOption.color || colors.cardBackground },
                    note.backgroundColor === colorOption.color && styles.selectedColorOption,
                    !colorOption.color && { borderWidth: 2, borderColor: colors.textSecondary },
                  ]}
                  onPress={() => handleBackgroundColorChange(colorOption)}>
                  <Text style={[styles.colorOptionText, { color: colorOption.color ? '#333' : colors.textPrimary }]}>
                    {colorOption.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowColorPicker(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Recording Modal */}
      {showRecordingModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.recordingModal, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.recordingIndicator}>
              <MaterialIcons
                name="mic"
                size={48}
                color={isRecording ? colors.accent.red : colors.textSecondary}
              />
              <Text style={[styles.recordingText, { color: colors.textPrimary }]}>
                {isRecording ? 'Recording...' : 'Transcribing...'}
              </Text>
            </View>

            <View style={styles.recordingActions}>
              <TouchableOpacity
                style={[styles.recordingButton, styles.cancelButton, { backgroundColor: colors.textSecondary }]}
                onPress={cancelRecording}>
                <MaterialIcons name="close" size={24} color={colors.cardBackground} />
                <Text style={[styles.buttonText, { color: colors.cardBackground }]}>Cancel</Text>
              </TouchableOpacity>

              {isRecording && (
                <TouchableOpacity
                  style={[styles.recordingButton, styles.confirmButton, { backgroundColor: colors.accent.green }]}
                  onPress={stopRecording}>
                  <MaterialIcons name="check" size={24} color={colors.cardBackground} />
                  <Text style={[styles.buttonText, { color: colors.cardBackground }]}>Stop & Transcribe</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Share Menu */}
      <ShareMenu
        visible={showShareMenu}
        note={note}
        onClose={() => setShowShareMenu(false)}
        onShareAsText={handleShareAsText}
        onShareAsImage={handleShareAsImage}
        onExportAsMarkdown={handleExportAsMarkdown}
        onShareWithSomeone={handleShareWithSomeone}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        visible={showImagePreview}
        note={note}
        templateSVG={''}
        onClose={() => setShowImagePreview(false)}
      />

      {/* Hidden ShareableNoteImage for capturing */}
      {note && (
        <ShareableNoteImage
          ref={shareableImageRef}
          note={note}
          width={768}
          // height is intentionally omitted to allow dynamic height
        />
      )}

      {/* Image Picker Modal */}
      <ImagePickerModal
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onImageSelected={handleImageSelected}
      />

      {/* Drawing Canvas Modal */}
      <DrawingCanvas
        visible={showDrawingCanvas}
        onClose={() => setShowDrawingCanvas(false)}
        onSaveDrawing={handleDrawingSaved}
      />

      {/* Audio Recorder Modal */}
      <AudioRecorder
        visible={showAudioRecorder}
        onClose={() => setShowAudioRecorder(false)}
        onSaveAudio={handleAudioSaved}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    height: LAYOUT.headerHeight,
  },
  backIconButton: {
    padding: SPACING.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  actionIcon: {
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dateInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
  date: {
    fontSize: TYPOGRAPHY.dateSize,
    opacity: 0.5,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reminderText: {
    fontSize: TYPOGRAPHY.dateSize - 1,
    fontWeight: '500',
  },
  characterCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  characterCount: {
    fontSize: TYPOGRAPHY.dateSize - 2,
    opacity: 0.7,
  },
  editHint: {
    fontSize: TYPOGRAPHY.dateSize - 1,
    opacity: 0.4,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 28, // Large title as shown in design
    fontWeight: 'bold',
    lineHeight: 34,
    marginBottom: SPACING.xl,
    padding: SPACING.xs, // Add padding for better touch area
    borderRadius: 8,
  },
  contentContainer: {
    paddingBottom: SPACING.xl * 2,
    padding: SPACING.xs, // Add padding for better touch area
    borderRadius: 8,
  },
  contentText: {
    fontSize: TYPOGRAPHY.bodySize + 2, // Slightly larger for reading
    lineHeight: TYPOGRAPHY.bodySize * 1.6,
    marginBottom: SPACING.md,
  },
  // Format text styles
  headerH1: {
    fontSize: TYPOGRAPHY.titleSize + 4, // 32px
    fontWeight: 'bold',
    lineHeight: TYPOGRAPHY.titleSize * 1.3,
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  headerH2: {
    fontSize: TYPOGRAPHY.titleSize, // 28px
    fontWeight: 'bold',
    lineHeight: TYPOGRAPHY.titleSize * 1.3,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  headerH3: {
    fontSize: TYPOGRAPHY.titleSize - 4, // 24px
    fontWeight: 'bold',
    lineHeight: TYPOGRAPHY.titleSize * 1.2,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  boldText: {
    fontWeight: 'bold',
  },
  highlightText: {
    backgroundColor: '#FFFF00', // Yellow background
    paddingHorizontal: 2,
    borderRadius: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: TYPOGRAPHY.titleSize,
    marginBottom: SPACING.lg,
  },
  backButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
    marginBottom: SPACING.xl,
    padding: SPACING.xs,
    minHeight: 6,
  },
  contentInput: {
    fontSize: TYPOGRAPHY.bodySize + 2,
    lineHeight: TYPOGRAPHY.bodySize * 1.6,
    paddingBottom: SPACING.sm,
    padding: SPACING.xs,
    minHeight: 200,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  colorModal: {
    borderRadius: 16,
    padding: SPACING.xl,
    margin: SPACING.lg,
    maxWidth: 300,
    width: '80%',
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },

  cancelButton: {
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  checkboxDisplay: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
  },
  checklistTextContainer: {
    flex: 1,
  },
  checklistText: {
    fontSize: TYPOGRAPHY.bodySize + 2,
    lineHeight: TYPOGRAPHY.bodySize * 1.6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.bodySize,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  checklistContainer: {
    marginBottom: SPACING.xl,
  },
  checklistEditItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  checkbox: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
  },
  checklistInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.bodySize,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    marginRight: SPACING.sm,
  },
  completedChecklistInput: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteItemButton: {
    padding: SPACING.xs,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    marginTop: SPACING.sm,
  },
  addItemText: {
    marginLeft: SPACING.xs,
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '500',
  },
  recordingModal: {
    borderRadius: 16,
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
    alignItems: 'center',
    maxWidth: '90%',
    width: '100%',
  },
  recordingIndicator: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  recordingText: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: '600',
    marginTop: SPACING.md,
  },
  recordingActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  recordingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    gap: 4,
    flex: 1,
    minWidth: 90,
    maxWidth: 140,
  },
  confirmButton: {
  },
  buttonText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  textSection: {
    marginBottom: SPACING.lg,
  },
  checklistSection: {
    marginTop: 0,
  },
  checklistWithText: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 0, // Will be set dynamically
  },
  textPlaceholder: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  placeholderText: {
    fontSize: TYPOGRAPHY.bodySize,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  colorOption: {
    width: 80,
    height: 60,
    borderRadius: 8,
    margin: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#4A90E2',
  },
  colorOptionText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  imagesSection: {
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  imageContainer: {
    marginBottom: 12,
  },
  noteImage: {
    width: '100%',
    height: 320,
    borderRadius: 8,
  },
  contentEditContainer: {
    flex: 1,
    gap: 12,
  },
  imagesPreviewSection: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  imagesLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  imagesHorizontalScroll: {
    marginBottom: 8,
  },
  imagePreviewContainer: {
    marginRight: 8,
    borderRadius: 6,
    overflow: 'hidden',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  continueTypingHint: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  contentEditScroll: {
    flex: 1,
  },
  imagesContentSection: {
    marginTop: 16,
  },
  imageInContentWrapper: {
    marginBottom: 8,
  },
  writeAfterImageArea: {
    padding: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    borderStyle: 'dashed',
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  writeAfterImageHint: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  textAfterImage: {
    minHeight: 60,
    padding: 12,
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 8,
    borderStyle: 'dashed',
  },
  imageWithTextWrapper: {
    marginBottom: 12,
  },
  textAfterImageView: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  blockTextInput: {
    minHeight: 50,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  imageBlockWrapper: {
    marginBottom: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
