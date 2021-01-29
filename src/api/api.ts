import directus from './directus';
import * as auth from './auth';
import * as info from './info';
import * as dsa from './dsa';
import * as data from './data';

const api = {
  // Object instances
  directus,
  axios: directus?.axios,
  url: directus?.url || directus?.axios?.defaults?.baseURL,
  token: directus.auth.token,
  // API "modules"
  auth,
  info,
  data,
  dsa,
};

export default api;
