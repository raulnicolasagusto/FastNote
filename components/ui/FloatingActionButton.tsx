import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, LAYOUT, SHADOWS } from '../../constants/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.8}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <MaterialIcons name="add" size={24} color={COLORS.cardBackground} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: LAYOUT.fabMargin,
    right: LAYOUT.fabMargin,
    width: LAYOUT.fabSize,
    height: LAYOUT.fabSize,
    borderRadius: LAYOUT.fabSize / 2,
    backgroundColor: COLORS.accent.blue,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.fab,
  },
});
