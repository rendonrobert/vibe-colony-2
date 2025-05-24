export interface Recommendation {
  song: string;
  artist: string;
  album: string;
  albumCover?: string;
  spotifyUrl: string;
  previewUrl?: string;
  explanation: string;
  imageFeatures: string[];
}

export interface ImageFeatures {
  colors: string[];
  objects: string[];
  mood: string[];
  scene: string;
}