import { api } from '..';
import { PrimaryKey } from '@directus/sdk-js/dist/types/types';

const METHOD = 'fileDelete()';

export async function fileDeleteByDirectus(key: PrimaryKey) { 
    try {
      await api.directus.files.delete(key)
      console.log(METHOD, '- key:', key);
      return true;
    } catch (error) {
      console.error(METHOD, error);
    }
    return false;
  }


export default fileDeleteByDirectus;
