import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Note } from '../types';

interface NativeNoteImageProps {
  note: Note;
  width?: number;
  height?: number;
}

/**
 * A native React Native component that renders note content for image capture
 * This uses View, Text and ImageBackground instead of SVG for better compatibility
 */
export const NativeNoteImage: React.FC<NativeNoteImageProps> = ({
  note,
  width = 768,
  height = 768,
}) => {
  // Format note content for display
  const formatNoteContent = (note: Note): { title: string; content: string; checklistItems: string[] } => {
    let content = '';
    let checklistItems: string[] = [];
    
    // Add text content
    if (note.content && note.content.trim()) {
      content = note.content.trim();
    }
    
    // Add checklist items
    if (note.checklistItems && note.checklistItems.length > 0) {
      checklistItems = note.checklistItems.map(item => {
        const checkbox = item.completed ? '✅' : '☐';
        return `${checkbox} ${item.text}`;
      });
    }
    
    return {
      title: note.title || '',
      content,
      checklistItems
    };
  };

  const { title, content, checklistItems } = formatNoteContent(note);

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
            
            {/* Text Content */}
            {content && (
              <Text style={styles.content} numberOfLines={12}>
                {content}
              </Text>
            )}
            
            {/* Checklist Items */}
            {checklistItems.length > 0 && (
              <View style={styles.checklistContainer}>
                {checklistItems.slice(0, 8).map((item, index) => (
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
    padding: 20,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 32,
  },
  content: {
    fontSize: 18,
    color: '#34495e',
    lineHeight: 26,
    marginBottom: 16,
    textAlign: 'left',
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