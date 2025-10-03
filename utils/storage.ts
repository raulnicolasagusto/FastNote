import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, Category } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/theme';
import i18n from './i18n';

const STORAGE_KEYS = {
  NOTES: 'fastnote_notes',
  CATEGORIES: 'fastnote_categories',
};

export class StorageService {
  static async saveNotes(notes: Note[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, jsonValue);
    } catch (error) {
      console.error('Error saving notes:', error);
      throw new Error('Failed to save notes');
    }
  }

  static async loadNotes(): Promise<Note[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
      if (jsonValue === null) {
        return this.getDefaultNotes();
      }
      const notes = JSON.parse(jsonValue);
      // Convert date strings back to Date objects
      return notes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading notes:', error);
      return this.getDefaultNotes();
    }
  }

  static async saveCategories(categories: Category[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(categories);
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, jsonValue);
    } catch (error) {
      console.error('Error saving categories:', error);
      throw new Error('Failed to save categories');
    }
  }

  static async loadCategories(): Promise<Category[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (jsonValue === null) {
        const defaultCategories = DEFAULT_CATEGORIES;
        await this.saveCategories(defaultCategories);
        return defaultCategories;
      }
      return JSON.parse(jsonValue);
    } catch (error) {
      console.error('Error loading categories:', error);
      return DEFAULT_CATEGORIES;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.NOTES, STORAGE_KEYS.CATEGORIES]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new Error('Failed to clear data');
    }
  }

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Create some default notes matching the design
  private static getDefaultNotes(): Note[] {
    const categories = DEFAULT_CATEGORIES;
    const currentLanguage = i18n.locale || 'en';
    const now = new Date();

    // Welcome notes (first 2 notes, pinned at top)
    const welcomeNotes: Note[] = [];

    if (currentLanguage.startsWith('es')) {
      // Spanish Welcome Notes
      welcomeNotes.push({
        id: this.generateId(),
        title: 'Crea notas con el poder de la voz y la IA',
        content: '<p>Presiona <b>Nota Rápida</b> y di:</p><p>"<i>Nueva lista de supermercado: azúcar, huevos, y leche. Recuérdame mañana a las 7 de la tarde</i>"</p><p>Se creará un checklist con los items para hacer las compras y además se guarda el recordatorio.</p><p>Además puedes agregar items a la lista ya creada diciendo en la nota:</p><p>"<i>Agregar a esta lista pan</i>" o "<i>agregar pan</i>"</p><p>Y automáticamente se agregará a ese checklist.</p>',
        category: categories[1], // Personal
        type: 'text',
        createdAt: new Date(now.getTime() - 10000),
        updatedAt: new Date(now.getTime() - 10000),
        images: [],
        isArchived: false,
        isPinned: true,
        isLocked: false,
        backgroundColor: '#FFF9C4', // Yellow
      });

      welcomeNotes.push({
        id: this.generateId(),
        title: 'Transcribe imágenes con texto usando IA',
        content: '<p>Puedes transcribir imágenes que contengan texto, o puedes sacar foto de algún texto y la IA te lo transcribirá a la nota.</p><p>Usa la opción de <b>cámara</b> 📷 dentro de la nota para capturar texto automáticamente.</p>',
        category: categories[1], // Personal
        type: 'text',
        createdAt: new Date(now.getTime() - 8000),
        updatedAt: new Date(now.getTime() - 8000),
        images: [],
        isArchived: false,
        isPinned: true,
        isLocked: false,
        backgroundColor: '#E1F5FE', // Sky blue
      });
    } else if (currentLanguage.startsWith('pt')) {
      // Portuguese Welcome Notes
      welcomeNotes.push({
        id: this.generateId(),
        title: 'Crie notas com o poder da voz e IA',
        content: '<p>Pressione <b>Nota Rápida</b> e diga:</p><p>"<i>Nova lista de supermercado: açúcar, ovos e leite. Lembre-me amanhã às 7 da tarde</i>"</p><p>Será criada uma lista de tarefas com os itens para fazer as compras e além disso o lembrete será salvo.</p><p>Além disso, você pode adicionar itens à lista já criada dizendo na nota:</p><p>"<i>Adicionar a esta lista pão</i>" ou "<i>adicionar pão</i>"</p><p>E automaticamente será adicionado a essa lista.</p>',
        category: categories[1], // Personal
        type: 'text',
        createdAt: new Date(now.getTime() - 10000),
        updatedAt: new Date(now.getTime() - 10000),
        images: [],
        isArchived: false,
        isPinned: true,
        isLocked: false,
        backgroundColor: '#FFF9C4', // Yellow
      });

      welcomeNotes.push({
        id: this.generateId(),
        title: 'Transcreva imagens com texto usando IA',
        content: '<p>Você pode transcrever imagens que contenham texto, ou pode tirar foto de algum texto e a IA irá transcrevê-lo para a nota.</p><p>Use a opção de <b>câmera</b> 📷 dentro da nota para capturar texto automaticamente.</p>',
        category: categories[1], // Personal
        type: 'text',
        createdAt: new Date(now.getTime() - 8000),
        updatedAt: new Date(now.getTime() - 8000),
        images: [],
        isArchived: false,
        isPinned: true,
        isLocked: false,
        backgroundColor: '#E1F5FE', // Sky blue
      });
    } else {
      // English Welcome Notes (default)
      welcomeNotes.push({
        id: this.generateId(),
        title: 'Create notes with voice and AI power',
        content: '<p>Press <b>Quick Note</b> and say:</p><p>"<i>New grocery list: sugar, eggs, and milk. Remind me tomorrow at 7 PM</i>"</p><p>A checklist will be created with the shopping items and the reminder will be saved.</p><p>You can also add items to an existing list by saying in the note:</p><p>"<i>Add bread to this list</i>" or "<i>add bread</i>"</p><p>And it will be automatically added to that checklist.</p>',
        category: categories[1], // Personal
        type: 'text',
        createdAt: new Date(now.getTime() - 10000),
        updatedAt: new Date(now.getTime() - 10000),
        images: [],
        isArchived: false,
        isPinned: true,
        isLocked: false,
        backgroundColor: '#FFF9C4', // Yellow
      });

      welcomeNotes.push({
        id: this.generateId(),
        title: 'Transcribe images with text using AI',
        content: '<p>You can transcribe images that contain text, or you can take a photo of some text and AI will transcribe it to the note.</p><p>Use the <b>camera</b> 📷 option inside the note to automatically capture text.</p>',
        category: categories[1], // Personal
        type: 'text',
        createdAt: new Date(now.getTime() - 8000),
        updatedAt: new Date(now.getTime() - 8000),
        images: [],
        isArchived: false,
        isPinned: true,
        isLocked: false,
        backgroundColor: '#E1F5FE', // Sky blue
      });
    }

    // Sample notes (existing notes, translated)
    const sampleNotes: Note[] = [];

    if (currentLanguage.startsWith('es')) {
      sampleNotes.push({
        id: this.generateId(),
        title: 'Supermercado',
        content: '',
        category: categories.find((c) => c.id === 'grocery')!,
        type: 'checklist',
        createdAt: new Date('2022-07-28'),
        updatedAt: new Date('2022-07-28'),
        images: [],
        isArchived: false,
        isPinned: false,
        isLocked: false,
        checklistItems: [
          { id: this.generateId(), text: 'Naranjas', completed: false, order: 0 },
          { id: this.generateId(), text: 'Huevos', completed: false, order: 1 },
          { id: this.generateId(), text: 'Papas', completed: false, order: 2 },
          { id: this.generateId(), text: 'Leche', completed: false, order: 3 },
          { id: this.generateId(), text: 'Zanahorias', completed: false, order: 4 },
        ],
      });
    } else if (currentLanguage.startsWith('pt')) {
      sampleNotes.push({
        id: this.generateId(),
        title: 'Supermercado',
        content: '',
        category: categories.find((c) => c.id === 'grocery')!,
        type: 'checklist',
        createdAt: new Date('2022-07-28'),
        updatedAt: new Date('2022-07-28'),
        images: [],
        isArchived: false,
        isPinned: false,
        isLocked: false,
        checklistItems: [
          { id: this.generateId(), text: 'Laranjas', completed: false, order: 0 },
          { id: this.generateId(), text: 'Ovos', completed: false, order: 1 },
          { id: this.generateId(), text: 'Batatas', completed: false, order: 2 },
          { id: this.generateId(), text: 'Leite', completed: false, order: 3 },
          { id: this.generateId(), text: 'Cenouras', completed: false, order: 4 },
        ],
      });
    } else {
      sampleNotes.push({
        id: this.generateId(),
        title: 'Grocery',
        content: '',
        category: categories.find((c) => c.id === 'grocery')!,
        type: 'checklist',
        createdAt: new Date('2022-07-28'),
        updatedAt: new Date('2022-07-28'),
        images: [],
        isArchived: false,
        isPinned: false,
        isLocked: false,
        checklistItems: [
          { id: this.generateId(), text: 'Oranges', completed: false, order: 0 },
          { id: this.generateId(), text: 'Eggs', completed: false, order: 1 },
          { id: this.generateId(), text: 'Potatoes', completed: false, order: 2 },
          { id: this.generateId(), text: 'Milk', completed: false, order: 3 },
          { id: this.generateId(), text: 'Carrots', completed: false, order: 4 },
        ],
      });
    }

    // Rest of sample notes (same for all languages)
    sampleNotes.push(
      {
        id: this.generateId(),
        title: 'Projects',
        content: 'Finish 3 new projects by the end of the...',
        category: categories.find((c) => c.id === 'projects')!,
        type: 'text',
        createdAt: new Date('2022-07-28'),
        updatedAt: new Date('2022-07-28'),
        images: [],
        isArchived: false,
        isPinned: false,
        isLocked: false,
      },
      {
        id: this.generateId(),
        title: 'Goals',
        content:
          'Football Is A Game Played On A Rectangular Field, Between Two Teams Of 11 Players Each. The...',
        category: categories.find((c) => c.id === 'goals')!,
        type: 'text',
        createdAt: new Date('2022-07-28'),
        updatedAt: new Date('2022-07-28'),
        images: [],
        isArchived: false,
        isPinned: false,
        isLocked: false,
      },
      {
        id: this.generateId(),
        title: 'Tennis',
        content:
          'Tennis Is Also One Of The Most Popular Indoor Sports In Many Countries Around The World. Tennis Players...',
        category: categories.find((c) => c.id === 'tennis')!,
        type: 'text',
        createdAt: new Date('2022-07-28'),
        updatedAt: new Date('2022-07-28'),
        images: [],
        isArchived: false,
        isPinned: false,
        isLocked: false,
      },
      {
        id: this.generateId(),
        title: 'To do list',
        content: '',
        category: categories.find((c) => c.id === 'todo')!,
        type: 'checklist',
        createdAt: new Date('2022-07-28'),
        updatedAt: new Date('2022-07-28'),
        images: [],
        isArchived: false,
        isPinned: false,
        isLocked: false,
        checklistItems: [
          { id: this.generateId(), text: 'Go to the gym', completed: false, order: 0 },
          { id: this.generateId(), text: 'Work', completed: false, order: 1 },
          { id: this.generateId(), text: 'Walking', completed: false, order: 2 },
        ],
      },
      {
        id: this.generateId(),
        title: 'Shopping',
        content: '',
        category: categories.find((c) => c.id === 'shopping')!,
        type: 'checklist',
        createdAt: new Date('2022-07-28'),
        updatedAt: new Date('2022-07-28'),
        images: [],
        isArchived: false,
        isPinned: false,
        isLocked: false,
        checklistItems: [
          { id: this.generateId(), text: 'Mango', completed: false, order: 0 },
          { id: this.generateId(), text: 'Apples', completed: false, order: 1 },
          { id: this.generateId(), text: 'Oranges', completed: false, order: 2 },
          { id: this.generateId(), text: 'Eggs', completed: false, order: 3 },
          { id: this.generateId(), text: 'Potatoes', completed: false, order: 4 },
          { id: this.generateId(), text: 'Milk', completed: false, order: 5 },
          { id: this.generateId(), text: 'Carrots', completed: false, order: 6 },
        ],
      }
    );

    // Combine welcome notes (pinned at top) + sample notes
    return [...welcomeNotes, ...sampleNotes];
  }
}
