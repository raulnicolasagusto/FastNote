import React from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { NoteCard } from './NoteCard';
import { Note } from '../../types';
import { SPACING, LAYOUT } from '../../constants/theme';

interface NotesGridProps {
  notes: Note[];
  onNotePress: (note: Note) => void;
  onNoteEdit?: (note: Note) => void;
  onNoteLongPress?: (note: Note) => void;
  pressedNoteId?: string | null;
}

export const NotesGrid: React.FC<NotesGridProps> = ({ notes, onNotePress, onNoteEdit, onNoteLongPress, pressedNoteId }) => {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - SPACING.md * 2 - LAYOUT.gridGutter) / LAYOUT.gridColumns;

  const renderNote = ({ item }: { item: Note }) => (
    <View style={[styles.cardContainer, { width: cardWidth }]}>
      <NoteCard
        note={item}
        onPress={() => onNotePress(item)}
        onEdit={onNoteEdit ? () => onNoteEdit(item) : undefined}
        onLongPress={onNoteLongPress ? () => onNoteLongPress(item) : undefined}
        isPressed={pressedNoteId === item.id}
      />
    </View>
  );

  return (
    <FlatList
      data={notes}
      renderItem={renderNote}
      keyExtractor={(item) => item.id}
      numColumns={LAYOUT.gridColumns}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      // Add padding bottom to account for FAB
      contentContainerStyle={[
        styles.container,
        { paddingBottom: LAYOUT.fabSize + LAYOUT.fabMargin * 2 },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    marginBottom: SPACING.sm,
  },
});
