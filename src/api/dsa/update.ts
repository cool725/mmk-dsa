import { api } from '..';
import { Payload, PrimaryKey, Query } from '@directus/sdk-js/dist/types/types';
import { COLLECTION } from './utils';

// const ENDPOINT = 'data/update';
const METHOD = 'customDataUpdate()';

// export async function customDataUpdateByAxios(payload: object) {
//   try {
//     const res = await api.axios.post(ENDPOINT, payload);
//     if ([200, 201, 204].includes(res?.status)) {
//       const { data } = res;
//       console.log(METHOD, '- data:', data);
//       return data;
//     }
//   } catch (error) {
//     console.error(METHOD, error);
//   }
//   return undefined;
// }

export async function customDataUpdateByDirectus(key: PrimaryKey, payload: Payload, query?: Query) {
  try {
    const { data } = await api.directus.items(COLLECTION).update(key, payload, query);
    console.log(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

// export default customDataUpdateByAxios;
export default customDataUpdateByDirectus;
