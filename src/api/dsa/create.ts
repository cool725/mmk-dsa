import { api } from '..';
import { Payload, Query } from '@directus/sdk-js/dist/types/types';
import { COLLECTION, ENDPOINT } from './utils';

const METHOD = 'dsaCreate()';

export async function dsaCreateByAxios(payload: any | any[], query?: any) {
  const data = {
    ...payload,
    mobile_number: payload?.mobile_number?.replace(/\D/g, ''),
    mobile_number_secondary: payload?.mobile_number_secondary?.replace(/\D/g, ''),
    referrer_mobile_number: payload?.referrer_mobile_number?.replace(/\D/g, ''),
  };
  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    params: query,
  };
  try {
    const res = await api.axios.post(ENDPOINT, data, config);
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

export async function dsaCreateByDirectus(payload: Payload | Payload[], query?: Query) {
  try {
    const { data } = await api.directus.items(COLLECTION).create(payload, query);
    console.warn(METHOD, '- data:', data);
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return undefined;
}

// export default dsaCreateByAxios;
export default dsaCreateByDirectus;
