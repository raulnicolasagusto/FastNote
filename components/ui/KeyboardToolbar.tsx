import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/theme/useThemeStore';

interface KeyboardToolbarProps {
  visible?: boolean;
  isFormatMode?: boolean;
  onFormatPress?: () => void;
  onAudioPress?: () => void;
  onDrawPress?: () => void;
  onImagePress?: () => void;
  // Format mode handlers
  onH1Press?: () => void;
  onH2Press?: () => void;
  onH3Press?: () => void;
  onBoldPress?: () => void;
  onHighlightPress?: () => void;
  onBulletPress?: () => void;
  // Active states
  activeFormats?: {
    bold: boolean;
    h1: boolean;
    h2: boolean;
    h3: boolean;
    highlight: boolean;
  };
}

const KeyboardToolbar: React.FC<KeyboardToolbarProps> = ({
  visible = false,
  isFormatMode = false,
  onFormatPress,
  onAudioPress,
  onDrawPress,
  onImagePress,
  // Format mode handlers
  onH1Press,
  onH2Press,
  onH3Press,
  onBoldPress,
  onHighlightPress,
  onBulletPress,
  // Active states
  activeFormats = { bold: false, h1: false, h2: false, h3: false, highlight: false },
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
        {isFormatMode ? (
          // Format mode buttons: H1, H2, H3, B, Highlight, X
          <>
            {/* H1 */}
            <TouchableOpacity
              style={[
                styles.toolButton, 
                { backgroundColor: activeFormats.h1 ? colors.accent.blue : colors.background }
              ]}
              onPress={onH1Press}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.headerText, 
                { color: activeFormats.h1 ? 'white' : colors.textPrimary }
              ]}>
                H1
              </Text>
            </TouchableOpacity>

            {/* H2 */}
            <TouchableOpacity
              style={[
                styles.toolButton, 
                { backgroundColor: activeFormats.h2 ? colors.accent.blue : colors.background }
              ]}
              onPress={onH2Press}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.headerText, 
                { color: activeFormats.h2 ? 'white' : colors.textPrimary }
              ]}>
                H2
              </Text>
            </TouchableOpacity>

            {/* H3 */}
            <TouchableOpacity
              style={[
                styles.toolButton, 
                { backgroundColor: activeFormats.h3 ? colors.accent.blue : colors.background }
              ]}
              onPress={onH3Press}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.headerText, 
                { color: activeFormats.h3 ? 'white' : colors.textPrimary }
              ]}>
                H3
              </Text>
            </TouchableOpacity>

            {/* Bold (B) */}
            <TouchableOpacity
              style={[
                styles.toolButton, 
                { backgroundColor: activeFormats.bold ? colors.accent.blue : colors.background }
              ]}
              onPress={onBoldPress}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="format-bold"
                size={20}
                color={activeFormats.bold ? 'white' : colors.textPrimary}
              />
            </TouchableOpacity>

            {/* Highlight (like a marker) */}
            <TouchableOpacity
              style={[
                styles.toolButton,
                { backgroundColor: activeFormats.highlight ? '#FFD700' : colors.background }
              ]}
              onPress={onHighlightPress}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="highlight"
                size={20}
                color={activeFormats.highlight ? 'black' : '#FFD700'}
              />
            </TouchableOpacity>

            {/* Bullet Point (•) */}
            <TouchableOpacity
              style={[styles.toolButton, { backgroundColor: colors.background }]}
              onPress={onBulletPress}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="fiber-manual-record"
                size={20}
                color={colors.textPrimary}
              />
            </TouchableOpacity>

            {/* Close Format Mode (X) */}
            <TouchableOpacity
              style={[styles.toolButton, { backgroundColor: colors.background }]}
              onPress={onFormatPress}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="close"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </>
        ) : (
          // Normal mode buttons: Format, Audio, Draw, Image
          <>
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
          </>
        )}
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
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default KeyboardToolbar;