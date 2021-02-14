import { api } from '..';
import { PrimaryKey } from '@directus/sdk-js/dist/types/types';
import { COLLECTION } from './utils';

// const ENDPOINT = 'file/delete';
const METHOD = 'customFileDelete()';

// export async function customFileDeleteByAxios(query: object | undefined) {
//   try {
//     const res = await api.axios.delete(ENDPOINT, query);
//     if (res?.status < 400) {
//       console.warn(METHOD, '- query:', query);
//       return true
//     }
//   } catch (error) {
//     console.error(METHOD, error);
//   }
//   return false;
// }

export async function customFileDeleteByDirectus(key: PrimaryKey) {
  try {
    await api.directus.items(COLLECTION).delete(key);
    console.warn(METHOD, '- key:', key);
    return true;
  } catch (error) {
    console.error(METHOD, error);
  }
  return false;
}

// export default customFileDeleteByAxios;
export default customFileDeleteByDirectus;
