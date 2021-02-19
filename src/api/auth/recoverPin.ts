import { api } from '..';

// const ENDPOINT = '/auth/pin/request';
const METHOD = 'recoverPin()';
interface IRecoverPin {
  phone: string;
}

export async function recoverPinByDirectus({ phone }: IRecoverPin) {
  try {
    await api.directus.auth.password.request(phone?.replace(/\D/g, ''));
    return true;
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

// export async function recoverPinByAxios({ phone }: IRecoverPin) {
//   try {
//     const res = await await api.axios.post(ENDPOINT, { phone });
//     if (res?.status < 400) {
//       return true;
//     }
//   } catch (error) {
//     console.error(METHOD, error);
//   }
//   return null;
// }

export default recoverPinByDirectus;
