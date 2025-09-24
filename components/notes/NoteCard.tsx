import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Note } from '../../types';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../../constants/theme';
import { useThemeStore } from '../../store/theme/useThemeStore';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onEdit?: () => void;
  onLongPress?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPress, onEdit, onLongPress }) => {
  const { colors } = useThemeStore();
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderContent = () => {
    if (note.type === 'checklist' && note.checklistItems) {
      // Show first 3 checklist items
      return note.checklistItems.slice(0, 3).map((item, index) => (
        <View key={item.id} style={styles.checklistItem}>
          <Text style={[styles.bullet, { color: colors.textSecondary }]}>•</Text>
          <Text style={[styles.checklistText, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.text}
          </Text>
        </View>
      ));
    }

    // Show text content preview
    if (note.content.trim()) {
      return (
        <Text style={[styles.contentText, { color: colors.textSecondary }]} numberOfLines={3}>
          {note.content}
        </Text>
      );
    }

    return null;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBackground }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
            {note.title}
          </Text>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <MaterialIcons name="edit" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(note.createdAt)}</Text>
      </View>

      <View style={styles.content}>{renderContent()}</View>

      {/* Category indicator dot */}
      <View style={[styles.categoryDot, { backgroundColor: note.category.color }]} />

      {/* Pin indicator */}
      {note.isPinned && (
        <View style={styles.pinIndicator}>
          <MaterialIcons name="star" size={16} color={colors.accent.orange} />
        </View>
      )}

      {/* Lock indicator */}
      {note.isLocked && (
        <View style={styles.lockIndicator}>
          <MaterialIcons name="lock" size={14} color={colors.accent.red} />
        </View>
      )}

      {/* Reminder indicator */}
      {note.reminderDate && (
        <View style={[styles.reminderIndicator, { backgroundColor: colors.accent.blue + '15' }]}>
          <MaterialIcons name="schedule" size={14} color={colors.accent.blue} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    aspectRatio: 1 / 1.2, // Aspect ratio from design
    position: 'relative',
    ...SHADOWS.card,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: 'bold',
    flex: 1,
    marginRight: SPACING.xs,
  },
  editButton: {
    padding: SPACING.xs,
  },
  date: {
    fontSize: TYPOGRAPHY.dateSize,
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  contentText: {
    fontSize: TYPOGRAPHY.bodySize,
    lineHeight: TYPOGRAPHY.bodySize * 1.4,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs / 2,
  },
  bullet: {
    fontSize: TYPOGRAPHY.bodySize,
    marginRight: SPACING.xs,
    lineHeight: TYPOGRAPHY.bodySize * 1.4,
  },
  checklistText: {
    fontSize: TYPOGRAPHY.bodySize,
    flex: 1,
    lineHeight: TYPOGRAPHY.bodySize * 1.4,
  },
  categoryDot: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pinIndicator: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    borderRadius: 10,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  lockIndicator: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    borderRadius: 8,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderIndicator: {
    position: 'absolute',
    bottom: SPACING.xs,
    left: SPACING.xs,
    borderRadius: 8,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
