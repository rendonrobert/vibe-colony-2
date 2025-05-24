# Visual Echo

Visual Echo is a web application that creates a unique bridge between visual and auditory experiences. By analyzing uploaded images and considering user genre preferences, it recommends music that resonates with the visual content.

## Features

- 🎵 Multi-genre music preference selection
- 📸 Drag-and-drop image upload with preview
- 🤖 AI-powered image analysis
- 🎧 Spotify integration for music recommendations
- 🌓 Dark mode support
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Supabase
- **AI Integration**: Supabase AI
- **Music API**: Spotify Web API

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase account
- Spotify Developer account

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Installation

```bash
npm install
npm run dev
```

## Supabase Setup

1. Create a new Supabase project
2. Set up the following tables:

```sql
-- Create recommendations table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  image_url TEXT NOT NULL,
  song_id TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  image_features JSONB NOT NULL
);

-- Enable RLS
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can view their own recommendations"
  ON recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations"
  ON recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

3. Create an Edge Function for Spotify integration:

```typescript
// /supabase/functions/spotify-recommend/index.ts
import { createClient } from '@supabase/supabase-js';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageFeatures, genres } = await req.json();
    
    // Get Spotify access token
    const spotifyToken = await getSpotifyToken();
    
    // Use image features and genres to find matching songs
    const recommendations = await getSpotifyRecommendations(
      spotifyToken,
      imageFeatures,
      genres
    );

    return new Response(
      JSON.stringify(recommendations),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
```

## AI Integration

The application uses Supabase AI to analyze images. Create an Edge Function for image processing:

```typescript
// /supabase/functions/analyze-image/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    // Initialize AI model
    const model = new Supabase.ai.Session('gte-small');
    
    // Generate image embeddings
    const features = await model.run(imageUrl, {
      mean_pool: true,
      normalize: true
    });

    return new Response(
      JSON.stringify(features),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Development Guidelines

- Follow the existing code style and structure
- Use TypeScript for type safety
- Write meaningful commit messages
- Update documentation when adding new features
- Add appropriate error handling
- Test thoroughly before submitting PRs

## License

MIT

## Support

For support, please open an issue in the repository or contact the development team.