import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import React from 'react';
import { NoteWidget } from './NoteWidget';
import type { Note } from '../types';

// Usamos SharedPreferences nativo
const { NativeModules } = require('react-native');

async function getSelectedNote(): Promise<Note | null> {
  try {
    const RNSharedPreferences = NativeModules.RNSharedPreferences;
    if (!RNSharedPreferences) {
      console.log('⚠️ RNSharedPreferences no disponible');
      return null;
    }

    const noteDataStr = await RNSharedPreferences.getItem('widget_note_data');
    if (!noteDataStr) {
      console.log('⚠️ No hay nota en SharedPreferences');
      return null;
    }

    const noteData = JSON.parse(noteDataStr);
    console.log(`✅ Nota cargada desde SharedPreferences: ${noteData.title}`);
    
    // Convertir a Note completo
    return {
      ...noteData,
      category: { id: 'default', name: 'Default', color: '#4F46E5' },
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [],
      isArchived: false,
      isPinned: false,
      isLocked: false,
    };
  } catch (error) {
    console.error('❌ Error cargando nota desde SharedPreferences:', error);
    return null;
  }
}

function createPlaceholder(title: string, content: string): Note {
  return {
    id: 'placeholder',
    title,
    content,
    type: 'text',
    category: { id: 'default', name: 'Default', color: '#4F46E5' },
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    isArchived: false,
    isPinned: false,
    isLocked: false,
  };
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetAction = props.widgetAction;
  const widgetName = props.widgetInfo?.widgetName || '';

  console.log(`🎨 Widget: ${widgetAction} - ${widgetName}`);

  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      const note = await getSelectedNote();
      
      if (note) {
        console.log(`✅ Renderizando widget con: ${note.title}`);
        props.renderWidget(<NoteWidget note={note} size="medium" />);
      } else {
        console.log('⚠️ Mostrando placeholder');
        props.renderWidget(
          <NoteWidget 
            note={createPlaceholder('No configurado', 'Abre la app y selecciona "Add to Home Screen"')} 
            size="medium" 
          />
        );
      }
      break;

    case 'WIDGET_CLICK':
      console.log('👆 Click en widget');
      break;

    case 'WIDGET_DELETED':
      console.log('🗑️ Widget eliminado');
      break;
  }
}
