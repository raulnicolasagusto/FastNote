import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
  onSearchPress?: () => void;
  onMenuPress?: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({
  onNotePress,
  onNewNotePress,
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={COLORS.background} />

      <Header title="Notes" onSearchPress={onSearchPress} onMenuPress={onMenuPress} />

      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />

      <View style={styles.content}>
        <NotesGrid notes={filteredNotes} onNotePress={onNotePress} onNoteEdit={handleNoteEdit} />

        <FloatingActionButton onPress={onNewNotePress} />
      </View>
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
});
