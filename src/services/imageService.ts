import type { ImageFeatures } from '../types';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const processImage = async (image: File): Promise<ImageFeatures> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error('User not authenticated');

    // Upload image to Supabase Storage with user ID in path
    const filePath = `${user.id}/uploads/${Date.now()}-${image.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, image);

    if (uploadError) throw uploadError;

    // Get the public URL of the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(uploadData.path);

    // Call the analyze-image edge function
    const { data: features, error: analysisError } = await supabase.functions
      .invoke('analyze-image', {
        body: { image: publicUrl },
      });

    if (analysisError) throw analysisError;

    return features as ImageFeatures;
  } catch (error) {
    console.error('Error processing image:', error);
    toast.error('Failed to process image. Please try again.');
    throw error;
  }
};