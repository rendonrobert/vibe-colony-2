import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { GenreSelection } from './components/GenreSelection';
import { ImageUpload } from './components/ImageUpload';
import { ProcessStep } from './components/ProcessStep';
import { RecommendationResult } from './components/RecommendationResult';
import { AuthModal } from './components/AuthModal';
import { useAppStore } from './store/appStore';
import { processImage } from './services/imageService';
import { getRecommendation } from './services/musicService';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const { selectedGenres, uploadedImage, setRecommendation, recommendation, isProcessing, setIsProcessing } = useAppStore();

  useEffect(() => {
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    setIsAuthenticated(!!user && !error);
  };

  const handleNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleGenerateRecommendation = async () => {
    if (!uploadedImage || selectedGenres.length === 0) return;
    
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Step 1: Process the image to extract features
      const imageFeatures = await processImage(uploadedImage);
      
      // Step 2: Get music recommendation based on image features and genres
      const recommendationResult = await getRecommendation(imageFeatures, selectedGenres);
      
      // Step 3: Store the recommendation result
      setRecommendation(recommendationResult);
      
      // Step 4: Move to the results step
      setActiveStep(3);
    } catch (error) {
      console.error('Error generating recommendation:', error);
      toast.error('Failed to generate recommendation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const canProceedToImageUpload = selectedGenres.length > 0;
  const canProceedToResult = uploadedImage !== null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent gradient-animate">
            Visual Echo
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Discover music that resonates with your visual world
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-4 btn btn-primary"
            >
              Sign In to Get Started
            </button>
          )}
        </header>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 md:space-x-4">
            <ProcessStep 
              number={1} 
              title="Select Genres" 
              isActive={activeStep === 1} 
              isCompleted={activeStep > 1} 
            />
            <div className="h-0.5 w-10 md:w-20 bg-gray-300 dark:bg-gray-700" />
            <ProcessStep 
              number={2} 
              title="Upload Image" 
              isActive={activeStep === 2} 
              isCompleted={activeStep > 2} 
            />
            <div className="h-0.5 w-10 md:w-20 bg-gray-300 dark:bg-gray-700" />
            <ProcessStep 
              number={3} 
              title="Get Recommendation" 
              isActive={activeStep === 3} 
              isCompleted={false} 
            />
          </div>
        </div>

        <div className="card mx-auto max-w-4xl my-8 p-8 transition-all duration-300">
          {activeStep === 1 && (
            <GenreSelection onNext={handleNextStep} canProceed={canProceedToImageUpload} />
          )}
          
          {activeStep === 2 && (
            <ImageUpload 
              onBack={handleBackStep}
              onProcess={handleGenerateRecommendation}
              isProcessing={isProcessing}
              canProceed={canProceedToResult}
            />
          )}
          
          {activeStep === 3 && recommendation && (
            <RecommendationResult 
              recommendation={recommendation}
              onBack={handleBackStep}
              onReset={() => setActiveStep(1)}
            />
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </Layout>
  );
}

export default App;