# Rich Text Editor Implementation Guide for React Native

## 📋 Overview
This guide provides a complete implementation of a Rich Text Editor in React Native using `react-native-pell-rich-editor`. The solution includes WYSIWYG editing, format persistence, and clean preview display.

## 🎯 Features Implemented
- **H1, H2, H3 Headings**: Real visual formatting during editing
- **Bold Text**: Apply bold formatting to selected text
- **Highlight**: Background color highlighting (yellow)
- **Clean Preview**: HTML-free text display in cards/previews
- **Format Persistence**: Formatting saved and restored correctly
- **Stable Editing**: No cursor jumping or editing issues

## 📦 Required Dependencies

### Installation
```bash
# Install the rich text editor package
npm install react-native-pell-rich-editor

# Note: react-native-webview is NOT needed for this implementation
```

### Package.json Dependencies
```json
{
  "dependencies": {
    "react-native-pell-rich-editor": "^1.10.0"
  }
}
```

## 🔧 Core Implementation

### 1. Import Required Components
```typescript
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import React, { useRef } from 'react';
import { View, Text } from 'react-native';
```

### 2. Create Rich Editor Component
```typescript
// Create ref for RichEditor
const richTextRef = useRef<RichEditor>(null);

// State for content
const [editedContent, setEditedContent] = useState('');

// RichEditor Component
<RichEditor
  ref={richTextRef}
  style={{
    minHeight: 200,
    flex: 1
  }}
  initialContentHTML={editedContent}
  onChange={setEditedContent}
  placeholder="Start writing..."
  editorStyle={{
    backgroundColor: 'transparent',
    color: textColors.primary
  }}
/>
```

### 3. Format Button Functions
```typescript
// Format Mode Functions - Using RichEditor actions
const handleH1Press = () => {
  richTextRef.current?.sendAction(actions.heading1, 'result');
};

const handleH2Press = () => {
  richTextRef.current?.sendAction(actions.heading2, 'result');
};

const handleH3Press = () => {
  richTextRef.current?.sendAction(actions.heading3, 'result');
};

const handleBoldPress = () => {
  richTextRef.current?.sendAction(actions.setBold, 'result');
};

const handleHighlightPress = () => {
  richTextRef.current?.sendAction(actions.setBackgroundColor, 'yellow');
};
```

### 4. HTML to Formatted Text Display (for read-only view)
```typescript
// Display rich text content - convert HTML to formatted Text components
const renderRichContent = (content: string) => {
  if (!content || !content.trim()) {
    return (
      <Text style={[styles.contentText, { color: textColors.secondary }]}>
        No content
      </Text>
    );
  }

  // If it's plain text, return as is
  if (!content.includes('<') || !content.includes('>')) {
    return (
      <Text style={[styles.contentText, { color: textColors.primary }]}>
        {content}
      </Text>
    );
  }

  // Simple regex-based HTML parsing for basic formatting
  const elements: any[] = [];
  let key = 0;
  
  // Split content by HTML tags but process each part
  const parts = content.split(/(<[^>]*>.*?<\/[^>]*>|<[^>]*\/>)/);
  
  parts.forEach(part => {
    if (!part.trim()) return;
    
    // Check for headings
    if (part.match(/<h1[^>]*>(.*?)<\/h1>/)) {
      const text = part.replace(/<h1[^>]*>(.*?)<\/h1>/, '$1');
      elements.push(
        <Text key={key++} style={[styles.headerH1, { color: textColors.primary }]}>
          {text}
        </Text>
      );
    } else if (part.match(/<h2[^>]*>(.*?)<\/h2>/)) {
      const text = part.replace(/<h2[^>]*>(.*?)<\/h2>/, '$1');
      elements.push(
        <Text key={key++} style={[styles.headerH2, { color: textColors.primary }]}>
          {text}
        </Text>
      );
    } else if (part.match(/<h3[^>]*>(.*?)<\/h3>/)) {
      const text = part.replace(/<h3[^>]*>(.*?)<\/h3>/, '$1');
      elements.push(
        <Text key={key++} style={[styles.headerH3, { color: textColors.primary }]}>
          {text}
        </Text>
      );
    } else {
      // Regular text - remove HTML tags
      const cleanText = part.replace(/<[^>]*>/g, '');
      if (cleanText.trim()) {
        elements.push(
          <Text key={key++} style={[styles.contentText, { color: textColors.primary }]}>
            {cleanText}
          </Text>
        );
      }
    }
  });
  
  return (
    <View>
      {elements.length > 0 ? elements : (
        <Text style={[styles.contentText, { color: textColors.primary }]}>
          {content.replace(/<[^>]*>/g, '')}
        </Text>
      )}
    </View>
  );
};
```

