import { api } from '..';
import { Payload, PrimaryKey, Query } from '@directus/sdk-js/dist/types/types';
import { COLLECTION, ENDPOINT } from './utils';

const METHOD = 'dsaUpdate()';

export async function dsaUpdateByAxios(key: string | number, payload: any | any[], query?: any) {
  const data = {
    ...payload,
    mobile_number: payload?.mobile_number?.replace(/\D/g, ''),
    mobile_number_secondary: payload?.mobile_number_secondary?.replace(/\D/g, ''),
    referrer_mobile_number: payload?.referrer_mobile_number?.replace(/\D/g, ''),
  };
  const config = {
    params: query,
  };
  try {
    const res = await api.axios.patch(`${ENDPOINT}/${key}`, data, config);
    if ([200, 201, 204].includes(res?.status)) {
      const { data } = res;
      console.warn(METHOD, '- data:', data);
      return data;
    }
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export async function dsaUpdateByDirectus(key: PrimaryKey, payload: Payload, query?: Query) {
  try {
    const { data } = await api.directus.items(COLLECTION).update(key, payload, query);
    console.warn(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

export default dsaUpdateByAxios;
// export default dsaUpdateByDirectus;
