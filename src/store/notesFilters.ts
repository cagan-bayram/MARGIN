import { create } from 'zustand';

type NotesFiltersState = {
  search: string;
  category: 'all' | 'history' | 'economics' | 'philosophy' | 'psychology' | 'science' | 'technology' | 'fiction' | 'other';
  setSearch: (value: string) => void;
  setCategory: (value: NotesFiltersState['category']) => void;
};

export const useNotesFiltersStore = create<NotesFiltersState>((set) => ({
  search: '',
  category: 'all',
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
}));
