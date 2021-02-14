import { api } from '..';

// const ENDPOINT = '/auth/password/request';
const METHOD = 'recoverPassword()';
interface IRecoverPassword {
  email: string;
}

export async function recoverPasswordByDirectus({ email }: IRecoverPassword) {
  try {
    await api.directus.auth.password.request(email);
    return true;
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export default recoverPasswordByDirectus;
