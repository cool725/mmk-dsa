import api from '../api';
import { localStorageSet, localStorageGet, localStorageDelete } from '../../utils/localStorage';

const TOKEN_KEY = 'token';

/**
 * Sets new access token into api.directus and saves it in localStorage
 * @param {string|null} newToken - new token value
 */
export function saveToken(newToken = api.directus.auth.token) {
  if (api.directus.auth.token !== newToken) {
    api.directus.auth.token = newToken;
  }
  localStorageSet(TOKEN_KEY, api.directus.auth.token);
}

/**
 * Sets new access token into api.directus and saves it in localStorage
 * @returns {string|null} auth token loaded form Local Storage
 */
export function loadToken() {
  api.directus.auth.token = localStorageGet(TOKEN_KEY);
  return api.directus.auth.token;
}

/**
 * Removes access token from api.directus and from localStorage
 */
export function removeToken() {
  api.directus.auth.token = null;
  localStorageDelete(TOKEN_KEY);
  localStorageDelete('directus_refresh_token'); // Also clean Directus refresh token
}
