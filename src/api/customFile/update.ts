import { api } from '..';
import { Payload, PrimaryKey, Query } from '@directus/sdk-js/dist/types/types';
import { COLLECTION } from './utils';

// const ENDPOINT = 'file/update';
const METHOD = 'customFileUpdate()';

// export async function customFileUpdateByAxios(data: object) {
//   try {
//     const res = await api.axios.post(ENDPOINT, data);
//     if ([200, 201, 204].includes(res?.status)) {
//       const { data } = res;
//       console.log(METHOD, '- data:', data);
//       return data;
//     }
//   } catch (error) {
//     console.error(METHOD, error);
//   }
//   return false;
// }

export async function customFileUpdateByDirectus(key: PrimaryKey, payload: Payload | Payload[], query?: Query) {
  try {
    const { data } = await api.directus.items(COLLECTION).update(key, payload, query);
    console.log(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

// export default customFileUpdateByAxios;
export default customFileUpdateByDirectus;
