import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { MainScreen } from '../components/layout/MainScreen';
import { Note, ChecklistItem } from '../types';
import { useNotesStore } from '../store/notes/useNotesStore';
import { StorageService } from '../utils/storage';
import { COLORS, SPACING, TYPOGRAPHY, DEFAULT_CATEGORIES } from '../constants/theme';

export default function Home() {
  const { addNote } = useNotesStore();
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleNotePress = (note: Note) => {
    // Navigate to note detail/edit screen
    router.push({
      pathname: '/note-detail',
      params: { noteId: note.id },
    });
  };

  const handleNewNotePress = () => {
    // Navigate to new note screen
    router.push('/new-note');
  };

  const handleVoiceNotePress = async () => {
    setShowRecordingModal(true);
    await startRecording();
  };

  const handleSearchPress = () => {
    // Navigate to search screen
    router.push('/search');
  };

  const handleMenuPress = () => {
    // Navigate to settings/menu screen (route not implemented yet)
    // router.push('/settings');
  };

  // Recording functions (copied from note-detail.tsx)
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
        createVoiceNote(result.text);
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

  const generateVoiceNoteTitle = (): string => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1; // getMonth() returns 0-11
    const year = now.getFullYear().toString().slice(-2); // Get last 2 digits of year
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `Nota Rápida ${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const createVoiceNote = (transcribedText: string) => {
    const noteTitle = generateVoiceNoteTitle();

    // Check if the transcribed text indicates a list
    if (detectListKeywords(transcribedText)) {
      // Convert to checklist
      const checklistItems = parseTextToChecklistItems(transcribedText);

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
        };

        addNote(newNote);
        return;
      }
    }

    // Create regular text note
    const newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
      title: noteTitle,
      content: transcribedText,
      type: 'text',
      category: DEFAULT_CATEGORIES[0], // Default category
      checklistItems: [],
      images: [],
      isArchived: false,
      isPinned: false,
      isLocked: false,
    };

    addNote(newNote);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainScreen
        onNotePress={handleNotePress}
        onNewNotePress={handleNewNotePress}
        onVoiceNotePress={handleVoiceNotePress}
        onSearchPress={handleSearchPress}
        onMenuPress={handleMenuPress}
      />

      {/* Recording Modal */}
      {showRecordingModal && (
        <View style={styles.modalOverlay}>
          <StatusBar style="dark" backgroundColor="rgba(0, 0, 0, 0.5)" />
          <SafeAreaView style={styles.modalContainer}>
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
                    <Text style={styles.buttonText}>Stop & Create Note</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </SafeAreaView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  cancelButton: {
    backgroundColor: COLORS.textSecondary,
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
