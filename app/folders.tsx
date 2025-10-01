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
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '../store/theme/useThemeStore';
import { useFoldersStore } from '../store/folders/useFoldersStore';
import { SPACING, TYPOGRAPHY } from '../constants/theme';
import { Folder } from '../types';

export default function Folders() {
  const { colors, isDarkMode } = useThemeStore();
  const { folders, addFolder, updateFolder, deleteFolder, togglePinFolder } = useFoldersStore();
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedFolderName, setEditedFolderName] = useState('');

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

  const handleFolderLongPress = (folder: Folder) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedFolder(folder);
    setShowBottomMenu(true);
  };

  const handleCloseBottomMenu = () => {
    setShowBottomMenu(false);
    setSelectedFolder(null);
  };

  const handlePinFolder = () => {
    if (selectedFolder) {
      togglePinFolder(selectedFolder.id);
      handleCloseBottomMenu();
    }
  };

  const handleEditFolder = () => {
    if (selectedFolder) {
      setEditedFolderName(selectedFolder.name);
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    const trimmedName = editedFolderName.trim();

    if (!trimmedName) {
      Alert.alert('Error', 'El nombre de la carpeta no puede estar vacío');
      return;
    }

    if (selectedFolder && trimmedName !== selectedFolder.name) {
      // Check for duplicate names (excluding current folder)
      if (folders.some(f => f.id !== selectedFolder.id && f.name.toLowerCase() === trimmedName.toLowerCase())) {
        Alert.alert('Error', 'Ya existe una carpeta con ese nombre');
        return;
      }

      try {
        updateFolder(selectedFolder.id, { name: trimmedName });
        setShowEditModal(false);
        handleCloseBottomMenu();
      } catch (error) {
        Alert.alert('Error', (error as Error).message);
      }
    } else {
      setShowEditModal(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedFolderName('');
    setShowEditModal(false);
  };

  const handleDeleteFolder = () => {
    if (selectedFolder) {
      Alert.alert(
        'Eliminar Carpeta',
        `¿Estás seguro de que deseas eliminar la carpeta "${selectedFolder.name}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => {
              deleteFolder(selectedFolder.id);
              handleCloseBottomMenu();
            },
          },
        ]
      );
    }
  };

  // Sort folders: pinned first, then by name
  const sortedFolders = [...folders].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return a.name.localeCompare(b.name);
  });

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
        {sortedFolders.map((folder) => (
          <TouchableOpacity
            key={folder.id}
            style={[
              styles.folderItem,
              { backgroundColor: colors.cardBackground },
              selectedFolder?.id === folder.id && showBottomMenu && styles.pressedFolder
            ]}
            onPress={() => {
              // TODO: Navigate to folder content
            }}
            onLongPress={() => handleFolderLongPress(folder)}
            activeOpacity={0.7}>
            <MaterialIcons name="folder" size={24} color={colors.textPrimary} />
            <Text style={[styles.folderName, { color: colors.textPrimary }]}>
              {folder.name}
            </Text>
            {folder.isPinned && (
              <MaterialIcons name="star" size={20} color={colors.accent.orange} style={styles.pinIcon} />
            )}
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

      {/* Edit Folder Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showEditModal}
        onRequestClose={handleCancelEdit}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Editar Carpeta
            </Text>

            <TextInput
              style={[styles.modalInput, {
                color: colors.textPrimary,
                borderColor: colors.textSecondary,
                backgroundColor: colors.background
              }]}
              value={editedFolderName}
              onChangeText={setEditedFolderName}
              placeholder="Nuevo nombre..."
              placeholderTextColor={colors.textSecondary}
              maxLength={50}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.textSecondary }]}
                onPress={handleCancelEdit}>
                <Text style={[styles.modalButtonText, { color: colors.cardBackground }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.accent.blue }]}
                onPress={handleSaveEdit}>
                <Text style={[styles.modalButtonText, { color: colors.cardBackground }]}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Menu - Custom for Folders */}
      {selectedFolder && showBottomMenu && (
        <Modal
          animationType="none"
          transparent={true}
          visible={showBottomMenu}
          onRequestClose={handleCloseBottomMenu}>
          <View style={styles.bottomMenuOverlay}>
            <TouchableOpacity
              style={styles.backdrop}
              activeOpacity={1}
              onPress={handleCloseBottomMenu}
            />

            <View style={[styles.bottomMenuContainer, { backgroundColor: colors.cardBackground, borderTopColor: colors.textSecondary + '20' }]}>
              {/* Handle bar */}
              <View style={[styles.handle, { backgroundColor: colors.textSecondary }]} />

              {/* Folder name */}
              <Text style={[styles.bottomMenuTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {selectedFolder.name}
              </Text>

              {/* Menu buttons */}
              <View style={styles.bottomMenuButtons}>
                {/* Pin */}
                <TouchableOpacity style={styles.bottomMenuButton} onPress={handlePinFolder}>
                  <View style={[styles.bottomMenuIconContainer, { backgroundColor: colors.background }]}>
                    <MaterialIcons
                      name={selectedFolder.isPinned ? 'star' : 'star-border'}
                      size={24}
                      color={selectedFolder.isPinned ? colors.accent.orange : colors.textPrimary}
                    />
                  </View>
                  <Text style={[styles.bottomMenuButtonLabel, { color: colors.textPrimary }]}>
                    {selectedFolder.isPinned ? 'Desanclar' : 'Anclar'}
                  </Text>
                </TouchableOpacity>

                {/* Edit */}
                <TouchableOpacity style={styles.bottomMenuButton} onPress={handleEditFolder}>
                  <View style={[styles.bottomMenuIconContainer, { backgroundColor: colors.background }]}>
                    <MaterialIcons name="edit" size={24} color={colors.textPrimary} />
                  </View>
                  <Text style={[styles.bottomMenuButtonLabel, { color: colors.textPrimary }]}>
                    Editar
                  </Text>
                </TouchableOpacity>

                {/* Delete */}
                <TouchableOpacity style={styles.bottomMenuButton} onPress={handleDeleteFolder}>
                  <View style={[styles.bottomMenuIconContainer, { backgroundColor: colors.background }]}>
                    <MaterialIcons name="delete" size={24} color={colors.accent.red} />
                  </View>
                  <Text style={[styles.bottomMenuButtonLabel, { color: colors.accent.red }]}>
                    Eliminar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  pressedFolder: {
    transform: [{ scale: 0.97 }],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  folderName: {
    flex: 1,
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '500',
    marginLeft: SPACING.md,
  },
  pinIcon: {
    marginRight: SPACING.xs,
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
  bottomMenuOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomMenuContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
    opacity: 0.3,
  },
  bottomMenuTitle: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  bottomMenuButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomMenuButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  bottomMenuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomMenuButtonLabel: {
    fontSize: TYPOGRAPHY.dateSize,
    fontWeight: '500',
    textAlign: 'center',
  },
});