import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
  const [noteToMove, setNoteToMove] = useState<Note | null>(null);
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [showMoveFolderModal, setShowMoveFolderModal] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const { loadNotes, setCurrentCategory, setCurrentFolder, togglePinNote, archiveNote, deleteNote, moveNoteToFolder, setNoteReminder } = useNotesStore();
  const { colors, isDarkMode } = useThemeStore();
  const filteredNotes = useFilteredNotes();

  // Setup notification handlers
  useNotificationHandlers({ onNotePress });

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
    setSelectedNote(note);
    setShowBottomMenu(true);
  };

  const handleCloseBottomMenu = () => {
    setShowBottomMenu(false);
    setSelectedNote(null);
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
    setShowReminderPicker(true);
  };

  const handleReminderConfirm = async (reminderDate: Date | null) => {
    if (selectedNote) {
      // Cancel existing notification if any
      if (selectedNote.notificationId) {
        await NotificationService.cancelNotification(selectedNote.notificationId);
      }

      // Schedule new notification if date is provided
      let newNotificationId: string | undefined;
      if (reminderDate) {
        const notificationId = await NotificationService.scheduleNoteReminder(selectedNote, reminderDate);
        if (notificationId) {
          newNotificationId = notificationId;
        }
      }

      // Update note with new reminder and notification ID
      setNoteReminder(selectedNote.id, reminderDate);
      if (newNotificationId) {
        // We need to update the notification ID separately since setNoteReminder resets it
        const { updateNote } = useNotesStore.getState();
        updateNote(selectedNote.id, { notificationId: newNotificationId });
      }
    }
    setShowBottomMenu(false);
    setSelectedNote(null);
  };

  const handleReminderClose = () => {
    setShowReminderPicker(false);
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
