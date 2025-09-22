import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotesStore } from '../store/notes/useNotesStore';
import {
  DEFAULT_CATEGORIES,
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
} from '../constants/theme';

export default function NewNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORIES[0]);
  const { addNote } = useNotesStore();

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note');
      return;
    }

    addNote({
      title: title.trim(),
      content: content.trim(),
      category: selectedCategory,
      type: 'text',
      images: [],
      isArchived: false,
    });

    router.back();
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      Alert.alert('Discard Note?', 'Are you sure you want to discard this note?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Background overlay */}
      <View style={styles.overlay}>
        {/* Modal content */}
        <View style={styles.modal}>
          {/* Category selector */}
          <View style={styles.categorySection}>
            <Text style={styles.sectionLabel}>Add Label</Text>
            <View style={styles.categoryRow}>
              {DEFAULT_CATEGORIES.slice(0, 2).map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: category.color },
                    selectedCategory.id === category.id && styles.selectedCategory,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                />
              ))}
            </View>
          </View>

          {/* Title input */}
          <TextInput
            style={styles.titleInput}
            placeholder="Add Title"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            autoFocus
          />

          {/* Content input */}
          <TextInput
            style={styles.contentInput}
            placeholder="Add note details..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modal: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 400,
    minHeight: 400,
    ...SHADOWS.card,
  },
  categorySection: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.bodySize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  categoryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedCategory: {
    borderColor: COLORS.textPrimary,
  },
  titleInput: {
    fontSize: TYPOGRAPHY.titleSize,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: BORDER_RADIUS.input,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  contentInput: {
    fontSize: TYPOGRAPHY.bodySize,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: BORDER_RADIUS.input,
    padding: SPACING.md,
    flex: 1,
    minHeight: 120,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  cancelButton: {
    flex: 1,
    padding: SPACING.md,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    padding: SPACING.md,
    marginLeft: SPACING.sm,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.accent.blue,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: TYPOGRAPHY.bodySize,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  saveText: {
    fontSize: TYPOGRAPHY.bodySize,
    color: COLORS.cardBackground,
    fontWeight: '600',
  },
});
