import { api } from '..';
import { Payload, Query } from '@directus/sdk-js/dist/types/types';
import { ENDPOINT } from './utils'

const METHOD = 'fileCreate()';

/**
 * Creates File record using Form-Data format
 */
export async function fileCreateByAxiosAsFormData(payload: Payload, query?: Query) {
  const config = {
    headers: {
      // 'content-type': 'multipart/form-data',
    },
    params: query,
  };
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'data' || key === 'file') return; // Skip .data, we will add it at the end as .file
      formData.append(key, value);
    });
    formData.append('file', payload.data || payload.file); // Must be last in FormData!!!

    const res = await api.axios.post(ENDPOINT, formData, config);
    console.warn(METHOD, '- res:', res);
    return res?.data?.data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

/**
 * Creates File record using JSON format 
 * NOTE: Doesn't work correctly. Returns file data, but the file is not accessible by id
 */
export async function fileCreateByAxiosAsJson(payload: Payload | Payload[], query?: Query) {
  const data = {
    // storage: 'amazon',
    ...payload,
  };
  const config = {
    params: query,
  };
  try {
    const res = await api.axios.post(ENDPOINT, data, config);
    // NOTE: Doesn't work correctly. Returns file data, but the file is not accessible by id
    console.warn(METHOD, '- res:', res);
    return res?.data?.data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

/**
 * Creates File record using Directus SDK
 * NOTE: Doesn't work correctly. Returns file data, but the file is not accessible by id
 */
export async function fileCreateByDirectus(payload: Payload | Payload[], query?: Query) {
  try {
    const extendedPayload = {
      storage: 'amazon',
      ...payload,
    };
    const { data } = await api.directus.files.create(extendedPayload, query);
    // NOTE: Doesn't work correctly. Returns file data, but the file is not accessible by id
    console.warn(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export default fileCreateByAxiosAsFormData;
// export default fileCreateByAxiosAsJson
// export default fileCreateByDirectus;
