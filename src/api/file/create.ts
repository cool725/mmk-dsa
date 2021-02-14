import { api } from '..';
import { Payload, Query } from '@directus/sdk-js/dist/types/types';

const METHOD = 'fileCreate()';
const ENDPOINT = '/files';

export async function fileCreateByAxios(payload: Payload | Payload[], query?: Query) {
  try {
    // const extendedPayload = {
    //   ...payload,
    //   storage: 'amazon',
    // };

    const formData = new FormData();
    formData.append('storage', 'amazon');
    formData.append('title', 'Uploaded by DSA App');
    // formData.append('filename_download', (payload as any).filename_download);
    formData.append('filename_download', (payload as any).filename_download);
    formData.append('file', (payload as any).data); // Must be last in FormData!!!
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
      params: query,
    };

    const res = await api.axios.post(ENDPOINT, formData, config);
    console.warn(METHOD, '- res:', res);
    return res?.data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export async function fileCreateByDirectus(payload: Payload | Payload[], query?: Query) {
  try {
    const extendedPayload = {
      ...payload,
      storage: 'amazon',
    };
    const { data } = await api.directus.files.create(extendedPayload, query);
    console.warn(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export default fileCreateByAxios;
// export default fileCreateByDirectus;
