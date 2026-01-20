// src/types/music.types.ts
import { Track, Album, Artist } from './spotify.types.js';

interface BaseCache {
  spotifyId: string;
  imageUrl: string;
  externalUrl: string;
}

export interface ArtistCache extends BaseCache {
  type: 'artist';
  name: string;
  fullData: Artist;
}

export interface AlbumCache extends BaseCache {
  type: 'album';
  title: string;
  artists: any[];
  fullData: Album;
}

export interface TrackCache extends BaseCache {
  type: 'track';
  title: string;
  artists: any[];
  fullData: Track;
}

export type MusicCacheData = ArtistCache | AlbumCache | TrackCache;

// export interface MusicCacheData {
//   spotifyId: string;
//   name: string;
//   type: 'track' | 'album' | 'artist';
//   imageUrl: string;
//   artistName?: string;
//   externalUrl: string;
//   fullData: Track | Album | Artist;
// }
