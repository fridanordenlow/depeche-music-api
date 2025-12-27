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
  id: string;
  images: RawImage[];
  name: string;
  popularity: number;
  type: 'artist';
  [key: string]: any; // For undefined or future unknown properties
}

export interface RawTrack {
  album: RawAlbum;
  artists: RawArtist[];
  duration_ms: number;
  id: string;
  name: string;
  preview_url: string | null; // To be able to play 30 sec previews
  track_number: number;
  [key: string]: any;
}

// export interface RawAlbumsResponse {
//   href: string;
//   limit: number;
//   next: string | null;
//   offset: number;
//   previous: string | null;
//   total: number;
//   items: RawAlbum[];
//   [key: string]: any;
// }

// eller? export interface RawAlbumsResponse
export interface RawPaginated<T> {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
  [key: string]: any;
}

export interface RawAlbum {
  album_type: 'album' | 'single' | 'compilation';
  total_tracks: number;
  id: string;
  images: RawImage[];
  name: string;
  release_date: string;
  artists: RawArtist[];

  // Gör dessa valfria?
  tracks: {
    total: number;
    items: RawTrack[];
    [key: string]: any;
  };

  // Gör dessa valfria?
  genres: string[];
  label: string;
  popularity: number;
  [key: string]: any;
}

export interface RawNewReleases {
  albums: RawPaginated<RawAlbum>;
}

// new
export type RawAlbumsResponse = RawPaginated<RawAlbum>;

// export interface RawNewReleases {
//   albums: {
//     limit: number;
//     offset: number;
//     total: number;
//     items: RawAlbum[];
//     [key: string]: any;
//   };
// }
