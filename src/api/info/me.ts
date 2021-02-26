import { api } from '..';

// const ENDPOINT = 'users/me;
const METHOD = 'me()';

export async function me() {
  if (process.env.REACT_APP_MULTIPASS) {
    return {
      phone: '1234567890',
      email: 'fake@domain.com',
    };
  }

  try {
    const { data } = await api.directus.users.me.read();
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export default me;
