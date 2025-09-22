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
import { Note, ChecklistItem } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT, DEFAULT_CATEGORIES } from '../constants/theme';
import { StorageService } from '../utils/storage';

export default function NoteDetail() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { notes, updateNote, togglePinNote, toggleLockNote } = useNotesStore();
  const [note, setNote] = useState<Note | null>(null);
  const [editingElement, setEditingElement] = useState<'title' | 'content' | 'checklist' | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [editedChecklistItems, setEditedChecklistItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    if (noteId) {
      const foundNote = notes.find((n) => n.id === noteId);
      setNote(foundNote || null);
      if (foundNote) {
        setEditedTitle(foundNote.title);
        setEditedContent(foundNote.content);
        setEditedChecklistItems(foundNote.checklistItems || []);
      }
    }
  }, [noteId, notes]);

  const handleBack = () => {
    if (editingElement) {
      handleCancelEdit();
    } else {
      router.back();
    }
  };

  const handleStartTitleEdit = () => {
    if (!note) return;
    if (note.isLocked) {
      Alert.alert('Note Locked', 'This note is locked. Unlock it first to edit.');
      return;
    }
    setEditingElement('title');
  };

  const handleStartContentEdit = () => {
    if (!note) return;
    if (note.isLocked) {
      Alert.alert('Note Locked', 'This note is locked. Unlock it first to edit.');
      return;
    }
    setEditingElement('content');
  };

  const handleStartChecklistEdit = () => {
    if (!note) return;
    if (note.isLocked) {
      Alert.alert('Note Locked', 'This note is locked. Unlock it first to edit.');
      return;
    }
    setEditingElement('checklist');
  };

  const handleSaveEdit = () => {
    if (!note) return;

    if (editedTitle.trim() === '') {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }

    const updates: Partial<Note> = {
      title: editedTitle.trim(),
      content: editedContent.trim(),
      checklistItems: editedChecklistItems,
      type: editedChecklistItems.length > 0 ? 'checklist' : 'text',
    };

    updateNote(note.id, updates);
    setEditingElement(null);
  };

  const handleCancelEdit = () => {
    if (!note) return;

    setEditedTitle(note.title);
    setEditedContent(note.content);
    setEditedChecklistItems(note.checklistItems || []);
    setEditingElement(null);
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

  const addChecklistItem = (text: string = '') => {
    const newItem: ChecklistItem = {
      id: StorageService.generateId(),
      text,
      completed: false,
      order: editedChecklistItems.length,
    };
    setEditedChecklistItems([...editedChecklistItems, newItem]);
    return newItem;
  };

  const updateChecklistItem = (itemId: string, updates: Partial<ChecklistItem>) => {
    if (!note) return;

    // Update both the edited items and immediately save to the note
    const updatedItems = note.checklistItems?.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ) || [];

    const updatedNote: Partial<Note> = {
      checklistItems: updatedItems,
    };

    updateNote(note.id, updatedNote);
    setEditedChecklistItems(updatedItems);
  };

  const removeChecklistItem = (itemId: string) => {
    setEditedChecklistItems(items => items.filter(item => item.id !== itemId));
  };

  const handleChecklistItemSubmit = (itemId: string) => {
    const currentIndex = editedChecklistItems.findIndex(item => item.id === itemId);
    if (currentIndex !== -1) {
      addChecklistItem();
    }
  };

  const toggleChecklistMode = () => {
    if (editedChecklistItems.length === 0) {
      addChecklistItem();
    }
    setEditingElement('checklist');
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

    // If note has checklist items, render them
    if (note.checklistItems && note.checklistItems.length > 0) {
      return (
        <View>
          {note.checklistItems.map((item) => (
            <View key={item.id} style={styles.checklistItem}>
              <TouchableOpacity
                style={styles.checkboxDisplay}
                onPress={() => {
                  updateChecklistItem(item.id, { completed: !item.completed });
                  handleStartChecklistEdit();
                }}
                activeOpacity={0.7}>
                <MaterialIcons
                  name={item.completed ? "check-box" : "check-box-outline-blank"}
                  size={20}
                  color={item.completed ? COLORS.accent.green : COLORS.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checklistTextContainer}
                onPress={handleStartChecklistEdit}
                activeOpacity={1}>
                <Text style={[styles.checklistText, item.completed && styles.completedText]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      );
    }

    // If note has text content, render it
    if (note.content && note.content.trim()) {
      const paragraphs = note.content.split('\n').filter((p) => p.trim());
      return paragraphs.map((paragraph, index) => (
        <Text key={index} style={styles.contentText}>
          {paragraph}
        </Text>
      ));
    }

    // Empty state
    return (
      <Text style={styles.emptyText}>
        Start writing or add a checklist...
      </Text>
    );
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
            name={editingElement ? "close" : "arrow-back"}
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
            disabled={note.isLocked && !editingElement}
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


          {/* Checklist icon - only show when not editing checklist */}
          {!editingElement && (
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={toggleChecklistMode}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons
                name="checklist"
                size={24}
                color={note.checklistItems && note.checklistItems.length > 0 ? COLORS.accent.blue : COLORS.textSecondary}
              />
            </TouchableOpacity>
          )}

          {/* Save icon - only show when editing */}
          {editingElement && (
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
          {!editingElement && !note.isLocked && (
            <Text style={styles.editHint}>Tap to edit</Text>
          )}
        </View>

        {/* Title */}
        {editingElement === 'title' ? (
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
            onPress={handleStartTitleEdit}
            activeOpacity={1}>
            <Text style={styles.title}>
              {note.title}
            </Text>
          </TouchableOpacity>
        )}

        {/* Content */}
        {editingElement === 'content' ? (
          <TextInput
            style={styles.contentInput}
            value={editedContent}
            onChangeText={setEditedContent}
            placeholder="Start writing..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            textAlignVertical="top"
            autoFocus
          />
        ) : editingElement === 'checklist' ? (
          <View style={styles.checklistContainer}>
            {editedChecklistItems.map((item, index) => (
              <View key={item.id} style={styles.checklistEditItem}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => updateChecklistItem(item.id, { completed: !item.completed })}>
                  <MaterialIcons
                    name={item.completed ? "check-box" : "check-box-outline-blank"}
                    size={20}
                    color={item.completed ? COLORS.accent.green : COLORS.textSecondary}
                  />
                </TouchableOpacity>
                <TextInput
                  style={[
                    styles.checklistInput,
                    item.completed && styles.completedChecklistInput,
                  ]}
                  value={item.text}
                  onChangeText={(text) => updateChecklistItem(item.id, { text })}
                  placeholder="Add item..."
                  placeholderTextColor={COLORS.textSecondary}
                  onSubmitEditing={() => handleChecklistItemSubmit(item.id)}
                  returnKeyType="next"
                  autoFocus={index === editedChecklistItems.length - 1 && !item.text}
                />
                <TouchableOpacity
                  style={styles.deleteItemButton}
                  onPress={() => removeChecklistItem(item.id)}>
                  <MaterialIcons name="close" size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={() => addChecklistItem()}>
              <MaterialIcons name="add" size={20} color={COLORS.accent.blue} />
              <Text style={styles.addItemText}>Add item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleStartContentEdit}
            activeOpacity={1}>
            <View style={styles.contentContainer}>
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
    padding: SPACING.xs,
    minHeight: 60,
  },
  contentInput: {
    fontSize: TYPOGRAPHY.bodySize + 2,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.bodySize * 1.6,
    paddingBottom: SPACING.xl * 2,
    padding: SPACING.xs,
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
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  checkboxDisplay: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
  },
  checklistTextContainer: {
    flex: 1,
  },
  checklistText: {
    fontSize: TYPOGRAPHY.bodySize + 2,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.bodySize * 1.6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.bodySize,
    color: COLORS.textSecondary,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  checklistContainer: {
    marginBottom: SPACING.xl,
  },
  checklistEditItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  checkbox: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
  },
  checklistInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.bodySize,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    marginRight: SPACING.sm,
  },
  completedChecklistInput: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteItemButton: {
    padding: SPACING.xs,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accent.blue,
    borderRadius: 8,
    borderStyle: 'dashed',
    marginTop: SPACING.sm,
  },
  addItemText: {
    marginLeft: SPACING.xs,
    fontSize: TYPOGRAPHY.bodySize,
    color: COLORS.accent.blue,
    fontWeight: '500',
  },
});