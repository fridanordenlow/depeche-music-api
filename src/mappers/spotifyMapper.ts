import {
  Album,
  AlbumReference,
  Artist,
  ArtistReference,
  SpotifyImage,
  PaginatedResponse,
  Track,
} from '../types/spotify.types.js';
import { RawAlbum, RawArtist, RawImage, RawTrack } from '../types/spotify.raw.js';
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
  if (raw.popularity !== undefined) artist.popularity = raw.popularity;

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
    uri: raw.uri,
    title: raw.name,
    artists: (raw.artists || []).map(mapArtistReference),
    type: raw.album_type,
    images: mapImages(raw.images),
    releaseDate: raw.release_date || '',
    totalTracks: raw.total_tracks,
  };
  // Add optional fields if they exist in the raw data
  if (raw.album_group) album.group = raw.album_group;
  if (raw.tracks) album.tracks = mapPaginatedResponse(raw.tracks, mapTrack);
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

// Raw & Clean are placeholders for generic types
// itemMapper is a function that maps a single Raw item to a Clean item
export const mapPaginatedResponse = <Raw, Clean>(
  // We say "I want an object that at least has items: Raw[]", but it can also have total, limit, offset
  paginatedData: {
    items: Raw[];
    total?: number;
    limit?: number;
    offset?: number;
  },
  itemMapper: (item: Raw) => Clean
): PaginatedResponse<Clean> => {
  return {
    items: (paginatedData.items || []).map(itemMapper),
    pagination: {
      total: paginatedData.total ?? 0,
      limit: paginatedData.limit ?? 0,
      offset: paginatedData.offset ?? 0,
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
  if (raw.album) track.album = mapAlbumsReference(raw.album);
  if (raw.popularity !== undefined) track.popularity = raw.popularity;

  return track;
};
