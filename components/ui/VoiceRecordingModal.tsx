import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { useTranscriptionLimitsStore } from '../../store/transcription/useTranscriptionLimitsStore';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { FREE_TIER_LIMITS } from '../../constants/limits';
import { t } from '../../utils/i18n';

interface VoiceRecordingModalProps {
  visible: boolean;
  isRecording: boolean;
  recordingDuration: number;
  onCancel: () => void;
  onStop: () => void;
}

export const VoiceRecordingModal: React.FC<VoiceRecordingModalProps> = ({
  visible,
  isRecording,
  recordingDuration,
  onCancel,
  onStop,
}) => {
  const { colors } = useThemeStore();
  const { getRemainingTranscriptions } = useTranscriptionLimitsStore();

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <StatusBar style="dark" backgroundColor="rgba(0, 0, 0, 0.5)" />
      <SafeAreaView style={styles.modalContainer}>
        <View style={[styles.recordingModal, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.recordingIndicator}>
            <MaterialIcons
              name="mic"
              size={48}
              color={isRecording ? colors.accent.red : colors.textSecondary}
            />
            <Text style={[styles.recordingText, { color: colors.textPrimary }]}>
              {isRecording ? t('recording.recording') : t('recording.transcribing')}
            </Text>

            {/* Limits Info - Always visible */}
            <View style={styles.limitsContainer}>
              <Text style={[styles.limitsText, { color: colors.textSecondary }]}>
                {t('recording.maxDuration')} • {t('recording.transcriptionsLeft', { count: getRemainingTranscriptions() })}
              </Text>
            </View>

            {/* Timer and Warning */}
            {isRecording && (
              <View style={styles.timerContainer}>
                <Text style={[styles.timerText, {
                  color: recordingDuration >= FREE_TIER_LIMITS.WARNING_THRESHOLD_SECONDS
                    ? colors.accent.red
                    : colors.textPrimary
                }]}>
                  {recordingDuration}s / {FREE_TIER_LIMITS.MAX_DURATION_SECONDS}s
                </Text>
                {recordingDuration >= FREE_TIER_LIMITS.WARNING_THRESHOLD_SECONDS && (
                  <Text style={[styles.warningText, { color: colors.accent.red }]}>
                    {t('recording.autoStopSoon')}
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.recordingActions}>
            <TouchableOpacity
              style={[styles.recordingButton, styles.cancelButton, { backgroundColor: colors.accent.red }]}
              onPress={onCancel}>
              <MaterialIcons name="close" size={24} color={colors.cardBackground} />
              <Text style={[styles.buttonText, { color: colors.cardBackground }]}>{t('common.cancel')}</Text>
            </TouchableOpacity>

            {isRecording && (
              <TouchableOpacity
                style={[styles.recordingButton, styles.confirmButton, { backgroundColor: colors.accent.green }]}
                onPress={onStop}>
                <MaterialIcons name="check" size={24} color={colors.cardBackground} />
                <Text style={[styles.buttonText, { color: colors.cardBackground }]}>{t('recording.stop')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingModal: {
    borderRadius: 16,
    padding: SPACING.xl,
    margin: SPACING.lg,
    alignItems: 'center',
    minWidth: 280,
  },
  recordingIndicator: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  recordingText: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: '600',
    marginTop: SPACING.md,
  },
  limitsContainer: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  limitsText: {
    fontSize: TYPOGRAPHY.captionSize,
    textAlign: 'center',
  },
  timerContainer: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  timerText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
  warningText: {
    fontSize: TYPOGRAPHY.captionSize,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  recordingActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  recordingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  cancelButton: {
    backgroundColor: '#7F8C8D',
  },
  confirmButton: {
    backgroundColor: '#27AE60',
  },
  buttonText: {
    fontSize: TYPOGRAPHY.bodySize,
    fontWeight: '600',
  },
});
