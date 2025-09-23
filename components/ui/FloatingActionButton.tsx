import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Platform, View, Text, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, LAYOUT, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface FloatingActionButtonProps {
  onNewNotePress: () => void;
  onVoiceNotePress: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onNewNotePress,
  onVoiceNotePress
}) => {
  const insets = useSafeAreaInsets();
  const [showMenu, setShowMenu] = useState(false);

  const handleFabPress = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuItemPress = (action: () => void) => {
    setShowMenu(false);
    action();
  };

  const fabBottom = LAYOUT.fabMargin + (Platform.OS === 'android' ? insets.bottom : 0);

  return (
    <>
      {/* Overlay to close menu */}
      {showMenu && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowMenu(false)}
          activeOpacity={1}
        />
      )}

      {/* Menu Items */}
      {showMenu && (
        <View style={[styles.menuContainer, { bottom: fabBottom + LAYOUT.fabSize + SPACING.md }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(onVoiceNotePress)}
            activeOpacity={0.8}>
            <MaterialIcons name="mic" size={20} color={COLORS.cardBackground} />
            <Text style={styles.menuText}>Nota de voz rápida</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(onNewNotePress)}
            activeOpacity={0.8}>
            <MaterialIcons name="edit" size={20} color={COLORS.cardBackground} />
            <Text style={styles.menuText}>Nueva Nota</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            bottom: fabBottom,
          },
          showMenu && styles.fabRotated
        ]}
        onPress={handleFabPress}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <MaterialIcons
          name={showMenu ? "close" : "add"}
          size={24}
          color={COLORS.cardBackground}
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: LAYOUT.fabMargin,
    width: LAYOUT.fabSize,
    height: LAYOUT.fabSize,
    borderRadius: LAYOUT.fabSize / 2,
    backgroundColor: COLORS.accent.blue,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.fab,
  },
  fabRotated: {
    transform: [{ rotate: '45deg' }],
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    right: LAYOUT.fabMargin,
    alignItems: 'flex-end',
    gap: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent.blue,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    gap: SPACING.sm,
    ...SHADOWS.fab,
  },
  menuText: {
    color: COLORS.cardBackground,
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
});
