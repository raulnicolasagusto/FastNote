import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { WidgetSize, WIDGET_BG_COLORS, truncateText, stripHtml } from './widgetConfig';
import { Note } from '../types';

interface NoteWidgetProps {
  note: Note;
  size: WidgetSize;
}

export function NoteWidget({ note, size }: NoteWidgetProps) {
  const backgroundColor = note.backgroundColor 
    ? WIDGET_BG_COLORS[note.backgroundColor] || WIDGET_BG_COLORS.default
    : WIDGET_BG_COLORS.default;

  // Get content preview
  const getContentPreview = (): string => {
    if (note.type === 'checklist' && note.checklistItems && note.checklistItems.length > 0) {
      const items = note.checklistItems.slice(0, 3);
      return items.map(item => `${item.completed ? '✓' : '○'} ${item.text}`).join('\n');
    }
    
    if (note.content) {
      const cleanContent = stripHtml(note.content);
      return cleanContent;
    }
    
    return 'Empty note';
  };

  const content = getContentPreview();

  // Small widget: Title only
  if (size === 'small') {
    const title = truncateText(note.title, 30);
    
    return (
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'match_parent',
          backgroundColor: backgroundColor as any,
          padding: 12,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        clickAction="OPEN_URI"
        clickActionData={{ uri: `fastnote://note/${note.id}` }}
      >
        <TextWidget
          text={title}
          style={{
            fontSize: 14,
            color: '#1a1a1a' as any,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        />
      </FlexWidget>
    );
  }

  // Medium widget: Title + preview (2 lines)
  if (size === 'medium') {
    const title = truncateText(note.title, 40);
    const preview = truncateText(content, 2000);

    return (
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'match_parent',
          backgroundColor: backgroundColor as any,
          padding: 12,
          borderRadius: 8,
          flexDirection: 'column',
        }}
        clickAction="OPEN_URI"
        clickActionData={{ uri: `fastnote://note/${note.id}` }}
      >
        <TextWidget
          text={title}
          style={{
            fontSize: 16,
            color: '#1a1a1a' as any,
            fontWeight: 'bold',
            marginBottom: 4,
          }}
        />
        <TextWidget
          text={preview}
          style={{
            fontSize: 12,
            color: '#666666' as any,
          }}
        />
      </FlexWidget>
    );
  }

  // Large widget: Title + full content
  const title = truncateText(note.title, 50);
  const largeContent = truncateText(content, 4000);

  return (
    <FlexWidget
      style={{
        width: 'match_parent',
        height: 'match_parent',
        backgroundColor: backgroundColor as any,
        padding: 16,
        borderRadius: 8,
        flexDirection: 'column',
      }}
      clickAction="OPEN_URI"
      clickActionData={{ uri: `fastnote://note/${note.id}` }}
    >
      <TextWidget
        text={title}
        style={{
          fontSize: 18,
          color: '#1a1a1a' as any,
          fontWeight: 'bold',
          marginBottom: 8,
        }}
      />
      <TextWidget
        text={largeContent}
        style={{
          fontSize: 14,
          color: '#333333' as any,
        }}
      />
    </FlexWidget>
  );
}
