import { create } from 'zustand';
import type { Recommendation } from '../types';

interface AppState {
  selectedGenres: string[];
  uploadedImage: File | null;
  recommendation: Recommendation | null;
  isProcessing: boolean;
  
  // Actions
  toggleGenre: (genreId: string) => void;
  setUploadedImage: (image: File | null) => void;
  setRecommendation: (recommendation: Recommendation) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  resetState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedGenres: [],
  uploadedImage: null,
  recommendation: null,
  isProcessing: false,
  
  toggleGenre: (genreId: string) => set((state) => {
    if (state.selectedGenres.includes(genreId)) {
      return { selectedGenres: state.selectedGenres.filter(id => id !== genreId) };
    } else {
      return { selectedGenres: [...state.selectedGenres, genreId] };
    }
  }),
  
  setUploadedImage: (image: File | null) => set({ uploadedImage: image }),
  
  setRecommendation: (recommendation: Recommendation) => set({ recommendation }),
  
  setIsProcessing: (isProcessing: boolean) => set({ isProcessing }),
  
  resetState: () => set({
    selectedGenres: [],
    uploadedImage: null,
    recommendation: null,
  }),
}));