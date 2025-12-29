import {
  Album,
  AlbumReference,
  Artist,
  ArtistReference,
  SpotifyImage,
  PaginatedResponse,
  Track,
} from '../types/spotify.types.js';
import { RawAlbum, RawArtist, RawImage, RawPaginatedResponse, RawTrack } from '../types/spotify.raw.js';
import { getPrimaryImageUrl } from '../utils/spotifyApiUtils.js';

/* Mapper functions to convert raw Spotify API data to clean application-specific data structures */

export const mapImages = (raw: RawImage[]): SpotifyImage[] => {
  const imagesToClean = raw || [];
  return imagesToClean.map((img) => ({
    url: img.url,
    height: img.height,
    width: img.width,
  }));
};

// Maybe add followers later?
export const mapArtist = (raw: RawArtist): Artist => {
  const artist: Artist = {
    id: raw.id,
    name: raw.name || '',
    genres: raw.genres || [],
    images: mapImages(raw.images),
  };
  if (raw.popularity !== undefined) {
    artist.popularity = raw.popularity;
  }
  return artist;
};

export const mapArtistReference = (raw: RawArtist): ArtistReference => {
  return {
    id: raw.id,
    name: raw.name || '',
  };
};

export const mapAlbum = (raw: RawAlbum): Album => {
  // Base album with mandatory fields
  const album: Album = {
    id: raw.id,
    title: raw.name || '',
    artists: (raw.artists || []).map(mapArtistReference),
    type: raw.album_type || 'unknown',
    images: mapImages(raw.images),
    releaseDate: raw.release_date || '',
    totalTracks: raw.total_tracks || 0,
  };
  // Add optional fields if they exist in the raw data
  if (raw.tracks && raw.tracks.items) album.tracks = raw.tracks.items.map(mapTrack);
  if (raw.genres) album.genres = raw.genres;
  if (raw.label) album.label = raw.label;
  if (raw.popularity !== undefined) album.popularity = raw.popularity;

  return album;
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
export const mapPaginatedAlbums = (rawResponse: RawPaginatedResponse<RawAlbum>): PaginatedResponse<Album> => {
  const items = rawResponse.items || [];
  const cleanItems = items.map(mapAlbum);

  // This is how the "clean" Album now looks like
  return {
    items: cleanItems,
    pagination: {
      limit: rawResponse.limit ?? 0, // Using nullish coalescing (??) to handle undefined
      offset: rawResponse.offset ?? 0,
      total: rawResponse.total ?? 0,
    },
  };
};

export const mapTrack = (raw: RawTrack): Track => {
  const track: Track = {
    id: raw.id,
    title: raw.name || '',
    artists: (raw.artists || []).map(mapArtistReference),
    durationMs: raw.duration_ms || 0,
    previewUrl: raw.preview_url || null,
    trackNumber: raw.track_number || 0,
  };
  // Only add 'album' if raw.album actually exists in the raw data
  // It depends if it's used in album tracks or standalone track fetches
  if (raw.album) {
    track.album = mapAlbumsReference(raw.album);
  }

  return track;
};
