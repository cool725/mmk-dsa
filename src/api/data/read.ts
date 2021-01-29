import { Query } from '@directus/sdk-js/dist/types/types';
import { api } from '..';
import { COLLECTION } from './utils';

const ENDPOINT = 'data/read';
const METHOD = 'dataRead()';

export async function dataReadByAxios(query: object | undefined) {
  try {
    const res = await api.axios.get(ENDPOINT, query);
    if (res?.status < 400) {
      return res?.data;
    }
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export async function dataReadByDirectus(query?: Query) {
  try {
    const { data } = await api.directus.items(COLLECTION).read(query as Query);
    console.log(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

// export default dataReadByAxios;
export default dataReadByDirectus;
