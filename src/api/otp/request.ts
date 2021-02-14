import { api } from '..';

const ENDPOINT = 'otp/request';
const METHOD = 'otpRequest()';

export async function otpRequest(phone: string) {
  try {
    const phoneOnlyNumbers = phone.replace(/\D/g, '');
    const res = await api.axios.post(ENDPOINT, { phone: phoneOnlyNumbers });
    if (res?.status === 200 /* && res?.data?.status === 'ok'*/) {
      return true;
    }
  } catch (error) {
    console.error(METHOD, error);
  }
  return false;
}

export default otpRequest;
