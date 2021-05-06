import { api } from '..';
import { PrimaryKey, Query } from '@directus/sdk-js/dist/types/types';
import { COLLECTION } from './utils';

const METHOD = 'dsaRead()';

// export async function dsaReadByAxios(query: object | undefined) {
//   try {
//     const res = await api.axios.get(ENDPOINT, query);
//     if (res?.status < 400) {
//       const { data } = res;
//       console.warn(METHOD, '- data:', data);
//       return data;
//     }
//   } catch (error) {
//     console.error(METHOD, error);
//   }
//   return undefined;
// }

export async function dsaReadByDirectus(key: PrimaryKey, query?: Query) {
  try {
    const { data } = await api.directus.items(COLLECTION).read(key, query);
    console.warn(METHOD, '- data:', data);
    return data[0];
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

// export default dsaReadByAxios;
export default dsaReadByDirectus;
