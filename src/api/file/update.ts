import { api } from '..';
import { Payload, PrimaryKey, Query } from '@directus/sdk-js/dist/types/types';
import { ENDPOINT } from './utils';

const METHOD = 'fileUpdate()';

/**
 * Partially updates existing File record, also supports binary data replacement
 */
export async function fileUpdateByAxiosAsFormData(key: PrimaryKey, payload: Payload, query?: Query) {
  const fileData = payload.data || payload.file;
  if (!fileData) {
    return fileUpdateByAxiosAsJson(key, payload, query); // There is no binary data, so update data as JSON
  }

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
    formData.append('file', fileData); // Must be last in FormData!!!

    const res = await api.axios.patch(`${ENDPOINT}/${key}`, formData, config);
    console.warn(METHOD, '- res:', res);
    return res?.data?.data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

/**
 * Partially updates existing File record, but does not support binary data
 */
export async function fileUpdateByAxiosAsJson(key: PrimaryKey, payload: Payload, query?: Query) {
  const data = {
    // storage: 'amazon',
    ...payload,
  };
  const config = {
    params: query,
  };
  try {
    const res = await api.axios.patch(`${ENDPOINT}/${key}`, data, config);
    console.warn(METHOD, '- res:', res);
    return res?.data?.data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

/**
 * Partially updates existing File record using Directus SDK, not supports binary data
 */
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

export default fileUpdateByAxiosAsFormData;
// export default fileUpdateByAxiosAsJson;
// export default fileUpdateByDirectus;
