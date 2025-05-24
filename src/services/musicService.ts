import type { ImageFeatures, Recommendation } from '../types';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const getRecommendation = async (
  imageFeatures: ImageFeatures, 
  genres: string[]
): Promise<Recommendation> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error('User not authenticated');

    // Call the spotify-recommend edge function
    const { data: recommendation, error } = await supabase.functions
      .invoke('spotify-recommend', {
        body: { imageFeatures, genres },
      });

    if (error) throw error;

    // Store the recommendation in the database with user_id
    const { error: dbError } = await supabase
      .from('recommendations')
      .insert({
        user_id: user.id,
        image_features: imageFeatures,
        song_id: recommendation.spotifyUrl.split('/').pop(),
        explanation: recommendation.explanation,
      });

    if (dbError) {
      console.error('Error storing recommendation:', dbError);
      // Continue even if storage fails
    }

    return recommendation as Recommendation;
  } catch (error) {
    console.error('Error getting music recommendation:', error);
    toast.error('Failed to get recommendation. Please try again.');
    throw error;
  }
};