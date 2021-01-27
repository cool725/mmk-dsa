import { api } from '..';
import { removeToken, saveToken } from './utils';

// const ENDPOINT = 'auth/refresh';
const METHOD = 'refresh()';

export async function refreshByDirectus() {
  try {
    const { data } = await api.directus.auth.refresh();
    saveToken();
    return data;
  } catch (error) {
    console.error(METHOD, error);
    removeToken();
  }
  return null;
}

export default refreshByDirectus;
