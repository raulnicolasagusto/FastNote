import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/theme/useThemeStore';

interface KeyboardToolbarProps {
  visible?: boolean;
  onFormatPress?: () => void;
  onAudioPress?: () => void;
  onDrawPress?: () => void;
  onImagePress?: () => void;
}

const KeyboardToolbar: React.FC<KeyboardToolbarProps> = ({
  visible = false,
  onFormatPress,
  onAudioPress,
  onDrawPress,
  onImagePress,
}) => {
  const { colors } = useThemeStore();

  // Solo renderizar si visible
  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.textSecondary + '20',
          opacity: visible ? 1 : 0,
        },
      ]}
    >
      <View style={styles.toolbar}>
        {/* Formato de texto */}
        <TouchableOpacity
          style={[styles.toolButton, { backgroundColor: colors.background }]}
          onPress={onFormatPress}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="format-bold"
            size={20}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        {/* Grabación de audio */}
        <TouchableOpacity
          style={[styles.toolButton, { backgroundColor: colors.background }]}
          onPress={onAudioPress}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="mic"
            size={20}
            color={colors.accent.red}
          />
        </TouchableOpacity>

        {/* Herramientas de dibujo */}
        <TouchableOpacity
          style={[styles.toolButton, { backgroundColor: colors.background }]}
          onPress={onDrawPress}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="brush"
            size={20}
            color={colors.accent.blue}
          />
        </TouchableOpacity>

        {/* Insertar imagen */}
        <TouchableOpacity
          style={[styles.toolButton, { backgroundColor: colors.background }]}
          onPress={onImagePress}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="image"
            size={20}
            color={colors.accent.green}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

export default KeyboardToolbar;