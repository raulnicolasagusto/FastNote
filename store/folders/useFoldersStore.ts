import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Folder } from '../../types';
import { StorageService } from '../../utils/storage';

interface FoldersState {
  folders: Folder[];
  isLoading: boolean;
}

interface FoldersActions {
  addFolder: (name: string) => string;
  updateFolder: (id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt'>>) => void;
  deleteFolder: (id: string) => void;
  loadFolders: () => Promise<void>;
}

type FoldersStore = FoldersState & FoldersActions;

export const useFoldersStore = create<FoldersStore>()(
  persist(
    (set, get) => ({
      folders: [],
      isLoading: false,

      addFolder: (name: string) => {
        const trimmedName = name.trim();
        if (!trimmedName || trimmedName.length > 50) {
          throw new Error('El nombre de la carpeta debe tener entre 1 y 50 caracteres');
        }

        // Check for duplicate names
        const { folders } = get();
        if (folders.some(folder => folder.name.toLowerCase() === trimmedName.toLowerCase())) {
          throw new Error('Ya existe una carpeta con ese nombre');
        }

        const newFolder: Folder = {
          id: StorageService.generateId(),
          name: trimmedName,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          folders: [...state.folders, newFolder],
        }));

        return newFolder.id;
      },

      updateFolder: (id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt'>>) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id
              ? { ...folder, ...updates, updatedAt: new Date() }
              : folder
          ),
        }));
      },

      deleteFolder: (id: string) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
        }));
      },

      loadFolders: async () => {
        set({ isLoading: true });
        try {
          // Folders are automatically loaded from persistence
          set({ isLoading: false });
        } catch (error) {
          console.error('Error loading folders:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'folders-storage',
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);