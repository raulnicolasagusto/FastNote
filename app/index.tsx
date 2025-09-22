import React from 'react';
import { Stack, router } from 'expo-router';
import { MainScreen } from '../components/layout/MainScreen';
import { Note } from '../types';

export default function Home() {
  const handleNotePress = (note: Note) => {
    // Navigate to note detail/edit screen
    router.push({
      pathname: '/note-detail',
      params: { noteId: note.id },
    });
  };

  const handleNewNotePress = () => {
    // Navigate to new note screen
    router.push('/new-note');
  };

  const handleSearchPress = () => {
    // Navigate to search screen
    router.push('/search');
  };

  const handleMenuPress = () => {
    // Navigate to settings/menu screen
    router.push('/settings');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainScreen
        onNotePress={handleNotePress}
        onNewNotePress={handleNewNotePress}
        onSearchPress={handleSearchPress}
        onMenuPress={handleMenuPress}
      />
    </>
  );
}
