import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '../types';
import { generateNoteSVG } from '../utils/imageGenerator';
import { shareNote, shareToWhatsApp, shareWithImage, showShareOptions } from '../utils/shareUtils';
import ImageConverter from './ImageConverter';

interface ImagePreviewModalProps {
  visible: boolean;
  note: Note | null;
  templateSVG: string;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ImagePreviewModal({ 
  visible, 
  note, 
  templateSVG, 
  onClose 
}: ImagePreviewModalProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [imageData, setImageData] = useState<string>('');

  // Calculate SVG display dimensions to fit screen
  const maxWidth = screenWidth - 40;
  const maxHeight = screenHeight * 0.7;
  const aspectRatio = 1024 / 768; // Original SVG aspect ratio
  
  let displayWidth, displayHeight;
  if (maxWidth / aspectRatio <= maxHeight) {
    displayWidth = maxWidth;
    displayHeight = maxWidth / aspectRatio;
  } else {
    displayHeight = maxHeight;
    displayWidth = maxHeight * aspectRatio;
  }

  // Generate SVG content when modal opens
  useEffect(() => {
    if (visible && note && templateSVG) {
      generateSVGContent();
    }
  }, [visible, note, templateSVG]);

  const generateSVGContent = async () => {
    if (!note) return;
    
    setIsGenerating(true);
    try {
      const svg = await generateNoteSVG(note, templateSVG);
      setSvgContent(svg);
    } catch (error) {
      console.error('Error generating SVG content:', error);
      Alert.alert('Error', 'No se pudo generar la imagen de la nota');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageConversion = (base64Data: string) => {
    setImageData(base64Data);
    console.log('Image converted successfully');
  };

  const handleConversionError = (error: string) => {
    console.error('Image conversion error:', error);
    Alert.alert('Error', 'No se pudo convertir la imagen');
  };

  const captureAndShare = async (shareToWhatsAppDirectly = false) => {
    if (!note) return;

    setIsSharing(true);
    try {
      if (shareToWhatsAppDirectly) {
        // For WhatsApp sharing, use the formatted text with note data
        await shareToWhatsApp(note);
      } else {
        // Show share options with image data if available
        showShareOptions(note, imageData);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'No se pudo compartir');
    } finally {
      setIsSharing(false);
    }
  };

  const handleClose = () => {
    setSvgContent('');
    setImageData('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          
          <Text style={styles.title}>Vista previa</Text>
          
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {isGenerating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B35" />
              <Text style={styles.loadingText}>Generando imagen...</Text>
            </View>
          ) : svgContent ? (
            <View style={styles.previewContainer}>
              <View style={[styles.svgContainer, { width: displayWidth, height: displayHeight }]}>
                <SvgXml 
                  xml={svgContent} 
                  width={displayWidth}
                  height={displayHeight}
                />
              </View>
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>No se pudo cargar la vista previa</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.whatsappButton]}
            onPress={() => captureAndShare(true)}
            disabled={isSharing || isGenerating || !svgContent}
          >
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text style={styles.whatsappButtonText}>
              {isSharing ? 'Compartiendo...' : 'WhatsApp'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={() => captureAndShare(false)}
            disabled={isSharing || isGenerating || !svgContent}
          >
            <Ionicons name="share-outline" size={20} color="#FF6B35" />
            <Text style={styles.shareButtonText}>
              {isSharing ? 'Compartiendo...' : 'Compartir'}
            </Text>
            {imageData && (
              <View style={styles.imageReadyIndicator}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Hidden Image Converter */}
        {svgContent && (
          <ImageConverter
            svgString={svgContent}
            options={{ width: 400, height: 600, format: 'png' }}
            onSuccess={handleImageConversion}
            onError={handleConversionError}
            autoConvert={true}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  whatsappButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  shareButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
  imageReadyIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});