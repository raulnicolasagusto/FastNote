import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

// This component is a redirector for deep links
// It redirects from /note/:id to /[noteId] with the correct parameter
export default function NoteRedirector() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      // Navigate to the actual note detail page with the noteId parameter
      router.replace({
        pathname: '/[noteId]',
        params: { noteId: id },
      });
    }
  }, [id, router]);

  // Optionally render a loading state while redirecting
  return null;
}