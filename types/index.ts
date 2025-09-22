export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category;
  type: 'text' | 'checklist' | 'mixed';
  createdAt: Date;
  updatedAt: Date;
  images: string[]; // Base64 encoded images
  checklistItems?: ChecklistItem[];
  isArchived: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface NotesState {
  notes: Note[];
  categories: Category[];
  currentCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
}

export interface NotesActions {
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  archiveNote: (id: string) => void;
  setCurrentCategory: (categoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
  loadNotes: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export type NotesStore = NotesState & NotesActions;

// Design system types
export interface ColorScheme {
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  accent: {
    orange: string;
    blue: string;
    green: string;
    purple: string;
    red: string;
  };
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface Typography {
  titleSize: number;
  bodySize: number;
  dateSize: number;
}
