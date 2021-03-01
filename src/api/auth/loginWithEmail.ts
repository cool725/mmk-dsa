import { api } from '..';
import { ILoginByEmailCredentials } from '../types';
import { clearAuthData, saveRefreshToken, saveToken, setRefreshTimeout } from './utils';

const ENDPOINT = 'auth/login';
const METHOD = 'loginWithEmail()';

export async function loginWithPhoneByAxios({ email, password, otp }: ILoginByEmailCredentials) {
  try {
    clearAuthData();
    const res = await api.axios.post(ENDPOINT, { email, password, otp });
    if (res?.status === 200) {
      const { data } = res?.data;
      console.warn(METHOD, '- token expires in', +data?.expires / 1000 / 60, 'minutes');
      saveToken(data?.access_token || data?.accessToken);
      saveRefreshToken(data?.refresh_token || data?.refreshToken);
      setRefreshTimeout(data?.expires);
      return data;
    }
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export async function loginWithEmailByDirectus({ email, password, otp }: ILoginByEmailCredentials) {
  try {
    clearAuthData();
    const { data } = await api.directus.auth.login({ email, password, otp });
    console.warn(METHOD, '- token expires in', +data.expires / 1000 / 60, 'minutes');
    saveToken();
    setRefreshTimeout(data?.expires);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export default loginWithPhoneByAxios;
// export default loginWithEmailByDirectus;
