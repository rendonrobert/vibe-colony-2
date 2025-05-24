import React from 'react';
import { Music, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn } from '../utils/cn';

const MUSIC_GENRES = [
  { id: 'pop', name: 'Pop', color: 'bg-pink-100 border-pink-300 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/30 dark:border-pink-700 dark:text-pink-300' },
  { id: 'rock', name: 'Rock', color: 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300' },
  { id: 'hip-hop', name: 'Hip Hop', color: 'bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300' },
  { id: 'electronic', name: 'Electronic', color: 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300' },
  { id: 'jazz', name: 'Jazz', color: 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300' },
  { id: 'classical', name: 'Classical', color: 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300' },
  { id: 'r-n-b', name: 'R&B', color: 'bg-indigo-100 border-indigo-300 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300' },
  { id: 'country', name: 'Country', color: 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300' },
  { id: 'reggae', name: 'Reggae', color: 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300' },
  { id: 'folk', name: 'Folk', color: 'bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300' },
  { id: 'metal', name: 'Metal', color: 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 dark:bg-slate-900/30 dark:border-slate-700 dark:text-slate-300' },
  { id: 'blues', name: 'Blues', color: 'bg-cyan-100 border-cyan-300 text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:border-cyan-700 dark:text-cyan-300' },
];

interface GenreSelectionProps {
  onNext: () => void;
  canProceed: boolean;
}

export const GenreSelection: React.FC<GenreSelectionProps> = ({ onNext, canProceed }) => {
  const { selectedGenres, toggleGenre } = useAppStore();

  const handleGenreClick = (genreId: string) => {
    toggleGenre(genreId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-700 mb-4 dark:bg-primary-900/40 dark:text-primary-300">
          <Music size={24} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Select Your Favorite Genres</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose at least one genre to help us find the perfect music match for your image
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {MUSIC_GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreClick(genre.id)}
            className={cn(
              'rounded-lg border py-3 px-4 flex items-center justify-center transition-all duration-200',
              genre.color,
              selectedGenres.includes(genre.id) && 'ring-2 ring-primary-500 dark:ring-primary-400 transform scale-105'
            )}
          >
            <span className="font-medium">{genre.name}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selected: <span className="font-medium text-gray-800 dark:text-gray-200">{selectedGenres.length}</span> genres
        </p>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};