import { api } from '..';
import { PrimaryKey, Query } from '@directus/sdk-js/dist/types/types';
import { COLLECTION } from './utils';

const METHOD = 'customFileRead()';

export async function customFileReadByDirectus(key: PrimaryKey, query?: Query) {
  try {
    const { data } = await api.directus.items(COLLECTION).read(key, query);
    console.warn(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export default customFileReadByDirectus;
