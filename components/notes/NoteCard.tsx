import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Note } from '../../types';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../../constants/theme';
import { useThemeStore } from '../../store/theme/useThemeStore';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onEdit?: () => void;
  onLongPress?: () => void;
  isPressed?: boolean;
  isSelected?: boolean; // Multi-select mode
  isMultiSelectMode?: boolean; // Show empty circle indicator
}

export const NoteCard: React.FC<NoteCardProps> = React.memo(({ note, onPress, onEdit, onLongPress, isPressed, isSelected, isMultiSelectMode }) => {
  const { colors } = useThemeStore();
  
  // Helper function to get text colors for notes with custom backgrounds
  const getTextColors = () => {
    if (note.backgroundColor) {
      // If note has custom background, use dark text colors for readability
      return {
        primary: '#1a1a1a',    // Dark gray for primary text
        secondary: '#666666',  // Medium gray for secondary text
      };
    }
    // Otherwise use theme colors
    return {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    };
  };

  const textColors = getTextColors();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Helper function to clean HTML from content for preview
  const cleanHtmlContent = (content: string) => {
    if (!content) return '';
    
    // Process HTML content to preserve structure while removing tags
    let cleanContent = content
      // Replace block elements with line breaks
      .replace(/<\/?(h[1-6]|p|div)[^>]*>/g, '\n')
      .replace(/<br\s*\/?>/g, '\n') // Replace <br> tags with line breaks
      .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&')  // Replace encoded ampersands
      .replace(/&lt;/g, '<')   // Replace encoded less than
      .replace(/&gt;/g, '>')   // Replace encoded greater than
      .replace(/\n\s*\n/g, '\n') // Remove multiple consecutive line breaks
      .replace(/^\s+|\s+$/g, '') // Trim whitespace from start and end
      .replace(/\n\s+/g, '\n'); // Remove leading spaces from lines
    
    return cleanContent;
  };

  // Helper to detect if URI is audio
  const isAudioUri = (uri: string): boolean => {
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];
    return audioExtensions.some(ext => uri.toLowerCase().includes(ext));
  };

  // Helper to check if note has images or drawings (excluding audio)
  const hasImages = () => {
    // Check legacy images array
    if (note.images && note.images.length > 0) {
      const hasNonAudioImages = note.images.some(uri => !isAudioUri(uri));
      if (hasNonAudioImages) return true;
    }
    // Check contentBlocks
    if (note.contentBlocks && note.contentBlocks.some(block => block.type === 'image' && block.uri && !isAudioUri(block.uri))) {
      return true;
    }
    return false;
  };

  // Helper to check if note has audio files
  const hasAudio = () => {
    // Check legacy images array for audio files
    if (note.images && note.images.length > 0) {
      const hasAudioFiles = note.images.some(uri => isAudioUri(uri));
      if (hasAudioFiles) return true;
    }
    // Check contentBlocks for audio
    if (note.contentBlocks && note.contentBlocks.some(block => block.type === 'image' && block.uri && isAudioUri(block.uri))) {
      return true;
    }
    return false;
  };

  // Helper to get first 1-2 images/drawings (excluding audio) for thumbnail preview
  const getThumbnailImages = (): string[] => {
    const thumbnails: string[] = [];

    // Check contentBlocks first (NEW system)
    if (note.contentBlocks) {
      for (const block of note.contentBlocks) {
        if (block.type === 'image' && block.uri && !isAudioUri(block.uri)) {
          thumbnails.push(block.uri);
          if (thumbnails.length === 2) break; // Max 2 thumbnails
        }
      }
    }

    // If no thumbnails yet, check legacy images array
    if (thumbnails.length === 0 && note.images && note.images.length > 0) {
      for (const uri of note.images) {
        if (!isAudioUri(uri)) {
          thumbnails.push(uri);
          if (thumbnails.length === 2) break; // Max 2 thumbnails
        }
      }
    }

    return thumbnails;
  };

  const renderContent = () => {
    const thumbnails = getThumbnailImages();
    const hasThumbnails = thumbnails.length > 0;

    return (
      <>
        {/* Thumbnail images preview (1 or 2 max) */}
        {hasThumbnails && (
          <View style={styles.thumbnailContainer}>
            {thumbnails.map((uri, index) => (
              <Image
                key={`thumb-${index}`}
                source={{ uri }}
                style={[
                  styles.thumbnail,
                  thumbnails.length === 1 && styles.thumbnailSingle,
                  thumbnails.length === 2 && styles.thumbnailDouble
                ]}
                resizeMode="cover"
              />
            ))}
          </View>
        )}

        {/* Text/Checklist preview below thumbnails */}
        {note.type === 'checklist' && note.checklistItems && note.checklistItems.length > 0 ? (
          <View style={styles.previewContent}>
            {note.checklistItems.slice(0, 2).map((item, index) => (
              <View key={item.id} style={styles.checklistItem}>
                <Text style={[styles.bullet, { color: textColors.secondary }]}>•</Text>
                <Text style={[styles.checklistText, { color: textColors.secondary }]} numberOfLines={1}>
                  {item.text}
                </Text>
              </View>
            ))}
            {note.checklistItems.length > 2 && (
              <Text style={[styles.ellipsis, { color: textColors.secondary }]}>...</Text>
            )}
          </View>
        ) : note.content.trim() ? (
          <View style={styles.previewContent}>
            <Text style={[styles.contentText, { color: textColors.secondary }]} numberOfLines={2}>
              {cleanHtmlContent(note.content)}
            </Text>
            <Text style={[styles.ellipsis, { color: textColors.secondary }]}>...</Text>
          </View>
        ) : null}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: note.backgroundColor || colors.cardBackground },
        isPressed && styles.pressedCard,
        isPressed && { backgroundColor: (note.backgroundColor || colors.cardBackground) + 'E0' }
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {/* Multi-select circle indicator */}
          {isMultiSelectMode && (
            <View style={[
              styles.selectCircle,
              { borderColor: colors.accent.blue },
              isSelected && { backgroundColor: colors.accent.blue }
            ]}>
              {isSelected && (
                <MaterialIcons name="check" size={14} color="#FFFFFF" />
              )}
            </View>
          )}

          <Text style={[styles.title, { color: textColors.primary }]} numberOfLines={2}>
            {note.title}
          </Text>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <MaterialIcons name="edit" size={16} color={textColors.secondary} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.date, { color: textColors.secondary }]}>{formatDate(note.createdAt)}</Text>
      </View>

      <View style={styles.content}>{renderContent()}</View>

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
        <View style={styles.reminderIndicator}>
          <MaterialIcons name="schedule" size={16} color={colors.accent.blue} />
        </View>
      )}

      {/* Image/Drawing indicator */}
      {hasImages() && (
        <View style={[
          styles.imageIndicator,
          hasAudio() && { right: SPACING.xs + 28 } // Move left if audio indicator is present
        ]}>
          <MaterialIcons name="image" size={16} color={colors.accent.purple} />
        </View>
      )}

      {/* Audio indicator */}
      {hasAudio() && (
        <View style={styles.audioIndicator}>
          <MaterialIcons name="mic" size={16} color={colors.accent.orange} />
        </View>
      )}
    </TouchableOpacity>
  );
});

NoteCard.displayName = 'NoteCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    aspectRatio: 1 / 1.2, // Aspect ratio from design
    position: 'relative',
    ...SHADOWS.card,
  },
  pressedCard: {
    transform: [{ scale: 0.95 }],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
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
  selectCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
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
  thumbnailContainer: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    borderRadius: BORDER_RADIUS.small || 8,
    backgroundColor: '#f0f0f0',
  },
  thumbnailSingle: {
    width: '100%',
    height: 100,
  },
  thumbnailDouble: {
    width: '48%',
    height: 80,
  },
  previewContent: {
    flex: 1,
  },
  contentText: {
    fontSize: TYPOGRAPHY.bodySize,
    lineHeight: TYPOGRAPHY.bodySize * 1.4,
  },
  ellipsis: {
    fontSize: TYPOGRAPHY.bodySize,
    textAlign: 'center',
    marginTop: SPACING.xs / 2,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: SPACING.xs,
    right: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  audioIndicator: {
    position: 'absolute',
    bottom: SPACING.xs,
    right: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
});
