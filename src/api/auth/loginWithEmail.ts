import { api } from '..';
import { ILoginByEmailCredentials } from '../types';
import { clearAuthData, saveRefreshToken, saveToken, setRefreshTimeout } from './utils';

const ENDPOINT = 'custom/user/dsaLogin';
const METHOD = 'loginWithEmail()';

export async function loginWithEmailByDirectus({ email, password, otp }: ILoginByEmailCredentials) {
  try {
    clearAuthData();
    const res = await api.axios.post(ENDPOINT, { email, password, otp });
    if (res?.status === 200) {
      const { data } = res?.data;
      console.warn(METHOD, '- token expires in', +data?.expires / 1000 / 60, 'minutes');
      saveToken(data?.access_token || data?.accessToken);
      saveRefreshToken(data?.refresh_token || data?.refreshToken);
      setRefreshTimeout(data?.expires);
      return {
        data,
        error: false
      };
    }
  } catch (error) {
    console.error(METHOD, error);
    return {
      data: error?.response?.data,
      error: true
    };
  }
  return null;
}

export default loginWithEmailByDirectus;
