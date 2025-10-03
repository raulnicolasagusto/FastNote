import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { t } from '../../utils/i18n';
import { useLanguage } from '../../utils/useLanguage';

interface CalloutProps {
  visible: boolean;
  messageKey: string;
  iconName: string;
  onClose?: () => void;
}

export default function Callout({ visible, messageKey, iconName, onClose }: CalloutProps) {
  useLanguage(); // Forzar re-render en cambio de idioma
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

  if (!visible) return null;

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
            {t(messageKey)}
          </Text>
          {onClose && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <MaterialIcons
                name="close"
                size={14}
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
    paddingRight: SPACING.sm, // Extra padding for close button
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
  closeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFF8DC',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DAA520',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});