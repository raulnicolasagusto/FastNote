import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { TabBar } from './TabBar';
import { NotesGrid } from '../notes/NotesGrid';
import { FloatingActionButton } from '../ui/FloatingActionButton';
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
  const { loadNotes, setCurrentCategory, setCurrentFolder } = useNotesStore();
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={colors.background}
        translucent={false}
      />

      <Header title="Notes" onSearchPress={onSearchPress} onMenuPress={onMenuPress} onFoldersPress={onFoldersPress} />

      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />

      <View style={styles.content}>
        <NotesGrid notes={filteredNotes} onNotePress={onNotePress} onNoteEdit={handleNoteEdit} />

        <FloatingActionButton onNewNotePress={onNewNotePress} onVoiceNotePress={onVoiceNotePress} />
      </View>

      {/* Add bottom safe area for Android navigation */}
      <SafeAreaView style={[styles.bottomSafeArea, { backgroundColor: colors.background }]} edges={['bottom']} />
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
  bottomSafeArea: {
  },
});
