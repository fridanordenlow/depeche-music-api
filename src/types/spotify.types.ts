// types/spotify.types.ts
import { ParsedQs } from 'qs';

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface SpotifyPaginationQuery extends ParsedQs {
  limit?: string;
  offset?: string;
}

export interface ArtistAlbumsQuery extends SpotifyPaginationQuery {
  include_groups?: string;
  market?: string;
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

// Maybe add followers later?
export interface Artist {
  id: string;
  name: string;
  genres: string[]; // Can be empty array
  images: SpotifyImage[];
  followers?: number;
  popularity?: number;
}

export interface Track {
  id: string;
  title: string;
  artists: ArtistReference[];
  album?: AlbumReference;
  durationMs: number;
  previewUrl: string | null; // To be able to play 30 sec previews
  trackNumber: number;
  popularity?: number;
}

export interface AlbumReference {
  id: string;
  title: string;
  artists: ArtistReference[];
  imageUrl: string;
  type: 'album' | 'single' | 'compilation';
}

export interface Album {
  id: string;
  uri: string;
  title: string;
  artists: ArtistReference[];
  type: 'album' | 'single' | 'compilation';
  group?: 'album' | 'single' | 'compilation' | 'appears_on';
  images: SpotifyImage[];
  releaseDate: string;
  totalTracks: number;
  tracks?: PaginatedResponse<Track>;
  //   tracks?: Track[];
  genres?: string[]; // Deprecated - TODO remove
  label?: string;
  popularity?: number;
}

export interface SearchResponse {
  artists: PaginatedResponse<Artist>;
  albums: PaginatedResponse<Album>;
  tracks: PaginatedResponse<Track>;
}

export type AlbumListResponse = PaginatedResponse<Album>;
// export type ArtistAlbumsResponse = PaginatedResponse<Album>;
// export type NewReleasesResponse = PaginatedResponse<Album>;
