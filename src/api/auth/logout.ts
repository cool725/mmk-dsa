import { api } from '..';
import { removeToken } from './utils';

// const ENDPOINT = 'auth/logout';
const METHOD = 'logout()';

export async function logoutByDirectus() {
  try {
    await api.directus.auth.logout();
  } catch (error) {
    console.error(METHOD, error);
  } finally {
    removeToken();
  }
}

export default logoutByDirectus;
