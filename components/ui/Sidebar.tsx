import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const { isDarkMode, colors, calloutsEnabled, toggleTheme, toggleCallouts } = useThemeStore();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.sidebar, { backgroundColor: colors.cardBackground }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Configuración
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons
                name="close"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Theme Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons
                name={isDarkMode ? "dark-mode" : "light-mode"}
                size={24}
                color={colors.textPrimary}
              />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                  Tema Oscuro
                </Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  {isDarkMode ? 'Activado' : 'Desactivado'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{
                false: colors.textSecondary,
                true: colors.accent.blue
              }}
              thumbColor={isDarkMode ? colors.cardBackground : colors.cardBackground}
            />
          </View>

          {/* Callouts Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons
                name="tips-and-updates"
                size={24}
                color={colors.textPrimary}
              />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                  Desactivar Tips
                </Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  {calloutsEnabled ? 'Tips activados' : 'Tips desactivados'}
                </Text>
              </View>
            </View>
            <Switch
              value={!calloutsEnabled}
              onValueChange={toggleCallouts}
              trackColor={{
                false: colors.textSecondary,
                true: colors.accent.red
              }}
              thumbColor={!calloutsEnabled ? colors.cardBackground : colors.cardBackground}
            />
          </View>

          {/* App Info */}
          <View style={styles.footer}>
            <Text style={[styles.appInfo, { color: colors.textSecondary }]}>
              FastNote v1.0.0
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayTouch: {
    flex: 1,
  },
  sidebar: {
    width: 280,
    height: '100%',
    paddingTop: 50,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.md,
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: TYPOGRAPHY.dateSize,
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    alignItems: 'center',
  },
  appInfo: {
    fontSize: TYPOGRAPHY.dateSize,
    fontStyle: 'italic',
  },
});