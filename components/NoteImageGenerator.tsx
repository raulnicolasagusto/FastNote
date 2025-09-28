import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Rect, Path, Text as SvgText } from 'react-native-svg';
import { Note } from '../types';
import { TYPOGRAPHY } from '../constants/theme';

interface NoteImageGeneratorProps {
  note: Note;
  width?: number;
  height?: number;
}

export const NoteImageGenerator: React.FC<NoteImageGeneratorProps> = ({
  note,
  width = 768,
  height = 768,
}) => {
  // Format note content for display
  const formatNoteContent = (note: Note): string => {
    let content = '';
    
    // Add title
    if (note.title) {
      content += `${note.title}\n\n`;
    }
    
    // Add text content
    if (note.content && note.content.trim()) {
      content += `${note.content.trim()}\n\n`;
    }
    
    // Add checklist items
    if (note.checklistItems && note.checklistItems.length > 0) {
      note.checklistItems.forEach(item => {
        const checkbox = item.completed ? '✅' : '☐';
        content += `${checkbox} ${item.text}\n`;
      });
    }
    
    return content.trim();
  };

  // Split text into lines and limit length
  const formatTextForSVG = (text: string, maxCharsPerLine = 50, maxLines = 20): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Word is longer than max chars, split it
          lines.push(word.substring(0, maxCharsPerLine));
          currentLine = word.substring(maxCharsPerLine);
        }
      }
      
      if (lines.length >= maxLines) {
        break;
      }
    }
    
    if (currentLine && lines.length < maxLines) {
      lines.push(currentLine);
    }
    
    // Add "..." if text was truncated
    if (lines.length === maxLines && words.length > lines.join(' ').split(' ').length) {
      lines[lines.length - 1] = lines[lines.length - 1] + '...';
    }
    
    return lines;
  };

  const noteText = formatNoteContent(note);
  const textLines = formatTextForSVG(noteText, 45, 18);

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background - White fill */}
        <Rect width="100%" height="100%" fill="#ffffff" />
        
        {/* Decorative border frame from the original SVG */}
        <G>
          {/* Frame border paths - simplified version maintaining the elegant look */}
          <Path
            d="M 738 682 C 738 674 731 667 723 667 C 716 667 711 672 711 679 C 711 681 712 682 713 682 C 714 682 716 681 716 679 C 716 675 719 672 723 672 C 729 672 734 676 734 682 C 734 690 728 696 720 696 C 710 696 702 688 702 678 C 702 665 713 655 725 655 L 728 655 L 728 113 L 725 113 C 713 113 702 103 702 90 C 702 80 710 72 720 72 C 728 72 734 78 734 86 C 734 92 729 96 723 96 C 719 96 716 93 716 89 C 716 87 714 86 713 86 C 712 86 711 87 711 89 C 711 96 716 101 723 101 C 732 101 739 94 739 86 C 739 76 730 67 720 67 C 708 67 698 77 698 90 C 698 105 709 117 723 118 L 723 650 C 709 651 698 663 698 678 C 698 690 708 701 720 701 C 730 701 739 692 739 682 Z"
            fill="#000000"
            strokeWidth="0.5"
          />
          <Path
            d="M 70 678 C 70 663 59 651 45 650 L 45 118 C 59 117 70 105 70 90 C 70 78 60 67 48 67 C 38 67 29 76 29 86 C 29 94 36 101 45 101 C 52 101 57 96 57 89 C 57 87 56 86 55 86 C 54 86 52 87 52 89 C 52 93 49 96 45 96 C 39 96 34 92 34 86 C 34 78 40 72 48 72 C 58 72 66 80 66 90 C 66 103 55 113 43 113 L 40 113 L 40 655 L 43 655 C 55 655 66 665 66 678 C 66 688 58 696 48 696 C 40 696 34 690 34 682 C 34 676 39 672 45 672 C 49 672 52 675 52 679 C 52 681 54 682 55 682 C 56 682 57 681 57 679 C 57 672 52 667 45 667 C 36 667 29 674 29 682 C 29 692 38 701 48 701 C 60 701 70 690 70 678 Z"
            fill="#000000"
            strokeWidth="0.5"
          />
        </G>

        {/* Title */}
        <SvgText
          x="80"
          y="180"
          fontSize="24"
          fontWeight="bold"
          fill="#2c3e50"
          fontFamily="Arial, sans-serif"
        >
          {note.title}
        </SvgText>

        {/* Note content */}
        {textLines.map((line, index) => (
          <SvgText
            key={index}
            x="80"
            y={220 + (index * 25)}
            fontSize="16"
            fill="#34495e"
            fontFamily="Arial, sans-serif"
          >
            {line}
          </SvgText>
        ))}

        {/* Date */}
        <SvgText
          x="80"
          y={height - 80}
          fontSize="12"
          fill="#7f8c8d"
          fontFamily="Arial, sans-serif"
        >
          {new Date(note.createdAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </SvgText>

        {/* Bottom text */}
        <SvgText
          x={width/2}
          y={height - 40}
          fontSize="14"
          fontWeight="600"
          fill="#95a5a6"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
        >
          Creado con FastNote
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: -10000, // Hide off-screen
    top: -10000,
  },
  textContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  contentText: {
    fontSize: 16,
    color: '#2a2a2a',
    lineHeight: 24,
    marginBottom: 8,
  },
  footerContainer: {
    marginTop: 'auto',
    paddingTop: 20,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  appText: {
    fontSize: 10,
    color: '#888888',
    fontStyle: 'italic',
  },
  bottomTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
});

export default NoteImageGenerator;