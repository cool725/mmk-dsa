import { api } from '..';
import { Payload, Query } from '@directus/sdk-js/dist/types/types';

const METHOD = 'fileCreate()';

export async function fileCreateByDirectus(payload: Payload | Payload[], query?: Query) {
  try {
    const { data } = await api.directus.files.create(payload, query)
    console.log(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export default fileCreateByDirectus;
