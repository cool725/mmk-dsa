import { api } from '..';
import { PrimaryKey, Query } from '@directus/sdk-js/dist/types/types';

const METHOD = 'fileRead()';

export async function fileReadByDirectus(key: PrimaryKey, query?: Query) {
  try {
    const { data } = await api.directus.files.read(key, query);
    console.log(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export default fileReadByDirectus;
