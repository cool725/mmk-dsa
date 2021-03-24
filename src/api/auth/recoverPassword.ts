import { api } from '..';

const ENDPOINT = '/auth/password/request';
const METHOD = 'recoverPassword()';
interface IRecoverPassword {
  email: string;
}

export async function recoverPasswordByDirectus({ email }: IRecoverPassword) {
  try {
    const reset_url = `${window.location.host}/auth/recovery/reset-password`;
    await api.axios.post(ENDPOINT, { email, reset_url });
    return true;
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export default recoverPasswordByDirectus;
