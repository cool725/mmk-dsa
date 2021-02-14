import { PrimaryKey } from '@directus/sdk-js/dist/types/types';
import { api } from '..';
import { COLLECTION } from './utils';

const ENDPOINT = 'data/update';
const METHOD = 'dataUpdate()';

export async function dataUpdateByAxios(data: object) {
  try {
    const res = await api.axios.post(ENDPOINT, data);
    if ([200, 204].includes(res?.status)) {
      return true;
    }
  } catch (error) {
    console.error(METHOD, error);
  }
  return false;
}

export async function dataUpdateByDirectus(key: PrimaryKey, data: object) {
  try {
    const res = await api.directus.items(COLLECTION).update(key, data);
    console.warn(METHOD, '- res:', res);
    return true;
    // if ([200, 204].includes(res?.status) ) {
    //   return true;
    // }
  } catch (error) {
    console.error(METHOD, error);
  }
  return false;
}

// export default dataUpdateByAxios;
export default dataUpdateByDirectus;
