import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActionSheetIOS,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { useTranscriptionLimitsStore } from '../../store/transcription/useTranscriptionLimitsStore';
import { AudioMetadata } from '../../types';
import { t, useLanguage, getCurrentLanguage } from '../../utils/i18n';
import { transcribeAudioFile } from '../../utils/audioTranscriptionService';

interface AudioPlayerProps {
  audioUri: string;
  audioMetadata?: AudioMetadata; // Optional metadata with timestamp and transcription count
  onDelete?: () => void;
  onTranscribe?: (transcribedText: string) => void;
  onUpdateMetadata?: (updatedMetadata: AudioMetadata) => void; // Callback to update transcription count
  isSelected?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUri,
  audioMetadata,
  onDelete,
  onTranscribe,
  onUpdateMetadata,
  isSelected = false,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { colors } = useThemeStore();
  const {
    canTranscribe,
    getRemainingMonthlyMinutes,
    recordTranscription,
    checkAndResetIfNeeded,
  } = useTranscriptionLimitsStore();
  useLanguage(); // Re-render on language change

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUri]);

  const loadAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(sound);
    } catch (error) {
      Alert.alert(t('alerts.errorTitle'), t('alerts.audioLoadError'));
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const togglePlayback = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const formatTime = (millis: number) => {
    const seconds = Math.floor(millis / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRecordedDate = (): string => {
    if (!audioMetadata?.recordedAt) return '';

    const date = new Date(audioMetadata.recordedAt);
    const currentLang = getCurrentLanguage();

    // Format date according to language
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const dateStr = currentLang === 'en'
      ? `${month}/${day}/${year}` // MM/DD/YYYY for English
      : `${day}/${month}/${year}`; // DD/MM/YYYY for Spanish

    return `${dateStr} ${hours}:${minutes}`;
  };

  const handleLongPress = () => {
    if (!onTranscribe && !onDelete) return;

    if (Platform.OS === 'ios') {
      // iOS - ActionSheet con 3 opciones
      const options = [t('common.cancel')];

      if (onTranscribe) options.push(t('audio.transcribe'));
      if (onDelete) options.push(t('audio.deleteAudio'));

      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: t('audio.menuTitle'),
          options,
          destructiveButtonIndex: onDelete ? options.length - 1 : undefined, // Último botón (Delete) en rojo
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1 && onTranscribe) {
            handleTranscribe();
          } else if (buttonIndex === 2 && onDelete) {
            handleDeleteWithConfirmation();
          } else if (buttonIndex === 1 && !onTranscribe && onDelete) {
            handleDeleteWithConfirmation();
          }
        }
      );
    } else {
      // Android - Alert con botones
      const buttons = [];

      if (onTranscribe) {
        buttons.push({ text: t('audio.transcribe'), onPress: handleTranscribe });
      }

      if (onDelete) {
        buttons.push({
          text: t('audio.deleteAudio'),
          onPress: handleDeleteWithConfirmation,
          style: 'destructive' as const
        });
      }

      buttons.push({ text: t('common.cancel'), style: 'cancel' as const });

      Alert.alert(
        t('audio.menuTitle'),
        '',
        buttons
      );
    }
  };

  const handleDeleteWithConfirmation = () => {
    if (!onDelete) return;

    Alert.alert(
      t('audio.deleteConfirmTitle'),
      t('audio.deleteConfirmMessage'),
      [
        { text: t('common.no'), style: 'cancel' },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: () => {
            onDelete();
          }
        }
      ]
    );
  };

  const handleTranscribe = async () => {
    if (!onTranscribe || isTranscribing) return;

    // ⚠️ CRITICAL: Check transcription limits BEFORE transcribing (costs money!)
    // Check if audio has been transcribed 2+ times already
    const currentCount = audioMetadata?.transcriptionCount || 0;
    if (currentCount >= 2) {
      Alert.alert(
        t('audio.transcriptionLimitTitle'),
        t('audio.transcriptionLimitMessage'),
        [{ text: t('common.ok') }]
      );
      return;
    }

    // Check limits before transcribing
    await checkAndResetIfNeeded();

    // Get audio duration in seconds
    const audioDurationSeconds = Math.ceil(duration / 1000);
    const remainingMinutes = getRemainingMonthlyMinutes();
    const remainingSeconds = remainingMinutes * 60;

    // Check if user has enough minutes left
    if (audioDurationSeconds > remainingSeconds) {
      Alert.alert(
        t('recording.monthlyLimitReached'),
        t('audio.insufficientMinutes', {
          needed: Math.ceil(audioDurationSeconds / 60),
          available: remainingMinutes,
        }),
        [{ text: t('common.ok') }]
      );
      return;
    }

    // Check daily limit
    if (!canTranscribe()) {
      Alert.alert(
        t('recording.dailyLimitReached'),
        t('audio.dailyLimitInfo', { minutes: remainingMinutes }),
        [{ text: t('common.ok') }]
      );
      return;
    }

    setIsTranscribing(true);

    try {
      const result = await transcribeAudioFile(audioUri);

      if (result.success && result.transcript) {
        // Only record transcription if we got meaningful text (not just empty or unclear response)
        const trimmedTranscript = result.transcript.trim();
        if (trimmedTranscript && trimmedTranscript.length > 3) { // At least 4 characters for meaningful content
          // ⚠️ CRITICAL: Record transcription usage (costs money!)
          await recordTranscription(audioDurationSeconds);
          console.log(`🎤 Recorded audio transcription: ${audioDurationSeconds}s`);

          // Update transcription count
          if (audioMetadata && onUpdateMetadata) {
            const updatedMetadata: AudioMetadata = {
              ...audioMetadata,
              transcriptionCount: audioMetadata.transcriptionCount + 1,
            };
            onUpdateMetadata(updatedMetadata);
            console.log(`🎤 Updated transcription count: ${updatedMetadata.transcriptionCount}/2`);
          }

          onTranscribe(result.transcript);
          Alert.alert(t('alerts.successTitle'), t('audio.transcribed'));
        } else {
          // Transcription returned empty or unclear result
          Alert.alert(t('alerts.errorTitle'), t('audio.transcriptionFailed'));
          console.log('⚠️ Audio transcription returned empty/unusable result, not recording to limits');
        }
      } else {
        // Manejo de errores específicos
        if (result.error === 'DEEPGRAM_API_KEY_MISSING') {
          Alert.alert(t('alerts.errorTitle'), t('alerts.deepgramApiKeyMissing'));
        } else {
          Alert.alert(t('alerts.errorTitle'), t('audio.transcriptionFailed'));
        }
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      Alert.alert(t('alerts.errorTitle'), t('audio.transcriptionFailed'));
    } finally {
      setIsTranscribing(false);
    }
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.cardBackground }]}
      onLongPress={handleLongPress}
      delayLongPress={500}
      activeOpacity={0.7}
      disabled={isTranscribing}
    >
      {/* Play/Pause Button */}
      <TouchableOpacity
        style={[styles.playButton, { backgroundColor: colors.accent.blue }]}
        onPress={togglePlayback}
        disabled={isTranscribing}
      >
        <MaterialIcons
          name={isPlaying ? "pause" : "play-arrow"}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      {/* Audio Info */}
      <View style={styles.audioInfo}>
        {/* Recorded Date/Time - if available */}
        {audioMetadata?.recordedAt && (
          <View style={styles.recordedDateContainer}>
            <MaterialIcons name="access-time" size={12} color={colors.textSecondary} />
            <Text style={[styles.recordedDateText, { color: colors.textSecondary }]}>
              {formatRecordedDate()}
            </Text>
            {audioMetadata.transcriptionCount > 0 && (
              <Text style={[styles.transcriptionCountBadge, { color: colors.accent.orange }]}>
                ({audioMetadata.transcriptionCount}/2)
              </Text>
            )}
          </View>
        )}

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.textSecondary + '20' }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.accent.blue,
                  width: `${progressPercentage}%`
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatTime(position)}
          </Text>
          <MaterialIcons name="audiotrack" size={16} color={colors.textSecondary} />
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Transcribing Indicator */}
      {isTranscribing && (
        <View style={styles.transcribingContainer}>
          <ActivityIndicator size="small" color={colors.accent.blue} />
          <Text style={[styles.transcribingText, { color: colors.textSecondary }]}>
            {t('audio.transcribing')}
          </Text>
        </View>
      )}

      {/* Delete Button - only show if selected and not transcribing */}
      {isSelected && onDelete && !isTranscribing && (
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.accent.red }]}
          onPress={onDelete}
        >
          <MaterialIcons name="delete" size={20} color="white" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  audioInfo: {
    flex: 1,
  },
  recordedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  recordedDateText: {
    fontSize: 10,
    fontWeight: '500',
  },
  transcriptionCountBadge: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 6,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  transcribingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 6,
  },
  transcribingText: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default AudioPlayer;