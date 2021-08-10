import { api } from '..';
import { PrimaryKey, Query } from '@directus/sdk-js/dist/types/types';
import { COLLECTION } from './utils';

const READ_METHOD = 'dsaRead()';

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
    console.warn(READ_METHOD, '- data:', data);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(READ_METHOD, error);
  }
  return undefined;
}


export async function getIncompleteDsaApplications(search: string, limit: number) {
  try {
    const params = { search, limit }
    const { data } = await api.axios.get('/custom/manager/dsa_applications_for_edit', { params });
    const apps = data?.data?.result ?? null;
    console.warn(READ_METHOD, '- apps:', apps);
    return apps && apps?.length > 0 ? apps : [];
  } catch (error) {
    console.error(READ_METHOD, error);
  }
  return undefined;
}

// export default dsaReadByAxios;
export default dsaReadByDirectus;
