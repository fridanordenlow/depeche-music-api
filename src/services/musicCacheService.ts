// services/musicCacheService.ts
import { mapAlbum, mapArtist, mapTrack } from '../mappers/spotifyMapper.js';
import MusicCache, { IMusicCache } from '../models/MusicCache.js';
import { MusicCacheData } from '../types/music.types.js';
import { RawAlbum, RawArtist, RawTrack } from '../types/spotify.raw.js';
import { fetchSpotifyData, getPrimaryImageUrl } from '../utils/spotifyApiUtils.js';

export const getMusicData = async (
  spotifyId: string,
  type: 'track' | 'album' | 'artist',
  token: string
): Promise<MusicCacheData> => {
  const cached = (await MusicCache.findOne({ spotifyId, type })) as IMusicCache | null;
  if (cached) return cached.data;

  const endpoint = `/${type}s/${spotifyId}`;
  let musicData: MusicCacheData;

  if (type === 'track') {
    const raw = await fetchSpotifyData<RawTrack>(token, endpoint);
    const clean = mapTrack(raw);
    musicData = {
      spotifyId: clean.id,
      type: 'track',
      name: clean.title,
      artistName: clean.artists.map((a) => a.name).join(', '),
      imageUrl: clean.album?.imageUrl || '',
      externalUrl: `https://open.spotify.com/track/${clean.id}`,
      fullData: clean,
    };
  } else if (type === 'album') {
    const raw = await fetchSpotifyData<RawAlbum>(token, endpoint);
    const clean = mapAlbum(raw);
    musicData = {
      spotifyId: clean.id,
      type: 'album',
      name: clean.title,
      artistName: clean.artists[0]?.name || '',
      imageUrl: getPrimaryImageUrl(raw.images),
      externalUrl: `https://open.spotify.com/album/${clean.id}`,
      fullData: clean,
    };
  } else {
    const raw = await fetchSpotifyData<RawArtist>(token, endpoint);
    const clean = mapArtist(raw);
    musicData = {
      spotifyId: clean.id,
      type: 'artist',
      name: clean.name,
      artistName: 'Artist',
      imageUrl: getPrimaryImageUrl(raw.images),
      externalUrl: `https://open.spotify.com/artist/${clean.id}`,
      fullData: clean,
    };
  }
  await MusicCache.create({ spotifyId, type, data: musicData });
  return musicData;
};
