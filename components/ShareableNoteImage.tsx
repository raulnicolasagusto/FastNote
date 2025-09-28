import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { NoteImageGenerator } from './NoteImageGenerator';
import { Note } from '../types';

interface ShareableNoteImageProps {
  note: Note;
  width?: number;
  height?: number;
}

/**
 * A wrapper component that can be captured by react-native-view-shot
 * This component renders the note in a capturable format
 */
export const ShareableNoteImage = forwardRef<View, ShareableNoteImageProps>(
  ({ note, width = 768, height = 768 }, ref) => {
    return (
      <View 
        ref={ref}
        style={[
          styles.container,
          {
            width,
            height,
          }
        ]}
        collapsable={false}
      >
        <NoteImageGenerator 
          note={note} 
          width={width} 
          height={height} 
        />
      </View>
    );
  }
);

ShareableNoteImage.displayName = 'ShareableNoteImage';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    position: 'absolute',
    left: -10000, // Hide off-screen during capture
    top: -10000,
  },
});

export default ShareableNoteImage;