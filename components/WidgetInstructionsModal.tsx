import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  Dimensions,
  ScrollView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { t } from '../utils/i18n';
import { useThemeStore } from '../store/theme/useThemeStore';

interface WidgetInstructionsModalProps {
  visible: boolean;
  onClose: () => void;
  widgetSize: 'small' | 'medium' | 'large';
}

const WidgetInstructionsModal: React.FC<WidgetInstructionsModalProps> = ({
  visible,
  onClose,
  widgetSize
}) => {
  const { colors } = useThemeStore();
  
  const sizeLabels = {
    small: 'Small (2x2)',
    medium: 'Medium (4x2)',
    large: 'Large (4x4)',
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.header}>
            <MaterialIcons name="widgets" size={48} color="#4F46E5" />
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t('widgetInstructions.title')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t('widgetInstructions.subtitle')}
            </Text>
          </View>

          <ScrollView style={styles.stepsContainer}>
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                  {t('widgetInstructions.step1')}
                </Text>
              </View>
            </View>

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                  {t('widgetInstructions.step2')}
                </Text>
              </View>
            </View>

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                  {t('widgetInstructions.step3')}
                </Text>
              </View>
            </View>

            {/* Visual hint */}
            <View style={styles.hintBox}>
              <MaterialIcons name="info-outline" size={20} color="#4F46E5" />
              <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                {t('widgetInstructions.hint')}
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>
              {t('widgetInstructions.understood')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');
const modalWidth = Math.min(width * 0.9, 400);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: modalWidth,
    maxHeight: height * 0.8,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  stepsContainer: {
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 15,
    lineHeight: 22,
  },
  hintBox: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WidgetInstructionsModal;
