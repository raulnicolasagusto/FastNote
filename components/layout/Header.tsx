import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT } from '../../constants/theme';

interface HeaderProps {
  title: string;
  onSearchPress?: () => void;
  onMenuPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onSearchPress, onMenuPress }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actions}>
        {onSearchPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onSearchPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name="search" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}
        {onMenuPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onMenuPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name="menu" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: LAYOUT.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: TYPOGRAPHY.titleSize + 2, // Slightly larger for header
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
});
