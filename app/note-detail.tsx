import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNotesStore } from '../store/notes/useNotesStore';
import { Note } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT, DEFAULT_CATEGORIES } from '../constants/theme';

export default function NoteDetail() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { notes, updateNote, togglePinNote, toggleLockNote } = useNotesStore();
  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [pressedElement, setPressedElement] = useState<'title' | 'content' | null>(null);

  useEffect(() => {
    if (noteId) {
      const foundNote = notes.find((n) => n.id === noteId);
      setNote(foundNote || null);
      if (foundNote) {
        setEditedTitle(foundNote.title);
        setEditedContent(foundNote.content);
      }
    }
  }, [noteId, notes]);

  const handleBack = () => {
    if (isEditing) {
      handleCancelEdit();
    } else {
      router.back();
    }
  };

  const handleStartEditing = () => {
    if (!note) return;

    if (note.isLocked) {
      Alert.alert('Note Locked', 'This note is locked. Unlock it first to edit.');
      return;
    }

    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!note) return;

    if (editedTitle.trim() === '') {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }

    updateNote(note.id, {
      title: editedTitle.trim(),
      content: editedContent.trim(),
    });

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (!note) return;

    setEditedTitle(note.title);
    setEditedContent(note.content);
    setIsEditing(false);
  };

  const handleTogglePin = () => {
    if (!note) return;
    togglePinNote(note.id);
  };

  const handleToggleLock = () => {
    if (!note) return;
    toggleLockNote(note.id);
  };

  const handleCategoryChange = (category: any) => {
    if (!note) return;
    updateNote(note.id, { category });
    setShowCategoryPicker(false);
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
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar
          style="dark"
          backgroundColor={COLORS.background}
          translucent={false}
        />
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialIcons
            name={isEditing ? "close" : "arrow-back"}
            size={24}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {/* Category indicator - clickable to change */}
          <TouchableOpacity
            onPress={() => setShowCategoryPicker(true)}
            style={[
              styles.categoryIndicator,
              { backgroundColor: note.category.color },
            ]}
            disabled={note.isLocked && !isEditing}
          />

          {/* Star/Pin icon */}
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={handleTogglePin}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons
              name={note.isPinned ? "star" : "star-border"}
              size={24}
              color={note.isPinned ? COLORS.accent.orange : COLORS.textPrimary}
            />
          </TouchableOpacity>

          {/* Lock icon */}
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={handleToggleLock}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons
              name={note.isLocked ? "lock" : "lock-open"}
              size={24}
              color={note.isLocked ? COLORS.accent.red : COLORS.textPrimary}
            />
          </TouchableOpacity>

          {/* Save icon - only show when editing */}
          {isEditing && (
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={handleSaveEdit}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons
                name="check"
                size={24}
                color={COLORS.accent.green}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date and edit hint */}
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
          {!isEditing && !note.isLocked && (
            <Text style={styles.editHint}>Tap to edit</Text>
          )}
        </View>

        {/* Title */}
        {isEditing ? (
          <TextInput
            style={styles.titleInput}
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Note title..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            maxLength={100}
            autoFocus
          />
        ) : (
          <TouchableOpacity
            onPress={handleStartEditing}
            onPressIn={() => setPressedElement('title')}
            onPressOut={() => setPressedElement(null)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.title,
                pressedElement === 'title' && styles.pressedElement,
              ]}>
              {note.title}
            </Text>
          </TouchableOpacity>
        )}

        {/* Content */}
        {isEditing ? (
          <TextInput
            style={styles.contentInput}
            value={editedContent}
            onChangeText={setEditedContent}
            placeholder="Start writing..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            textAlignVertical="top"
          />
        ) : (
          <TouchableOpacity
            onPress={handleStartEditing}
            onPressIn={() => setPressedElement('content')}
            onPressOut={() => setPressedElement(null)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.contentContainer,
                pressedElement === 'content' && styles.pressedElement,
              ]}>
              {renderContent()}
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Category Picker Modal */}
      {showCategoryPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.categoryModal}>
            <Text style={styles.modalTitle}>Choose Category</Text>
            <View style={styles.categoryGrid}>
              {DEFAULT_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    { backgroundColor: category.color },
                    note.category.id === category.id && styles.selectedCategoryOption,
                  ]}
                  onPress={() => handleCategoryChange(category)}>
                  <Text style={styles.categoryOptionText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCategoryPicker(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  date: {
    fontSize: TYPOGRAPHY.dateSize,
    color: COLORS.textSecondary,
    opacity: 0.5,
  },
  editHint: {
    fontSize: TYPOGRAPHY.dateSize - 1,
    color: COLORS.textSecondary,
    opacity: 0.4,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 28, // Large title as shown in design
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    lineHeight: 34,
    marginBottom: SPACING.xl,
    padding: SPACING.xs, // Add padding for better touch area
    borderRadius: 8,
  },
  contentContainer: {
    paddingBottom: SPACING.xl * 2,
    padding: SPACING.xs, // Add padding for better touch area
    borderRadius: 8,
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
  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    lineHeight: 34,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 8,
    padding: SPACING.md,
    minHeight: 60,
  },
  contentInput: {
    fontSize: TYPOGRAPHY.bodySize + 2,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.bodySize * 1.6,
    paddingBottom: SPACING.xl * 2,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 8,
    padding: SPACING.md,
    minHeight: 200,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  categoryModal: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: SPACING.xl,
    margin: SPACING.lg,
    maxWidth: 300,
    width: '80%',
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  categoryOption: {
    width: '45%',
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  selectedCategoryOption: {
    borderWidth: 3,
    borderColor: COLORS.textPrimary,
  },
  categoryOptionText: {
    color: COLORS.cardBackground,
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: COLORS.textSecondary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.cardBackground,
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
  pressedElement: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.1,
  },
});