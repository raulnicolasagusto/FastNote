import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  Dimensions 
} from 'react-native';
import { t } from '../utils/i18n';

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
  const handleSizeSelect = (size: 'small' | 'medium' | 'large') => {
    onSelectSize(size);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {t('widgetSizeSelection.title')}
          </Text>
          
          <TouchableOpacity
            style={styles.sizeOption}
            onPress={() => handleSizeSelect('small')}
          >
            <Text style={styles.optionText}>
              {t('widgetSizeSelection.small')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.sizeOption}
            onPress={() => handleSizeSelect('medium')}
          >
            <Text style={styles.optionText}>
              {t('widgetSizeSelection.medium')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.sizeOption}
            onPress={() => handleSizeSelect('large')}
          >
            <Text style={styles.optionText}>
              {t('widgetSizeSelection.large')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>
              {t('common.cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const modalWidth = Math.min(width * 0.8, 300);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: modalWidth,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sizeOption: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    marginTop: 15,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});

export default WidgetSizeSelectionModal;