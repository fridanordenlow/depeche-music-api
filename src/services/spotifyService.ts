// services/spotifyService.ts

import { mapAlbum, mapArtist, mapPaginatedResponse, mapTrack } from '../mappers/spotifyMapper.js';
import {
  RawAlbum,
  RawAlbumsResponse,
  RawArtist,
  RawNewReleases,
  RawSearchResponse,
  RawTrack,
} from '../types/spotify.raw.js';
import { AlbumListResponse, SearchResponse } from '../types/spotify.types.js';
import { fetchSpotifyData } from '../utils/spotifyApiUtils.js';

export const getArtist = async (token: string, id: string) => {
  const endpointPath = `/artists/${id}`;
  const rawResponse = await fetchSpotifyData<RawArtist>(token, endpointPath);

  return mapArtist(rawResponse);
};

export const getArtistAlbums = async (
  token: string,
  id: string,
  limit: number = 20,
  offset: number = 0
): Promise<AlbumListResponse> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    include_groups: 'album,single',
  });
  const endpointPath = `/artists/${id}/albums?${params.toString()}`;
  const rawResponse = await fetchSpotifyData<RawAlbumsResponse>(token, endpointPath);

  return mapPaginatedResponse(rawResponse, mapAlbum);
};

export const getAlbum = async (token: string, id: string) => {
  const endpointPath = `/albums/${id}`;
  const rawResponse = await fetchSpotifyData<RawAlbum>(token, endpointPath);

  return mapAlbum(rawResponse);
};

export const getTrack = async (token: string, id: string) => {
  const endpointPath = `/tracks/${id}`;
  const rawResponse = await fetchSpotifyData<RawTrack>(token, endpointPath);

  return mapTrack(rawResponse);
};

export const getNewReleases = async (token: string, limit?: number, offset?: number): Promise<AlbumListResponse> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());

  const endpointPath = `/browse/new-releases?${params.toString()}`;
  const rawResponse = await fetchSpotifyData<RawNewReleases>(token, endpointPath);
  const rawReleases = rawResponse.albums || { items: [], total: 0, limit: limit || 20, offset: offset || 0 };

  return mapPaginatedResponse(rawReleases, mapAlbum);
};

export const getSearchResults = async (
  token: string,
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<SearchResponse> => {
  const params = new URLSearchParams({
    q: query,
    type: 'artist,album,track',
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const endpointPath = `/search?${params.toString()}`;

  const rawData = await fetchSpotifyData<RawSearchResponse>(token, endpointPath);

  const emptyPaging = { items: [], pagination: { limit: 0, offset: 0, total: 0 } };

  return {
    artists: rawData.artists ? mapPaginatedResponse(rawData.artists, mapArtist) : emptyPaging,
    albums: rawData.albums ? mapPaginatedResponse(rawData.albums, mapAlbum) : emptyPaging,
    tracks: rawData.tracks ? mapPaginatedResponse(rawData.tracks, mapTrack) : emptyPaging,
  };
};
