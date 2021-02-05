import { api } from '..';
import { Payload, Query } from '@directus/sdk-js/dist/types/types';
import { COLLECTION } from './utils';

// const ENDPOINT = 'file/add';
const METHOD = 'customFileCreate()';

// export async function customFileCreateByAxios(data: object) {
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
//   return undefined;
// }

export async function customFileCreateByDirectus(payload: Payload | Payload[], query?: Query) {
  try {
    const { data } = await api.directus.items(COLLECTION).create(payload, query);
    console.log(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

// export default customFileCreateByAxios;
export default customFileCreateByDirectus;
