import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Note } from '../types';

interface NativeNoteImageProps {
  note: Note;
  width?: number;
  height?: number;
}

/**
 * A native React Native component that renders note content for image capture
 * This uses View, Text and Image instead of SVG for better compatibility
 */
export const NativeNoteImage: React.FC<NativeNoteImageProps> = ({
  note,
  width = 768,
  height = 768,
}) => {
  // Helper to decode HTML entities
  const decodeHtmlEntities = (text: string): string => {
    return text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  // Helper to detect if URI is audio (we skip audio in image export)
  const isAudioUri = (uri: string): boolean => {
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];
    return audioExtensions.some(ext => uri.toLowerCase().includes(ext));
  };

  // Parse HTML content and return React elements with formatting
  const parseHtmlToElements = (html: string): React.ReactNode[] => {
    if (!html || !html.trim()) return [];

    // If it's plain text (no HTML tags), return as is
    if (!html.includes('<') || !html.includes('>')) {
      return [<Text key="plain" style={styles.content}>{html}</Text>];
    }

    const elements: React.ReactNode[] = [];
    let key = 0;

    // Process text with inline formatting (bold, highlight, headers)
    const processText = (text: string, baseStyle: any = styles.content) => {
      // Handle highlighted text with background color
      if (text.includes('<span') && text.includes('background')) {
        const regex = /<span[^>]*background[^>]*>(.*?)<\/span>/gs;
        const parts: any[] = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
          // Add text before the span
          if (match.index > lastIndex) {
            const beforeText = decodeHtmlEntities(text.substring(lastIndex, match.index).replace(/<[^>]*>/g, ''));
            if (beforeText) {
              parts.push(beforeText);
            }
          }

          // Add highlighted text
          const innerText = decodeHtmlEntities(match[1].replace(/<[^>]*>/g, ''));
          parts.push(
            <Text key={`hl-${key++}`} style={styles.highlightText}>
              {innerText}
            </Text>
          );

          lastIndex = regex.lastIndex;
        }

        // Add remaining text after last span
        if (lastIndex < text.length) {
          const afterText = decodeHtmlEntities(text.substring(lastIndex).replace(/<[^>]*>/g, ''));
          if (afterText) {
            parts.push(afterText);
          }
        }

        return parts.length > 0 ? (
          <Text key={key++} style={baseStyle}>
            {parts}
          </Text>
        ) : null;
      }

      // Check for bold text (handles both <b>, <strong> and inline style)
      if (text.includes('<b>') || text.includes('<strong>') || text.includes('font-weight')) {
        const cleanText = text
          .replace(/<b>/g, '')
          .replace(/<\/b>/g, '')
          .replace(/<strong>/g, '')
          .replace(/<\/strong>/g, '')
          .replace(/<[^>]*>/g, '');
        return (
          <Text key={key++} style={[baseStyle, styles.boldText]}>
            {decodeHtmlEntities(cleanText)}
          </Text>
        );
      }

      // Plain text
      const cleanText = text.replace(/<[^>]*>/g, '');
      return cleanText ? (
        <Text key={key++} style={baseStyle}>
          {decodeHtmlEntities(cleanText)}
        </Text>
      ) : null;
    };

    // Split by major block elements (headers, divs, paragraphs)
    const blocks = html.split(/(<\/?(?:h[1-6]|div|p)[^>]*>)/);

    let currentBlockType: 'h1' | 'h2' | 'h3' | null = null;
    let currentContent = '';

    blocks.forEach(block => {
      if (block.match(/<h1[^>]*>/)) {
        currentBlockType = 'h1';
        currentContent = '';
      } else if (block.match(/<h2[^>]*>/)) {
        currentBlockType = 'h2';
        currentContent = '';
      } else if (block.match(/<h3[^>]*>/)) {
        currentBlockType = 'h3';
        currentContent = '';
      } else if (block.match(/<\/h[1-6]>/)) {
        // End of heading - process accumulated content
        if (currentContent.trim()) {
          const style = currentBlockType === 'h1' ? styles.headerH1 :
                       currentBlockType === 'h2' ? styles.headerH2 : styles.headerH3;
          const processed = processText(currentContent, style);
          if (processed) {
            elements.push(processed);
          }
        }
        currentBlockType = null;
        currentContent = '';
      } else if (block.match(/<\/?(?:div|p)/)) {
        // Skip div/p tags but process any accumulated content
        if (currentContent.trim()) {
          const processed = processText(currentContent);
          if (processed) {
            elements.push(processed);
          }
        }
        currentContent = '';
      } else if (block.trim()) {
        // Accumulate content
        currentContent += block;
      }
    });

    // Process any remaining content
    if (currentContent.trim()) {
      const processed = processText(currentContent);
      if (processed) {
        elements.push(processed);
      }
    }

    return elements;
  };

  // Format note content for display
  const formatNoteContent = (note: Note): {
    title: string;
    richContent: React.ReactNode[];
    checklistItems: string[];
    images: string[];
  } => {
    let richContent: React.ReactNode[] = [];
    let checklistItems: string[] = [];
    let images: string[] = [];

    // Parse rich text content with formatting
    if (note.content && note.content.trim()) {
      richContent = parseHtmlToElements(note.content.trim());
    }

    // Add checklist items
    if (note.checklistItems && note.checklistItems.length > 0) {
      checklistItems = note.checklistItems.map(item => {
        const checkbox = item.completed ? '✅' : '☐';
        return `${checkbox} ${item.text}`;
      });
    }

    // Collect images from both contentBlocks and legacy images array
    const allImages: string[] = [];

    // First, check contentBlocks (NEW system)
    if (note.contentBlocks && note.contentBlocks.length > 0) {
      note.contentBlocks.forEach(block => {
        if (block.type === 'image' && block.uri) {
          // Only add valid image URIs (not audio)
          if (!isAudioUri(block.uri)) {
            allImages.push(block.uri);
          }
        }
      });
    }

    // Then, check legacy images array (LEGACY system)
    if (note.images && note.images.length > 0) {
      note.images.forEach(uri => {
        // Only add valid image URIs (not audio) and avoid duplicates
        if (!isAudioUri(uri) && !allImages.includes(uri)) {
          allImages.push(uri);
        }
      });
    }

    images = allImages;

    return {
      title: note.title || '',
      richContent,
      checklistItems,
      images
    };
  };

  const { title, richContent, checklistItems, images } = formatNoteContent(note);

  // Log for debugging
  React.useEffect(() => {
    console.log('📸 NativeNoteImage rendering:', {
      noteId: note.id,
      title: note.title,
      hasContent: !!note.content,
      hasContentBlocks: !!(note.contentBlocks && note.contentBlocks.length > 0),
      hasLegacyImages: !!(note.images && note.images.length > 0),
      totalImagesFound: images.length,
      imageUris: images.map(uri => uri.substring(0, 50) + '...')
    });
  }, [note, images]);

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Background with border */}
      <View style={styles.border}>
        <View style={styles.innerBorder}>
          <View style={styles.contentArea}>

            {/* Title */}
            {title && (
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
            )}

            {/* Rich Text Content with formatting */}
            {richContent.length > 0 && (
              <View style={styles.richContentContainer}>
                {richContent}
              </View>
            )}

            {/* Images (excluding audio) */}
            {images.length > 0 && (
              <View style={styles.imagesContainer}>
                {images.slice(0, 2).map((imageUri, index) => {
                  console.log(`🖼️ Rendering image ${index}:`, imageUri.substring(0, 80));
                  return (
                    <Image
                      key={index}
                      source={{ uri: imageUri }}
                      style={styles.noteImage}
                      resizeMode="contain"
                      onLoad={() => console.log(`✅ Image ${index} loaded successfully`)}
                      onError={(error) => console.error(`❌ Image ${index} failed to load:`, error.nativeEvent.error)}
                    />
                  );
                })}
              </View>
            )}

            {/* Checklist Items */}
            {checklistItems.length > 0 && (
              <View style={styles.checklistContainer}>
                {checklistItems.slice(0, 6).map((item, index) => (
                  <Text key={index} style={styles.checklistItem} numberOfLines={1}>
                    {item}
                  </Text>
                ))}
              </View>
            )}

            {/* Footer - removed date display */}
            <View style={styles.footer}>
            </View>

          </View>
        </View>

        {/* Bottom branding */}
        <View style={styles.brandingContainer}>
          <Text style={styles.branding}>Created with FastVoiceNote</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 0,
  },
  border: {
    flex: 1,
    borderWidth: 8,
    borderColor: '#2c3e50',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    padding: 16,
    margin: 20,
  },
  innerBorder: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#34495e',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 30, // Increased from 20 to give more horizontal padding
  },
  contentArea: {
    flex: 1,
    justifyContent: 'flex-start',
    maxWidth: 620, // Limit width so text wraps more like in real note (768 - 2*margins - 2*paddings)
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 32,
  },
  richContentContainer: {
    marginBottom: 16,
  },
  content: {
    fontSize: 18,
    color: '#34495e',
    lineHeight: 26,
    marginBottom: 8,
    textAlign: 'left',
  },
  // Rich text formatting styles
  headerH1: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: 32,
    marginBottom: 12,
    marginTop: 8,
  },
  headerH2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: 28,
    marginBottom: 10,
    marginTop: 6,
  },
  headerH3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: 26,
    marginBottom: 8,
    marginTop: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  highlightText: {
    backgroundColor: '#FFEB3B', // Bright yellow for highlight
    paddingHorizontal: 2,
  },
  // Images container
  imagesContainer: {
    marginBottom: 12,
    gap: 8,
  },
  noteImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  checklistContainer: {
    marginBottom: 16,
  },
  checklistItem: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    lineHeight: 22,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'left',
    fontStyle: 'italic',
  },
  brandingContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  branding: {
    fontSize: 16,
    color: '#95a5a6',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default NativeNoteImage;