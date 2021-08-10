import { api } from '../api';

export function getAssetUrl(assetId: string, key: string = 'system-small-cover') {
  if (!assetId) return '';

  let baseUrl = process.env.REACT_APP_API;
  if (!baseUrl) return '';

  if (baseUrl?.lastIndexOf('/') + 1 !== baseUrl?.length) {
    baseUrl = `${baseUrl}/`
  }

  const url = `${baseUrl}assets/${assetId}?key=${key}&access_token=${api.token}`;
  return url;
}