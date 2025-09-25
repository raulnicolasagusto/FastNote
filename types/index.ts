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
  isPinned: boolean; // For star functionality
  isLocked: boolean; // For lock functionality
  folderId?: string; // Optional folder assignment
  reminderDate?: Date; // Reminder date and time
  notificationId?: string; // ID for scheduled notification
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

export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotesState {
  notes: Note[];
  categories: Category[];
  currentCategory: string | null;
  currentFolder: string | null;
  searchQuery: string;
  isLoading: boolean;
}

export interface NotesActions {
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  archiveNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  toggleLockNote: (id: string) => void;
  moveNoteToFolder: (noteId: string, folderId: string) => void;
  setNoteReminder: (noteId: string, reminderDate: Date | null, notificationId?: string) => void;
  setCurrentCategory: (categoryId: string | null) => void;
  setCurrentFolder: (folderId: string | null) => void;
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
