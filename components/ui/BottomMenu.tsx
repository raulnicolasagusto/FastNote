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
import { useThemeStore } from '../../store/theme/useThemeStore';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { Note } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BottomMenuProps {
  visible: boolean;
  note: Note | null;
  onClose: () => void;
  onPin: () => void;
  onMoveTo: () => void;
  onHide: () => void;
  onReminder: () => void;
  onDelete: () => void;
}

interface MenuButton {
  id: string;
  icon: string;
  label: string;
  action: () => void;
}

export default function BottomMenu({
  visible,
  note,
  onClose,
  onPin,
  onMoveTo,
  onHide,
  onReminder,
  onDelete,
}: BottomMenuProps) {
  const { colors } = useThemeStore();
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

  const menuButtons: MenuButton[] = [
    {
      id: 'pin',
      icon: note?.isPinned ? 'star' : 'star-border',
      label: note?.isPinned ? 'Desanclar' : 'Anclar',
      action: onPin,
    },
    {
      id: 'move',
      icon: 'folder',
      label: 'Mover a',
      action: onMoveTo,
    },
    {
      id: 'hide',
      icon: 'visibility-off',
      label: 'Ocultar',
      action: onHide,
    },
    {
      id: 'reminder',
      icon: 'schedule',
      label: 'Recordatorio',
      action: onReminder,
    },
    {
      id: 'delete',
      icon: 'delete',
      label: 'Eliminar',
      action: onDelete,
    },
  ];

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  const opacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!note) return null;

  return (
    <Modal
      animationType="none"
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

        {/* Menu */}
        <Animated.View
          style={[
            styles.menuContainer,
            {
              backgroundColor: colors.cardBackground,
              borderTopColor: colors.textSecondary + '20',
              transform: [{ translateY }],
              opacity,
            },
          ]}>
          {/* Handle bar */}
          <View style={[styles.handle, { backgroundColor: colors.textSecondary }]} />

          {/* Note title */}
          <Text
            style={[styles.noteTitle, { color: colors.textPrimary }]}
            numberOfLines={1}>
            {note.title}
          </Text>

          {/* Menu buttons */}
          <View style={styles.buttonsContainer}>
            {menuButtons.map((button) => (
              <TouchableOpacity
                key={button.id}
                style={styles.menuButton}
                onPress={() => {
                  button.action();
                  onClose();
                }}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                  <MaterialIcons
                    name={button.icon as any}
                    size={24}
                    color={
                      button.id === 'delete'
                        ? colors.accent.red
                        : button.id === 'pin' && note?.isPinned
                        ? colors.accent.orange
                        : colors.textPrimary
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.buttonLabel,
                    {
                      color:
                        button.id === 'delete'
                          ? colors.accent.red
                          : colors.textPrimary,
                    },
                  ]}>
                  {button.label}
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
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
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
  noteTitle: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  menuButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: SPACING.sm,
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
  buttonLabel: {
    fontSize: TYPOGRAPHY.dateSize,
    fontWeight: '500',
    textAlign: 'center',
  },
});