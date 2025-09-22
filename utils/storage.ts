import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, Category } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/theme';

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

    return [
      {
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
      },
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
      },
    ];
  }
}
