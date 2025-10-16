import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { t, useLanguage } from '../../utils/i18n';

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (imageUri: string) => void;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onImageSelected,
}) => {
  const { colors } = useThemeStore();
  useLanguage(); // Re-render when language changes

  // Función para tomar foto con la cámara
  const handleCamera = async () => {
    try {
      // Solicitar permisos de cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('imagePicker.permissionsRequired'),
          t('imagePicker.cameraPermissionMessage')
        );
        return;
      }

      // Abrir cámara
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8, // Reducir calidad para optimizar tamaño
      });

      if (!result.canceled && result.assets[0]) {
        console.log('📷 Camera photo taken:', result.assets[0].uri);
        onImageSelected(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert(t('imagePicker.error'), t('imagePicker.cameraError'));
    }
  };

  // Función para seleccionar desde galería
  const handleGallery = async () => {
    try {
      // Solicitar permisos de galería
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('imagePicker.permissionsRequired'),
          t('imagePicker.galleryPermissionMessage')
        );
        return;
      }

      // Abrir galería
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8, // Reducir calidad para optimizar tamaño
      });

      if (!result.canceled && result.assets[0]) {
        console.log('🖼️ Gallery photo selected:', result.assets[0].uri);
        onImageSelected(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert(t('imagePicker.error'), t('imagePicker.galleryError'));
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.cardBackground }
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: colors.textPrimary }
            ]}
          >
            {t('imagePicker.title')}
          </Text>

          {/* Opción Cámara */}
          <TouchableOpacity
            style={[
              styles.option,
              { borderBottomColor: colors.textSecondary + '20' }
            ]}
            onPress={handleCamera}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="camera-alt"
              size={24}
              color={colors.accent.blue}
            />
            <Text
              style={[
                styles.optionText,
                { color: colors.textPrimary }
              ]}
            >
              {t('imagePicker.takePhoto')}
            </Text>
          </TouchableOpacity>

          {/* Opción Galería */}
          <TouchableOpacity
            style={styles.option}
            onPress={handleGallery}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="photo-library"
              size={24}
              color={colors.accent.green}
            />
            <Text
              style={[
                styles.optionText,
                { color: colors.textPrimary }
              ]}
            >
              {t('imagePicker.chooseFromGallery')}
            </Text>
          </TouchableOpacity>

          {/* Botón Cancelar */}
          <TouchableOpacity
            style={[
              styles.cancelButton,
              { backgroundColor: colors.textSecondary + '10' }
            ]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.cancelText,
                { color: colors.textSecondary }
              ]}
            >
              {t('imagePicker.cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ImagePickerModal;