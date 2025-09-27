// Test file to verify sharing functionality
// This can be removed once testing is complete

import { Note } from '../types';
import { shareNote, shareToWhatsApp, shareWithImage } from '../utils/shareUtils';

// Example note for testing
const testNote: Note = {
  id: 'test-123',
  title: 'Nota de Prueba',
  content: 'Este es el contenido de una nota de prueba para verificar la funcionalidad de compartir.',
  category: {
    id: 'default',
    name: 'General',
    color: 'blue'
  },
  type: 'mixed' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  images: [],
  checklistItems: [
    { id: '1', text: 'Tarea completada', completed: true, order: 0 },
    { id: '2', text: 'Tarea pendiente', completed: false, order: 1 },
  ],
  isArchived: false,
  isPinned: false,
  isLocked: false,
};

// Test SVG content (simplified)
const testSVG = `
<svg width="1024" height="768" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f0f0f0"/>
  <text x="50%" y="50%" text-anchor="middle" font-size="24" fill="#333">
    Nota de Prueba
  </text>
</svg>
`;

// Test functions (call these from your component to test)
export async function testBasicShare() {
  console.log('Testing basic share...');
  try {
    await shareNote(testNote);
    console.log('Basic share successful');
  } catch (error) {
    console.error('Basic share failed:', error);
  }
}

export async function testWhatsAppShare() {
  console.log('Testing WhatsApp share...');
  try {
    await shareToWhatsApp(testNote);
    console.log('WhatsApp share successful');
  } catch (error) {
    console.error('WhatsApp share failed:', error);
  }
}

export async function testImageShare() {
  console.log('Testing image share...');
  try {
    await shareWithImage(testNote, testSVG);
    console.log('Image share successful');
  } catch (error) {
    console.error('Image share failed:', error);
  }
}

export { testNote, testSVG };