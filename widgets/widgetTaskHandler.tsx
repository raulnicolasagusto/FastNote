import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { NoteWidget } from './NoteWidget';
import type { Note } from '../types';

const NOTES_STORAGE_KEY = '@fastnote_notes';
const WIDGET_PENDING_NOTE_KEY = '@fastnote_widget_pending_note';
const WIDGET_INSTANCE_KEY = '@fastnote_widget_instances'; // Maps widgetId -> noteId

// Get note by ID from AsyncStorage
async function getNoteById(noteId: string): Promise<Note | null> {
  try {
    const stored = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    if (!stored) return null;

    const notes: Note[] = JSON.parse(stored);
    const note = notes.find(n => n.id === noteId);
    return note || null;
  } catch (error) {
    console.error('Error loading note for widget:', error);
    return null;
  }
}

// Save widget instance configuration
async function saveWidgetInstance(widgetId: number, noteId: string): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(WIDGET_INSTANCE_KEY);
    const instances: Record<string, string> = stored ? JSON.parse(stored) : {};
    instances[widgetId.toString()] = noteId;
    await AsyncStorage.setItem(WIDGET_INSTANCE_KEY, JSON.stringify(instances));
    console.log(`✅ Widget instance saved: ${widgetId} -> ${noteId}`);
  } catch (error) {
    console.error('Error saving widget instance:', error);
  }
}

// Get note ID for a widget instance
async function getNoteIdForWidget(widgetId: number): Promise<string | null> {
  try {
    const stored = await AsyncStorage.getItem(WIDGET_INSTANCE_KEY);
    if (!stored) return null;
    const instances: Record<string, string> = JSON.parse(stored);
    return instances[widgetId.toString()] || null;
  } catch (error) {
    console.error('Error getting widget instance:', error);
    return null;
  }
}

// Get pending note ID (the note the user wants to add as widget)
async function getPendingNoteId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(WIDGET_PENDING_NOTE_KEY);
  } catch (error) {
    console.error('Error getting pending note:', error);
    return null;
  }
}

// Main widget task handler
export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetAction = props.widgetAction;
  const widgetId = props.widgetInfo?.widgetId || 0;
  const widgetName = props.widgetInfo?.widgetName || '';

  console.log(`🎨 Widget Task: ${widgetAction} for ID: ${widgetId}, Name: ${widgetName}`);

  switch (widgetAction) {
    case 'WIDGET_ADDED':
      console.log('📱 New widget added!');
      
      // When widget is first added, check for pending note
      const pendingNoteId = await getPendingNoteId();
      
      if (pendingNoteId) {
        console.log(`📌 Using pending note: ${pendingNoteId}`);
        // Save this widget instance with the pending note
        await saveWidgetInstance(widgetId, pendingNoteId);
        
        // Load and render the note
        const pendingNote = await getNoteById(pendingNoteId);
        if (pendingNote) {
          console.log(`✅ Rendering widget for note: ${pendingNote.title}`);
          props.renderWidget(<NoteWidget note={pendingNote} size="medium" />);
        } else {
          console.log('⚠️ Pending note not found');
          props.renderWidget(
            <NoteWidget 
              note={createPlaceholderNote('Note not found', 'This note may have been deleted')} 
              size="medium" 
            />
          );
        }
      } else {
        console.log('⚠️ No pending note, showing placeholder');
        props.renderWidget(
          <NoteWidget 
            note={createPlaceholderNote('Tap to configure', 'Open the app and select a note to display')} 
            size="medium" 
          />
        );
      }
      break;

    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      console.log('🔄 Widget update/resize');
      
      // Get the note ID for this widget instance
      const noteId = await getNoteIdForWidget(widgetId);
      
      if (!noteId) {
        console.log('⚠️ No note configured for this widget');
        props.renderWidget(
          <NoteWidget 
            note={createPlaceholderNote('Tap to configure', 'Open the app and select a note to display')} 
            size="medium" 
          />
        );
        break;
      }

      // Load and render the note
      const note = await getNoteById(noteId);
      
      if (!note) {
        console.log(`⚠️ Note not found: ${noteId}`);
        props.renderWidget(
          <NoteWidget 
            note={createPlaceholderNote('Note not found', 'This note may have been deleted')} 
            size="medium" 
          />
        );
        break;
      }

      console.log(`✅ Rendering widget for note: ${note.title}`);
      props.renderWidget(<NoteWidget note={note} size="medium" />);
      break;

    case 'WIDGET_CLICK':
      console.log('👆 Widget clicked:', props.clickActionData);
      break;

    case 'WIDGET_DELETED':
      console.log('🗑️ Widget deleted');
      // Clean up widget instance when deleted
      try {
        const stored = await AsyncStorage.getItem(WIDGET_INSTANCE_KEY);
        if (stored) {
          const instances: Record<string, string> = JSON.parse(stored);
          delete instances[widgetId.toString()];
          await AsyncStorage.setItem(WIDGET_INSTANCE_KEY, JSON.stringify(instances));
          console.log(`✅ Widget instance deleted: ${widgetId}`);
        }
      } catch (error) {
        console.error('Error deleting widget instance:', error);
      }
      break;

    default:
      console.log('Unknown widget action:', widgetAction);
      break;
  }
}

// Helper function to create placeholder notes
function createPlaceholderNote(title: string, content: string): Note {
  return {
    id: 'placeholder',
    title,
    content,
    type: 'text',
    category: { id: 'personal', name: 'Personal', color: '#4F46E5' },
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    isArchived: false,
    isPinned: false,
    isLocked: false,
  };
}
