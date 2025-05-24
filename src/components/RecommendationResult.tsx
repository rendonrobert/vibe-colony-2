import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, RefreshCw, ExternalLink, Volume2 } from 'lucide-react';
import { type Recommendation } from '../types';

interface RecommendationResultProps {
  recommendation: Recommendation;
  onBack: () => void;
  onReset: () => void;
}

export const RecommendationResult: React.FC<RecommendationResultProps> = ({
  recommendation,
  onBack,
  onReset,
}) => {
  const { song, artist, album, albumCover, spotifyUrl, previewUrl, explanation, imageFeatures } = recommendation;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="text-center">
        <motion.h2 
          variants={itemVariants}
          className="text-2xl md:text-3xl font-bold mb-2"
        >
          Your Music Recommendation
        </motion.h2>
        <motion.p 
          variants={itemVariants}
          className="text-gray-600 dark:text-gray-400"
        >
          Based on your image and selected genres
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          variants={itemVariants}
          className="flex flex-col"
        >
          <div className="relative group overflow-hidden rounded-lg mb-4">
            <img 
              src={albumCover || 'https://placehold.co/500x500/1e293b/e2e8f0?text=Album+Art'} 
              alt={`${album} by ${artist}`}
              className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {previewUrl && (
              <button 
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => window.open(previewUrl, '_blank')}
              >
                <div className="bg-white rounded-full p-3">
                  <Volume2 size={24} className="text-black" />
                </div>
              </button>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{song}</h3>
            <p className="text-lg text-gray-700 dark:text-gray-300">{artist}</p>
            <p className="text-gray-600 dark:text-gray-400">Album: {album}</p>
            
            <div className="flex space-x-2 mt-4">
              <a 
                href={spotifyUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Open in Spotify <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Why This Song?</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {explanation}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Detected Image Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {imageFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-700 px-3 py-2 rounded-md text-sm"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="btn btn-outline"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Image
        </button>
        <button
          onClick={onReset}
          className="btn btn-secondary"
        >
          <RefreshCw size={16} className="mr-2" /> Start Over
        </button>
      </div>
    </motion.div>
  );
};