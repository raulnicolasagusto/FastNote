import { create } from 'zustand';
import { NotesStore, Note, Category } from '../../types';
import { StorageService } from '../../utils/storage';

export const useNotesStore = create<NotesStore>((set, get) => ({
  // State
  notes: [],
  categories: [],
  currentCategory: null,
  searchQuery: '',
  isLoading: false,

  // Actions
  addNote: (noteData) => {
    const newNote: Note = {
      ...noteData,
      id: StorageService.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const notes = [...get().notes, newNote];
    set({ notes });
    StorageService.saveNotes(notes);
  },

  updateNote: (id, updates) => {
    const notes = get().notes.map((note) =>
      note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
    );
    set({ notes });
    StorageService.saveNotes(notes);
  },

  deleteNote: (id) => {
    const notes = get().notes.filter((note) => note.id !== id);
    set({ notes });
    StorageService.saveNotes(notes);
  },

  archiveNote: (id) => {
    const notes = get().notes.map((note) =>
      note.id === id ? { ...note, isArchived: true, updatedAt: new Date() } : note
    );
    set({ notes });
    StorageService.saveNotes(notes);
  },

  setCurrentCategory: (categoryId) => {
    set({ currentCategory: categoryId });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  loadNotes: async () => {
    set({ isLoading: true });
    try {
      const [notes, categories] = await Promise.all([
        StorageService.loadNotes(),
        StorageService.loadCategories(),
      ]);
      set({ notes, categories, isLoading: false });
    } catch (error) {
      console.error('Failed to load notes:', error);
      set({ isLoading: false });
    }
  },

  addCategory: (categoryData) => {
    const newCategory: Category = {
      ...categoryData,
      id: StorageService.generateId(),
    };

    const categories = [...get().categories, newCategory];
    set({ categories });
    StorageService.saveCategories(categories);
  },

  updateCategory: (id, updates) => {
    const categories = get().categories.map((category) =>
      category.id === id ? { ...category, ...updates } : category
    );
    set({ categories });
    StorageService.saveCategories(categories);
  },

  deleteCategory: (id) => {
    const categories = get().categories.filter((category) => category.id !== id);
    set({ categories });
    StorageService.saveCategories(categories);
  },
}));

// Selectors
export const useFilteredNotes = () => {
  return useNotesStore((state) => {
    let filtered = state.notes.filter((note) => !note.isArchived);

    // Filter by category
    if (state.currentCategory) {
      filtered = filtered.filter((note) => note.category.id === state.currentCategory);
    }

    // Filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          (note.checklistItems &&
            note.checklistItems.some((item) => item.text.toLowerCase().includes(query)))
      );
    }

    // Sort by updated date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  });
};
