import { api } from '..';
import { Payload, PrimaryKey, Query } from '@directus/sdk-js/dist/types/types';

const METHOD = 'fileUpdate()';
const ENDPOINT = '/files';

export async function fileUpdateByAxios(key: PrimaryKey, payload: Payload, query?: Query) {
  try {
    const extendedPayload = {
      ...payload,
      storage: 'amazon',
    };
    const { data } = await api.axios.patch(`${ENDPOINT}/${key}`, extendedPayload, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      params: query,
    });
    console.warn(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export async function fileUpdateByDirectus(key: PrimaryKey, payload: Payload, query?: Query) {
  try {
    const { data } = await api.directus.files.update(key, payload, query);
    console.warn(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export default fileUpdateByAxios;
// export default fileUpdateByDirectus;
