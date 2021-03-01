import { AuthResponse } from '@directus/sdk-js/dist/types/handlers';
import { api } from '..';
import { loadRefreshToken, clearAuthData, saveRefreshToken, saveToken, setRefreshTimeout } from './utils';

const ENDPOINT = 'auth/refresh';
const METHOD = 'refresh()';

export async function refreshByAxios() {
  try {
    const res = await api.axios.post(ENDPOINT, {
      refresh_token: loadRefreshToken(),
    });
    if (res.status < 400) {
      const { data } = res?.data;
      console.warn(METHOD, '- token expires in', +data?.expires / 1000 / 60, 'minutes');
      saveToken(data?.access_token || data?.accessToken);
      saveRefreshToken(data?.refresh_token || data?.refreshToken);
      setRefreshTimeout(data?.expires);
      return data;
    }
  } catch (error) {
    console.error(METHOD, error);
    clearAuthData();
    window.location.href = '/'; // Reload Application
  }
  return null;
}

export async function refreshByDirectus() {
  try {
    const res = await api.directus.auth.refresh();
    const data = res?.data as AuthResponse;
    console.warn(METHOD, '- token expires in', +data?.expires / 1000 / 60, 'minutes');
    saveToken();
    setRefreshTimeout(data?.expires);
    return data;
  } catch (error) {
    console.error(METHOD, error);
    clearAuthData();
    window.location.href = '/'; // Reload Application
  }
  return null;
}

export default refreshByAxios;
// export default refreshByDirectus;
