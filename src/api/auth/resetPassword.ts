import { api } from '..';

const METHOD = 'resetPassword()';
interface IResetPassword {
  password: string;
  // confirmPassword: string;
  token: string;
}

export async function resetPasswordByDirectus({ password, token }: IResetPassword) {
  try {
    await api.directus.auth.password.reset(token, password);
    return true;
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export default resetPasswordByDirectus;
