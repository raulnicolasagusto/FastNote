import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Modal, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Header } from './Header';
import { TabBar } from './TabBar';
import { NotesGrid } from '../notes/NotesGrid';
import { FloatingActionButton } from '../ui/FloatingActionButton';
import BottomMenu from '../ui/BottomMenu';
import MoveFolderModal from '../ui/MoveFolderModal';
import ReminderPicker from '../ui/ReminderPicker';
import { useNotesStore, useFilteredNotes } from '../../store/notes/useNotesStore';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { NotificationService } from '../../utils/notifications';
import { useNotificationHandlers } from '../../utils/useNotificationHandlers';
import { Note } from '../../types';
import { t } from '../../utils/i18n';

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
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]); // Multi-select array
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false); // Multi-select mode active
  const [noteToMove, setNoteToMove] = useState<Note | null>(null);
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [showMoveFolderModal, setShowMoveFolderModal] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const { loadNotes, setCurrentCategory, setCurrentFolder, togglePinNote, archiveNote, deleteNote, moveNoteToFolder, setNoteReminder } = useNotesStore();
  const { colors, isDarkMode } = useThemeStore();
  const filteredNotes = useFilteredNotes();

  // Setup notification handlers
  useNotificationHandlers({ 
    onNotePress: (note: Note) => {
      console.log('🔔 NOTIFICATION DEBUG - onNotePress received in MainScreen:', note.title);
      console.log('🔔 NOTIFICATION DEBUG - About to call onNotePress prop with note:', note.id);
      
      // Add a small delay to ensure navigation is ready
      setTimeout(() => {
        console.log('🔔 NOTIFICATION DEBUG - Executing onNotePress after delay');
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

    // Activate multi-select mode with first note
    setIsMultiSelectMode(true);
    setSelectedNotes([note]);
    setShowBottomMenu(true);
    console.log('👆 LONG PRESS DEBUG - Multi-select mode activated, 1 note selected');
  };

  const handleNoteSelect = (note: Note) => {
    console.log('✅ SELECT DEBUG - Note tapped in multi-select mode:', note.title);

    // Check if note is already selected
    const isAlreadySelected = selectedNotes.some(n => n.id === note.id);

    if (isAlreadySelected) {
      // Deselect note
      const newSelection = selectedNotes.filter(n => n.id !== note.id);
      setSelectedNotes(newSelection);

      // If no notes left, exit multi-select mode
      if (newSelection.length === 0) {
        setIsMultiSelectMode(false);
        setShowBottomMenu(false);
        console.log('✅ SELECT DEBUG - Last note deselected, exiting multi-select mode');
      } else {
        console.log(`✅ SELECT DEBUG - Note deselected, ${newSelection.length} notes remaining`);
      }
    } else {
      // Select note
      const newSelection = [...selectedNotes, note];
      setSelectedNotes(newSelection);
      console.log(`✅ SELECT DEBUG - Note selected, total: ${newSelection.length}`);
    }
  };

  const handleCloseBottomMenu = () => {
    setShowBottomMenu(false);
    setSelectedNotes([]);
    setIsMultiSelectMode(false);
    console.log('❌ CLOSE DEBUG - Multi-select mode deactivated');
  };

  const handlePin = () => {
    // Toggle pin for all selected notes
    selectedNotes.forEach(note => {
      togglePinNote(note.id);
    });
    console.log(`📌 PIN DEBUG - Toggled pin for ${selectedNotes.length} notes`);
  };

  const handleMoveTo = () => {
    // All selected notes will be moved to chosen folder
    console.log('📁 MOVE DEBUG - handleMoveTo called, selectedNotes:', selectedNotes.length);
    setShowMoveFolderModal(true);
  };

  const handleSelectFolder = (folderId: string) => {
    // Move all selected notes to the folder
    selectedNotes.forEach(note => {
      moveNoteToFolder(note.id, folderId);
    });
    console.log(`📁 MOVE DEBUG - Moved ${selectedNotes.length} notes to folder ${folderId}`);
    setShowBottomMenu(false);
    setShowMoveFolderModal(false);
    setSelectedNotes([]);
    setIsMultiSelectMode(false);
    setNoteToMove(null);
  };

  const handleCloseMoveModal = () => {
    setShowMoveFolderModal(false);
    setNoteToMove(null);
  };

  const handleHide = () => {
    // Archive all selected notes
    selectedNotes.forEach(note => {
      archiveNote(note.id);
    });
    console.log(`👁️ HIDE DEBUG - Archived ${selectedNotes.length} notes`);
  };

  const handleReminder = () => {
    // Only works with single note
    if (selectedNotes.length === 1) {
      console.log('⏰ REMINDER DEBUG - handleReminder called, selectedNote:', selectedNotes[0]?.title, selectedNotes[0]?.id);
      setShowReminderPicker(true);
    }
  };

  const handleReminderConfirm = async (reminderDate: Date | null) => {
    console.log('🔔 REMINDER DEBUG - handleReminderConfirm called with:', reminderDate);

    // Only works with single note
    if (selectedNotes.length === 1) {
      const selectedNote = selectedNotes[0];
      console.log('🔔 REMINDER DEBUG - selectedNote:', selectedNote?.title, selectedNote?.id);

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
    setSelectedNotes([]);
    setIsMultiSelectMode(false);
  };

  const handleReminderClose = () => {
    // Cuando se cancela el ReminderPicker, también cerrar el BottomMenu
    setShowReminderPicker(false);
    setShowBottomMenu(false);
    setSelectedNotes([]);
    setIsMultiSelectMode(false);
  };

  const handleDelete = () => {
    console.log('🗑️ DELETE DEBUG - handleDelete called, selectedNotes:', selectedNotes.length);
    if (selectedNotes.length > 0) {
      setShowDeleteConfirmModal(true);
    }
  };

  const confirmDelete = () => {
    // Delete all selected notes
    selectedNotes.forEach(note => {
      deleteNote(note.id);
    });
    console.log(`🗑️ DELETE DEBUG - Deleted ${selectedNotes.length} notes`);
    setShowDeleteConfirmModal(false);
    setShowBottomMenu(false);
    setSelectedNotes([]);
    setIsMultiSelectMode(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setNoteToDelete(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={colors.background}
        translucent={false}
      />

      <Header title={t('notes.title')} onSearchPress={onSearchPress} onMenuPress={onMenuPress} onFoldersPress={onFoldersPress} />

      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />

      <View style={styles.content}>
        <NotesGrid
          notes={filteredNotes}
          onNotePress={(note) => {
            console.log('🎯 MAINSCREEN DEBUG - onNotePress called for:', note.title);
            console.log('🎯 MAINSCREEN DEBUG - isMultiSelectMode:', isMultiSelectMode);
            if (isMultiSelectMode) {
              handleNoteSelect(note);
            } else {
              onNotePress(note);
            }
          }}
          onNoteEdit={handleNoteEdit}
          onNoteLongPress={handleNoteLongPress}
          selectedNoteIds={selectedNotes.map(n => n.id)}
          isMultiSelectMode={isMultiSelectMode}
        />

        <FloatingActionButton onNewNotePress={onNewNotePress} onVoiceNotePress={onVoiceNotePress} />
      </View>

      {/* Bottom Menu */}
      <BottomMenu
        visible={showBottomMenu}
        notes={selectedNotes}
        onClose={handleCloseBottomMenu}
        onPin={handlePin}
        onMoveTo={handleMoveTo}
        onHide={handleHide}
        onReminder={handleReminder}
        onDelete={handleDelete}
        isMultiSelectMode={isMultiSelectMode}
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
        currentDate={selectedNotes.length === 1 ? selectedNotes[0]?.reminderDate : undefined}
        onClose={handleReminderClose}
        onConfirm={handleReminderConfirm}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <Modal
          transparent
          visible={showDeleteConfirmModal}
          animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.deleteConfirmModal, { backgroundColor: colors.cardBackground }]}>
              <MaterialIcons
                name="warning"
                size={48}
                color={colors.accent.red}
                style={styles.warningIcon}
              />
              <Text style={[styles.deleteTitle, { color: colors.textPrimary }]}>
                {selectedNotes.length === 1
                  ? `¿Seguro que quieres eliminar la nota "${selectedNotes[0]?.title}"?`
                  : `¿Seguro que quieres eliminar ${selectedNotes.length} notas?`
                }
              </Text>
              <View style={styles.deleteActions}>
                <TouchableOpacity
                  style={[styles.deleteButton, styles.cancelButton, { backgroundColor: colors.textSecondary }]}
                  onPress={cancelDelete}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={[styles.buttonText, { color: colors.cardBackground }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.deleteButton, styles.confirmButton, { backgroundColor: colors.accent.red }]}
                  onPress={confirmDelete}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={[styles.buttonText, { color: colors.cardBackground }]}>
                    Eliminar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* AdMob Banner at bottom */}
      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
        />
      </View>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  deleteConfirmModal: {
    borderRadius: 16,
    padding: SPACING.xl,
    margin: SPACING.lg,
    alignItems: 'center',
    minWidth: 280,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  warningIcon: {
    marginBottom: SPACING.md,
  },
  deleteTitle: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  deleteMessage: {
    fontSize: TYPOGRAPHY.bodySize,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: TYPOGRAPHY.bodySize * 1.4,
  },
  deleteActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  deleteButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    // backgroundColor set dynamically
  },
  confirmButton: {
    // backgroundColor set dynamically
  },
  buttonText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
  bannerContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: SPACING.xs,
  },
});
