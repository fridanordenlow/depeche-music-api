// types/spotify.types.ts
import { ParsedQs } from 'qs';

// export interface NewReleasesQuery extends ParsedQs {
export interface SpotifyPaginationQuery extends ParsedQs {
  limit?: string;
  offset?: string;
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface ArtistReference {
  id: string;
  name: string;
}

export interface Artist {
  id: string;
  name: string;
  genres: string[]; // Can be empty array
  images: SpotifyImage[];
  popularity: number;
}

export interface Track {
  id: string;
  title: string;
  artists: ArtistReference[];
  album?: AlbumReference;
  durationMs: number;
  previewUrl: string | null; // To be able to play 30 sec previews
  trackNumber: number;
}

export interface AlbumReference {
  id: string;
  title: string;
  artists: ArtistReference[];
  imageUrl: string;
  type: 'album' | 'single' | 'compilation' | 'unknown';
}

export interface Album {
  id: string;
  title: string;
  artists: ArtistReference[];
  type: 'album' | 'single' | 'compilation' | 'unknown';
  images: SpotifyImage[];
  releaseDate: string;
  totalTracks: number;
  tracks: Track[];
  genres: string[];
  label: string;
  popularity: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export type ArtistAlbumsResponse = PaginatedResponse<Album>;
export type NewReleasesResponse = PaginatedResponse<Album>;

// export interface NewReleases {
//   items: Album[];
//   pagination: {
//     limit: number;
//     offset: number;
//     total: number;
//   };
// }
