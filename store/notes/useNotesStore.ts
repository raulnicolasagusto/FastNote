import { create } from 'zustand';
import { NotesStore, Note, Category } from '../../types';
import { StorageService } from '../../utils/storage';

export const useNotesStore = create<NotesStore>((set, get) => ({
  // State
  notes: [],
  categories: [],
  currentCategory: null,
  currentFolder: null,
  searchQuery: '',
  isLoading: false,

  // Actions
  addNote: (noteData) => {
    const newNote: Note = {
      ...noteData,
      id: StorageService.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      isLocked: false,
    };

    const notes = [...get().notes, newNote];
    set({ notes });
    StorageService.saveNotes(notes);
    return newNote.id;
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

  togglePinNote: (id) => {
    const notes = get().notes.map((note) =>
      note.id === id ? { ...note, isPinned: !note.isPinned, updatedAt: new Date() } : note
    );
    set({ notes });
    StorageService.saveNotes(notes);
  },

  toggleLockNote: (id) => {
    const notes = get().notes.map((note) =>
      note.id === id ? { ...note, isLocked: !note.isLocked, updatedAt: new Date() } : note
    );
    set({ notes });
    StorageService.saveNotes(notes);
  },

  moveNoteToFolder: (noteId, folderId) => {
    const notes = get().notes.map((note) => {
      if (note.id === noteId) {
        return { ...note, folderId, updatedAt: new Date() };
      }
      return note;
    });
    set({ notes });
    StorageService.saveNotes(notes);
  },

  setNoteReminder: (noteId, reminderDate, notificationId) => {
    console.log('🏪 STORE DEBUG - setNoteReminder called with:', { noteId, reminderDate, notificationId });
    
    const notes = get().notes.map((note) => {
      if (note.id === noteId) {
        const updatedNote = {
          ...note,
          reminderDate: reminderDate || undefined, // Convert null to undefined
          notificationId: reminderDate ? notificationId : undefined, // Keep ID if setting reminder, clear if removing
          updatedAt: new Date()
        };
        console.log('🏪 STORE DEBUG - Note updated:', updatedNote.title, 'reminderDate:', updatedNote.reminderDate);
        return updatedNote;
      }
      return note;
    });
    
    console.log('🏪 STORE DEBUG - Setting new notes state');
    set({ notes });
    StorageService.saveNotes(notes);
    console.log('🏪 STORE DEBUG - Notes saved to storage');
  },

  setCurrentCategory: (categoryId) => {
    set({ currentCategory: categoryId });
  },

  setCurrentFolder: (folderId) => {
    set({ currentFolder: folderId });
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

    // Filter by folder
    if (state.currentFolder && state.currentFolder !== 'all') {
      filtered = filtered.filter((note) => note.folderId === state.currentFolder);
    } else if (state.currentFolder === 'all') {
      // Show only notes that are not assigned to any specific folder
      filtered = filtered.filter((note) => !note.folderId || note.folderId === undefined);
    }

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

    // Sort by pinned status first, then by updated date (newest first)
    return filtered.sort((a, b) => {
      // Pinned notes come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // If both pinned or both not pinned, sort by updated date
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  });
};

// Helper function to format date for search
const formatDateForSearch = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return {
    ddmm: `${day}/${month}`, // 22/09
    ddmmyyyy: `${day}/${month}/${year}`, // 22/09/2024
    mmdd: `${month}/${day}`, // 09/22 (US format)
    mmddyyyy: `${month}/${day}/${year}`, // 09/22/2024
    yyyymmdd: `${year}/${month}/${day}`, // 2024/09/22
    ddmmyy: `${day}/${month}/${year.slice(-2)}`, // 22/09/24
    mmddyy: `${month}/${day}/${year.slice(-2)}`, // 09/22/24
  };
};

// Search utility for advanced search functionality
export const useSearchNotes = (query: string) => {
  return useNotesStore((state) => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const filtered = state.notes.filter((note) => {
      if (note.isArchived) return false;

      // Search in title (higher priority)
      if (note.title.toLowerCase().includes(searchTerm)) return true;

      // Search in content
      if (note.content.toLowerCase().includes(searchTerm)) return true;

      // Search in checklist items
      if (note.checklistItems) {
        const checklistMatch = note.checklistItems.some((item) =>
          item.text.toLowerCase().includes(searchTerm)
        );
        if (checklistMatch) return true;
      }

      // Search in dates (both created and updated)
      const createdDateFormats = formatDateForSearch(note.createdAt);
      const updatedDateFormats = formatDateForSearch(note.updatedAt);

      const dateSearchTerms = [
        ...Object.values(createdDateFormats),
        ...Object.values(updatedDateFormats),
      ];

      const dateMatch = dateSearchTerms.some((dateStr) =>
        dateStr.toLowerCase().includes(searchTerm)
      );

      if (dateMatch) return true;

      return false;
    });

    // Sort by relevance: title matches first, then date matches, then by updated date
    return filtered.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
      const bTitleMatch = b.title.toLowerCase().includes(searchTerm);

      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;

      // Check for date matches as second priority
      const aDateFormats = formatDateForSearch(a.createdAt);
      const bDateFormats = formatDateForSearch(b.createdAt);

      const aDateMatch = Object.values(aDateFormats).some((dateStr) =>
        dateStr.toLowerCase().includes(searchTerm)
      );
      const bDateMatch = Object.values(bDateFormats).some((dateStr) =>
        dateStr.toLowerCase().includes(searchTerm)
      );

      if (aDateMatch && !bDateMatch) return -1;
      if (!aDateMatch && bDateMatch) return 1;

      // If both match or both don't, sort by updated date
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  });
};
