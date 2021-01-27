import { api } from '..';
import { ISignupCredentials } from '../types';
import { removeToken, saveToken } from './utils';

const ENDPOINT = 'auth/signup';
const METHOD = 'signup()';

export async function signupByAxios(credentials: ISignupCredentials) {
  try {
    removeToken();
    const res = await api.axios.post(ENDPOINT, credentials);
    if (res?.status < 400) {
      const data = res?.data?.data;
      saveToken(data?.access_token);
      return data;
    }
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export default signupByAxios;
