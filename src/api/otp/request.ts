import { api } from '..';

const ENDPOINT = '/custom/sms/otp/request';
const METHOD = 'otpRequest()';

export async function otpRequest(phone: string) {
  try {
    const phoneOnlyNumbers = phone.replace(/\D/g, '');
    const res = await api.axios.post(ENDPOINT, { phone: phoneOnlyNumbers });
    console.warn(METHOD, '- res:', res);
    if (res?.status === 200 /* && res?.data?.status === 'ok'*/) {
      return true;
    }
  } catch (error) {
    console.error(METHOD, error);
    throw error;
  }
}

export default otpRequest;
