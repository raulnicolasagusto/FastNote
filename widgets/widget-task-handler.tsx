import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { NoteWidget } from './NoteWidget';
import { Note } from '../types';
import { StorageService } from '../utils/storage';
import { WidgetService } from '../utils/widgetService';

/**
 * Widget Task Handler
 *
 * This function is called when Android needs to render/update the widget.
 * Actions: WIDGET_ADDED, WIDGET_UPDATE, WIDGET_RESIZED, WIDGET_DELETED, WIDGET_CLICK
 */
export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      // Get note ID from widget data or pending storage
      let noteId = widgetInfo.widgetData?.noteId as string | undefined;

      // If no noteId in widget data, check for pending note
      if (!noteId) {
        noteId = await WidgetService.getPendingWidgetNote() || undefined;
      }

      if (!noteId) {
        // Render placeholder widget
        props.renderWidget(
          <NoteWidget
            note={{
              id: 'placeholder',
              title: 'FastNote Widget',
              content: 'Open FastNote, select a note, and tap "Add to Home Screen" from the menu',
              category: { id: '1', name: 'Info', color: '#4A90E2' },
              type: 'text',
              createdAt: new Date(),
              updatedAt: new Date(),
              images: [],
              isArchived: false,
              isPinned: false,
              isLocked: false,
            }}
          />
        );
        break;
      }

      try {
        // Load notes from storage
        const notes = await StorageService.loadNotes();
        const note = notes.find((n) => n.id === noteId);

        if (note) {
          props.renderWidget(<NoteWidget note={note} />);
        } else {
          // Note not found - render error widget
          props.renderWidget(
            <NoteWidget
              note={{
                id: 'error',
                title: 'Note Not Found',
                content: 'This note may have been deleted',
                category: { id: '1', name: 'Error', color: '#E74C3C' },
                type: 'text',
                createdAt: new Date(),
                updatedAt: new Date(),
                images: [],
                isArchived: false,
                isPinned: false,
                isLocked: false,
              }}
            />
          );
        }
      } catch (error) {
        console.error('Widget error:', error);
        props.renderWidget(
          <NoteWidget
            note={{
              id: 'error',
              title: 'Error',
              content: 'Failed to load note data',
              category: { id: '1', name: 'Error', color: '#E74C3C' },
              type: 'text',
              createdAt: new Date(),
              updatedAt: new Date(),
              images: [],
              isArchived: false,
              isPinned: false,
              isLocked: false,
            }}
          />
        );
      }
      break;
    }

    case 'WIDGET_DELETED':
      // Cleanup - could remove stored widget preferences here
      console.log('Widget deleted:', widgetInfo.widgetId);
      break;

    case 'WIDGET_CLICK':
      // Widget was clicked - deep link handled by clickActionData in NoteWidget
      console.log('Widget clicked:', widgetInfo.widgetId);
      break;

    default:
      break;
  }
}
