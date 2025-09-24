import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/theme/useThemeStore';
import { useFoldersStore } from '../store/folders/useFoldersStore';
import { SPACING, TYPOGRAPHY } from '../constants/theme';

export default function Folders() {
  const { colors, isDarkMode } = useThemeStore();
  const { folders, addFolder } = useFoldersStore();
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleNewFolder = () => {
    setShowNewFolderModal(true);
  };

  const handleCreateFolder = () => {
    const trimmedName = newFolderName.trim();

    if (!trimmedName) {
      Alert.alert('Error', 'El nombre de la carpeta no puede estar vacío');
      return;
    }

    try {
      addFolder(trimmedName);
      setNewFolderName('');
      setShowNewFolderModal(false);
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  const handleCancelNewFolder = () => {
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Carpetas</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {folders.map((folder) => (
          <TouchableOpacity
            key={folder.id}
            style={[styles.folderItem, { backgroundColor: colors.cardBackground }]}
            onPress={() => {
              // TODO: Navigate to folder content
            }}>
            <MaterialIcons name="folder" size={24} color={colors.textPrimary} />
            <Text style={[styles.folderName, { color: colors.textPrimary }]}>
              {folder.name}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}

        {/* New Folder Button */}
        <TouchableOpacity
          style={[styles.newFolderButton, { backgroundColor: colors.cardBackground, borderColor: colors.textSecondary }]}
          onPress={handleNewFolder}>
          <MaterialIcons name="add" size={24} color={colors.textPrimary} />
          <Text style={[styles.newFolderText, { color: colors.textPrimary }]}>
            Nueva Carpeta
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* New Folder Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showNewFolderModal}
        onRequestClose={handleCancelNewFolder}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Nombre de la Carpeta
            </Text>

            <TextInput
              style={[styles.modalInput, {
                color: colors.textPrimary,
                borderColor: colors.textSecondary,
                backgroundColor: colors.background
              }]}
              value={newFolderName}
              onChangeText={setNewFolderName}
              placeholder="Ingresa el nombre..."
              placeholderTextColor={colors.textSecondary}
              maxLength={50}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.textSecondary }]}
                onPress={handleCancelNewFolder}>
                <Text style={[styles.modalButtonText, { color: colors.cardBackground }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.accent.blue }]}
                onPress={handleCreateFolder}>
                <Text style={[styles.modalButtonText, { color: colors.cardBackground }]}>
                  Crear
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: SPACING.xs,
  },
  title: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40, // Same as back button to center title
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  folderName: {
    flex: 1,
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '500',
    marginLeft: SPACING.md,
  },
  newFolderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  newFolderText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '500',
    marginLeft: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.bodySize,
    marginBottom: SPACING.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#7F8C8D',
  },
  confirmButton: {
    backgroundColor: '#3498DB',
  },
  modalButtonText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
});