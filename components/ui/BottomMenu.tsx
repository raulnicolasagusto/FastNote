import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
  BackHandler,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { Note } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BottomMenuProps {
  visible: boolean;
  notes: Note[]; // Changed from single note to array
  onClose: () => void;
  onPin: () => void;
  onMoveTo: () => void;
  onHide: () => void;
  onReminder: () => void;
  onDelete: () => void;
  isMultiSelectMode?: boolean; // Mode flag from parent
}

interface MenuButton {
  id: string;
  icon: string;
  label: string;
  action: () => void;
}

export default function BottomMenu({
  visible,
  notes,
  onClose,
  onPin,
  onMoveTo,
  onHide,
  onReminder,
  onDelete,
  isMultiSelectMode = false,
}: BottomMenuProps) {
  const { colors } = useThemeStore();
  const insets = useSafeAreaInsets();
  const slideAnim = React.useState(new Animated.Value(0))[0];

  const isMultiSelect = notes.length > 1;
  const firstNote = notes[0];

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

  // Handle Android back button
  useEffect(() => {
    if (visible) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        onClose();
        return true; // Prevent default behavior (exit app)
      });

      return () => backHandler.remove();
    }
  }, [visible, onClose]);

  // Check if all selected notes have the same pin status
  const allPinned = notes.every(note => note.isPinned);
  const somePinned = notes.some(note => note.isPinned);

  const menuButtons: MenuButton[] = [
    {
      id: 'pin',
      icon: allPinned ? 'star' : 'star-border',
      label: allPinned ? 'Desanclar' : 'Anclar',
      action: onPin,
    },
    {
      id: 'move',
      icon: 'folder',
      label: 'Mover a',
      action: onMoveTo,
    },
    {
      id: 'reminder',
      icon: firstNote?.reminderDate ? 'edit-notifications' : 'schedule',
      label: firstNote?.reminderDate ? 'Editar' : 'Recordar',
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

  if (notes.length === 0) return null;

  // If multi-select MODE (not just count), render as fixed bottom bar WITHOUT Modal
  if (isMultiSelectMode && visible) {
    return (
      <View
        style={[
          styles.multiSelectContainer,
          {
            backgroundColor: colors.cardBackground,
            borderTopColor: colors.textSecondary + '20',
            paddingBottom: insets.bottom + SPACING.md,
          },
        ]}>
        {/* Handle bar */}
        <View style={[styles.handle, { backgroundColor: colors.textSecondary }]} />

        {/* Note title or counter */}
        <Text
          style={[styles.noteTitle, { color: colors.textPrimary }]}
          numberOfLines={1}>
          {`${notes.length} notas seleccionadas`}
        </Text>

        {/* Menu buttons */}
        <View style={styles.buttonsContainer}>
          {menuButtons.map((button) => {
            // Disable reminder button if multiple notes selected
            const isDisabled = button.id === 'reminder' && isMultiSelect;

            return (
              <TouchableOpacity
                key={button.id}
                style={styles.menuButton}
                onPress={() => {
                  if (isDisabled) return;
                  button.action();
                  // Don't close for buttons that open modals (reminder, move, delete)
                  if (button.id !== 'reminder' && button.id !== 'move' && button.id !== 'delete') {
                    onClose();
                  }
                }}
                disabled={isDisabled}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: colors.background },
                  isDisabled && { opacity: 0.3 }
                ]}>
                  <MaterialIcons
                    name={button.icon as any}
                    size={24}
                    color={
                      button.id === 'delete'
                        ? colors.accent.red
                        : button.id === 'pin' && allPinned
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
                    isDisabled && { opacity: 0.3 }
                  ]}>
                  {button.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // Single note mode - use Modal with backdrop
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="box-none">
        {/* Backdrop - no longer blocks touches, only visible for dimming effect */}
        <View
          style={styles.backdrop}
          pointerEvents="none"
        />

        {/* Menu */}
        <Animated.View
          style={[
            styles.menuContainer,
            {
              backgroundColor: colors.cardBackground,
              borderTopColor: colors.textSecondary + '20',
              transform: [{ translateY }],
              paddingBottom: insets.bottom + SPACING.md, // Respetar la barra de navegación
            },
          ]}>
          {/* Handle bar */}
          <View style={[styles.handle, { backgroundColor: colors.textSecondary }]} />

          {/* Note title or counter */}
          <Text
            style={[styles.noteTitle, { color: colors.textPrimary }]}
            numberOfLines={1}>
            {isMultiSelect ? `${notes.length} notas seleccionadas` : firstNote.title}
          </Text>

          {/* Menu buttons */}
          <View style={styles.buttonsContainer}>
            {menuButtons.map((button) => {
              // Disable reminder button if multiple notes selected
              const isDisabled = button.id === 'reminder' && isMultiSelect;

              return (
                <TouchableOpacity
                  key={button.id}
                  style={styles.menuButton}
                  onPress={() => {
                    if (isDisabled) return; // Don't execute if disabled
                    button.action();
                    // Solo cerrar si NO es el botón de recordatorio
                    if (button.id !== 'reminder') {
                      onClose();
                    }
                  }}
                  disabled={isDisabled}>
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: colors.background },
                    isDisabled && { opacity: 0.3 }
                  ]}>
                    <MaterialIcons
                      name={button.icon as any}
                      size={24}
                      color={
                        button.id === 'delete'
                          ? colors.accent.red
                          : button.id === 'pin' && allPinned
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
                      isDisabled && { opacity: 0.3 }
                    ]}>
                    {button.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
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
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  multiSelectContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
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
    marginBottom: SPACING.sm,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  menuButton: {
    alignItems: 'center',
    minWidth: 70,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
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