import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
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
import { SPACING, TYPOGRAPHY, LAYOUT, DEFAULT_CATEGORIES } from '../constants/theme';
import { StorageService } from '../utils/storage';
import Callout from '../components/ui/Callout';
import { useCalloutRotation } from '../utils/useCalloutRotation';

export default function NoteDetail() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { notes, updateNote, togglePinNote, toggleLockNote } = useNotesStore();
  const { colors, isDarkMode } = useThemeStore();
  const { currentCallout, isVisible } = useCalloutRotation();
  const [note, setNote] = useState<Note | null>(null);
  const [editingElement, setEditingElement] = useState<'title' | 'content' | 'checklist' | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [editedChecklistItems, setEditedChecklistItems] = useState<ChecklistItem[]>([]);
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  useEffect(() => {
    if (noteId) {
      const foundNote = notes.find((n) => n.id === noteId);
      setNote(foundNote || null);
      if (foundNote) {
        setEditedTitle(foundNote.title);
        setEditedContent(foundNote.content);
        setEditedChecklistItems(foundNote.checklistItems || []);
      }
    }
  }, [noteId, notes]);

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
  };

  const handleCancelEdit = () => {
    if (!note) return;

    setEditedTitle(note.title);
    setEditedContent(note.content);
    setEditedChecklistItems(note.checklistItems || []);
    setEditingElement(null);
  };

  const handleTogglePin = () => {
    if (!note) return;
    togglePinNote(note.id);
  };

  const handleToggleLock = () => {
    if (!note) return;
    toggleLockNote(note.id);
  };

  const handleCategoryChange = (category: any) => {
    if (!note) return;
    updateNote(note.id, { category });
    setShowCategoryPicker(false);
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
        insertTranscribedText(result.text);
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
          text: trimmedItem,
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
          insertTranscribedText(detectedText);
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
        allowsEditing: true,
        aspect: [4, 3],
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
        allowsEditing: true,
        aspect: [4, 3],
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

  const insertTranscribedText = (transcribedText: string) => {
    if (!note) return;

    // Check if the transcribed text indicates a list
    if (detectListKeywords(transcribedText)) {
      // Convert to checklist
      const newChecklistItems = parseTextToChecklistItems(transcribedText);

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
    const updatedContent = editedContent ? `${editedContent}\n\n${transcribedText}` : transcribedText;
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
  };


  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderContent = () => {
    if (!note) return null;

    const hasText = note.content && note.content.trim();
    const hasChecklist = note.checklistItems && note.checklistItems.length > 0;

    // If neither text nor checklist, show empty state
    if (!hasText && !hasChecklist) {
      return (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Start writing or add a checklist...
        </Text>
      );
    }

    return (
      <View>
        {/* Render text content first if it exists */}
        {hasText && (
          <TouchableOpacity
            style={styles.textSection}
            onPress={handleStartContentEdit}
            activeOpacity={1}>
            {note.content.split('\n').filter((p) => p.trim()).map((paragraph, index) => (
              <Text key={index} style={[styles.contentText, { color: colors.textPrimary }]}>
                {paragraph}
              </Text>
            ))}
          </TouchableOpacity>
        )}

        {/* Text placeholder when no text but has checklist */}
        {!hasText && hasChecklist && (
          <TouchableOpacity
            style={styles.textPlaceholder}
            onPress={handleStartContentEdit}
            activeOpacity={1}>
            <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>Tap to add text...</Text>
          </TouchableOpacity>
        )}

        {/* Render checklist items if they exist */}
        {hasChecklist && (
          <View style={[styles.checklistSection, hasText && styles.checklistWithText, hasText && { borderTopWidth: 1, borderTopColor: colors.textSecondary + '33' }]}>
            {note.checklistItems!.map((item) => (
              <View key={item.id} style={styles.checklistItem}>
                <TouchableOpacity
                  style={styles.checkboxDisplay}
                  onPress={() => toggleCheckboxCompleted(item.id)}
                  activeOpacity={0.7}>
                  <MaterialIcons
                    name={item.completed ? "check-box" : "check-box-outline-blank"}
                    size={20}
                    color={item.completed ? colors.accent.green : colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.checklistTextContainer}
                  onPress={handleStartChecklistEdit}
                  activeOpacity={1}>
                  <Text style={[styles.checklistText, { color: colors.textPrimary }, item.completed && styles.completedText]}>
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
          {/* Category indicator - clickable to change */}
          <TouchableOpacity
            onPress={() => setShowCategoryPicker(true)}
            style={[
              styles.categoryIndicator,
              { backgroundColor: note.category.color },
            ]}
            disabled={note.isLocked && !editingElement}
          />

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

      {/* Callouts */}
      {currentCallout && (
        <Callout
          visible={isVisible}
          message={currentCallout.message}
          iconName={currentCallout.iconName}
          keywords={currentCallout.keywords}
        />
      )}

      {/* Content */}
      <ScrollView style={[styles.content, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Date and edit hint */}
        <View style={styles.dateContainer}>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(note.createdAt)}</Text>
          {!editingElement && !note.isLocked && (
            <Text style={[styles.editHint, { color: colors.textSecondary }]}>Tap to edit</Text>
          )}
        </View>

        {/* Title */}
        {editingElement === 'title' ? (
          <TextInput
            style={[styles.titleInput, { color: colors.textPrimary, backgroundColor: colors.cardBackground, borderColor: colors.textPrimary }]}
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Note title..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={100}
            autoFocus
          />
        ) : (
          <TouchableOpacity
            onPress={handleStartTitleEdit}
            activeOpacity={1}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {note.title}
            </Text>
          </TouchableOpacity>
        )}

        {/* Content */}
        {editingElement === 'content' ? (
          <TextInput
            style={[styles.contentInput, { color: colors.textPrimary, backgroundColor: colors.cardBackground, borderColor: colors.textSecondary }]}
            value={editedContent}
            onChangeText={setEditedContent}
            placeholder="Start writing..."
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
            autoFocus
          />
        ) : editingElement === 'checklist' ? (
          <View style={styles.checklistContainer}>
            {editedChecklistItems.map((item, index) => (
              <View key={item.id} style={styles.checklistEditItem}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => updateChecklistItem(item.id, { completed: !item.completed })}>
                  <MaterialIcons
                    name={item.completed ? "check-box" : "check-box-outline-blank"}
                    size={20}
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
                  onChangeText={(text) => updateChecklistItem(item.id, { text })}
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
      </ScrollView>

      {/* Category Picker Modal */}
      {showCategoryPicker && (
        <View style={styles.modalOverlay}>
          <View style={[styles.categoryModal, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Choose Category</Text>
            <View style={styles.categoryGrid}>
              {DEFAULT_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    { backgroundColor: category.color },
                    note.category.id === category.id && styles.selectedCategoryOption,
                  ]}
                  onPress={() => handleCategoryChange(category)}>
                  <Text style={styles.categoryOptionText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCategoryPicker(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
  categoryIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
  date: {
    fontSize: TYPOGRAPHY.dateSize,
    opacity: 0.5,
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
    minHeight: 60,
  },
  contentInput: {
    fontSize: TYPOGRAPHY.bodySize + 2,
    lineHeight: TYPOGRAPHY.bodySize * 1.6,
    paddingBottom: SPACING.xl * 2,
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
  categoryModal: {
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  categoryOption: {
    width: '45%',
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  selectedCategoryOption: {
    borderWidth: 3,
  },
  categoryOptionText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
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
    alignItems: 'flex-start',
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
});