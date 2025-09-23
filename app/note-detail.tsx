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
import { useNotesStore } from '../store/notes/useNotesStore';
import { Note, ChecklistItem } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT, DEFAULT_CATEGORIES } from '../constants/theme';
import { StorageService } from '../utils/storage';

export default function NoteDetail() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { notes, updateNote, togglePinNote, toggleLockNote } = useNotesStore();
  const [note, setNote] = useState<Note | null>(null);
  const [editingElement, setEditingElement] = useState<'title' | 'content' | 'checklist' | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [editedChecklistItems, setEditedChecklistItems] = useState<ChecklistItem[]>([]);
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

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

    const updates: Partial<Note> = {
      title: editedTitle.trim(),
      content: editedContent.trim(),
      checklistItems: editedChecklistItems,
      type: editedChecklistItems.length > 0 ? 'checklist' : 'text',
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
      'lista de',
      'lista del',
      'lista para',
      'lista de compras',
      'lista de supermercado',
      'shopping list',
      'to do list',
      'lista de tareas',
      'checklist',
      'check list'
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
      'lista del',
      'lista para',
      'lista de',
      'checklist',
      'check list'
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

        // Update the note to be a checklist
        const updates: Partial<Note> = {
          type: 'checklist',
          checklistItems: combinedItems,
        };

        updateNote(note.id, updates);
        setEditedChecklistItems(combinedItems);

        // Switch to checklist editing mode
        setEditingElement('checklist');
        return;
      }
    }

    // If not a list, insert as regular text (existing behavior)
    const updatedContent = editedContent ? `${editedContent}\n\n${transcribedText}` : transcribedText;
    setEditedContent(updatedContent);

    // Auto-save the transcribed text
    const updates: Partial<Note> = {
      content: updatedContent.trim(),
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

    // If note has checklist items, render them
    if (note.checklistItems && note.checklistItems.length > 0) {
      return (
        <View>
          {note.checklistItems.map((item) => (
            <View key={item.id} style={styles.checklistItem}>
              <TouchableOpacity
                style={styles.checkboxDisplay}
                onPress={() => toggleCheckboxCompleted(item.id)}
                activeOpacity={0.7}>
                <MaterialIcons
                  name={item.completed ? "check-box" : "check-box-outline-blank"}
                  size={20}
                  color={item.completed ? COLORS.accent.green : COLORS.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checklistTextContainer}
                onPress={handleStartChecklistEdit}
                activeOpacity={1}>
                <Text style={[styles.checklistText, item.completed && styles.completedText]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      );
    }

    // If note has text content, render it
    if (note.content && note.content.trim()) {
      const paragraphs = note.content.split('\n').filter((p) => p.trim());
      return paragraphs.map((paragraph, index) => (
        <Text key={index} style={styles.contentText}>
          {paragraph}
        </Text>
      ));
    }

    // Empty state
    return (
      <Text style={styles.emptyText}>
        Start writing or add a checklist...
      </Text>
    );
  };

  if (!note) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar
          style="dark"
          backgroundColor={COLORS.background}
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialIcons
            name={editingElement ? "close" : "arrow-back"}
            size={24}
            color={COLORS.textPrimary}
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
              color={note.isPinned ? COLORS.accent.orange : COLORS.textPrimary}
            />
          </TouchableOpacity>

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
                color={COLORS.textPrimary}
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
              color={note.isLocked ? COLORS.accent.red : COLORS.textPrimary}
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
                color={note.checklistItems && note.checklistItems.length > 0 ? COLORS.accent.blue : COLORS.textSecondary}
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
                color={COLORS.accent.green}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date and edit hint */}
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
          {!editingElement && !note.isLocked && (
            <Text style={styles.editHint}>Tap to edit</Text>
          )}
        </View>

        {/* Title */}
        {editingElement === 'title' ? (
          <TextInput
            style={styles.titleInput}
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Note title..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            maxLength={100}
            autoFocus
          />
        ) : (
          <TouchableOpacity
            onPress={handleStartTitleEdit}
            activeOpacity={1}>
            <Text style={styles.title}>
              {note.title}
            </Text>
          </TouchableOpacity>
        )}

        {/* Content */}
        {editingElement === 'content' ? (
          <TextInput
            style={styles.contentInput}
            value={editedContent}
            onChangeText={setEditedContent}
            placeholder="Start writing..."
            placeholderTextColor={COLORS.textSecondary}
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
                    color={item.completed ? COLORS.accent.green : COLORS.textSecondary}
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
                  placeholderTextColor={COLORS.textSecondary}
                  onSubmitEditing={() => handleChecklistItemSubmit(item.id)}
                  returnKeyType="next"
                  autoFocus={index === editedChecklistItems.length - 1 && !item.text}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  style={styles.deleteItemButton}
                  onPress={() => removeChecklistItem(item.id)}>
                  <MaterialIcons name="close" size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={() => addChecklistItem()}>
              <MaterialIcons name="add" size={20} color={COLORS.accent.blue} />
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
          <View style={styles.categoryModal}>
            <Text style={styles.modalTitle}>Choose Category</Text>
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

      {/* Recording Modal */}
      {showRecordingModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.recordingModal}>
            <View style={styles.recordingIndicator}>
              <MaterialIcons
                name="mic"
                size={48}
                color={isRecording ? COLORS.accent.red : COLORS.textSecondary}
              />
              <Text style={styles.recordingText}>
                {isRecording ? 'Recording...' : 'Transcribing...'}
              </Text>
            </View>

            <View style={styles.recordingActions}>
              <TouchableOpacity
                style={[styles.recordingButton, styles.cancelButton]}
                onPress={cancelRecording}>
                <MaterialIcons name="close" size={24} color={COLORS.cardBackground} />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              {isRecording && (
                <TouchableOpacity
                  style={[styles.recordingButton, styles.confirmButton]}
                  onPress={stopRecording}>
                  <MaterialIcons name="check" size={24} color={COLORS.cardBackground} />
                  <Text style={styles.buttonText}>Stop & Transcribe</Text>
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
    backgroundColor: COLORS.background,
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
    color: COLORS.textSecondary,
    opacity: 0.5,
  },
  editHint: {
    fontSize: TYPOGRAPHY.dateSize - 1,
    color: COLORS.textSecondary,
    opacity: 0.4,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 28, // Large title as shown in design
    fontWeight: 'bold',
    color: COLORS.textPrimary,
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
    color: COLORS.textPrimary,
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
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  backButton: {
    backgroundColor: COLORS.accent.blue,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.cardBackground,
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    lineHeight: 34,
    marginBottom: SPACING.xl,
    padding: SPACING.xs,
    minHeight: 60,
  },
  contentInput: {
    fontSize: TYPOGRAPHY.bodySize + 2,
    color: COLORS.textPrimary,
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
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: SPACING.xl,
    margin: SPACING.lg,
    maxWidth: 300,
    width: '80%',
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
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
    borderColor: COLORS.textPrimary,
  },
  categoryOptionText: {
    color: COLORS.cardBackground,
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: COLORS.textSecondary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.cardBackground,
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
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.bodySize * 1.6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.bodySize,
    color: COLORS.textSecondary,
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
    color: COLORS.textPrimary,
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
    borderColor: COLORS.accent.blue,
    borderRadius: 8,
    borderStyle: 'dashed',
    marginTop: SPACING.sm,
  },
  addItemText: {
    marginLeft: SPACING.xs,
    fontSize: TYPOGRAPHY.bodySize,
    color: COLORS.accent.blue,
    fontWeight: '500',
  },
  recordingModal: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: SPACING.xl,
    margin: SPACING.lg,
    alignItems: 'center',
    minWidth: 280,
  },
  recordingIndicator: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  recordingText: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  recordingActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  recordingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  confirmButton: {
    backgroundColor: COLORS.accent.green,
  },
  buttonText: {
    color: COLORS.cardBackground,
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
});