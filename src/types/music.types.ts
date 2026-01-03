import { Track, Album, Artist } from './spotify.types.js';

export interface MusicCacheData {
  spotifyId: string;
  name: string;
  type: 'track' | 'album' | 'artist';
  imageUrl: string;
  artistName?: string;
  externalUrl: string;
  fullData: Track | Album | Artist;
}
