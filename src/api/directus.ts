import DirectusSDK from '@directus/sdk-js';
import { localStorageGet, localStorageSet } from '../utils/localStorage';

/**
 * Storage for Directus auth token(s), should be compatible with AuthStorage type
 * type AuthStorage = {
 *    getItem: (key: string) => Promise<any>;
 *    setItem: (key: string, value: any) => Promise<any>;
 * };
 */
class DirectusStorage {
  async getItem(key: string) {
    console.log(`DirectusStorage.getItem(${key})`);
    return await localStorageGet(key);
  }

  async setItem(key: string, value: any) {
    // console.log(`DirectusStorage.setItem(${key}, ${JSON.stringify(value)})`)
    return await localStorageSet(key, value);
  }
}

/**
 * Instance of Directus API aka DirectusSDK
 * Note: We can override API's baseURL via localStorage.api
 */
const API_URL = (localStorageGet('api') || process.env.REACT_APP_API) as string;
const directus = new DirectusSDK(API_URL, {
  auth: {
    storage: new DirectusStorage(), // Storage adapter where refresh tokens are stored in JSON mode
    // mode: 'cookie', // What login mode to use. One of `json`, `cookie`
    mode: 'json', // What login mode to use. One of `json`, `cookie`
    // autoRefresh: true, // Note: Not working :( Whether or not to automatically refresh the access token on login.
  },
});

directus.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export default directus;
