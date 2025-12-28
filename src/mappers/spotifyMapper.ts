import {
  Album,
  AlbumReference,
  Artist,
  ArtistReference,
  SpotifyImage,
  PaginatedResponse,
  Track,
} from '../types/spotify.types.js';
import { RawAlbum, RawArtist, RawImage, RawPaginated, RawTrack } from '../types/spotify.raw.js';
import { getPrimaryImageUrl } from '../utils/spotifyApiUtils.js';

/* Mapper functions to convert raw Spotify API data to clean application-specific data structures */

// Simplify name to just raw instead of rawAlbum, rawArtist, etc.
export const mapImages = (rawImages: RawImage[]): SpotifyImage[] => {
  const imagesToClean = rawImages || [];
  return imagesToClean.map((img) => ({
    url: img.url,
    height: img.height,
    width: img.width,
  }));
};

export const mapArtist = (raw: RawArtist): Artist => {
  return {
    id: raw.id,
    name: raw.name || '',
    genres: raw.genres || [],
    images: mapImages(raw.images),
    popularity: raw.popularity || 0,
  };
};

export const mapArtistReference = (raw: RawArtist): ArtistReference => {
  return {
    id: raw.id,
    name: raw.name || '',
  };
};

export const mapAlbum = (raw: RawAlbum): Album => {
  const rawTracksListContainer = raw.tracks || { items: [] };
  return {
    id: raw.id,
    title: raw.name || '',
    artists: (raw.artists || []).map(mapArtistReference),
    type: raw.album_type || 'unknown',
    images: mapImages(raw.images),
    releaseDate: raw.release_date || '',
    totalTracks: raw.total_tracks || 0,
    tracks: (rawTracksListContainer.items || []).map(mapTrack),
    genres: raw.genres || [],
    label: raw.label || '',
    popularity: raw.popularity || 0,
  };
};

export const mapAlbumsReference = (raw: RawAlbum): AlbumReference => {
  return {
    id: raw.id,
    title: raw.name || '',
    artists: (raw.artists || []).map(mapArtistReference),
    imageUrl: getPrimaryImageUrl(raw.images),
    type: raw.album_type || 'unknown',
  };
};

// This function takes the raw paginated response and maps it to my clean paginated response structure
export const mapPaginatedAlbums = (rawResponse: RawPaginated<RawAlbum>): PaginatedResponse<Album> => {
  const items = rawResponse.items || [];
  const cleanItems = items.map(mapAlbum);

  // This is how the "clean" Album now looks like
  return {
    items: cleanItems,
    pagination: {
      limit: rawResponse.limit || 0,
      offset: rawResponse.offset || 0,
      total: rawResponse.total || 0,
    },
  };
};

export const mapTrack = (raw: RawTrack): Track => {
  return {
    id: raw.id,
    title: raw.name || '',
    artists: (raw.artists || []).map(mapArtistReference),
    durationMs: raw.duration_ms || 0,
    previewUrl: raw.preview_url || null,
    trackNumber: raw.track_number || 0,

    // Only add 'album' if raw.album actually exists in the raw data
    // It depends if it's used in album tracks or standalone track fetches
    ...(raw.album && { album: mapAlbumsReference(raw.album) }),
  };
};

// Is this one redundant now?
// export const mapNewReleases = (rawNewRels: RawNewReleases): CleanNewReleases => {
//   const releaseData = rawNewRels.albums || { items: [] };

//   const rawItems = releaseData.items || [];

//   console.log('Mapping new releases:', releaseData);
//   return {
//     items: rawItems.map(mapAlbums),

//     pagination: {
//       limit: releaseData.limit || 0,
//       offset: releaseData.offset || 0,
//       total: releaseData.total || 0,
//     },
//   };
// };
