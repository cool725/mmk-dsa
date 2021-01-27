import { api } from '..';
import { ILoginByPhoneCredentials } from '../types';
import { removeToken, saveToken } from './utils';

// const ENDPOINT = 'auth/login/phone';
const METHOD = 'loginWithPhone()';

export async function loginWithPhoneByDirectus({ phone, pin, otp }: ILoginByPhoneCredentials) {
  try {
    removeToken();
    const { data } = await api.directus.auth.login({ email: phone, password: pin, otp });
    saveToken();
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

// export async function loginWithPhoneByAxios({ phone, pin, otp }: ILoginByPhoneCredentials) {
//   try {
//     removeToken();
//     const res = await api.axios.post(ENDPOINT, { phone, pin, otp });
//     if (res?.status === 200) {
//       const data = res?.data?.data;
//       saveToken(data?.access_token);
//       return data;
//     }
//   } catch (error) {
//     console.error(METHOD, error);
//   }
//   return null;
// }

export default loginWithPhoneByDirectus;
// export default loginWithPhoneByAxios;
