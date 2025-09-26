import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { TabBar } from './TabBar';
import { NotesGrid } from '../notes/NotesGrid';
import { FloatingActionButton } from '../ui/FloatingActionButton';
import BottomMenu from '../ui/BottomMenu';
import MoveFolderModal from '../ui/MoveFolderModal';
import ReminderPicker from '../ui/ReminderPicker';
import { useNotesStore, useFilteredNotes } from '../../store/notes/useNotesStore';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { NotificationService } from '../../utils/notifications';
import { useNotificationHandlers } from '../../utils/useNotificationHandlers';
import { Note } from '../../types';

interface MainScreenProps {
  onNotePress: (note: Note) => void;
  onNewNotePress: () => void;
  onVoiceNotePress: () => void;
  onSearchPress?: () => void;
  onMenuPress?: () => void;
  onFoldersPress?: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({
  onNotePress,
  onNewNotePress,
  onVoiceNotePress,
  onSearchPress,
  onMenuPress,
  onFoldersPress,
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [pressedNoteId, setPressedNoteId] = useState<string | null>(null);
  const [noteToMove, setNoteToMove] = useState<Note | null>(null);
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [showMoveFolderModal, setShowMoveFolderModal] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const { loadNotes, setCurrentCategory, setCurrentFolder, togglePinNote, archiveNote, deleteNote, moveNoteToFolder, setNoteReminder } = useNotesStore();
  const { colors, isDarkMode } = useThemeStore();
  const filteredNotes = useFilteredNotes();

  // Setup notification handlers
  useNotificationHandlers({ 
    onNotePress: (note: Note) => {
      console.log('🔔 NOTIFICATION DEBUG - onNotePress received in MainScreen:', note.title);
      // Add a small delay to ensure navigation is ready
      setTimeout(() => {
        onNotePress(note);
      }, 200);
    }
  });

  useEffect(() => {
    loadNotes();
    // Set default folder to "all"
    setCurrentFolder('all');

    // Initialize notifications
    NotificationService.initializeNotifications();
  }, [loadNotes, setCurrentFolder]);

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    // Filter by folder
    setCurrentFolder(tabId);
    // Clear category filter when switching folders
    setCurrentCategory(null);
  };

  const handleNoteEdit = (note: Note) => {
    onNotePress(note); // For now, edit and view are the same action
  };

  const handleNoteLongPress = (note: Note) => {
    console.log('👆 LONG PRESS DEBUG - Note selected:', note.title, note.id);
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setSelectedNote(note);
    setPressedNoteId(note.id);
    setShowBottomMenu(true);
    console.log('👆 LONG PRESS DEBUG - State updated, showBottomMenu:', true);
  };

  const handleCloseBottomMenu = () => {
    setShowBottomMenu(false);
    setSelectedNote(null);
    setPressedNoteId(null);
  };

  const handlePin = () => {
    if (selectedNote) {
      togglePinNote(selectedNote.id);
    }
  };

  const handleMoveTo = () => {
    setNoteToMove(selectedNote);
    setShowMoveFolderModal(true);
  };

  const handleSelectFolder = (folderId: string) => {
    if (noteToMove) {
      moveNoteToFolder(noteToMove.id, folderId);
      setShowBottomMenu(false);
      setShowMoveFolderModal(false);
      setSelectedNote(null);
      setNoteToMove(null);
    }
  };

  const handleCloseMoveModal = () => {
    setShowMoveFolderModal(false);
    setNoteToMove(null);
  };

  const handleHide = () => {
    if (selectedNote) {
      archiveNote(selectedNote.id);
    }
  };

  const handleReminder = () => {
    console.log('⏰ REMINDER DEBUG - handleReminder called, selectedNote:', selectedNote?.title, selectedNote?.id);
    setShowReminderPicker(true);
  };

  const handleReminderConfirm = async (reminderDate: Date | null) => {
    console.log('🔔 REMINDER DEBUG - handleReminderConfirm called with:', reminderDate);
    console.log('🔔 REMINDER DEBUG - selectedNote:', selectedNote?.title, selectedNote?.id);
    
    if (selectedNote) {
      // Cancel existing notification if any
      if (selectedNote.notificationId) {
        await NotificationService.cancelNotification(selectedNote.notificationId);
      }

      // Schedule new notification if date is provided
      let newNotificationId: string | undefined;
      if (reminderDate) {
        console.log('🔔 REMINDER DEBUG - Scheduling notification for:', reminderDate);
        const notificationId = await NotificationService.scheduleNoteReminder(selectedNote, reminderDate);
        console.log('🔔 REMINDER DEBUG - Notification ID returned:', notificationId);
        if (notificationId) {
          newNotificationId = notificationId;
        }
      }

      // Update note with new reminder and notification ID
      console.log('🔔 REMINDER DEBUG - Calling setNoteReminder with:', {
        noteId: selectedNote.id,
        reminderDate: reminderDate || undefined,
        notificationId: newNotificationId
      });
      setNoteReminder(selectedNote.id, reminderDate || undefined, newNotificationId);
      console.log('🔔 REMINDER DEBUG - setNoteReminder completed');
    }
    // Cerrar tanto el ReminderPicker como el BottomMenu
    setShowReminderPicker(false);
    setShowBottomMenu(false);
    setSelectedNote(null);
  };

  const handleReminderClose = () => {
    // Cuando se cancela el ReminderPicker, también cerrar el BottomMenu
    setShowReminderPicker(false);
    setShowBottomMenu(false);
    setSelectedNote(null);
  };

  const handleDelete = () => {
    if (selectedNote) {
      deleteNote(selectedNote.id);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={colors.background}
        translucent={false}
      />

      <Header title="Notes" onSearchPress={onSearchPress} onMenuPress={onMenuPress} onFoldersPress={onFoldersPress} />

      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />

      <View style={styles.content}>
        <NotesGrid
          notes={filteredNotes}
          onNotePress={onNotePress}
          onNoteEdit={handleNoteEdit}
          onNoteLongPress={handleNoteLongPress}
          pressedNoteId={pressedNoteId}
        />

        <FloatingActionButton onNewNotePress={onNewNotePress} onVoiceNotePress={onVoiceNotePress} />
      </View>

      {/* Bottom Menu */}
      <BottomMenu
        visible={showBottomMenu}
        note={selectedNote}
        onClose={handleCloseBottomMenu}
        onPin={handlePin}
        onMoveTo={handleMoveTo}
        onHide={handleHide}
        onReminder={handleReminder}
        onDelete={handleDelete}
      />

      {/* Move Folder Modal */}
      <MoveFolderModal
        visible={showMoveFolderModal}
        onClose={handleCloseMoveModal}
        onSelectFolder={handleSelectFolder}
      />

      {/* Reminder Picker */}
      <ReminderPicker
        visible={showReminderPicker}
        currentDate={selectedNote?.reminderDate}
        onClose={handleReminderClose}
        onConfirm={handleReminderConfirm}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
});
