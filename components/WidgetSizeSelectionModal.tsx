import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  Dimensions 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { t } from '../utils/i18n';
import { useThemeStore } from '../store/theme/useThemeStore';

interface WidgetSizeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSize: (size: 'small' | 'medium' | 'large') => void;
}

const WidgetSizeSelectionModal: React.FC<WidgetSizeSelectionModalProps> = ({
  visible,
  onClose,
  onSelectSize
}) => {
  const { colors } = useThemeStore();
  
  const handleSizeSelect = (size: 'small' | 'medium' | 'large') => {
    onSelectSize(size);
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
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
            {t('widgetSizeSelection.title')}
          </Text>
          
          {/* Small Widget */}
          <TouchableOpacity
            style={styles.sizeOption}
            onPress={() => handleSizeSelect('small')}
          >
            <MaterialIcons name="crop-square" size={24} color="#4F46E5" />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                {t('widgetSizeSelection.small')}
              </Text>
              <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                {t('widgetSizeSelection.smallDesc')}
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* Medium Widget */}
          <TouchableOpacity
            style={styles.sizeOption}
            onPress={() => handleSizeSelect('medium')}
          >
            <MaterialIcons name="crop-landscape" size={24} color="#4F46E5" />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                {t('widgetSizeSelection.medium')}
              </Text>
              <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                {t('widgetSizeSelection.mediumDesc')}
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* Large Widget */}
          <TouchableOpacity
            style={styles.sizeOption}
            onPress={() => handleSizeSelect('large')}
          >
            <MaterialIcons name="crop-din" size={24} color="#4F46E5" />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                {t('widgetSizeSelection.large')}
              </Text>
              <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                {t('widgetSizeSelection.largeDesc')}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
              {t('common.cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const modalWidth = Math.min(width * 0.85, 340);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: modalWidth,
    borderRadius: 16,
    padding: 24,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sizeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  optionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 13,
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WidgetSizeSelectionModal;