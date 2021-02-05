import { api } from '..';
import { PrimaryKey, Query } from '@directus/sdk-js/dist/types/types';
import { COLLECTION } from './utils';

// const ENDPOINT = 'file/read';
const METHOD = 'customFileRead()';

// export async function customFileReadByAxios(query: object | undefined) {
//   try {
//     const res = await api.axios.get(ENDPOINT, query);
//     if (res?.status < 400) {
//       const { data } = res;
//       console.log(METHOD, '- data:', data);
//       return data;
//     }
//   } catch (error) {
//     console.error(METHOD, error);
//   }
//   return undefined;
// }

export async function customFileReadByDirectus(key: PrimaryKey, query?: Query) {
  try {
    const { data } = await api.directus.items(COLLECTION).read(key, query);
    console.log(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

// export default customFileReadByAxios;
export default customFileReadByDirectus;
