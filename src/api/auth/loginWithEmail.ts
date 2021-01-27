import { api } from '..';
import { ILoginByEmailCredentials } from '../types';
import { removeToken, saveToken } from './utils';

// const ENDPOINT = 'auth/login/email';
const METHOD = 'loginWithEmail()';

export async function loginWithEmailByDirectus({ email, password, otp }: ILoginByEmailCredentials) {
  try {
    removeToken();
    const { data } = await api.directus.auth.login({ email, password, otp });
    saveToken();
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export default loginWithEmailByDirectus;

