import { api } from '..';

const VERIFICATION_METHOD = 'emailVerification()';
const CONFIRMATION_METHOD = 'emailConfirmation()';
const VERIFY_ENDPOINT = 'custom/email/verify';
const CONFIRM_ENDPOINT = 'custom/email/confirm';
const APP_BASE_URL = window.location.origin;

interface IVerifyEmail {
  email: string;
  phone: string
}

interface IConfirmEmail {
  token: string;
}

export async function verifyEmail({ email, phone }: IVerifyEmail) {
  try {
    const confirmUrl = `${APP_BASE_URL}/auth/signup/confirm-email`
    await api.axios.post(VERIFY_ENDPOINT, { email, phone, confirmUrl })
    return { error: false, message: '' };
  } catch (error) {
    console.error(VERIFICATION_METHOD, error);
    const statusCode = error?.response?.status;
    let message = '';
    if (statusCode === 409) message = 'User with given email already exist. Please login.';
    return { error: true, message };
  }
}

export async function confirmEmail({ token }: IConfirmEmail) {
  try {
    const res = await api.axios.post(CONFIRM_ENDPOINT, { token })
    return res?.data?.data;
  } catch (error) {
    console.error(CONFIRMATION_METHOD, error);
  }
  return null;
}

export default verifyEmail;
