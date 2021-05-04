import { api } from '..';

const ENDPOINT = '/custom/user/exist';
const METHOD = 'userExist()';

interface EmailOrPhone {
  email?: string;
  phone?: string;
  excludeStatus?: string;
}

/**
 * Returns true if the Agent/User with email or phone already exists
 */
export async function userExistByAxios({ email, phone, excludeStatus }: EmailOrPhone) {
  const payload = {
    email,
    phone,
    excludeStatus,
  };
  try {
    const res = await api.axios.post(ENDPOINT, payload);
    console.warn(METHOD, ' - res:', res);
    return Boolean(res?.data?.data?.exist);
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export default userExistByAxios;
