import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { Note } from '../../types';
import { t } from '../../utils/i18n';
import { useLanguage } from '../../utils/useLanguage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ShareMenuProps {
  visible: boolean;
  note: Note | null;
  onClose: () => void;
  onShareAsText: () => void;
  onShareAsImage: () => void;
  onExportAsMarkdown: () => void;
  onShareWithSomeone: () => void;
}

interface ShareOption {
  id: string;
  icon: string;
  label: string;
  action: () => void;
}

export default function ShareMenu({
  visible,
  note,
  onClose,
  onShareAsText,
  onShareAsImage,
  onExportAsMarkdown,
  onShareWithSomeone,
}: ShareMenuProps) {
  useLanguage(); // Re-render on language change
  const { colors } = useThemeStore();
  const insets = useSafeAreaInsets();
  const slideAnim = React.useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const shareOptions: ShareOption[] = [
    {
      id: 'text',
      icon: 'text-fields',
      label: t('share.shareAsText'),
      action: onShareAsText,
    },
    {
      id: 'image',
      icon: 'image',
      label: t('share.shareAsImage'),
      action: onShareAsImage,
    },
    // {
    //   id: 'markdown',
    //   icon: 'description',
    //   label: t('share.shareAsMarkdown'),
    //   action: onExportAsMarkdown,
    // },
    // {
    //   id: 'share',
    //   icon: 'person-add',
    //   label: t('share.shareWithSomeone'),
    //   action: onShareWithSomeone,
    // },
  ];

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  if (!note) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        {/* Menu Container */}
        <Animated.View
          style={[
            styles.menuContainer,
            {
              backgroundColor: colors.cardBackground,
              borderTopColor: colors.borderColor,
              paddingBottom: insets.bottom + SPACING.md,
              transform: [{ translateY }],
            },
          ]}>
          {/* Handle bar */}
          <View style={[styles.handle, { backgroundColor: colors.textSecondary }]} />

          {/* Menu title */}
          <Text
            style={[styles.menuTitle, { color: colors.textPrimary }]}>
            {t('share.shareNote')}
          </Text>

          {/* Note title */}
          <Text
            style={[styles.noteTitle, { color: colors.textSecondary }]}
            numberOfLines={1}>
            {note.title}
          </Text>

          {/* Share options */}
          <View style={styles.optionsContainer}>
            {shareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionButton}
                onPress={() => {
                  option.action();
                  onClose();
                }}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                  <MaterialIcons
                    name={option.icon as any}
                    size={24}
                    color={colors.accent.blue}
                  />
                </View>
                <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: SPACING.sm,
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
  menuTitle: {
    fontSize: TYPOGRAPHY.titleSize + 2,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  noteTitle: {
    fontSize: TYPOGRAPHY.bodySize,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    opacity: 0.8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: SPACING.md,
  },
  optionButton: {
    alignItems: 'center',
    width: '48%',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  iconContainer: {
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
  optionLabel: {
    fontSize: TYPOGRAPHY.dateSize + 1,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.dateSize * 1.3,
  },
});