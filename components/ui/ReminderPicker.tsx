import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';

interface ReminderPickerProps {
  visible: boolean;
  currentDate?: Date;
  onClose: () => void;
  onConfirm: (date: Date | null) => void;
}

export default function ReminderPicker({
  visible,
  currentDate,
  onClose,
  onConfirm,
}: ReminderPickerProps) {
  const { colors } = useThemeStore();
  const insets = useSafeAreaInsets();
  const slideAnim = React.useState(new Animated.Value(0))[0];

  const [selectedDate, setSelectedDate] = useState<Date>(currentDate || new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(currentDate || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      if (currentDate) {
        setSelectedDate(currentDate);
        setSelectedTime(currentDate);
      } else {
        const now = new Date();
        now.setHours(now.getHours() + 1); // Default to 1 hour from now
        now.setMinutes(0);
        setSelectedDate(now);
        setSelectedTime(now);
      }

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
  }, [visible, slideAnim, currentDate]);

  const formatDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setSelectedTime(selectedTime);
    }
  };

  const handleConfirm = () => {
    const finalDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );
    onConfirm(finalDate);
    onClose();
  };

  const handleRemove = () => {
    onConfirm(null);
    onClose();
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const opacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity }]}>
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Picker Container */}
        <Animated.View
          style={[
            styles.pickerContainer,
            {
              backgroundColor: colors.cardBackground,
              borderTopColor: colors.textSecondary + '20',
              transform: [{ translateY }],
              paddingBottom: insets.bottom + SPACING.md,
            },
          ]}>

          {/* Handle bar */}
          <View style={[styles.handle, { backgroundColor: colors.textSecondary }]} />

          {/* Title */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Configurar Recordatorio
          </Text>

          {/* Date and Time Selectors */}
          <View style={styles.selectorsContainer}>
            {/* Date Selector */}
            <TouchableOpacity
              style={[styles.selectorButton, { backgroundColor: colors.background }]}
              onPress={() => setShowDatePicker(true)}>
              <MaterialIcons name="calendar-today" size={20} color={colors.textPrimary} />
              <Text style={[styles.selectorText, { color: colors.textPrimary }]}>
                {formatDate(selectedDate)}
              </Text>
            </TouchableOpacity>

            {/* Time Selector */}
            <TouchableOpacity
              style={[styles.selectorButton, { backgroundColor: colors.background }]}
              onPress={() => setShowTimePicker(true)}>
              <MaterialIcons name="access-time" size={20} color={colors.textPrimary} />
              <Text style={[styles.selectorText, { color: colors.textPrimary }]}>
                {formatTime(selectedTime)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            {currentDate && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.accent.red + '15' }]}
                onPress={handleRemove}>
                <Text style={[styles.buttonText, { color: colors.accent.red }]}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.accent.blue + '15' }]}
              onPress={handleConfirm}>
              <Text style={[styles.buttonText, { color: colors.accent.blue }]}>
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Time Picker */}
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}
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
  pickerContainer: {
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
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
    opacity: 0.3,
  },
  title: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  selectorsContainer: {
    marginBottom: SPACING.xl,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectorText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '500',
    marginLeft: SPACING.sm,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
});