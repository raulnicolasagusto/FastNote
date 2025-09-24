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
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
} from '../constants/theme';
import { useThemeStore } from '../store/theme/useThemeStore';

export default function NewNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORIES[0]);
  const { addNote } = useNotesStore();
  const { colors, isDarkMode } = useThemeStore();

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
      isPinned: false,
      isLocked: false,
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Background overlay */}
      <View style={styles.overlay}>
        {/* Modal content */}
        <View style={[styles.modal, { backgroundColor: colors.cardBackground }]}>
          {/* Category selector */}
          <View style={styles.categorySection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Add Label</Text>
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
            style={[styles.titleInput, { borderColor: colors.textPrimary, color: colors.textPrimary }]}
            placeholder="Add Title"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            autoFocus
          />

          {/* Content input */}
          <TextInput
            style={[styles.contentInput, { borderColor: colors.textSecondary, color: colors.textPrimary }]}
            placeholder="Add note details..."
            placeholderTextColor={colors.textSecondary}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.cancelButton, { borderColor: colors.textSecondary }]} onPress={handleCancel}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.accent.blue }]} onPress={handleSave}>
              <Text style={[styles.saveText, { color: colors.cardBackground }]}>Save</Text>
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
  },
  titleInput: {
    fontSize: TYPOGRAPHY.titleSize,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.input,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  contentInput: {
    fontSize: TYPOGRAPHY.bodySize,
    borderWidth: 1,
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
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    padding: SPACING.md,
    marginLeft: SPACING.sm,
    borderRadius: BORDER_RADIUS.button,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
  saveText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
});
