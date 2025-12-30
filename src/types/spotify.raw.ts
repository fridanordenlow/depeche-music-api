// types/spotify.raw.ts
export interface RawImage {
  url: string;
  height: number;
  width: number;
  [key: string]: any;
}

export interface RawArtist {
  followers: { href: string | null; total: number };
  genres: string[]; // Can be empty array
  href: string; // A link to the Web API endpoint providing full details of the artist
  id: string;
  images: RawImage[];
  name: string;
  popularity?: number;
  type: 'artist';
  [key: string]: any; // For undefined or future unknown properties
}

export interface RawTrack {
  album: RawAlbum;
  artists: RawArtist[];
  duration_ms: number;
  id: string;
  name: string;
  popularity: number;
  preview_url: string | null; // To be able to play 30 sec previews
  track_number: number;
  [key: string]: any;
}
export interface RawAlbum {
  album_type: 'album' | 'single' | 'compilation';
  total_tracks: number;
  id: string;
  images: RawImage[];
  name: string;
  release_date: string;
  uri: string;
  artists: RawArtist[];
  album_group?: 'album' | 'single' | 'appears_on' | 'compilation';

  // Because in some Spotify endpoints, the tracks are not included in the response/album object
  tracks?: {
    total: number;
    items: RawTrack[];
    [key: string]: any;
  };

  genres?: string[];
  label?: string;
  popularity?: number;
  [key: string]: any;
}
export interface RawPaginatedResponse<T> {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
  [key: string]: any;
}

// Is this one needed? On the controller/service side we use RawPaginatedResponse<RawAlbum>
export type RawAlbumsResponse = RawPaginatedResponse<RawAlbum>;
export interface RawNewReleases {
  albums: RawAlbumsResponse;
}

export interface RawSearchResponse {
  artists?: RawPaginatedResponse<RawArtist>;
  albums?: RawPaginatedResponse<RawAlbum>;
  tracks?: RawPaginatedResponse<RawTrack>;
}
