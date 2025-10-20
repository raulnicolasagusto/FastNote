import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { useFoldersStore } from '../../store/folders/useFoldersStore';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { Folder } from '../../types';
import { t } from '../../utils/i18n';
import { useLanguage } from '../../utils/useLanguage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MoveFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFolder: (folderId: string) => void;
}

export default function MoveFolderModal({
  visible,
  onClose,
  onSelectFolder,
}: MoveFolderModalProps) {
  useLanguage(); // Re-render on language change
  const { colors } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { folders } = useFoldersStore();

  const handleFolderSelect = (folderId: string) => {
    onSelectFolder(folderId);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Modal Content */}
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.cardBackground,
              marginTop: insets.top + 60,
              marginBottom: insets.bottom + 20,
            },
          ]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t('folders.moveTo')}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}>
              <MaterialIcons
                name="close"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {folders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name="folder-open"
                size={48}
                color={colors.textSecondary}
                style={styles.emptyIcon}
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('folders.noFoldersCreated')}
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.foldersContainer}>
              {folders.map((folder: Folder) => (
                <TouchableOpacity
                  key={folder.id}
                  style={[
                    styles.folderItem,
                    { borderBottomColor: colors.textSecondary + '20' },
                  ]}
                  onPress={() => handleFolderSelect(folder.id)}>
                  <View style={styles.folderInfo}>
                    <MaterialIcons
                      name="folder"
                      size={24}
                      color={colors.accent.blue}
                      style={styles.folderIcon}
                    />
                    <Text
                      style={[styles.folderName, { color: colors.textPrimary }]}
                      numberOfLines={1}>
                      {folder.name}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    marginHorizontal: SPACING.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: '600',
  },
  closeButton: {
    padding: SPACING.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    marginBottom: SPACING.md,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.bodySize,
    textAlign: 'center',
  },
  foldersContainer: {
    flex: 1,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  folderIcon: {
    marginRight: SPACING.md,
  },
  folderName: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '500',
    flex: 1,
  },
});