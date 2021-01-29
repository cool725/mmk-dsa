import { api } from '..';
import { ISignupCredentials } from '../types';
import { clearAuthData, saveRefreshToken, saveToken, setRefreshTimeout } from './utils';

const ENDPOINT = 'auth/signup';
const METHOD = 'signup()';

export async function signupByAxios(credentials: ISignupCredentials) {
  try {
    clearAuthData();
    const res = await api.axios.post(ENDPOINT, credentials);
    if (res?.status < 400) {
      const { data } = res?.data;
      console.warn(METHOD, '- token expires in', +data?.expires / 1000 / 60, 'minutes');
      saveToken(data?.access_token);
      saveRefreshToken(data?.refresh_token);
      setRefreshTimeout(data?.expires);
      return data;
    }
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export default signupByAxios;
