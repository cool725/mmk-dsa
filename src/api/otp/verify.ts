import { api } from '..';

const ENDPOINT = 'otp/verify';
const METHOD = 'otpVerify()';

interface IOtpVerifyCredentials {
  phone: string;
  otp: string;
}

export async function otpVerify({ phone, otp }: IOtpVerifyCredentials) {
  try {
    const phoneOnlyNumbers = phone.replace(/\D/g, '');
    const res = await api.axios.post(ENDPOINT, { phone: phoneOnlyNumbers, otp });
    if (res?.status === 200 && res?.data?.status === 'ok') {
      return true;
    }
  } catch (error) {
    console.error(METHOD, error);
  }
  return false;
}

export default otpVerify;
