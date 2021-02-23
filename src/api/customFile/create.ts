import { api } from '..';
import { Payload, Query } from '@directus/sdk-js/dist/types/types';
import { COLLECTION, ENDPOINT } from './utils';

const METHOD = 'customFileCreate()';

/**
 * Creates record using Form-Data format, supports binary data
 */
export async function customFileCreateByAxiosAsFormData(payload: Payload, query?: Query) {
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
    return res?.data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

/**
 * Creates record using JSON format, does not support binary data
 */
export async function customFileCreateByAxiosAsJson(payload: Payload, query?: Query) {
  const data = {
    // storage: 'amazon',
    name: payload.name || payload.fileName,
    info: payload.info || payload.text,
    file: payload.data || payload.file, // Actually will not work :(
  };
  const config = {
    params: query,
  };
  try {
    const res = await api.axios.post(ENDPOINT, data, config);
    console.warn(METHOD, '- res:', res);
    return res?.data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

/**
 * Creates File record using Directus SDK
 * NOTE: Doesn't work correctly with binary data
 */
export async function customFileCreateByDirectus(payload: Payload | Payload[], query?: Query) {
  try {
    const { data } = await api.directus.items(COLLECTION).create(payload, query);
    console.warn(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export default customFileCreateByAxiosAsFormData;
// export default customFileCreateByAxiosAsJson;
// export default customFileCreateByDirectus;
