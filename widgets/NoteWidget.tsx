import React from 'react';
import { FlexWidget, TextWidget, ListWidget } from 'react-native-android-widget';
import { Note } from '../types';

interface NoteWidgetProps {
  note: Note;
}

/**
 * NoteWidget - Widget component for displaying a note on the home screen
 *
 * IMPORTANT: Widgets MUST NOT use hooks. They must be pure functions.
 * Can only use primitives: FlexWidget, TextWidget, ImageWidget, etc.
 */
export function NoteWidget({ note }: NoteWidgetProps) {
  // Strip HTML tags from content for plain text display
  const stripHtml = (html: string): string => {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&')  // Replace &amp; with &
      .trim();
  };

  const plainContent = stripHtml(note.content);

  // Get background color (default to white if not set)
  const backgroundColor = note.backgroundColor || '#FFFFFF';

  // Determine text colors based on background
  const isDarkBackground = backgroundColor.toLowerCase() !== '#ffffff' && backgroundColor.toLowerCase() !== '#f5f5f5';
  const textPrimaryColor = isDarkBackground ? '#1a1a1a' : '#1a1a1a';
  const textSecondaryColor = isDarkBackground ? '#666666' : '#666666';

  // Format date
  const formatDate = (date: Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get first 3 checklist items for display
  const checklistItems = note.checklistItems?.slice(0, 3) || [];
  const hasMoreChecklist = (note.checklistItems?.length || 0) > 3;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: backgroundColor,
        borderRadius: 16,
        padding: 12,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      }}
      clickAction="OPEN_APP"
      clickActionData={{
        noteId: note.id,
      }}
    >
      {/* Header with title and pin indicator */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8,
        }}
      >
        <TextWidget
          text={note.title}
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: textPrimaryColor,
            flex: 1,
            marginRight: 8,
          }}
          maxLines={2}
          ellipsize="end"
        />

        {/* Pin indicator */}
        {note.isPinned && (
          <TextWidget
            text="⭐"
            style={{
              fontSize: 16,
            }}
          />
        )}

        {/* Lock indicator */}
        {note.isLocked && (
          <TextWidget
            text="🔒"
            style={{
              fontSize: 16,
              marginLeft: 4,
            }}
          />
        )}
      </FlexWidget>

      {/* Content or Checklist */}
      {note.type === 'checklist' || (note.type === 'mixed' && checklistItems.length > 0) ? (
        <FlexWidget
          style={{
            flex: 1,
            justifyContent: 'flex-start',
          }}
        >
          {/* Checklist items */}
          {checklistItems.map((item, index) => (
            <FlexWidget
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <TextWidget
                text={item.completed ? '☑' : '☐'}
                style={{
                  fontSize: 14,
                  color: textPrimaryColor,
                  marginRight: 8,
                }}
              />
              <TextWidget
                text={item.text}
                style={{
                  fontSize: 14,
                  color: textSecondaryColor,
                  textDecorationLine: item.completed ? 'line-through' : 'none',
                  opacity: item.completed ? 0.6 : 1.0,
                  flex: 1,
                }}
                maxLines={1}
                ellipsize="end"
              />
            </FlexWidget>
          ))}

          {/* "More items" indicator */}
          {hasMoreChecklist && (
            <TextWidget
              text={`+${(note.checklistItems?.length || 0) - 3} more items...`}
              style={{
                fontSize: 12,
                color: textSecondaryColor,
                fontStyle: 'italic',
                marginTop: 4,
              }}
            />
          )}
        </FlexWidget>
      ) : (
        /* Text content */
        <TextWidget
          text={plainContent || 'No content'}
          style={{
            fontSize: 14,
            color: textSecondaryColor,
            lineHeight: 20,
            flex: 1,
          }}
          maxLines={6}
          ellipsize="end"
        />
      )}

      {/* Footer with date and category */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: textSecondaryColor + '30',
        }}
      >
        <TextWidget
          text={formatDate(note.updatedAt)}
          style={{
            fontSize: 11,
            color: textSecondaryColor,
          }}
        />

        <TextWidget
          text={note.category.name}
          style={{
            fontSize: 11,
            color: note.category.color,
            fontWeight: '500',
          }}
        />
      </FlexWidget>

      {/* Reminder indicator */}
      {note.reminderDate && (
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
            backgroundColor: '#FF6B3520',
            padding: 6,
            borderRadius: 6,
          }}
        >
          <TextWidget
            text="🔔 "
            style={{
              fontSize: 12,
            }}
          />
          <TextWidget
            text={`Reminder: ${formatDate(note.reminderDate)}`}
            style={{
              fontSize: 11,
              color: '#FF6B35',
              fontWeight: '500',
            }}
          />
        </FlexWidget>
      )}
    </FlexWidget>
  );
}
