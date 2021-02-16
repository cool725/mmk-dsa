import { api } from '..';

const ENDPOINT = '/custom/sms/otp/verify';
const METHOD = 'otpVerify()';

interface IOtpVerifyCredentials {
  phone: string;
  otp: string;
}

export async function otpVerify({ phone, otp }: IOtpVerifyCredentials) {
  try {
    const phoneOnlyNumbers = phone.replace(/\D/g, '');
    const res = await api.axios.post(ENDPOINT, { phone: phoneOnlyNumbers, code: otp });
    console.warn(METHOD, '- res:', res);
    if (res?.status === 200 /*&& res?.data?.status === 'ok'*/) {
      return true;
    }
  } catch (error) {
    console.error(METHOD, error);
  }
  return false;
}

export default otpVerify;
