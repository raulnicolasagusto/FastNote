import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { TabBar } from './TabBar';
import { NotesGrid } from '../notes/NotesGrid';
import { FloatingActionButton } from '../ui/FloatingActionButton';
import BottomMenu from '../ui/BottomMenu';
import { useNotesStore, useFilteredNotes } from '../../store/notes/useNotesStore';
import { useThemeStore } from '../../store/theme/useThemeStore';
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
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const { loadNotes, setCurrentCategory, setCurrentFolder, togglePinNote, archiveNote, deleteNote } = useNotesStore();
  const { colors, isDarkMode } = useThemeStore();
  const filteredNotes = useFilteredNotes();

  useEffect(() => {
    loadNotes();
    // Set default folder to "all"
    setCurrentFolder('all');
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
    // TODO: Implement move to folder functionality
    console.log('Move to folder:', selectedNote?.title);
  };

  const handleHide = () => {
    if (selectedNote) {
      archiveNote(selectedNote.id);
    }
  };

  const handleReminder = () => {
    // TODO: Implement reminder functionality
    console.log('Set reminder for:', selectedNote?.title);
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
