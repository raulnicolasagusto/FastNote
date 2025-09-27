import { Note } from '../types';

// Constants for SVG template dimensions and content area
const SVG_WIDTH = 1024;
const SVG_HEIGHT = 768;
const CONTENT_AREA = {
  x: 120,  // Starting X position for content
  y: 180,  // Starting Y position for content
  width: 784,  // Width of content area (1024 - 240 for margins)
  height: 448, // Height of content area (768 - 320 for margins)
  maxLines: 22, // Approximate max lines based on font size
};

// Font configuration
const FONT_CONFIG = {
  titleSize: 32,
  contentSize: 24,
  lineHeight: 28,
  titleLineHeight: 38,
  fontFamily: 'Arial, sans-serif',
};

/**
 * Wraps text to fit within specified width by calculating approximate character width
 */
function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const avgCharWidth = fontSize * 0.6; // Approximate character width
  const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth);
  
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
        // Word is too long, break it
        lines.push(word.substring(0, maxCharsPerLine));
        currentLine = word.substring(maxCharsPerLine);
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Formats note content to fit within the template bounds
 */
function formatNoteContent(note: Note): { title: string[], content: string[], truncated: boolean } {
  let availableLines = CONTENT_AREA.maxLines;
  let truncated = false;
  
  // Format title (up to 2 lines)
  const titleLines = wrapText(note.title, CONTENT_AREA.width, FONT_CONFIG.titleSize);
  const finalTitleLines = titleLines.slice(0, 2); // Max 2 lines for title
  availableLines -= finalTitleLines.length;
  availableLines -= 1; // Space between title and content
  
  // Format content
  let contentText = note.content;
  
  // Handle checklist items if present
  if (note.checklistItems && note.checklistItems.length > 0) {
    const listTexts: string[] = [];
    note.checklistItems.forEach(item => {
      const checkbox = item.completed ? '☑' : '☐';
      listTexts.push(`${checkbox} ${item.text}`);
    });
    
    if (listTexts.length > 0) {
      contentText = contentText + '\n\n' + listTexts.join('\n');
    }
  }
  
  const contentLines: string[] = [];
  const contentParagraphs = contentText.split('\n');
  
  for (const paragraph of contentParagraphs) {
    if (paragraph.trim() === '') {
      contentLines.push(''); // Empty line
      availableLines--;
    } else {
      const wrappedLines = wrapText(paragraph, CONTENT_AREA.width, FONT_CONFIG.contentSize);
      for (const line of wrappedLines) {
        if (availableLines <= 0) {
          truncated = true;
          break;
        }
        contentLines.push(line);
        availableLines--;
      }
    }
    
    if (truncated) break;
  }
  
  return {
    title: finalTitleLines,
    content: contentLines,
    truncated
  };
}

/**
 * Generates SVG text elements for the formatted content
 */
export function generateSVGContent(note: Note): string {
  const formatted = formatNoteContent(note);
  let svgContent = '';
  let currentY = CONTENT_AREA.y;
  
  // Add title
  formatted.title.forEach((line, index) => {
    svgContent += `
      <text x="${CONTENT_AREA.x}" y="${currentY}" 
            font-family="${FONT_CONFIG.fontFamily}" 
            font-size="${FONT_CONFIG.titleSize}" 
            font-weight="bold" 
            fill="#2C3E50">${escapeXml(line)}</text>`;
    currentY += FONT_CONFIG.titleLineHeight;
  });
  
  // Add space between title and content
  currentY += FONT_CONFIG.titleLineHeight / 2;
  
  // Add content
  formatted.content.forEach((line, index) => {
    if (line.trim() === '') {
      currentY += FONT_CONFIG.lineHeight / 2; // Half line for empty lines
    } else {
      svgContent += `
        <text x="${CONTENT_AREA.x}" y="${currentY}" 
              font-family="${FONT_CONFIG.fontFamily}" 
              font-size="${FONT_CONFIG.contentSize}" 
              fill="#34495E">${escapeXml(line)}</text>`;
      currentY += FONT_CONFIG.lineHeight;
    }
  });
  
  // Add truncation indicator if needed
  if (formatted.truncated) {
    svgContent += `
      <text x="${CONTENT_AREA.x}" y="${currentY + FONT_CONFIG.lineHeight}" 
            font-family="${FONT_CONFIG.fontFamily}" 
            font-size="${FONT_CONFIG.contentSize}" 
            fill="#7F8C8D" 
            font-style="italic">...</text>`;
  }
  
  return svgContent;
}

/**
 * Escapes XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Combines the SVG template with note content
 */
export async function generateNoteSVG(note: Note, templateSVG: string): Promise<string> {
  try {
    const noteContent = generateSVGContent(note);
    
    // Find the closing </svg> tag and insert content before it
    const svgEndIndex = templateSVG.lastIndexOf('</svg>');
    if (svgEndIndex === -1) {
      throw new Error('Invalid SVG template: no closing </svg> tag found');
    }
    
    const svgWithContent = 
      templateSVG.substring(0, svgEndIndex) +
      noteContent +
      '\n</svg>';
    
    return svgWithContent;
  } catch (error) {
    console.error('Error generating note SVG:', error);
    throw error;
  }
}

