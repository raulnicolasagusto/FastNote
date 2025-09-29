import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  PanResponder,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import Svg, { Path } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/theme/useThemeStore';

interface DrawingCanvasProps {
  visible: boolean;
  onClose: () => void;
  onSaveDrawing: (imageUri: string) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  visible,
  onClose,
  onSaveDrawing,
}) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);
  const { colors } = useThemeStore();

  const colorOptions = [
    '#000000', '#ff6b6b', '#4ecdc4', '#45b7d1', 
    '#96ceb4', '#ffd93d', '#a8e6cf', '#dda0dd'
  ];

  const brushSizes = [1, 3, 5, 8, 12];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const newPath = `M${locationX.toFixed(2)},${locationY.toFixed(2)}`;
      setCurrentPath(newPath);
    },

    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath(prev => `${prev} L${locationX.toFixed(2)},${locationY.toFixed(2)}`);
    },

    onPanResponderRelease: () => {
      if (currentPath) {
        setPaths(prev => [...prev, `${currentPath}|${currentColor}|${brushSize}`]);
        setCurrentPath('');
      }
    },
  });

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
  };

  const saveDrawing = async () => {
    if (paths.length === 0) {
      onClose();
      return;
    }

    try {
      setIsSaving(true);
      
      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        onSaveDrawing(uri);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving drawing:', error);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const renderPaths = () => {
    const allPaths = [...paths];
    if (currentPath) {
      allPaths.push(`${currentPath}|${currentColor}|${brushSize}`);
    }

    return allPaths.map((pathData, index) => {
      const [pathString, color, size] = pathData.split('|');
      return (
        <Path
          key={index}
          d={pathString}
          stroke={color}
          strokeWidth={parseFloat(size)}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    });
  };

  const handleClose = () => {
    setPaths([]);
    setCurrentPath('');
    onClose();
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
            Crear Dibujo
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Drawing Canvas */}
        <View style={styles.canvasContainer}>
          <ViewShot 
            ref={viewShotRef}
            options={{ format: 'png', quality: 0.9 }}
            style={styles.drawingArea}
          >
            <View
              style={{ backgroundColor: 'white', flex: 1 }}
              {...panResponder.panHandlers}
            >
              <Svg
                width={screenWidth - 32}
                height={screenHeight - 280}
                style={StyleSheet.absoluteFillObject}
              >
                {renderPaths()}
              </Svg>
            </View>
          </ViewShot>
        </View>

        {/* Controls */}
        <View style={[styles.controlsContainer, { backgroundColor: colors.cardBackground }]}>
          {/* Color Picker */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Colores:
            </Text>
            <View style={styles.colorPicker}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setCurrentColor(color)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    currentColor === color && {
                      borderColor: colors.accent.blue,
                      borderWidth: 3,
                    }
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Brush Size */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Tamaño: {brushSize}px
            </Text>
            <View style={styles.brushSizes}>
              {brushSizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setBrushSize(size)}
                  style={[
                    styles.brushOption,
                    {
                      backgroundColor: brushSize === size 
                        ? colors.accent.blue 
                        : colors.cardBackground,
                    }
                  ]}
                >
                  <Text style={[
                    styles.brushText,
                    {
                      color: brushSize === size ? 'white' : colors.textPrimary,
                    }
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={clearCanvas}
              style={[styles.button, styles.clearButton]}
            >
              <MaterialIcons name="clear" size={20} color="white" />
              <Text style={styles.buttonText}>Limpiar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={saveDrawing}
              style={[
                styles.button, 
                { backgroundColor: colors.accent.blue },
                isSaving && { opacity: 0.6 }
              ]}
              disabled={isSaving}
            >
              <MaterialIcons name="save" size={20} color="white" />
              <Text style={styles.buttonText}>
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
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
  canvasContainer: {
    flex: 1,
    padding: 16,
  },
  drawingArea: {
    flex: 1,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  controlsContainer: {
    padding: 16,
    paddingBottom: 32, // Extra padding for Android navigation
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  brushSizes: {
    flexDirection: 'row',
    gap: 8,
  },
  brushOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  brushText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16, // Increased for easier tapping
    borderRadius: 8,
    gap: 8,
    minHeight: 50, // Minimum touch target size
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});