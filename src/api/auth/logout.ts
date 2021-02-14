import { api } from '..';
import { loadRefreshToken, clearAuthData } from './utils';

const ENDPOINT = 'auth/logout';
const METHOD = 'logout()';

export async function logoutByAxios() {
  try {
    await api.axios.post(ENDPOINT, {
      refresh_token: loadRefreshToken(),
    });
  } catch (error) {
    console.error(METHOD, error);
  } finally {
    clearAuthData();
    window.location.href = '/'; // Reload Application
  }
}

export async function logoutByDirectus() {
  try {
    await api.directus.auth.logout(); // Note: returns 400 with message: ""refresh_token" is required in either the JSON payload or Cookie" message
  } catch (error) {
    console.error(METHOD, error);
  } finally {
    clearAuthData();
    window.location.href = '/'; // Reload Application
  }
}

export default logoutByAxios;
// export default logoutByDirectus;
