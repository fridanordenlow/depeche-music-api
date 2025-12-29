// services/spotifyService.ts

import { mapAlbum, mapArtist, mapPaginatedAlbums, mapTrack } from '../mappers/spotifyMapper.js';
import {
  RawAlbum,
  RawAlbumsResponse,
  RawArtist,
  RawNewReleases,
  RawPaginatedResponse,
  RawTrack,
} from '../types/spotify.raw.js';
import { NewReleasesResponse } from '../types/spotify.types.js';
import { fetchSpotifyData } from '../utils/spotifyApiUtils.js';

export const getArtist = async (token: string, id: string) => {
  const endpointPath = `/artists/${id}`;
  const rawResponse = await fetchSpotifyData<RawArtist>(token, endpointPath);
  const data = mapArtist(rawResponse);
  return data;
};

export const getArtistAlbums = async (token: string, id: string) => {
  const endpointPath = `/artists/${id}/albums`;
  const rawResponse = await fetchSpotifyData<RawAlbumsResponse>(token, endpointPath);
  const data = mapPaginatedAlbums(rawResponse);
  return data;
};

export const getAlbum = async (token: string, id: string) => {
  const endpointPath = `/albums/${id}`;
  const rawResponse = await fetchSpotifyData<RawAlbum>(token, endpointPath);
  const data = mapAlbum(rawResponse);
  return data;
};

export const getTrack = async (token: string, id: string) => {
  const endpointPath = `/tracks/${id}`;
  const rawResponse = await fetchSpotifyData<RawTrack>(token, endpointPath);
  const data = mapTrack(rawResponse);
  return data;
};

export const getNewReleases = async (token: string, limit?: number, offset?: number): Promise<NewReleasesResponse> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());

  const endpointPath = `/browse/new-releases?${params.toString()}`;
  const rawResponse = await fetchSpotifyData<RawNewReleases>(token, endpointPath);
  // The listing of albums is inside the 'albums' property
  const rawAlbumsContainer = rawResponse.albums || { items: [] };

  const data = mapPaginatedAlbums(rawAlbumsContainer as RawPaginatedResponse<RawAlbum>);
  return data;
};
