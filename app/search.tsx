import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNotesStore } from '../store/notes/useNotesStore';
import { NotesGrid } from '../components/notes/NotesGrid';
import { Note } from '../types';
import { SPACING, TYPOGRAPHY, LAYOUT } from '../constants/theme';
import { useThemeStore } from '../store/theme/useThemeStore';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const { notes } = useNotesStore();
  const { colors, isDarkMode } = useThemeStore();

  // Helper function to format date for search
  const formatDateForSearch = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return {
      ddmm: `${day}/${month}`, // 22/09
      ddmmyyyy: `${day}/${month}/${year}`, // 22/09/2024
      mmdd: `${month}/${day}`, // 09/22 (US format)
      mmddyyyy: `${month}/${day}/${year}`, // 09/22/2024
      yyyymmdd: `${year}/${month}/${day}`, // 2024/09/22
      ddmmyy: `${day}/${month}/${year.slice(-2)}`, // 22/09/24
      mmddyy: `${month}/${day}/${year.slice(-2)}`, // 09/22/24
    };
  };

  // Real-time search filtering
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = notes.filter((note) => {
      // Don't show archived notes
      if (note.isArchived) return false;

      // Search in title
      if (note.title.toLowerCase().includes(query)) return true;

      // Search in content
      if (note.content.toLowerCase().includes(query)) return true;

      // Search in checklist items
      if (note.checklistItems) {
        const checklistMatch = note.checklistItems.some((item) =>
          item.text.toLowerCase().includes(query)
        );
        if (checklistMatch) return true;
      }

      // Search in dates
      const createdDateFormats = formatDateForSearch(note.createdAt);
      const updatedDateFormats = formatDateForSearch(note.updatedAt);

      const dateSearchTerms = [
        ...Object.values(createdDateFormats),
        ...Object.values(updatedDateFormats),
      ];

      const dateMatch = dateSearchTerms.some((dateStr) =>
        dateStr.toLowerCase().includes(query)
      );

      if (dateMatch) return true;

      return false;
    });

    // Sort by relevance (title matches first, then date matches, then content, then updated date)
    const sorted = filtered.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(query);
      const bTitleMatch = b.title.toLowerCase().includes(query);

      // Title matches have highest priority
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;

      // Check for date matches as second priority
      const aDateFormats = formatDateForSearch(a.createdAt);
      const bDateFormats = formatDateForSearch(b.createdAt);

      const aDateMatch = Object.values(aDateFormats).some((dateStr) =>
        dateStr.toLowerCase().includes(query)
      );
      const bDateMatch = Object.values(bDateFormats).some((dateStr) =>
        dateStr.toLowerCase().includes(query)
      );

      if (aDateMatch && !bDateMatch) return -1;
      if (!aDateMatch && bDateMatch) return 1;

      // If equal priority, sort by updated date (newest first)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    setFilteredNotes(sorted);
  }, [searchQuery, notes]);

  const handleBack = () => {
    router.back();
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleNotePress = (note: Note) => {
    router.push({
      pathname: '/note-detail',
      params: { noteId: note.id },
    });
  };

  const renderEmptyState = () => {
    if (searchQuery.trim() === '') {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="search" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Search Notes</Text>
          <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
            Search by title, content, checklist items, or dates (e.g., &quot;22/9&quot;, &quot;22/09/2024&quot;)
          </Text>
        </View>
      );
    }

    if (filteredNotes.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="search-off" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Results</Text>
          <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
            No notes found for &quot;{searchQuery}&quot;. Try a different search term.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar
        style="dark"
        backgroundColor={colors.background}
        translucent={false}
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Search Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}>
          <MaterialIcons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search notes..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="clear" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results or Empty State */}
      <View style={styles.content}>
        {filteredNotes.length > 0 && (
          <View style={[styles.resultsHeader, { borderBottomColor: colors.cardBackground }]}>
            <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
              {filteredNotes.length} result{filteredNotes.length !== 1 ? 's' : ''} found
            </Text>
          </View>
        )}

        {renderEmptyState()}

        {filteredNotes.length > 0 && (
          <NotesGrid
            notes={filteredNotes}
            onNotePress={handleNotePress}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    height: LAYOUT.headerHeight,
  },
  backButton: {
    padding: SPACING.xs,
    marginRight: SPACING.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.bodySize,
    paddingVertical: 0, // Remove default padding on Android
  },
  clearButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  resultsCount: {
    fontSize: TYPOGRAPHY.bodySize - 1,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: TYPOGRAPHY.bodySize,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.bodySize * 1.4,
  },
});