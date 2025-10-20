import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { t } from '../../utils/i18n';
import { useLanguage } from '../../utils/useLanguage';

interface AudioRecorderProps {
  visible: boolean;
  onClose: () => void;
  onSaveAudio: (audioUri: string) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  visible,
  onClose,
  onSaveAudio,
}) => {
  useLanguage(); // Re-render on language change
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const { colors } = useThemeStore();

  async function startRecording() {
    try {
      console.log('🎤 Requesting audio permissions...');
      const permission = await Audio.requestPermissionsAsync();
      
      if (permission.status !== 'granted') {
        console.error('Audio permission not granted');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('🎤 Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Update duration every second
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Store interval ID in recording for cleanup
      (recording as any).intervalId = interval;

    } catch (err) {
      console.error('Error starting recording:', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    console.log('🎤 Stopping recording...');
    setIsRecording(false);

    // Clear interval
    if ((recording as any).intervalId) {
      clearInterval((recording as any).intervalId);
    }

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    
    setAudioUri(uri);
    setRecording(null);
    
    console.log('🎤 Recording saved to:', uri);
  }

  async function playSound() {
    if (!audioUri) return;

    try {
      console.log('🔊 Playing audio...');
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  async function saveAudio() {
    if (audioUri) {
      onSaveAudio(audioUri);
      handleClose();
    }
  }

  const handleClose = () => {
    // Cleanup
    if (recording) {
      recording.stopAndUnloadAsync();
      if ((recording as any).intervalId) {
        clearInterval((recording as any).intervalId);
      }
    }
    if (sound) {
      sound.unloadAsync();
    }
    
    // Reset state completely for next time
    setRecording(null);
    setSound(null);
    setAudioUri(null);
    setIsRecording(false);
    setRecordingDuration(0);
    
    onClose();
  };

  // Start recording automatically when modal opens
  useEffect(() => {
    if (visible && !recording && !audioUri) {
      // Small delay to let the modal open smoothly
      const timer = setTimeout(() => {
        startRecording();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={false}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Grabar Audio
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Recording Area */}
        <View style={styles.recordingArea}>
          {/* Microphone Icon */}
          <View style={[styles.micContainer, { 
            backgroundColor: isRecording ? colors.accent.red : colors.cardBackground 
          }]}>
            <MaterialIcons 
              name="mic" 
              size={60} 
              color={isRecording ? 'white' : colors.accent.red}
            />
          </View>

          {/* Recording Duration */}
          <Text style={[styles.duration, { color: colors.textPrimary }]}>
            {formatDuration(recordingDuration)}
          </Text>

          {/* Recording Status */}
          <Text style={[styles.status, { color: colors.textSecondary }]}>
            {isRecording 
              ? 'Grabando... Presiona para detener' 
              : audioUri 
                ? 'Audio grabado correctamente'
                : 'Iniciando grabación...'
            }
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {!audioUri ? (
            // Recording controls - only show stop button since recording starts automatically
            <TouchableOpacity
              style={[
                styles.recordButton,
                { 
                  backgroundColor: colors.accent.red,
                  opacity: isRecording ? 1 : 0.5
                }
              ]}
              onPress={stopRecording}
              disabled={!isRecording}
            >
              <MaterialIcons
                name="stop"
                size={24}
                color="white"
              />
              <Text style={styles.buttonText}>
                {t('recording.stopRecording')}
              </Text>
            </TouchableOpacity>
          ) : (
            // Playback and save controls
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.accent.green }]}
                onPress={playSound}
              >
                <MaterialIcons name="play-arrow" size={20} color="white" />
                <Text style={styles.actionButtonText}>{t('audio.play')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.accent.blue }]}
                onPress={saveAudio}
              >
                <MaterialIcons name="save" size={20} color="white" />
                <Text style={styles.actionButtonText}>{t('audio.save')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.textSecondary }]}
                onPress={() => {
                  setAudioUri(null);
                  setRecordingDuration(0);
                }}
              >
                <MaterialIcons name="refresh" size={20} color="white" />
                <Text style={styles.actionButtonText}>{t('audio.new')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  recordingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  micContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  duration: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  controls: {
    padding: 32,
    paddingBottom: 50,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AudioRecorder;