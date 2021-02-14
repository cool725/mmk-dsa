import { api } from '..';

const ENDPOINT = 'dsa/new';
const COLLECTION = 'dsa_applicaions';
const METHOD = 'newDsaApplication()';

export async function newDsaApplicationByAxios(data: object) {
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

export async function newDsaApplicationByDirectus(data: object) {
  try {
    const res = await api.directus.items(COLLECTION).create(data);
    console.log('res:', res);
    return true;
    // if ([200, 204].includes(res?.status) ) {
    //   return true;
    // }
  } catch (error) {
    console.error(METHOD, error);
  }
  return false;
}

// export default newDsaApplicationByAxios;
export default newDsaApplicationByDirectus;
