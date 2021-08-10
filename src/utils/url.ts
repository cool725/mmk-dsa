import { api } from '../api';

export function getAssetUrl(assetId: string, key: string = 'system-small-cover') {
  if (!assetId) return '';

  const url = `${process.env.REACT_APP_API}/assets/${assetId}?key=${key}&access_token=${api.token}`;
  // console.log(`getAssetUrl(${assetId}) - result:`, url)
  return url;
}