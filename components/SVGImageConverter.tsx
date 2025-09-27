import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { generateSVGToImageHTML, SVGToImageOptions } from '../utils/svgToImage';

export interface SVGImageConverterProps {
  svgString: string;
  options?: SVGToImageOptions;
  onConversionComplete: (imageData: string) => void;
  onConversionError: (error: string) => void;
  visible?: boolean;
}

export interface ConversionResult {
  success: boolean;
  imageData?: string;
  width?: number;
  height?: number;
  error?: string;
}

export const SVGImageConverter: React.FC<SVGImageConverterProps> = ({
  svgString,
  options = {},
  onConversionComplete,
  onConversionError,
  visible = false
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleWebViewMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as ConversionResult;
      
      if (data.success && data.imageData) {
        onConversionComplete(data.imageData);
      } else {
        onConversionError(data.error || 'Unknown conversion error');
      }
    } catch (error) {
      onConversionError('Failed to parse conversion result');
    } finally {
      setIsLoading(false);
    }
  }, [onConversionComplete, onConversionError]);

  const handleWebViewLoad = useCallback(() => {
    setIsLoading(false);
    // The conversion will start automatically when the page loads
  }, []);

  const handleWebViewError = useCallback(() => {
    setIsLoading(false);
    onConversionError('WebView failed to load');
  }, [onConversionError]);

  const triggerConversion = useCallback(() => {
    if (webViewRef.current) {
      setIsLoading(true);
      webViewRef.current.postMessage('convert');
    }
  }, []);

  const htmlContent = generateSVGToImageHTML(svgString, options);

  return (
    <View style={[styles.container, visible && styles.visible]}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        onMessage={handleWebViewMessage}
        onLoad={handleWebViewLoad}
        onError={handleWebViewError}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Hide scrollbars and prevent user interaction when not visible
        scrollEnabled={visible}
        showsHorizontalScrollIndicator={visible}
        showsVerticalScrollIndicator={visible}
        pointerEvents={visible ? 'auto' : 'none'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    width: 400,
    height: 600,
    opacity: 0,
    zIndex: -1,
  },
  visible: {
    position: 'relative',
    top: 0,
    left: 0,
    opacity: 1,
    zIndex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default SVGImageConverter;