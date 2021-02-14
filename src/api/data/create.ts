import { api } from '..';
import { COLLECTION } from './utils';

const ENDPOINT = 'data/add';
const METHOD = 'dataCreate()';

export async function dataCreateByAxios(data: object) {
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

export async function dataCreateByDirectus(data: object) {
  try {
    const res = await api.directus.items(COLLECTION).create(data);
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

// export default dataCreateByAxios;
export default dataCreateByDirectus;
