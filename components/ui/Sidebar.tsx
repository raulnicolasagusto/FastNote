import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { t, changeLanguage, getAvailableLanguages } from '../../utils/i18n';
import { useLanguage } from '../../utils/useLanguage';
import InstructionsModal from './InstructionsModal';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  useLanguage(); // Forzar re-render en cambio de idioma
  const { isDarkMode, colors, calloutsEnabled, currentLanguage, toggleTheme, toggleCallouts, setLanguage } = useThemeStore();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const availableLanguages = getAvailableLanguages();

  const handleLanguageChange = async (newLang: 'en' | 'es' | 'pt') => {
    if (newLang === currentLanguage || isChangingLanguage) return;

    setShowLanguageMenu(false);
    setIsChangingLanguage(true);
    await changeLanguage(newLang);
    setLanguage(newLang);

    // Delay para que se vea el spinner
    setTimeout(() => {
      setIsChangingLanguage(false);
    }, 500);
  };

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
              {t('sidebar.settings')}
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
                  {t('sidebar.darkMode')}
                </Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  {isDarkMode ? t('common.yes') : t('common.no')}
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
                  {t('sidebar.callouts')}
                </Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  {calloutsEnabled ? t('common.yes') : t('common.no')}
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

          {/* Instructions Button */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowInstructionsModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingInfo}>
              <MaterialIcons
                name="info-outline"
                size={24}
                color={colors.textPrimary}
              />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                  {t('sidebar.instructions')}
                </Text>
              </View>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Language Selector */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons
                name="language"
                size={24}
                color={colors.textPrimary}
              />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                  {t('sidebar.language')}
                </Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  {availableLanguages.find(l => l.code === currentLanguage)?.name}
                </Text>
              </View>
            </View>

            {isChangingLanguage ? (
              <ActivityIndicator size="small" color={colors.accent.blue} />
            ) : (
              <TouchableOpacity
                style={[styles.languageSelect, {
                  backgroundColor: colors.background,
                  borderColor: colors.textSecondary
                }]}
                onPress={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                <Text style={[styles.languageSelectText, { color: colors.textPrimary }]}>
                  {availableLanguages.find(l => l.code === currentLanguage)?.abbreviation}
                </Text>
                <MaterialIcons
                  name={showLanguageMenu ? "arrow-drop-up" : "arrow-drop-down"}
                  size={20}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Language Dropdown Menu */}
          {showLanguageMenu && !isChangingLanguage && (
            <View style={[styles.languageDropdown, {
              backgroundColor: colors.cardBackground,
              borderColor: colors.textSecondary
            }]}>
              {availableLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    currentLanguage === lang.code && { backgroundColor: colors.accent.blue + '20' }
                  ]}
                  onPress={() => handleLanguageChange(lang.code as 'en' | 'es' | 'pt')}
                >
                  <Text style={[
                    styles.languageOptionText,
                    { color: colors.textPrimary }
                  ]}>
                    {lang.abbreviation} - {lang.name}
                  </Text>
                  {currentLanguage === lang.code && (
                    <MaterialIcons
                      name="check"
                      size={20}
                      color={colors.accent.blue}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* App Info */}
          <View style={styles.footer}>
            <Text style={[styles.appInfo, { color: colors.textSecondary }]}>
              FastNote v1.0.0
            </Text>
          </View>
        </View>
      </View>

      {/* Instructions Modal */}
      <InstructionsModal
        visible={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
      />
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
  languageSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    gap: SPACING.xs,
    minWidth: 80,
  },
  languageSelectText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
  languageDropdown: {
    marginLeft: 48,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  languageOptionText: {
    fontSize: TYPOGRAPHY.bodySize,
    flex: 1,
  },
});