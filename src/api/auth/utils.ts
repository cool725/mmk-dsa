import api from '../api';
import { localStorageSet, localStorageGet, localStorageDelete } from '../../utils/localStorage';

const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'directus_refresh_token'; // Note: Directus SDK uses 'directus_refresh_token' key
const EXPIRED_AT_KEY = 'tokenExpiresAt';

/**
 * Removes token from "directus api" and all auth data from the local storage
 */
export function clearAuthData() {
  api.directus.auth.token = null;
  localStorageDelete(ACCESS_TOKEN_KEY);
  localStorageDelete(REFRESH_TOKEN_KEY);
  localStorageDelete(EXPIRED_AT_KEY);
  clearRefreshTimeout();
}

/**
 * Apples new "access token" into "directus api" and saves it in the local storage
 * @param {string|null|undefined} newToken - new token value
 */
export function saveToken(newToken: string | null | undefined = api.directus.auth.token) {
  if (api.directus.auth.token !== newToken) {
    api.directus.auth.token = newToken;
  }
  localStorageSet(ACCESS_TOKEN_KEY, api.directus.auth.token);
}

/**
 * Loads "access token" from the local storage and sets it into "directus api"
 */
export function loadToken() {
  api.directus.auth.token = localStorageGet(ACCESS_TOKEN_KEY);
  return api.directus.auth.token;
}

/**
 * Saves given "refresh token" in the local storage
 * @param {string|null|undefined} newRefreshToken - new refresh token value
 */
export function saveRefreshToken(newRefreshToken: string | null | undefined) {
  localStorageSet(REFRESH_TOKEN_KEY, newRefreshToken);
}

/**
 * Loads "refresh token" from the local storage
 */
export function loadRefreshToken() {
  return localStorageGet(REFRESH_TOKEN_KEY);
}

/**
 * Loads "token expiration date" from the local storage, as ISO string or ''
 */
export function tokenExpireAt(): string {
  return localStorageGet(EXPIRED_AT_KEY);
}

/**
 * The "token refresh timer" to refresh token before it expires
 */
let _timeout_refresh_token = 0;

export function clearRefreshTimeout() {
  if (_timeout_refresh_token) {
    clearTimeout(_timeout_refresh_token);
    _timeout_refresh_token = 0;
  }
}

export function setRefreshTimeout(interval = 15 * 60 * 1000) {
  clearRefreshTimeout();
  const timeExpiresAt = Date.now() + interval;
  const dateExpiresAt = new Date(+timeExpiresAt).toISOString();
  localStorageSet(EXPIRED_AT_KEY, dateExpiresAt); // Add 'tokenExpiresAt' as normal data string
  interval = interval - 10 * 1000; // 10 second before the end
  console.log(
    `Token refresh timer set for ${Math.trunc(interval / 1000 / 60)}.${Math.trunc(interval / 1000) % 60} minutes`
  );
  _timeout_refresh_token = setTimeout(() => {
    console.warn('Refreshing access token by timeout...');
    api.auth.refresh();
  }, interval) as any;
}

/**
 * Verifies is the current user still logged in, updates the "token refresh timer" if needed
 */
export function isUserStillLoggedIn() {
  if (_timeout_refresh_token) return true; // Timeout already exists, we are logged in

  const dateExpireAt = tokenExpireAt();
  if (!dateExpireAt) return false; // No data about token expiration in the local store, we are NOT logged in

  const timeExpireAt = new Date(dateExpireAt).getTime();
  if (timeExpireAt <= Date.now()) return false; // Token already expired, we are NOT logged in anymore

  setRefreshTimeout(timeExpireAt - Date.now()); // Create new timeout with interval taken form the local storage
  return true; // We are logged in
}
