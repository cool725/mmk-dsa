import { api } from '..';

// const ENDPOINT = 'users/me;
const METHOD = 'me()';

export async function me() {
  try {
    const { data } = await api.directus.users.me.read();
    return data;
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export default me;
