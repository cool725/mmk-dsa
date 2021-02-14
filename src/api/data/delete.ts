import { PrimaryKey } from '@directus/sdk-js/dist/types/types';
import { api } from '..';
import { COLLECTION } from './utils';

const ENDPOINT = 'data/delete';
const METHOD = 'dataDelete()';

export async function dataDeleteByAxios(query: object | undefined) {
  try {
    const res = await api.axios.delete(ENDPOINT, query);
    if (res?.status < 400) {
      return true;
    }
  } catch (error) {
    console.error(METHOD, error);
  }
  return false;
}

export async function dataDeleteByDirectus(key: PrimaryKey) {
  try {
    await api.directus.items(COLLECTION).delete(key);
    return true;
  } catch (error) {
    console.error(METHOD, error);
  }
  return false;
}

// export default dataDeleteByAxios;
export default dataDeleteByDirectus;
