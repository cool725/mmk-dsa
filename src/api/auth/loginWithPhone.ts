import { api } from '..';
import { ILoginByPhoneCredentials } from '../types';
import { clearAuthData, saveRefreshToken, saveToken, setRefreshTimeout } from './utils';

const ENDPOINT = 'auth/login/phone';
const METHOD = 'loginWithPhone()';

export async function loginWithPhoneByAxios({ phone, pin, otp }: ILoginByPhoneCredentials) {
  try {
    clearAuthData();
    const res = await api.axios.post(ENDPOINT, { phone, pin, otp });
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

export async function loginWithPhoneByDirectus({ phone, pin, otp }: ILoginByPhoneCredentials) {
  try {
    clearAuthData();
    const { data } = await api.directus.auth.login({ email: phone, password: pin, otp });
    console.warn(METHOD, '- token expires in', +data.expires / 1000 / 60, 'minutes');
    saveToken();
    setRefreshTimeout(data?.expires);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export default loginWithPhoneByDirectus;
// export default loginWithPhoneByAxios;
