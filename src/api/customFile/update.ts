import { api } from '..';
import { Payload, PrimaryKey, Query } from '@directus/sdk-js/dist/types/types';
import { COLLECTION, ENDPOINT } from './utils';

const METHOD = 'customFileUpdate()';

/**
 * Updates record using 3 sequential API calls
 */
export async function customFileUpdateByThreeCalls(key: PrimaryKey, payload: Payload, query?: Query) {
  // Get previous data to know the .file property
  const prevRecord: any = await api.customFile.get(key, query)

  // Create or update the record in 'files' collection if there "file data"
  let fileObject;
  if (payload.data) {
    const filePayload = {
      title: payload.name,
      file: payload.data,
    };
    if (prevRecord?.file) {
      // File already exists, lets update it
      fileObject = await api.file.update(prevRecord?.file, filePayload);
    } else {
      // Create new file
      fileObject = await api.file.create(filePayload);
    }
  }

  // Update record in 'custom_files' collection
  const data = {
    name: payload.name || payload.fileName,
    info: payload.info || payload.text,
    file: fileObject?.id ?? payload.file, // Id of updated, newly created or previous file
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
 * Updates record using Form-Data format, supports binary data
 */
export async function customFileUpdateByAxiosAsFormData(key: PrimaryKey, payload: Payload, query?: Query) {
  const fileData = payload.data;
  if (!fileData) {
    return customFileUpdateByAxiosAsJson(key, payload, query); // There is no binary data, so update data as JSON
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
      if (key === 'data') return; // Skip .data, we will add it at the end as .file
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
 * Partially updates existing record but does not support binary data
 */
export async function customFileUpdateByAxiosAsJson(key: PrimaryKey, payload: Payload, query?: Query) {
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
    const res = await api.axios.patch(`${ENDPOINT}/${key}`, data, config);
    console.warn(METHOD, '- res:', res);
    return res?.data?.data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

/**
 * Partially updates existing record using Directus SDK, not supports binary data
 */
export async function customFileUpdateByDirectus(key: PrimaryKey, payload: Payload | Payload[], query?: Query) {
  try {
    const { data } = await api.directus.items(COLLECTION).update(key, payload, query);
    console.warn(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export default customFileUpdateByThreeCalls;
// export default customFileUpdateByAxiosAsFormData;
// export default customFileUpdateByAxiosAsJson;
// export default customFileUpdateByDirectus;
