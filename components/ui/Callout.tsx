import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';

interface CalloutProps {
  visible: boolean;
  message: string;
  iconName: string;
  keywords?: string[];
  onClose?: () => void;
}

export default function Callout({ visible, message, iconName, keywords, onClose }: CalloutProps) {
  const { colors } = useThemeStore();
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible && fadeAnim._value === 0) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.callout, { borderColor: colors.textSecondary + '20' }]}>
        <View style={styles.content}>
          <MaterialIcons
            name={iconName as any}
            size={20}
            color="#B8860B"
            style={styles.icon}
          />
          <Text style={[styles.message, { color: '#8B6914' }]}>
            {message}
            {keywords && keywords.length > 0 && (
              <Text style={styles.keywords}>
                {' "'}{keywords.join('", "')}{'"'}
              </Text>
            )}
          </Text>
          {onClose && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons
                name="close"
                size={18}
                color="#8B6914"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    zIndex: 1000,
  },
  callout: {
    backgroundColor: '#FFF8DC',
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#DAA520',
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  message: {
    fontSize: TYPOGRAPHY.bodySize,
    lineHeight: TYPOGRAPHY.bodySize * 1.4,
    flex: 1,
    fontWeight: '500',
  },
  keywords: {
    fontStyle: 'italic',
    fontWeight: '400',
  },
  closeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFF8DC',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DAA520',
  },
});