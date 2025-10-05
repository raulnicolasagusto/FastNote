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
import { t, useLanguage } from '../../utils/i18n';
import { transcribeAudioFile } from '../../utils/audioTranscriptionService';

interface AudioPlayerProps {
  audioUri: string;
  onDelete?: () => void;
  onTranscribe?: (transcribedText: string) => void;
  isSelected?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUri,
  onDelete,
  onTranscribe,
  isSelected = false,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { colors } = useThemeStore();
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

  const handleLongPress = () => {
    if (!onTranscribe) return;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('common.cancel'), t('audio.transcribeToNote')],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleTranscribe();
          }
        }
      );
    } else {
      // Android - usar Alert con botones
      Alert.alert(
        t('audio.transcribeToNote'),
        '',
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('audio.transcribeToNote'), onPress: handleTranscribe },
        ]
      );
    }
  };

  const handleTranscribe = async () => {
    if (!onTranscribe || isTranscribing) return;

    setIsTranscribing(true);

    try {
      const result = await transcribeAudioFile(audioUri);

      if (result.success && result.transcript) {
        onTranscribe(result.transcript);
        Alert.alert(t('alerts.successTitle'), t('audio.transcribed'));
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