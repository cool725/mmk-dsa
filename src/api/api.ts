import directus from './directus';
import * as auth from './auth';
import * as info from './info';

const api = {
  // Object instances
  directus,
  axios: directus?.axios,
  url: directus?.url || directus?.axios?.defaults?.baseURL,
  token: directus.auth.token,
  // API "modules"
  auth,
  info,
};

export default api;
