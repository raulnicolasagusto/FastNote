import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { convertSVGToImage, SVGToImageOptions } from '../utils/imageConverter';

interface ImageConverterProps {
  svgString: string;
  options?: SVGToImageOptions;
  onSuccess: (imageData: string) => void;
  onError: (error: string) => void;
  autoConvert?: boolean;
}

export const ImageConverter: React.FC<ImageConverterProps> = ({
  svgString,
  options,
  onSuccess,
  onError,
  autoConvert = true
}) => {
  const [isConverting, setIsConverting] = useState(false);

  const convertImage = async () => {
    if (isConverting || !svgString) return;

    setIsConverting(true);
    try {
      console.log('🔄 Iniciando conversión SVG→imagen...');
      const imageData = await convertSVGToImage(svgString, options);
      console.log('✅ Conversión completada');
      onSuccess(imageData);
    } catch (error) {
      console.error('❌ Error en conversión:', error);
      onError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsConverting(false);
    }
  };

  useEffect(() => {
    if (autoConvert && svgString) {
      // Pequeño delay para asegurar que el SVG esté listo
      const timer = setTimeout(convertImage, 100);
      return () => clearTimeout(timer);
    }
  }, [svgString, autoConvert]);

  // Este componente no renderiza nada visible
  return null;
};

export default ImageConverter;