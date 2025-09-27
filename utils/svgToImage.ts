import { Platform } from 'react-native';

export interface SVGToImageOptions {
  width?: number;
  height?: number;
  format?: 'png' | 'jpeg';
  quality?: number; // 0-1 for jpeg
}

/**
 * Converts SVG string to base64 image using HTML5 Canvas
 * This function generates HTML content that will be loaded in a WebView
 */
export function generateSVGToImageHTML(
  svgString: string,
  options: SVGToImageOptions = {}
): string {
  const {
    width = 400,
    height = 600,
    format = 'png',
    quality = 0.9
  } = options;

  // Clean SVG string - ensure it doesn't have XML declaration conflicts
  const cleanSvgString = svgString
    .replace(/<?xml[^>]*>/g, '') // Remove XML declarations
    .replace(/<!DOCTYPE[^>]*>/g, '') // Remove DOCTYPE
    .trim();

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: transparent;
        }
        canvas {
            border: 1px solid #ddd;
        }
        #svg-container {
            display: none;
        }
    </style>
</head>
<body>
    <canvas id="canvas" width="${width}" height="${height}"></canvas>
    <div id="svg-container">${cleanSvgString}</div>
    
    <script>
        function convertSVGToImage() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            const svgContainer = document.getElementById('svg-container');
            const svgElement = svgContainer.querySelector('svg');
            
            if (!svgElement) {
                console.error('No SVG element found');
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    success: false,
                    error: 'No SVG element found'
                }));
                return;
            }

            // Set SVG dimensions if not specified
            if (!svgElement.hasAttribute('width')) {
                svgElement.setAttribute('width', '${width}');
            }
            if (!svgElement.hasAttribute('height')) {
                svgElement.setAttribute('height', '${height}');
            }

            // Convert SVG to data URL
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
            const DOMURL = window.URL || window.webkitURL;
            const url = DOMURL.createObjectURL(svgBlob);
            
            const img = new Image();
            img.onload = function() {
                try {
                    // Clear canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Set white background for better sharing
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw image to canvas
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    // Convert to base64
                    const mimeType = '${format}' === 'jpeg' ? 'image/jpeg' : 'image/png';
                    const imageData = canvas.toDataURL(mimeType, ${quality});
                    
                    // Clean up
                    DOMURL.revokeObjectURL(url);
                    
                    // Send result back to React Native
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        success: true,
                        imageData: imageData,
                        width: canvas.width,
                        height: canvas.height
                    }));
                    
                } catch (error) {
                    console.error('Canvas conversion error:', error);
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        success: false,
                        error: error.message
                    }));
                }
            };
            
            img.onerror = function(error) {
                console.error('Image load error:', error);
                DOMURL.revokeObjectURL(url);
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    success: false,
                    error: 'Failed to load SVG image'
                }));
            };
            
            img.src = url;
        }
        
        // Start conversion when page loads
        window.addEventListener('load', function() {
            setTimeout(convertSVGToImage, 100);
        });
        
        // Also listen for manual trigger
        window.addEventListener('message', function(event) {
            if (event.data === 'convert') {
                convertSVGToImage();
            }
        });
    </script>
</body>
</html>`;
}

/**
 * Serializes SVG element to string (based on react-native-svg docs)
 */
export function serializeSVGToString(svgElement: any): string {
  if (!svgElement) {
    throw new Error('SVG element is required');
  }

  // This would be used with react-native-svg components
  // The actual implementation would need to be adapted based on 
  // how the SVG is rendered in your React components
  
  // For now, return a placeholder - this will be implemented
  // when we integrate with the actual SVG components
  return svgElement.toString();
}

/**
 * Utility to extract text content and format it for sharing
 */
export function formatNoteForSharing(title: string, content: string): string {
  const timestamp = new Date().toLocaleDateString();
  return `${title}

${content}

Created with FastNote - ${timestamp}`;
}

/**
 * Generate filename for shared image
 */
export function generateImageFilename(title: string, format: 'png' | 'jpeg' = 'png'): string {
  const cleanTitle = title
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .toLowerCase()
    .substring(0, 30); // Limit length
    
  const timestamp = new Date().getTime();
  return `fastnote_${cleanTitle}_${timestamp}.${format}`;
}