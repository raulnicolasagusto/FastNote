import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNotesStore } from '../store/notes/useNotesStore';
import { Note } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT } from '../constants/theme';

export default function NoteDetail() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { notes } = useNotesStore();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    if (noteId) {
      const foundNote = notes.find((n) => n.id === noteId);
      setNote(foundNote || null);
    }
  }, [noteId, notes]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    if (note) {
      router.push({
        pathname: '/edit-note',
        params: { noteId: note.id },
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderContent = () => {
    if (!note) return null;

    if (note.type === 'checklist' && note.checklistItems) {
      return note.checklistItems.map((item, index) => (
        <View key={item.id} style={styles.checklistItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.checklistText}>{item.text}</Text>
        </View>
      ));
    }

    // Split content into paragraphs
    const paragraphs = note.content.split('\n').filter((p) => p.trim());
    return paragraphs.map((paragraph, index) => (
      <Text key={index} style={styles.contentText}>
        {paragraph}
      </Text>
    ));
  };

  if (!note) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor={COLORS.background} />
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Note not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={COLORS.background} />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {/* Category indicator */}
          <View
            style={[
              styles.categoryIndicator,
              { backgroundColor: note.category.color },
            ]}
          />

          {/* Star icon */}
          <TouchableOpacity
            style={styles.actionIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name="star-border" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Lock icon */}
          <TouchableOpacity
            style={styles.actionIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name="lock-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* More actions */}
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={handleEdit}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name="more-vert" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date */}
        <Text style={styles.date}>{formatDate(note.createdAt)}</Text>

        {/* Title */}
        <Text style={styles.title}>{note.title}</Text>

        {/* Content */}
        <View style={styles.contentContainer}>{renderContent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    height: LAYOUT.headerHeight,
  },
  backIconButton: {
    padding: SPACING.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  categoryIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  actionIcon: {
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  date: {
    fontSize: TYPOGRAPHY.dateSize,
    color: COLORS.textSecondary,
    opacity: 0.5,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28, // Large title as shown in design
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    lineHeight: 34,
    marginBottom: SPACING.xl,
  },
  contentContainer: {
    paddingBottom: SPACING.xl * 2,
  },
  contentText: {
    fontSize: TYPOGRAPHY.bodySize + 2, // Slightly larger for reading
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.bodySize * 1.6,
    marginBottom: SPACING.md,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  bullet: {
    fontSize: TYPOGRAPHY.bodySize + 2,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
    lineHeight: TYPOGRAPHY.bodySize * 1.6,
  },
  checklistText: {
    fontSize: TYPOGRAPHY.bodySize + 2,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: TYPOGRAPHY.bodySize * 1.6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: TYPOGRAPHY.titleSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  backButton: {
    backgroundColor: COLORS.accent.blue,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.cardBackground,
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
});