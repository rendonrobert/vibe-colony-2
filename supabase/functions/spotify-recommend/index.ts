import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageFeatures, genres } = await req.json();

    // Get Spotify access token
    const spotifyToken = await getSpotifyToken();

    // Convert image features to audio features for Spotify API
    const audioFeatures = await mapImageToAudioFeatures(imageFeatures);

    // Get recommendations from Spotify
    const recommendations = await getSpotifyRecommendations(spotifyToken, audioFeatures, genres);

    // Generate explanation for the recommendation
    const explanation = await generateExplanation(imageFeatures, recommendations[0]);

    return new Response(
      JSON.stringify({
        ...recommendations[0],
        explanation,
        imageFeatures: imageFeatures,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

async function getSpotifyToken() {
  const clientId = Deno.env.get("SPOTIFY_CLIENT_ID");
  const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify credentials");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

async function mapImageToAudioFeatures(imageFeatures: any) {
  // Map image features to Spotify audio features
  // This would be implemented based on your specific mapping logic
  return {
    valence: 0.5, // Mood positiveness
    energy: 0.5, // Energy level
    danceability: 0.5, // How suitable for dancing
    instrumentalness: 0.5, // Amount of vocals
    tempo: 120, // Speed of the track
  };
}

async function getSpotifyRecommendations(token: string, audioFeatures: any, genres: string[]) {
  const params = new URLSearchParams({
    limit: "1",
    seed_genres: genres.join(","),
    target_valence: audioFeatures.valence.toString(),
    target_energy: audioFeatures.energy.toString(),
    target_danceability: audioFeatures.danceability.toString(),
    target_instrumentalness: audioFeatures.instrumentalness.toString(),
    target_tempo: audioFeatures.tempo.toString(),
  });

  const response = await fetch(
    `https://api.spotify.com/v1/recommendations?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data.tracks.map((track: any) => ({
    song: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    albumCover: track.album.images[0]?.url,
    spotifyUrl: track.external_urls.spotify,
    previewUrl: track.preview_url,
  }));
}

async function generateExplanation(imageFeatures: any, song: any) {
  // Generate a natural language explanation for why this song matches the image
  // This would be implemented using your preferred NLP approach
  return "";
}