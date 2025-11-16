import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { t } from '../../utils/i18n';
import { useLanguage } from '../../utils/useLanguage';

interface InstructionsModalProps {
  visible: boolean;
  onClose: () => void;
}

// Componente de imagen simple
interface InstructionImageProps {
  source: any;
  alignTop?: boolean;
}

function InstructionImage({ source, alignTop = false }: InstructionImageProps) {
  if (alignTop) {
    return (
      <View style={styles.imageTopAlignedContainer}>
        <Image
          source={source}
          style={styles.imageTopAligned}
        />
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={styles.instructionImage}
      resizeMode="cover"
    />
  );
}

// Imágenes pre-cargadas según idioma
const IMAGES = {
  en: {
    voiceNote: require('../../assets/app-instructions/English/VoiceNote.png'),
    voiceNote1: require('../../assets/app-instructions/English/VoiceNote1.png'),
    voiceNote2: require('../../assets/app-instructions/English/VoiceNote2.png'),
    voiceNote3: require('../../assets/app-instructions/English/VoiceNote3.png'),
    voiceNote4_5: require('../../assets/app-instructions/English/VoiceNote4.5.png'),
    voiceNote5: require('../../assets/app-instructions/English/VoiceNote5.png'),
    voiceNote6: require('../../assets/app-instructions/English/VoiceNote6.png'),
  },
  es: {
    // TODO: Agregar imágenes en español cuando estén disponibles
    voiceNote: require('../../assets/app-instructions/English/VoiceNote.png'),
    voiceNote1: require('../../assets/app-instructions/English/VoiceNote1.png'),
    voiceNote2: require('../../assets/app-instructions/English/VoiceNote2.png'),
    voiceNote3: require('../../assets/app-instructions/English/VoiceNote3.png'),
    voiceNote4_5: require('../../assets/app-instructions/English/VoiceNote4.5.png'),
    voiceNote5: require('../../assets/app-instructions/English/VoiceNote5.png'),
    voiceNote6: require('../../assets/app-instructions/English/VoiceNote6.png'),
  },
  pt: {
    // TODO: Agregar imágenes en portugués cuando estén disponibles
    voiceNote: require('../../assets/app-instructions/English/VoiceNote.png'),
    voiceNote1: require('../../assets/app-instructions/English/VoiceNote1.png'),
    voiceNote2: require('../../assets/app-instructions/English/VoiceNote2.png'),
    voiceNote3: require('../../assets/app-instructions/English/VoiceNote3.png'),
    voiceNote4_5: require('../../assets/app-instructions/English/VoiceNote4.5.png'),
    voiceNote5: require('../../assets/app-instructions/English/VoiceNote5.png'),
    voiceNote6: require('../../assets/app-instructions/English/VoiceNote6.png'),
  },
};

export default function InstructionsModal({ visible, onClose }: InstructionsModalProps) {
  useLanguage(); // Re-render on language change
  const { colors, isDarkMode, currentLanguage } = useThemeStore();

  // Obtener imágenes según idioma actual
  const images = IMAGES[currentLanguage as 'en' | 'es' | 'pt'] || IMAGES.en;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.cardBackground }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.textSecondary + '20' }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t('instructions.title')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Instrucción 1: Voice Note */}
            <View style={styles.instructionSection}>
              <Text style={[styles.instructionText, { color: colors.textPrimary }]}>
                {t('instructions.voiceNote.description')}
              </Text>
              <InstructionImage source={images.voiceNote} />
            </View>

            {/* Instrucción 2: Voice Note In App */}
            <View style={styles.instructionSection}>
              <Text style={[styles.instructionText, { color: colors.textPrimary }]}>
                {t('instructions.voiceNoteInApp.description')}
              </Text>
              <InstructionImage source={images.voiceNote1} />
            </View>

            {/* Imágenes adicionales sin texto */}
            <View style={styles.instructionSection}>
              <InstructionImage source={images.voiceNote2} />
            </View>

            <View style={styles.instructionSection}>
              <InstructionImage source={images.voiceNote3} alignTop={true} />
            </View>

            {/* Instrucción 3: OCR Feature */}
            <View style={styles.instructionSection}>
              <Text style={[styles.instructionText, { color: colors.textPrimary }]}>
                {t('instructions.ocrFeature.description')}
              </Text>
              <InstructionImage source={images.voiceNote4_5} alignTop={true} />
            </View>

            {/* Instrucción 4: Audio Transcription */}
            <View style={styles.instructionSection}>
              <Text style={[styles.instructionText, { color: colors.textPrimary }]}>
                {t('instructions.audioTranscription.description')}
              </Text>
              <InstructionImage source={images.voiceNote5} />
            </View>

            {/* Imagen final - alignBottom para mostrar parte inferior */}
            <View style={styles.instructionSection}>
              <View style={styles.imageBottomAlignedContainer}>
                <Image
                  source={images.voiceNote6}
                  style={styles.imageBottomAligned}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    height: '85%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.titleSize,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl * 2,
  },
  instructionSection: {
    marginBottom: SPACING.xl,
  },
  instructionText: {
    fontSize: TYPOGRAPHY.bodySize,
    lineHeight: TYPOGRAPHY.bodySize * 1.5,
    marginBottom: SPACING.md,
  },
  instructionImage: {
    width: '100%',
    height: 280,
    borderRadius: 12,
  },
  imageTopAlignedContainer: {
    width: '100%',
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  imageTopAligned: {
    width: '100%',
    height: undefined,
    aspectRatio: 0.5,
    resizeMode: 'cover',
  },
  imageBottomAlignedContainer: {
    width: '100%',
    height: 350,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageBottomAligned: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
