// src/store/useUIStore.ts
import { create } from 'zustand';

interface HeaderState {
  headerTitle: string;
  setHeaderTitle: (title: string) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  headerTitle: 'Dashboard',
  setHeaderTitle: (title) => set({ headerTitle: title }),
}));