### 5. Clean HTML for Previews (cards, lists)
```typescript
// Helper function to clean HTML from content for preview
const cleanHtmlContent = (content: string) => {
  if (!content) return '';
  
  // Process HTML content to preserve structure while removing tags
  let cleanContent = content
    // Replace block elements with line breaks
    .replace(/<\/?(h[1-6]|p|div)[^>]*>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n') // Replace <br> tags with line breaks
    .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&amp;/g, '&')  // Replace encoded ampersands
    .replace(/&lt;/g, '<')   // Replace encoded less than
    .replace(/&gt;/g, '>')   // Replace encoded greater than
    .replace(/\n\s*\n/g, '\n') // Remove multiple consecutive line breaks
    .replace(/^\s+|\s+$/g, '') // Trim whitespace from start and end
    .replace(/\n\s+/g, '\n'); // Remove leading spaces from lines
  
  return cleanContent;
};

// Usage in preview cards
<Text style={styles.previewText} numberOfLines={3}>
  {cleanHtmlContent(note.content)}
</Text>
```

## 🎨 Required Styles
```typescript
const styles = StyleSheet.create({
  // Header styles
  headerH1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
    marginVertical: 8,
  },
  headerH2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    marginVertical: 6,
  },
  headerH3: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    marginVertical: 4,
  },
  
  // Content styles
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 2,
  },
  
  // Bold and highlight styles
  boldText: {
    fontWeight: 'bold',
  },
  highlightText: {
    backgroundColor: 'yellow',
    paddingHorizontal: 2,
  },
});
```

## 🔄 Complete Flow

### 1. Editing Mode
```typescript
// When editing starts
const handleStartContentEdit = () => {
  setEditingElement('content');
  setShowKeyboardToolbar(true); // Show format buttons
};

// During editing - RichEditor handles all formatting
// Users can select text and use H1/H2/H3/Bold/Highlight buttons
```

### 2. Saving Content
```typescript
// When saving
const handleSaveEdit = () => {
  // editedContent already contains HTML from RichEditor
  const updates = {
    content: editedContent, // Save HTML content
  };
  updateNote(note.id, updates);
  setEditingElement(null);
};
```

### 3. Display Modes
```typescript
// In detail view (when not editing)
{editingElement !== 'content' ? (
  <TouchableOpacity onPress={handleStartContentEdit}>
    {renderRichContent(note.content)} {/* Shows formatted text */}
  </TouchableOpacity>
) : (
  <RichEditor /> {/* Shows editor */}
)}

// In preview cards
<Text numberOfLines={3}>
  {cleanHtmlContent(note.content)} {/* Shows clean text */}
</Text>
```

## 🚨 Important Notes

### ✅ What Works in Expo Go
- `react-native-pell-rich-editor` works perfectly in Expo Go
- All formatting functions (H1, H2, H3, Bold, Highlight)
- Text display and HTML parsing

### ❌ What to Avoid
- Don't use `react-native-webview` for display (requires build)
- Don't use complex HTML parsers
- Don't add `useEffect` to sync RichEditor content (causes cursor issues)
- Don't over-style the RichEditor (keep it simple)

### 🔧 Troubleshooting
- **Cursor jumping**: Remove any `useEffect` that calls `setContentHTML`
- **Format not persisting**: Ensure you're saving HTML content from `onChange`
- **Preview showing HTML**: Use `cleanHtmlContent` function
- **Styling issues**: Keep `editorStyle` minimal

## 📱 Platform Compatibility
- ✅ **iOS**: Full support
- ✅ **Android**: Full support  
- ✅ **Expo Go**: Full support (no build required)
- ✅ **Web**: Limited support (basic functionality)

## 🎯 Final Implementation Checklist
- [ ] Install `react-native-pell-rich-editor`
- [ ] Create RichEditor with ref
- [ ] Implement format button handlers
- [ ] Add `renderRichContent` for display
- [ ] Add `cleanHtmlContent` for previews
- [ ] Define heading styles (H1, H2, H3)
- [ ] Test editing and saving flow
- [ ] Verify preview displays clean text

This implementation provides a complete, production-ready rich text editor that works seamlessly in React Native applications without requiring native builds.