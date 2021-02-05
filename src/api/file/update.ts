import { api } from '..';
import { Payload, PrimaryKey, Query } from '@directus/sdk-js/dist/types/types';

const METHOD = 'fileUpdate()';

export async function fileUpdateByDirectus(key: PrimaryKey, payload: Payload, query?: Query) {
  try {
    const { data } = await api.directus.files.update(key, payload, query)
    console.log(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export default fileUpdateByDirectus;
