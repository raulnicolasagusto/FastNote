import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { TabBar } from './TabBar';
import { NotesGrid } from '../notes/NotesGrid';
import { FloatingActionButton } from '../ui/FloatingActionButton';
import { useNotesStore, useFilteredNotes } from '../../store/notes/useNotesStore';
import { Note } from '../../types';
import { COLORS } from '../../constants/theme';

interface MainScreenProps {
  onNotePress: (note: Note) => void;
  onNewNotePress: () => void;
  onVoiceNotePress: () => void;
  onSearchPress?: () => void;
  onMenuPress?: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({
  onNotePress,
  onNewNotePress,
  onVoiceNotePress,
  onSearchPress,
  onMenuPress,
}) => {
  const [activeTab, setActiveTab] = useState('notes');
  const { loadNotes, setCurrentCategory } = useNotesStore();
  const filteredNotes = useFilteredNotes();

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    // For now, we'll show all notes regardless of tab
    // In a full implementation, you'd filter by category
    setCurrentCategory(null);
  };

  const handleNoteEdit = (note: Note) => {
    onNotePress(note); // For now, edit and view are the same action
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.background}
        translucent={false}
      />

      <Header title="Notes" onSearchPress={onSearchPress} onMenuPress={onMenuPress} />

      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />

      <View style={styles.content}>
        <NotesGrid notes={filteredNotes} onNotePress={onNotePress} onNoteEdit={handleNoteEdit} />

        <FloatingActionButton onNewNotePress={onNewNotePress} onVoiceNotePress={onVoiceNotePress} />
      </View>

      {/* Add bottom safe area for Android navigation */}
      <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  bottomSafeArea: {
    backgroundColor: COLORS.background,
  },
});
